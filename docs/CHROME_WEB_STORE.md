# Chrome Web Store submission checklist

Complete these steps after `pnpm package:extension` produces `syncx-extension.zip`.

## Prerequisites

- [ ] [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole) ($5 one-time)
- [ ] `syncx-extension.zip` at repo root
- [ ] Privacy policy live at **https://syncx.devomb.com/privacy**

## Upload

1. Developer Dashboard → **New item** → upload `syncx-extension.zip`.

## Store listing

| Field | Value |
|-------|--------|
| Name | SyncX |
| Summary | Search mirror queue with pacing and daily caps |
| Category | Productivity |
| Icon | `apps/extension/public/icon-128.png` |
| Screenshots | Add to `docs/screenshots/` first (1280×800) |
| Privacy policy | https://syncx.devomb.com/privacy |

**Description template:**

> SyncX captures Google search queries and replays them on Bing in your browser with enforced pacing, daily caps, and active-hour windows. Local-first by default; optional self-hosted AWS backend.
>
> Not affiliated with Microsoft. May conflict with Microsoft Rewards program rules. Use at your own risk.

## Privacy practices

- Single purpose: mirrors Google queries to Bing with user-controlled pacing
- Permissions: storage, alarms, notifications, identity, tabs
- Host access: google.com, bing.com (optional AWS/Cognito when user configures cloud)

## Distribution

- Visibility: **Unlisted**
- Countries: your choice

## After approval

1. Copy URL: `https://chrome.google.com/webstore/detail/<EXTENSION_ID>`
2. Update `CHROME_STORE_URL` in [`apps/web/lib/links.ts`](../apps/web/lib/links.ts)
3. Update README live links table
4. Run `vercel deploy --prod` from repo root to refresh site CTAs
