import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let cachedDocumentClient: DynamoDBDocumentClient | null = null;

export const getDocumentClient = (): DynamoDBDocumentClient => {
  if (cachedDocumentClient) {
    return cachedDocumentClient;
  }

  const client = new DynamoDBClient({});
  cachedDocumentClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });

  return cachedDocumentClient;
};
