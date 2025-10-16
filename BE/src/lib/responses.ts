import type { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';

const baseHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
} as const;

export const jsonResponse = (
  statusCode: number,
  body?: unknown,
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: baseHeaders,
  body: body ? JSON.stringify(body) : '',
});

export const noContentResponse = (): APIGatewayProxyStructuredResultV2 => ({
  statusCode: 204,
  headers: baseHeaders,
  body: '',
});
