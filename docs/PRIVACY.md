# SyncX Privacy Policy

Last updated: 2026-06-04

SyncX ("we", "the extension") stores minimal data to operate a search mirror queue. This document describes what we collect and how you can control it.

## Data we store

### On your device (Chrome local storage)

- Pending replay queue (search query text, timestamps, status)
- Daily replay counters
- User settings (delays, caps, active hours, pause state)
- Optional: OAuth tokens in session storage when signed in to SyncX cloud

### On SyncX cloud (when you sign in)

| Field | Purpose | Retention |
|-------|---------|-----------|
| Search query text | Replay on Bing | 30 days (TTL on event rows) |
| Capture timestamp | Ordering queue | 30 days on events; queue rows until completed |
| Source URL (Google search URL) | Debugging / context | 30 days |
| Cognito `sub` (anonymous user ID) | Account isolation | Until account deletion |
| Email (via Cognito) | Authentication only | Managed by Amazon Cognito |

## What we do NOT store

- Microsoft or Google passwords
- Full browsing history
- Page content beyond search query strings
- Payment information (v1 has no billing)

## How data is used

- Queue Google search queries for later replay on Bing in your browser
- Enforce pacing and daily caps you configure
- Display status in the extension popup

## Data sharing

We do not sell data. AWS hosts cloud infrastructure under their privacy and security terms.

## Export

Contact: **Devom.b@yahoo.com** to request a copy of cloud-stored data.

## Deletion

- **Cloud:** Extension Settings → **Delete cloud data**, or `DELETE /v1/user` with your access token
- **Local:** Remove extension or clear extension storage in Chrome

## Security

- API requires Cognito JWT for all `/v1/*` routes
- DynamoDB encryption at rest (AWS default)
- TLS in transit for all API calls

## Children

SyncX is not directed at users under 13.

## Changes

We may update this policy; material changes will be noted in the repository changelog.
