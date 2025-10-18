import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { v4 as uuid } from 'uuid';
import { getDocumentClient } from '../lib/dbClient.js';
import { credentialsSchema, emailOnlySchema } from '../lib/validators.js';
import { jsonResponse, noContentResponse } from '../lib/responses.js';
import { getEnv } from '../lib/env.js';
import { createTokens, hashPassword, verifyPassword } from '../lib/security.js';
import { DEFAULT_USER_ROLE, isUserRole } from '../lib/roles.js';
import { createInitialCredits, ensureCreditsForRole, refreshCreditsIfNeeded, type UserCredits } from '../lib/credits.js';

const documentClient = getDocumentClient();
const USER_PK_ATTRIBUTE = 'USERS_TABLE';
const PASSWORD_RESET_PK_PREFIX = 'PASSWORD_RESET#';
const sesClient = new SESClient({});

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

const createStepLogger = (handler: 'signup' | 'signin' | 'forgot-password', requestId: string | undefined) => {
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
  const now = new Date();
  const nowIso = now.toISOString();
  const passwordHash = hashPassword(password);
  const role = DEFAULT_USER_ROLE;
  const credits = createInitialCredits(role, now);
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
          createdAt: nowIso,
          updatedAt: nowIso,
          role,
          credits: credits ?? undefined,
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
        createdAt: nowIso,
        role,
        credits: credits ?? undefined,
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

    const now = new Date();
    const storedCredits = (result.Item.credits ?? undefined) as UserCredits | undefined;
    const { credits: ensuredCredits, changed: roleAdjusted } = ensureCreditsForRole(storedCredits, role, now);
    let creditsToReturn = ensuredCredits;
    let shouldUpdateCredits = roleAdjusted;

    if (ensuredCredits) {
      const { credits: refreshedCredits, changed } = refreshCreditsIfNeeded(ensuredCredits, now);
      creditsToReturn = refreshedCredits;
      shouldUpdateCredits = shouldUpdateCredits || changed;
    }

    if (shouldUpdateCredits) {
      const updatedAt = now.toISOString();
      if (creditsToReturn) {
        await documentClient.send(
          new UpdateCommand({
            TableName: env.usersTable,
            Key: userKey,
            UpdateExpression: 'SET credits = :credits, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
              ':credits': creditsToReturn,
              ':updatedAt': updatedAt,
            },
          }),
        );
      } else {
        await documentClient.send(
          new UpdateCommand({
            TableName: env.usersTable,
            Key: userKey,
            UpdateExpression: 'SET updatedAt = :updatedAt REMOVE credits',
            ExpressionAttributeValues: {
              ':updatedAt': updatedAt,
            },
          }),
        );
      }
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
        credits: creditsToReturn ?? undefined,
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

export const forgotPasswordHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const logStep = createStepLogger('forgot-password', event.requestContext.requestId);
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

  const parsed = emailOnlySchema.safeParse(payload);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`);
    return validationErrorResponse(issues);
  }

  const normalizedEmail = normalizeEmail(parsed.data.email);
  const userKeyValue = `USER#${normalizedEmail}`;
  const userKey = { [USER_PK_ATTRIBUTE]: userKeyValue };

  try {
    logStep('fetching user', { userKeyValue });
    const userResult = await documentClient.send(
      new GetCommand({
        TableName: env.usersTable,
        Key: userKey,
      }),
    );
    const userExists = Boolean(userResult.Item);
    logStep('fetched user', { userExists });

    if (userExists) {
      const requestTime = Date.now();
      const createdAt = new Date(requestTime).toISOString();
      const expiresAt = new Date(requestTime + env.passwordResetTtlSeconds * 1000);
      const resetToken = uuid();

      await documentClient.send(
        new PutCommand({
          TableName: env.usersTable,
          Item: {
            [USER_PK_ATTRIBUTE]: `${PASSWORD_RESET_PK_PREFIX}${normalizedEmail}`,
            token: resetToken,
            email: normalizedEmail,
            createdAt,
            expiresAt: expiresAt.toISOString(),
            ttl: Math.floor(expiresAt.getTime() / 1000),
          },
        }),
      );
      logStep('reset token stored', { normalizedEmail, expiresAt: expiresAt.toISOString() });

      let resetLink: string | null = null;
      if (env.passwordResetUrlBase) {
        try {
          const url = new URL(env.passwordResetUrlBase);
          url.searchParams.set('token', resetToken);
          url.searchParams.set('email', normalizedEmail);
          resetLink = url.toString();
        } catch (error) {
          console.warn('Failed to construct password reset URL, falling back to token-only email', {
            baseUrl: env.passwordResetUrlBase,
            error,
          });
        }
      }

      const humanReadableExpiry = expiresAt.toISOString();
      const plainTextBody = resetLink
        ? `We received a request to reset your LARUUS account password.\n\nReset link: ${resetLink}\n\nThis link expires at ${humanReadableExpiry}. If you did not request this, you can ignore this email.`
        : `We received a request to reset your LARUUS account password.\n\nYour reset token: ${resetToken}\nExpires at: ${humanReadableExpiry}\n\nEnter this token on the reset page to choose a new password. If you did not request this, you can ignore this email.`;

      const htmlBody = resetLink
        ? `<p>We received a request to reset your <strong>LARUUS</strong> account password.</p><p><a href="${resetLink}">Click here to reset your password</a>.</p><p>This link expires at <strong>${humanReadableExpiry}</strong>. If you did not request a reset, you can safely ignore this email.</p>`
        : `<p>We received a request to reset your <strong>LARUUS</strong> account password.</p><p>Your reset token:</p><p style="font-size:20px;font-weight:bold;letter-spacing:0.1em;">${resetToken}</p><p>The token expires at <strong>${humanReadableExpiry}</strong>. Enter this token on the reset page to choose a new password. If you did not request this, you can ignore this email.</p>`;

      await sesClient.send(
        new SendEmailCommand({
          Destination: { ToAddresses: [normalizedEmail] },
          Message: {
            Body: {
              Html: { Charset: 'UTF-8', Data: htmlBody },
              Text: { Charset: 'UTF-8', Data: plainTextBody },
            },
            Subject: { Charset: 'UTF-8', Data: 'Reset your LARUUS password' },
          },
          Source: env.passwordResetEmailSender,
        }),
      );
      logStep('email dispatched');

      if (process.env.NODE_ENV !== 'production') {
        console.log('Password reset token generated', {
          email: normalizedEmail,
          resetToken,
          resetLink,
          expiresAt: humanReadableExpiry,
        });
      }
    }

    const responsePayload: Record<string, unknown> = {
      message: 'If an account exists for this email, we have sent password reset instructions.',
    };

    if (userExists && process.env.NODE_ENV !== 'production') {
      responsePayload.debugTokenMessage =
        'A password reset email was dispatched. Check the server logs for the debug token and link.';
    }

    return jsonResponse(200, responsePayload);
  } catch (error) {
    logStep('handler failed');
    console.error('Forgot password handler failed', {
      requestId: event.requestContext.requestId,
      error,
    });
    const detail = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse(500, {
      message: 'Failed to process password reset request due to a server error.',
      detail,
    });
  }
};
