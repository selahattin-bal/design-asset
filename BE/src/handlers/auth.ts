import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { getDocumentClient } from '../lib/dbClient.js';
import { credentialsSchema } from '../lib/validators.js';
import { jsonResponse, noContentResponse } from '../lib/responses.js';
import { getEnv } from '../lib/env.js';
import { createTokens, hashPassword, verifyPassword } from '../lib/security.js';
import { DEFAULT_USER_ROLE, isUserRole } from '../lib/roles.js';

const documentClient = getDocumentClient();
const USER_PK_ATTRIBUTE = 'USERS_TABLE';

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

const validationErrorResponse = (issues: string[]): APIGatewayProxyStructuredResultV2 =>
  jsonResponse(400, {
    message: 'Validation failed.',
    issues,
  });

const normalizeEmail = (email: string) => email.trim().toLowerCase();

type EnvResult =
  | { ok: true; env: ReturnType<typeof getEnv> }
  | { ok: false; response: APIGatewayProxyStructuredResultV2 };

const createStepLogger = (handler: 'signup' | 'signin', requestId: string | undefined) => {
  const start = Date.now();
  return (step: string, extra: Record<string, unknown> = {}) => {
    console.log(`${handler} step`, {
      requestId,
      step,
      elapsedMs: Date.now() - start,
      ...extra,
    });
  };
};

const loadEnv = (): EnvResult => {
  try {
    return { ok: true, env: getEnv() };
  } catch (error) {
    console.error('Environment configuration error', error);
    const detail =
      error instanceof Error ? error.message : 'Invalid environment configuration.';

    return {
      ok: false,
      response: jsonResponse(500, {
        message: 'Environment configuration error.',
        detail,
      }),
    };
  }
};

export const signupHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const logStep = createStepLogger('signup', event.requestContext.requestId);
  logStep('handler invoked', {
    hasBody: Boolean(event.body),
    method: event.requestContext.http?.method,
  });
  if (event.requestContext.http?.method === 'OPTIONS') {
    return noContentResponse();
  }

  const envResult = loadEnv();
  if (!envResult.ok) {
    logStep('env load failed');
    return envResult.response;
  }
  const env = envResult.env;
  logStep('env loaded');
  const payload = parseJson(event);
  if (!payload) {
    return jsonResponse(400, { message: 'Invalid JSON payload.' });
  }

  const parsed = credentialsSchema.safeParse(payload);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`);
    return validationErrorResponse(issues);
  }

  const { email, password } = parsed.data;
  logStep('payload validated');
  const normalizedEmail = normalizeEmail(email);
  const userKeyValue = `USER#${normalizedEmail}`;
  const userKey = { [USER_PK_ATTRIBUTE]: userKeyValue };

  try {
    logStep('checking existing user', { userKeyValue });
    const existing = await documentClient.send(
      new GetCommand({
        TableName: env.usersTable,
        Key: userKey,
      }),
    );
    logStep('checked existing user', {
      itemFound: Boolean(existing.Item),
    });

    if (existing.Item) {
      return jsonResponse(409, { message: 'An account with this email already exists.' });
    }

  const userId = uuid();
  const now = new Date().toISOString();
  const passwordHash = hashPassword(password);
  const role = DEFAULT_USER_ROLE;
    logStep('hashed password');

    logStep('creating user record', { userId });
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
          role,
        },
        ConditionExpression: 'attribute_not_exists(#pk)',
        ExpressionAttributeNames: {
          '#pk': USER_PK_ATTRIBUTE,
        },
      }),
    );
    logStep('user record created', { userId });

    const tokens = createTokens(userId, normalizedEmail, role);
    logStep('tokens created', { userId });

    return jsonResponse(201, {
      message: 'Account created successfully.',
      user: {
        id: userId,
        email: normalizedEmail,
        createdAt: now,
        role,
      },
      tokens,
    });
  } catch (error) {
    if ((error as { name?: string }).name === 'ConditionalCheckFailedException') {
      return jsonResponse(409, { message: 'An account with this email already exists.' });
    }

    logStep('handler failed');
    console.error('Signup handler failed', {
      requestId: event.requestContext.requestId,
      error,
    });
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse(500, {
      message: 'Failed to create account due to a server error.',
      detail,
    });
  }
};

export const signinHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const logStep = createStepLogger('signin', event.requestContext.requestId);
  logStep('handler invoked', {
    hasBody: Boolean(event.body),
    method: event.requestContext.http?.method,
  });
  if (event.requestContext.http?.method === 'OPTIONS') {
    return noContentResponse();
  }

  const envResult = loadEnv();
  if (!envResult.ok) {
    logStep('env load failed');
    return envResult.response;
  }
  const env = envResult.env;
  logStep('env loaded');
  const payload = parseJson(event);
  if (!payload) {
    return jsonResponse(400, { message: 'Invalid JSON payload.' });
  }

  const parsed = credentialsSchema.safeParse(payload);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`);
    return validationErrorResponse(issues);
  }

  const { email, password } = parsed.data;
  logStep('payload validated');
  const normalizedEmail = normalizeEmail(email);
  const userKeyValue = `USER#${normalizedEmail}`;
  const userKey = { [USER_PK_ATTRIBUTE]: userKeyValue };

  try {
    logStep('fetching user', { userKeyValue });
    const result = await documentClient.send(
      new GetCommand({
        TableName: env.usersTable,
        Key: userKey,
      }),
    );
    logStep('fetched user', {
      itemFound: Boolean(result.Item),
    });

    if (!result.Item || typeof result.Item.passwordHash !== 'string') {
      return jsonResponse(401, { message: 'Invalid email or password.' });
    }

    const isPasswordValid = verifyPassword(password, result.Item.passwordHash);
    logStep('password verified', { isPasswordValid });
    if (!isPasswordValid) {
      return jsonResponse(401, { message: 'Invalid email or password.' });
    }

    if (typeof result.Item.userId !== 'string') {
      console.error('Stored user is missing userId', { email: normalizedEmail });
      return jsonResponse(500, { message: 'An unexpected error occurred.' });
    }

    const userId = result.Item.userId;
    const isRoleValid = isUserRole(result.Item.role);
    const role = isRoleValid ? result.Item.role : DEFAULT_USER_ROLE;
    if (!isRoleValid) {
      console.warn('Stored user missing or invalid role, defaulting to FREE_USER', {
        requestId: event.requestContext.requestId,
        email: normalizedEmail,
        storedRole: result.Item.role,
      });
    }
    const tokens = createTokens(userId, normalizedEmail, role);
    logStep('tokens created', { userId, role });

    return jsonResponse(200, {
      message: 'Signed in successfully.',
      user: {
        id: userId,
        email: normalizedEmail,
        createdAt: result.Item.createdAt,
        role,
      },
      tokens,
    });
  } catch (error) {
    logStep('handler failed');
    console.error('Signin handler failed', {
      requestId: event.requestContext.requestId,
      error,
    });
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse(500, {
      message: 'Failed to sign in due to a server error.',
      detail,
    });
  }
};
