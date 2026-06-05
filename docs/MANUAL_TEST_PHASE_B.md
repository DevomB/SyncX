# Phase B Integration Test Checklist

Complete after CDK deploy and Cognito configuration.

## Prerequisites

- Phase A passed
- AWS CDK deployed: `pnpm --filter @syncx/infra deploy -- -c budgetEmail=you@example.com`
- `infra/outputs.json` contains `ApiUrl`, `UserPoolClientId`, `CognitoDomain`
- Cognito app client callback URL updated (see below)

## Configure extension environment

Create `apps/extension/.env.local`:

```env
VITE_API_URL=https://xxxx.execute-api.us-east-1.amazonaws.com
VITE_COGNITO_CLIENT_ID=your-client-id
VITE_COGNITO_DOMAIN=syncx-xxxx.auth.us-east-1.amazoncognito.com
```

Rebuild extension: `pnpm --filter @syncx/extension build`

## Cognito callback URL

1. Load unpacked extension in Chrome.
2. Open service worker console and run: `chrome.identity.getRedirectURL('syncx')`
3. Copy the URL (format: `https://<extension-id>.chromiumapp.org/syncx`)
4. AWS Console → Cognito → User Pool → App client → Hosted UI → add callback URL
5. Save

## Create test user

AWS Console → Cognito → Users → Create user with email + temporary password, or self-sign-up via Hosted UI.

## Steps

1. Reload unpacked extension with `.env.local` values baked into build.
2. Open SyncX popup → **Sign in to SyncX** → complete Cognito login.
3. Confirm popup shows **Cloud: Connected**.
4. Run three distinct Google searches:
   - `syncx-cloud-test-1`
   - `syncx-cloud-test-2`
   - `syncx-cloud-test-3`
5. AWS Console → DynamoDB → SyncXTable → Explore items — confirm **6+ items** for your user (`EVENT#*` and `QUEUE#*` rows).
6. Wait for replays (or force via `FORCE_REPLAY_NOW`) — confirm three Bing replays complete.
7. Call API (optional): `GET /v1/stats/today` with Bearer token — confirm `replayCount: 3`.
8. Uninstall and reload extension, sign in again — pending queue should be empty; stats may reset locally but server stats persist.

## Pass criteria

- Cloud login succeeds
- Search events stored in DynamoDB
- Replays complete via cloud pending queue
- Stats reflect completed replays

## Fail actions

- Verify JWT authorizer issuer matches User Pool
- Verify `VITE_API_URL` has no trailing slash
- Check CloudWatch logs for `SyncXApiHandler`
- Confirm callback URL matches extension redirect exactly
