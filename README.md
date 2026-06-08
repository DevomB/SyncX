# SyncX

SyncX is a Chrome extension that captures Google search query text, keeps a local
queue, and replays those searches on Bing with pacing and daily limits you control.

It is not affiliated with Microsoft or Google. Use it at your own risk and review
the live [Terms of Service](https://syncx.devomb.com/terms), [Privacy Policy](https://syncx.devomb.com/privacy),
and [Third-party Terms Notice](https://syncx.devomb.com/risks).

## Links

| Resource | URL |
| --- | --- |
| Install extension | [Chrome Web Store](https://chromewebstore.google.com/detail/syncx/aoemdhkojjipbafpdehcfgfldjogfkka) |
| Website | [syncx.devomb.com](https://syncx.devomb.com) |
| Source | [github.com/DevomB/SyncX](https://github.com/DevomB/SyncX) |

## What It Does

1. Watches for Google searches in Chrome.
2. Stores the query text in Chrome local storage.
3. Opens Bing searches later, using your delay, daily cap, and active-hour settings.

The extension works without an account. Optional cloud sync is self-hosted with the
AWS CDK stack in this repo.

## Build

Requirements: Node.js 20+ and pnpm 9+.

```bash
pnpm install
pnpm build
```

Load the extension from `apps/extension/dist` in `chrome://extensions` with
Developer mode enabled.

To create the Chrome Web Store ZIP:

```bash
pnpm package:extension
```

The generated `syncx-extension.zip` is ignored by git.

## Development

```bash
pnpm dev:extension
pnpm dev:web
pnpm build
```

## Optional Cloud Backend

```bash
pnpm deploy:cloud
```

After deployment, copy `ApiUrl`, `CognitoDomain`, and `UserPoolClientId` from
`infra/outputs.json` into the extension Settings page. See
[docs/SELF_HOST.md](docs/SELF_HOST.md) for the full self-hosting flow.

## Layout

| Path | Purpose |
| --- | --- |
| `apps/extension` | Chrome MV3 extension |
| `apps/web` | Next.js website |
| `packages/shared` | Shared types and constants |
| `services/api` | Lambda API handler for optional cloud sync |
| `infra` | AWS CDK stack |
| `docs/SELF_HOST.md` | Self-hosting guide |

## License

[MIT](LICENSE) - Copyright (c) 2026 Devom B
