# Backend (Amazon Lambda + DynamoDB)

This folder contains the serverless authentication service that powers the Ilmiora signup and signin forms and the newly added asset catalog API. The handlers are designed for Amazon API Gateway HTTP APIs backed by AWS Lambda and DynamoDB.

## Features

- `POST /auth/signup` – creates a user with email/password, hashes credentials with `bcryptjs`, stores metadata in DynamoDB, and issues JWT access/refresh tokens.
- `POST /auth/signin` – verifies credentials and issues new JWTs.
- `POST /auth/forgot-password` – generates a time-limited password reset token, sends reset instructions via Amazon SES, and stores the token for later verification (token/link is only logged outside production for testing).
- `GET /assets` – lists assets stored in DynamoDB (optionally filtered by type).
- `GET /assets/{id}` – retrieves a single asset with normalized structure.
- `POST /assets` – authenticated admin route to create an asset (validates payload with `zod`, generates IDs when missing).
- `PUT /assets/{id}` – authenticated admin route to update an existing asset.
- `DELETE /assets/{id}` – authenticated admin route to remove an asset from the catalog.
- Input validation with `zod` to enforce email/password rules.
- DynamoDB uses a single-table design with partition key `pk = USER#<email>`.
- JWT secrets and table names are read from environment variables and validated at runtime.

## Environment Variables

| Variable | Description |
| --- | --- |
| `USERS_TABLE` | DynamoDB table name for storing users. |
| `ASSETS_TABLE` | DynamoDB table name for storing assets. |
| `JWT_SECRET` | Secret key for signing JWTs (minimum 32 characters). |
| `TOKEN_TTL_SECONDS` | Optional. Access token lifetime in seconds (default 900). |
| `REFRESH_TTL_SECONDS` | Optional. Refresh token lifetime in seconds (default 604800). |
| `PASSWORD_RESET_TTL_SECONDS` | Optional. Password reset token lifetime in seconds (default 3600). |
| `PASSWORD_RESET_EMAIL_SENDER` | Verified SES identity (email) used as the sender for password reset messages. |
| `PASSWORD_RESET_URL_BASE` | Optional. Base URL for the reset link (e.g. `https://app.example.com/reset-password`). Token and email query params are appended automatically. |

## Development

1. Install dependencies: `npm install`
2. Build the Lambda bundles: `npm run build` (outputs `dist/auth.js` and `dist/assets.js`).
3. Deploy using your preferred IaC (Serverless Framework, AWS SAM, CDK, etc.) wiring handlers in `dist/auth.js` and `dist/assets.js` to API Gateway routes.

> The compiled bundle targets Node.js 18 with native ES modules.
