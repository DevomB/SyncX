# Phase A Manual Test Checklist

Complete all 12 steps before deploying AWS infrastructure.

## Prerequisites

- Chrome browser
- SyncX extension built (`pnpm --filter @syncx/extension build`)
- Microsoft account signed in at [bing.com](https://www.bing.com) in the same Chrome profile

## Steps

1. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, select `apps/extension/dist`.
2. Confirm SyncX appears with no errors on the extensions page.
3. Open SyncX popup — verify **State: Active**, **Cloud: Local only** (no login required for Phase A).
4. Sign in to Microsoft on [https://www.bing.com](https://www.bing.com) if **Bing login** shows **No**.
5. Navigate to `https://www.google.com/search?q=syncx-test-1` — confirm no console errors (F12 → Console on Google tab).
6. Open SyncX popup — **Pending** should show **1** (or higher if dedup allows).
7. Open extension **Settings** — confirm min delay **90** s, max delay **180** s, max replays **25**.
8. Wait up to **2 minutes** for the replay alarm (or click **Force replay** via service worker console: send `{type:'FORCE_REPLAY_NOW'}`).
9. Verify a background Bing tab opens with `q=syncx-test-1`, waits ~90–180 s, then closes.
10. Open popup — **Pending** decrements, **Today** increments (e.g. `1 / 25`).
11. Repeat Google searches until **Today** reaches max replays — confirm **no further Bing tabs** open.
12. Click **Pause** in popup — run another Google search — confirm **Pending** does not increase while paused (or replay does not run).

## Pass criteria

- Captures fire from Google URL and form submit
- Bing replay uses same query with delay
- Daily cap enforced
- Pause stops replay scheduling

## Fail actions

- Check service worker logs: `chrome://extensions` → SyncX → **Service worker**
- Confirm host permissions for google.com and bing.com
- Confirm signed into Bing in same profile
