# Deploy SyncX

Guide for publishing the marketing site and Chrome extension.

## 1. Marketing site (Vercel)

1. Push this repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import `DevomB/SyncX`.
3. Vercel reads [`apps/web/vercel.json`](../apps/web/vercel.json) automatically:
   - Install: `cd ../.. && pnpm install`
   - Build: `cd ../.. && pnpm --filter @syncx/shared build && pnpm --filter @syncx/web build`
4. Deploy. Copy your URL (e.g. `https://syncx-xxx.vercel.app`).
5. Update [`apps/web/lib/links.ts`](../apps/web/lib/links.ts) → `SITE_URL`.
6. Redeploy so README links and footer match.

**Privacy policy URL for Chrome Web Store:** `https://syncx.devomb.com/privacy`

**Terms of Service URL:** `https://syncx.devomb.com/terms` (link from store description and extension UI)

### CLI (optional)

```bash
npm i -g vercel
cd apps/web
vercel --prod
```

## 2. Chrome extension (unlisted)

### Prerequisites

- [Chrome Web Store developer account](https://chrome.google.com/webstore/devconsole) ($5 one-time)
- Built zip from `pnpm package:extension`

### Build and package

```bash
pnpm install
pnpm package:extension
# → syncx-extension.zip at repo root
```

### Upload

1. Developer Dashboard → **New item** → upload `syncx-extension.zip`.
2. **Store listing**
   - Name: SyncX
   - Summary: Search mirror queue with pacing and daily caps
   - Description: Features + Microsoft Rewards disclaimer
   - Category: Productivity
   - Icon: 128×128 from `apps/extension/public/icon-128.png`
   - Screenshots: at least one 1280×800 (popup + options)
   - Privacy policy: `https://<your-vercel-domain>/privacy`
   - Terms reference in description: `https://<your-vercel-domain>/terms`
3. **Privacy practices**
   - Single purpose: mirrors Google queries to Bing with user-controlled pacing
   - Declare: storage, tabs, alarms, identity; host access to google.com and bing.com
4. **Distribution**
   - Visibility: **Unlisted**
   - Countries: your choice
5. **Submit for review** (typically 1–7 days).

### After approval

1. Copy store URL: `https://chrome.google.com/webstore/detail/<EXTENSION_ID>`
2. Update `CHROME_STORE_URL` in [`apps/web/lib/links.ts`](../apps/web/lib/links.ts)
3. Update the Live links table in [`README.md`](../README.md)
4. Redeploy Vercel

## 3. Hack Club / The Bay submission

- [ ] Hackatime tracking this repo
- [ ] Public GitHub repo with MIT license
- [ ] Live Chrome Web Store link (unlisted counts as production)
- [ ] Live Vercel site
- [ ] README with install instructions
- [ ] Submit in The Bay with project name, description, live URL, repo URL, screenshot

## Review tips

Google may question automation-related extensions. If asked:

- Emphasize user-controlled pacing and daily caps
- Local-first mode requires no cloud
- Not affiliated with Microsoft; user assumes Rewards risk
- Unlisted listing for personal use
