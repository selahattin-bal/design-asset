# Backend (Amazon Lambda + DynamoDB)

This folder contains the serverless authentication service that powers the Ilmiora signup and signin forms. The handlers are designed for Amazon API Gateway HTTP APIs backed by AWS Lambda and DynamoDB.

## Features

- `POST /auth/signup` – creates a user with email/password, hashes credentials with `bcryptjs`, stores metadata in DynamoDB, and issues JWT access/refresh tokens.
- `POST /auth/signin` – verifies credentials and issues new JWTs.
- Input validation with `zod` to enforce email/password rules.
- DynamoDB uses a single-table design with partition key `pk = USER#<email>`.
- JWT secrets and table names are read from environment variables and validated at runtime.

## Environment Variables

| Variable | Description |
| --- | --- |
| `USERS_TABLE` | DynamoDB table name for storing users. |
| `JWT_SECRET` | Secret key for signing JWTs (minimum 32 characters). |
| `TOKEN_TTL_SECONDS` | Optional. Access token lifetime in seconds (default 900). |
| `REFRESH_TTL_SECONDS` | Optional. Refresh token lifetime in seconds (default 604800). |

## Development

1. Install dependencies: `npm install`
2. Build the Lambda bundle: `npm run build`
3. Deploy using your preferred IaC (Serverless Framework, AWS SAM, CDK, etc.) wiring handlers in `dist/auth.js` to API Gateway routes.

> The compiled bundle targets Node.js 18 with native ES modules.
