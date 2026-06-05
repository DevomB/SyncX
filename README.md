# SyncX

Search mirror queue for Chrome — captures Google search queries and replays them on Bing in your browser with enforced pacing and daily caps.

**Not affiliated with Microsoft.** Using automation with Microsoft Rewards may violate the [Microsoft Services Agreement](https://www.microsoft.com/en-us/servicesagreement/) and result in account restrictions. See [docs/REWARDS_RISK.md](docs/REWARDS_RISK.md) and [docs/LEGAL_POSTURE.md](docs/LEGAL_POSTURE.md). Consult an attorney before commercial distribution.

## Architecture

```
Google search (capture) → SyncX queue (local or AWS) → Bing tab replay (your browser)
```

- **Extension:** Chrome MV3 — capture, schedule, replay
- **API:** AWS Lambda + API Gateway HTTP + DynamoDB + Cognito
- **Cost target:** ~$0–5/month for personal use ([details](#aws-deploy))

## Monorepo layout

| Path | Purpose |
|------|---------|
| `apps/extension` | Chrome extension |
| `packages/shared` | Shared types and constants |
| `services/api` | Lambda API handler |
| `infra` | AWS CDK stack |
| `docs/` | Manual tests, privacy, legal notices |

## Quick start (Phase A — local only)

```bash
pnpm install
pnpm --filter @syncx/shared build
pnpm --filter @syncx/extension build
```

1. Chrome → `chrome://extensions` → Developer mode → **Load unpacked** → `apps/extension/dist`
2. Sign in to [bing.com](https://www.bing.com) in the same Chrome profile
3. Search on Google — SyncX queues and replays on Bing automatically

Full checklist: [docs/MANUAL_TEST_PHASE_A.md](docs/MANUAL_TEST_PHASE_A.md)

## AWS deploy (Phase B — optional cloud queue)

```bash
pnpm install
pnpm --filter @syncx/infra deploy -- -c budgetEmail=you@example.com
```

Outputs written to `infra/outputs.json`. Configure extension:

```env
# apps/extension/.env.local
VITE_API_URL=<ApiUrl from outputs>
VITE_COGNITO_CLIENT_ID=<UserPoolClientId>
VITE_COGNITO_DOMAIN=<CognitoDomain>
```

Rebuild extension, add Cognito callback URL from `chrome.identity.getRedirectURL('syncx')`.

Full checklist: [docs/MANUAL_TEST_PHASE_B.md](docs/MANUAL_TEST_PHASE_B.md)

## Environment variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Extension build | API Gateway base URL |
| `VITE_COGNITO_CLIENT_ID` | Extension build | Cognito app client ID |
| `VITE_COGNITO_DOMAIN` | Extension build | Cognito hosted UI domain (no `https://`) |
| `TABLE_NAME` | Lambda | Set by CDK (`SyncXTable`) |
| `budgetEmail` | CDK context | Email for $10/mo budget alerts |

## Development

```bash
pnpm dev:extension    # Vite dev server with HMR
pnpm build            # Build all packages
```

## API endpoints

| Method | Path | Auth |
|--------|------|------|
| GET | `/health` | No |
| POST | `/v1/events/search` | JWT |
| GET | `/v1/queue/pending` | JWT |
| POST | `/v1/queue/{id}/complete` | JWT |
| GET | `/v1/stats/today` | JWT |
| GET/PATCH | `/v1/settings` | JWT |
| DELETE | `/v1/user` | JWT |

## Default pacing (conservative)

- Min delay between replays: **90 seconds**
- Max delay: **3 minutes**
- Max replays per day: **25**
- Active hours: **8:00–22:00** local time

Adjust in extension Settings.

## License

Private project — add license before public release.
