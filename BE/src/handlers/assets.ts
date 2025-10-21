import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import {
  DeleteCommand,
  GetCommand,
  PutCommand,
  ScanCommand,
  type ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { getDocumentClient } from '../lib/dbClient.js';
import { getEnv } from '../lib/env.js';
import { jsonResponse, noContentResponse } from '../lib/responses.js';
import { assetUpsertSchema, type AssetUpsertPayload } from '../lib/validators.js';
import { verifyAccessToken } from '../lib/security.js';

const documentClient = getDocumentClient();

type EnvResult =
  | { ok: true; env: ReturnType<typeof getEnv> }
  | { ok: false; response: APIGatewayProxyStructuredResultV2 };

const assetTypeValues = ['MODEL', 'SCENE', 'TEXTURE', 'FEATURED'] as const;
const assetStatusValues = ['DRAFT', 'PUBLISHED'] as const;
const assetVisibilityValues = ['PUBLIC', 'PRIVATE'] as const;

type AssetTypeValue = (typeof assetTypeValues)[number];
type AssetStatusValue = (typeof assetStatusValues)[number];
type AssetVisibilityValue = (typeof assetVisibilityValues)[number];

type AssetRecord = AssetUpsertPayload & {
  id: string;
  type: AssetTypeValue;
  status: AssetStatusValue;
  visibility: AssetVisibilityValue;
  createdAt: string;
  updatedAt: string;
};

const assetTypeSet = new Set<AssetTypeValue>(assetTypeValues);
const assetStatusSet = new Set<AssetStatusValue>(assetStatusValues);
const assetVisibilitySet = new Set<AssetVisibilityValue>(assetVisibilityValues);
const defaultAssetType: AssetTypeValue = 'MODEL';
const defaultAssetStatus: AssetStatusValue = 'PUBLISHED';
const defaultAssetVisibility: AssetVisibilityValue = 'PUBLIC';

const loadEnv = (): EnvResult => {
  try {
    return { ok: true, env: getEnv() };
  } catch (error) {
    console.error('Assets handler environment error', error);
    const detail = error instanceof Error ? error.message : 'Invalid environment configuration.';
    return {
      ok: false,
      response: jsonResponse(500, {
        message: 'Environment configuration error.',
        detail,
      }),
    };
  }
};

const parseJson = (event: APIGatewayProxyEventV2): unknown => {
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

const extractBearerToken = (event: APIGatewayProxyEventV2): string | null => {
  const header = event.headers?.authorization ?? event.headers?.Authorization;
  if (!header || typeof header !== 'string') {
    return null;
  }
  const trimmed = header.trim();
  if (!trimmed.toLowerCase().startsWith('bearer ')) {
    return null;
  }
  return trimmed.slice(7).trim();
};

const requireAdmin = (
  event: APIGatewayProxyEventV2,
): { ok: true } | { ok: false; response: APIGatewayProxyStructuredResultV2 } => {
  const token = extractBearerToken(event);
  if (!token) {
    return {
      ok: false,
      response: jsonResponse(401, { message: 'Authorization token missing.' }),
    };
  }

  const payload = verifyAccessToken(token);
  if (!payload) {
    return {
      ok: false,
      response: jsonResponse(401, { message: 'Invalid or expired token.' }),
    };
  }

  if (payload.role !== 'ADMIN' && payload.role !== 'CONTENT_MANAGER') {
    return {
      ok: false,
      response: jsonResponse(403, { message: 'Insufficient permissions.' }),
    };
  }

  return { ok: true };
};

const omitUndefined = (input: Record<string, unknown>): Record<string, unknown> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

const normalizeAsset = (raw: Record<string, unknown>): AssetRecord => {
  if (typeof raw.id !== 'string' || !raw.id.trim()) {
    throw new Error('Asset record missing id.');
  }

  const nowIso = new Date().toISOString();
  const id = raw.id.trim();
  const typeRaw = typeof raw.type === 'string' ? raw.type.trim().toUpperCase() : defaultAssetType;
  const statusRaw =
    typeof raw.status === 'string' ? raw.status.trim().toUpperCase() : defaultAssetStatus;
  const visibilityRaw =
    typeof raw.visibility === 'string'
      ? raw.visibility.trim().toUpperCase()
      : defaultAssetVisibility;

  const type = assetTypeSet.has(typeRaw as AssetTypeValue)
    ? (typeRaw as AssetTypeValue)
    : defaultAssetType;
  const status = assetStatusSet.has(statusRaw as AssetStatusValue)
    ? (statusRaw as AssetStatusValue)
    : defaultAssetStatus;
  const visibility = assetVisibilitySet.has(visibilityRaw as AssetVisibilityValue)
    ? (visibilityRaw as AssetVisibilityValue)
    : defaultAssetVisibility;

  const createdAt = typeof raw.createdAt === 'string' && raw.createdAt.trim() ? raw.createdAt : nowIso;
  const updatedAt = typeof raw.updatedAt === 'string' && raw.updatedAt.trim() ? raw.updatedAt : createdAt;

  return {
    ...(raw as AssetUpsertPayload),
    id,
    type,
    status,
    visibility,
    createdAt,
    updatedAt,
  } as AssetRecord;
};

const buildAssetKey = (id: string) => ({ id });

export const assetsHandler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const method = event.requestContext.http?.method ?? 'GET';

  if (method === 'OPTIONS') {
    return noContentResponse();
  }

  const envResult = loadEnv();
  if (!envResult.ok) {
    return envResult.response;
  }

  const { env } = envResult;
  const tableName = env.assetsTable;
  const assetId = event.pathParameters?.id?.trim();

  try {
    if (method === 'GET') {
      if (assetId) {
        const result = await documentClient.send(
          new GetCommand({
            TableName: tableName,
            Key: buildAssetKey(assetId),
          }),
        );

        if (!result.Item) {
          return jsonResponse(404, { message: 'Asset not found.' });
        }

        try {
          return jsonResponse(200, { item: normalizeAsset(result.Item as Record<string, unknown>) });
        } catch (error) {
          console.error('Failed to normalize asset record', { assetId, error });
          return jsonResponse(500, {
            message: 'Stored asset is invalid.',
          });
        }
      }

      const scanInput: ScanCommandInput = {
        TableName: tableName,
      };

      const requestedType = event.queryStringParameters?.type?.trim().toUpperCase();
      if (requestedType && assetTypeSet.has(requestedType as AssetRecord['type'])) {
        scanInput.FilterExpression = '#t = :type';
        scanInput.ExpressionAttributeNames = { '#t': 'type' };
        scanInput.ExpressionAttributeValues = { ':type': requestedType };
      }

      const searchTermRaw = event.queryStringParameters?.query ?? '';
      const searchTerm = searchTermRaw.trim().toLowerCase();
      const isSearchActive = searchTerm.length > 0;

      const result = await documentClient.send(new ScanCommand(scanInput));
      const items = (result.Items ?? []).flatMap(item => {
        try {
          return [normalizeAsset(item as Record<string, unknown>)];
        } catch (error) {
          console.error('Skipping asset with invalid structure', { error, item });
          return [];
        }
      });

      const matchesSearch = (asset: AssetRecord) => {
        if (!isSearchActive) {
          return true;
        }

        const haystacks: unknown[] = [
          asset.title,
          asset.subtitle,
          asset.description,
          asset.category,
          asset.author,
          asset.brand,
          asset.id,
          ...(Array.isArray(asset.tags) ? asset.tags : []),
        ];

        return haystacks.some(value =>
          typeof value === 'string' && value.toLowerCase().includes(searchTerm),
        );
      };

      const filteredItems = items.filter(matchesSearch);

      return jsonResponse(200, {
        items: filteredItems,
        count: filteredItems.length,
        scannedCount: result.ScannedCount,
      });
    }

    if (method === 'POST') {
      const auth = requireAdmin(event);
      if (!auth.ok) {
        return auth.response;
      }

      const payload = parseJson(event);
      if (!payload) {
        return jsonResponse(400, { message: 'Invalid JSON payload.' });
      }

      const parsed = assetUpsertSchema.safeParse(payload);
      if (!parsed.success) {
        const issues = parsed.error.issues.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`);
        return validationErrorResponse(issues);
      }

      const now = new Date().toISOString();
      const id = parsed.data.id?.trim() || uuid();
      const sanitizedPayload = omitUndefined(parsed.data as Record<string, unknown>);
      const item = normalizeAsset({
        ...sanitizedPayload,
        id,
        createdAt: sanitizedPayload.createdAt ?? now,
        updatedAt: now,
      });

      try {
        await documentClient.send(
          new PutCommand({
            TableName: tableName,
            Item: item,
            ConditionExpression: 'attribute_not_exists(#id)',
            ExpressionAttributeNames: {
              '#id': 'id',
            },
          }),
        );
      } catch (error) {
        if ((error as { name?: string }).name === 'ConditionalCheckFailedException') {
          return jsonResponse(409, { message: 'An asset with this id already exists.' });
        }
        throw error;
      }

      return jsonResponse(201, { item });
    }

    if (method === 'PUT') {
      if (!assetId) {
        return jsonResponse(400, { message: 'Asset id parameter is required.' });
      }

      const auth = requireAdmin(event);
      if (!auth.ok) {
        return auth.response;
      }

      const payload = parseJson(event);
      if (!payload) {
        return jsonResponse(400, { message: 'Invalid JSON payload.' });
      }

      const parsed = assetUpsertSchema.safeParse(payload);
      if (!parsed.success) {
        const issues = parsed.error.issues.map(issue => `${issue.path.join('.') || 'root'}: ${issue.message}`);
        return validationErrorResponse(issues);
      }

      const existing = await documentClient.send(
        new GetCommand({
          TableName: tableName,
          Key: buildAssetKey(assetId),
        }),
      );

      if (!existing.Item) {
        return jsonResponse(404, { message: 'Asset not found.' });
      }

      const sanitizedPayload = omitUndefined(parsed.data as Record<string, unknown>);
      const baseRecord = normalizeAsset(existing.Item as Record<string, unknown>);
      const now = new Date().toISOString();
      const mergedRecord = normalizeAsset({
        ...baseRecord,
        ...sanitizedPayload,
        id: assetId,
        updatedAt: now,
        createdAt: baseRecord.createdAt,
      });

      await documentClient.send(
        new PutCommand({
          TableName: tableName,
          Item: mergedRecord,
        }),
      );

      return jsonResponse(200, { item: mergedRecord });
    }

    if (method === 'DELETE') {
      if (!assetId) {
        return jsonResponse(400, { message: 'Asset id parameter is required.' });
      }

      const auth = requireAdmin(event);
      if (!auth.ok) {
        return auth.response;
      }

      await documentClient.send(
        new DeleteCommand({
          TableName: tableName,
          Key: buildAssetKey(assetId),
        }),
      );

      return noContentResponse();
    }

    return jsonResponse(405, { message: `Unsupported method: ${method}` });
  } catch (error) {
    console.error('Assets handler failure', {
      method,
      assetId,
      error,
    });

    const detail = error instanceof Error ? error.message : 'Unknown error';
    return jsonResponse(500, {
      message: 'Failed to process asset request.',
      detail,
    });
  }
};
