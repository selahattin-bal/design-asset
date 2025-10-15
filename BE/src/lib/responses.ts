import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const baseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
} as const;

const withCorsHeaders = (origin?: string): Record<string, string> => ({
  ...baseHeaders,
  ...(origin
    ? {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Credentials': 'true',
      }
    : {}),
});

export const jsonResponse = (
  statusCode: number,
  body?: unknown,
  origin?: string,
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: withCorsHeaders(origin),
  body: body ? JSON.stringify(body) : '',
});

export const noContentResponse = (origin?: string): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 204,
  headers: withCorsHeaders(origin),
  body: '',
});
