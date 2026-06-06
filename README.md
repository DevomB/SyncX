# SyncX

Search mirror queue for Chrome — captures Google search queries and replays them on Bing in your browser with enforced pacing and daily caps.

**Not affiliated with Microsoft.** Using automation with Microsoft Rewards may violate the [Microsoft Services Agreement](https://www.microsoft.com/en-us/servicesagreement/) and result in account restrictions. See [docs/REWARDS_RISK.md](docs/REWARDS_RISK.md) and [docs/LEGAL_POSTURE.md](docs/LEGAL_POSTURE.md). Consult an attorney before commercial distribution.

## Architecture

```
Google search (capture) → SyncX queue (local or AWS) → Bing tab replay (your browser)
```

- **Extension:** Chrome MV3 — capture, schedule, replay
- **API:** AWS Lambda + API Gateway HTTP + DynamoDB + Cognito
- **AWS organization:** myApplications app + Resource Group **`syncx-prod`**
- **Cost target:** ~$0–5/month for personal use ([details](#aws-deploy))

## Monorepo layout

| Path | Purpose |
|------|---------|
| `apps/extension` | Chrome extension |
| `apps/web` | Marketing site (Next.js, Vercel-ready) |
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

## AWS deploy (Phase B — your own cloud backend)

SyncX is **self-hostable**: deploy to your AWS account, paste three values into the extension **Settings** UI. No API keys baked into the build.

```bash
pnpm install
pnpm deploy:cloud
# optional budget alerts: add -c budgetEmail=you@example.com after --
```

1. Open `infra/outputs.json` — copy `ApiUrl`, `CognitoDomain`, `UserPoolClientId` (or use `ExtensionConfigJson`).
2. Extension **Settings → Your cloud backend** → paste values → **Save**.
3. Add the OAuth callback URL (shown in Settings) to Cognito app client.
4. Popup → **Sign in to SyncX**.

Full guide: [docs/SELF_HOST.md](docs/SELF_HOST.md) · Test checklist: [docs/MANUAL_TEST_PHASE_B.md](docs/MANUAL_TEST_PHASE_B.md)

### Optional dev shortcuts

Build-time `VITE_API_URL`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN` in `apps/extension/.env.local` pre-fill defaults; **Settings UI overrides** for public/self-host distribution.

## Configuration reference

| Setting | Where | Description |
|---------|-------|-------------|
| API URL, Cognito domain, Client ID | Extension Settings | User-provided (BYOK) |
| `TABLE_NAME` | Lambda env | Set by CDK (`SyncXTable`) |
| `budgetEmail` | CDK context | Email for $10/mo budget alerts |

## Development

```bash
pnpm dev:extension    # Vite dev server with HMR
pnpm dev:web          # Next.js marketing site (localhost:3000)
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
