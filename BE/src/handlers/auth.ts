import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { getDocumentClient } from '../lib/dbClient.js';
import { credentialsSchema } from '../lib/validators.js';
import { jsonResponse, noContentResponse } from '../lib/responses.js';
import { getEnv } from '../lib/env.js';
import { createTokens, hashPassword, verifyPassword } from '../lib/security.js';

const documentClient = getDocumentClient();

const parseJson = (event: APIGatewayProxyEventV2) => {
  if (!event.body) {
    return null;
  }

  try {
    return JSON.parse(event.body) as unknown;
  } catch (error) {
    console.error('Failed to parse request body', error);
    return null;
  }
};

const validationErrorResponse = (
  issues: string[],
  origin?: string,
): APIGatewayProxyStructuredResultV2 =>
  jsonResponse(400, {
    message: 'Validation failed.',
    issues,
  }, origin);

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const resolveOrigin = (
  event: APIGatewayProxyEventV2,
  allowedOrigins: string[],
): string | undefined => {
  const requestOrigin =
    event.headers?.origin ??
    event.headers?.Origin ??
    event.headers?.['x-forwarded-origin'];

  if (!requestOrigin) {
    return undefined;
  }

  return allowedOrigins.includes(requestOrigin) ? requestOrigin : undefined;
};

export const signupHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const env = getEnv();
  const origin = resolveOrigin(event, env.allowedOrigins);

  if (event.requestContext.http?.method === 'OPTIONS') {
    return noContentResponse(origin);
  }

  const payload = parseJson(event);
  if (!payload) {
    return jsonResponse(400, { message: 'Invalid JSON payload.' }, origin);
  }

  const parsed = credentialsSchema.safeParse(payload);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`);
    return validationErrorResponse(issues, origin);
  }

  const { email, password } = parsed.data;
  const normalizedEmail = normalizeEmail(email);
  const userKey = { pk: `USER#${normalizedEmail}` };

  try {
    const existing = await documentClient.send(
      new GetCommand({
        TableName: env.usersTable,
        Key: userKey,
      }),
    );

    if (existing.Item) {
      return jsonResponse(409, { message: 'An account with this email already exists.' }, origin);
    }

    const userId = uuid();
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    await documentClient.send(
      new PutCommand({
        TableName: env.usersTable,
        Item: {
          ...userKey,
          userId,
          email: normalizedEmail,
          passwordHash,
          createdAt: now,
          updatedAt: now,
        },
        ConditionExpression: 'attribute_not_exists(pk)',
      }),
    );

    const tokens = createTokens(userId, normalizedEmail);

    return jsonResponse(201, {
      message: 'Account created successfully.',
      user: {
        id: userId,
        email: normalizedEmail,
        createdAt: now,
      },
      tokens,
    }, origin);
  } catch (error) {
    if ((error as { name?: string }).name === 'ConditionalCheckFailedException') {
      return jsonResponse(409, { message: 'An account with this email already exists.' }, origin);
    }

    console.error('Signup handler failed', error);
    return jsonResponse(500, { message: 'An unexpected error occurred.' }, origin);
  }
};

export const signinHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const env = getEnv();
  const origin = resolveOrigin(event, env.allowedOrigins);

  if (event.requestContext.http?.method === 'OPTIONS') {
    return noContentResponse(origin);
  }

  const payload = parseJson(event);
  if (!payload) {
    return jsonResponse(400, { message: 'Invalid JSON payload.' }, origin);
  }

  const parsed = credentialsSchema.safeParse(payload);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`);
    return validationErrorResponse(issues, origin);
  }

  const { email, password } = parsed.data;
  const normalizedEmail = normalizeEmail(email);
  const userKey = { pk: `USER#${normalizedEmail}` };

  try {
    const result = await documentClient.send(
      new GetCommand({
        TableName: env.usersTable,
        Key: userKey,
      }),
    );

    if (!result.Item || typeof result.Item.passwordHash !== 'string') {
      return jsonResponse(401, { message: 'Invalid email or password.' }, origin);
    }

    const isPasswordValid = verifyPassword(password, result.Item.passwordHash);
    if (!isPasswordValid) {
      return jsonResponse(401, { message: 'Invalid email or password.' }, origin);
    }

    if (typeof result.Item.userId !== 'string') {
      console.error('Stored user is missing userId', { email: normalizedEmail });
      return jsonResponse(500, { message: 'An unexpected error occurred.' }, origin);
    }

    const userId = result.Item.userId;
    const tokens = createTokens(userId, normalizedEmail);

    return jsonResponse(200, {
      message: 'Signed in successfully.',
      user: {
        id: userId,
        email: normalizedEmail,
        createdAt: result.Item.createdAt,
      },
      tokens,
    }, origin);
  } catch (error) {
    console.error('Signin handler failed', error);
    return jsonResponse(500, { message: 'An unexpected error occurred.' }, origin);
  }
};
