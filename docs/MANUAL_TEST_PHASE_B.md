# Phase B Integration Test Checklist

Complete after CDK deploy and extension cloud backend configuration.

## Prerequisites

- Phase A passed
- AWS CDK deployed: `pnpm deploy:cloud` (see [SELF_HOST.md](./SELF_HOST.md))
- `infra/outputs.json` contains `ApiUrl`, `UserPoolClientId`, `CognitoDomain`

## Configure extension (Settings UI — no rebuild required)

1. Reload unpacked extension from `apps/extension/dist`.
2. Open **SyncX Settings** → **Your cloud backend**.
3. Copy values from `infra/outputs.json` (or `ExtensionConfigJson` output):
   - **API URL** → `ApiUrl`
   - **Cognito domain** → `CognitoDomain`
   - **Cognito client ID** → `UserPoolClientId`
4. Copy the **OAuth callback URL** shown on the settings page.
5. AWS Console → Cognito → App client → add callback URL → Save.
6. Click **Test API /health** — should show OK.
7. Click **Save cloud backend** — approve host permissions if prompted.

## Create test user

Self-sign-up via popup **Sign in to SyncX**, or create a user in Cognito console.

## Steps

1. Open SyncX popup → **Sign in to SyncX** → complete Cognito login.
2. Confirm popup shows **Cloud: Connected**.
3. Run three distinct Google searches:
   - `syncx-cloud-test-1`
   - `syncx-cloud-test-2`
   - `syncx-cloud-test-3`
4. AWS Console → DynamoDB → SyncXTable → confirm `EVENT#*` and `QUEUE#*` rows for your user.
5. Wait for replays (or `FORCE_REPLAY_NOW` in service worker console).
6. Popup **Today** count should reach 3; **Pending** should drain.
7. Optional: `GET {ApiUrl}/v1/stats/today` with Bearer token → `replayCount: 3`.

## Pass criteria

- Cloud backend saved via Settings (not build-time env)
- Cognito login succeeds
- Search events in DynamoDB
- Replays complete via cloud queue

## Fail actions

- Verify Cognito callback URL matches settings page exactly
- Re-save cloud config if fetch/CORS errors
- Check CloudWatch logs for `SyncXApiHandler`
