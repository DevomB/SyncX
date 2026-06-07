# SyncX

**Search mirror queue for Chrome** — captures Google search queries and replays them on Bing in your browser with enforced pacing and daily caps.

[![Chrome Extension](https://img.shields.io/badge/Chrome-MV3-blue)](apps/extension)
[![Next.js](https://img.shields.io/badge/Web-Next.js-black)](apps/web)
[![AWS CDK](https://img.shields.io/badge/Cloud-AWS%20CDK-orange)](infra)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Not affiliated with Microsoft.** Using automation with Microsoft Rewards may violate the [Microsoft Services Agreement](https://www.microsoft.com/en-us/servicesagreement/) and result in account restrictions. Use at your own risk. See [Terms of Service](https://syncx.devomb.com/terms), [Privacy Policy](https://syncx.devomb.com/privacy), [docs/REWARDS_RISK.md](docs/REWARDS_RISK.md), and [docs/LEGAL_POSTURE.md](docs/LEGAL_POSTURE.md).

## Live links

| Resource | URL |
|----------|-----|
| **Install extension** | [Chrome Web Store (unlisted)](https://chrome.google.com/webstore/detail/syncx) — update after approval |
| **Marketing site** | [syncx.devomb.com](https://syncx.devomb.com) |
| **Source code** | [github.com/DevomB/SyncX](https://github.com/DevomB/SyncX) |
| **Privacy policy** | [syncx.devomb.com/privacy](https://syncx.devomb.com/privacy) |
| **Terms of Service** | [syncx.devomb.com/terms](https://syncx.devomb.com/terms) |

> Replace the Chrome Web Store and Vercel URLs in [`apps/web/lib/links.ts`](apps/web/lib/links.ts) once your listings are live.

## What it does

SyncX watches for Google searches you already run, queues the query text, and later opens Bing in your browser to run the same search — with random delays, daily caps, and active-hour windows you control.

```
Google search (capture) → SyncX queue (local or AWS) → Bing tab replay (your browser)
```

- **Phase A (local):** Queue lives in Chrome storage — no account required.
- **Phase B (cloud):** Self-host AWS (Lambda, DynamoDB, Cognito) and paste three values into extension Settings.

## Screenshots

Add captures to [`docs/screenshots/`](docs/screenshots/) after building:

- Extension popup (pending count, pause/resume)
- Options page (pacing settings)
- Bing replay in action

## Install (end users)

1. Install from the [Chrome Web Store](https://chrome.google.com/webstore/detail/syncx) (unlisted link).
2. Sign in to [bing.com](https://www.bing.com) in the same Chrome profile.
3. Search on Google — SyncX queues and replays on Bing automatically.

## Build from source

**Requirements:** Node.js 20+, pnpm 9+

```bash
pnpm install
pnpm build
```

Load unpacked: Chrome → `chrome://extensions` → Developer mode → **Load unpacked** → `apps/extension/dist`

Full checklist: [docs/MANUAL_TEST_PHASE_A.md](docs/MANUAL_TEST_PHASE_A.md)

### Package for Chrome Web Store

```bash
pnpm package:extension
# Creates syncx-extension.zip at repo root
```

See [docs/DEPLOY.md](docs/DEPLOY.md) for Vercel + Chrome Web Store publishing steps.

## Self-host cloud backend (optional)

```bash
pnpm deploy:cloud
# optional budget alerts: add -c budgetEmail=you@example.com after --
```

1. Open `infra/outputs.json` — copy `ApiUrl`, `CognitoDomain`, `UserPoolClientId`.
2. Extension **Settings → Your cloud backend** → paste values → **Save**.
3. Add the OAuth callback URL (shown in Settings) to Cognito app client.
4. Popup → **Sign in to SyncX**.

Full guide: [docs/SELF_HOST.md](docs/SELF_HOST.md) · Test checklist: [docs/MANUAL_TEST_PHASE_B.md](docs/MANUAL_TEST_PHASE_B.md)

> **Known limitation:** Cloud settings API exists but the extension options UI currently stores pacing settings locally. Cloud sync for settings is planned; queue and stats sync when signed in.

## Monorepo layout

| Path | Purpose |
|------|---------|
| `apps/extension` | Chrome extension |
| `apps/web` | Marketing site (Next.js, Vercel-ready) |
| `packages/shared` | Shared types and constants |
| `services/api` | Lambda API handler |
| `infra` | AWS CDK stack |
| `docs/` | Manual tests, privacy, legal, deploy guide |

## Tech stack

- **Extension:** Chrome MV3, Vite, `@crxjs/vite-plugin`
- **Web:** Next.js 15, Vercel
- **Cloud:** AWS CDK, Lambda, API Gateway, DynamoDB, Cognito
- **Monorepo:** pnpm workspaces, Turbo

## Development

```bash
pnpm dev:extension    # Vite dev server with HMR
pnpm dev:web          # Next.js marketing site (localhost:3000)
pnpm build            # Build all packages
```

Optional dev env: copy [`apps/extension/.env.example`](apps/extension/.env.example) to `.env.local`.

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

[MIT](LICENSE) — Copyright (c) 2026 Devom B
