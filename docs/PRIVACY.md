# SyncX Privacy Policy

Last updated: 2026-06-06

## Operator

This Privacy Policy is issued by **Devom B** ("Operator", "we", "us", "our"), operator of SyncX. Contact: **Devom.b@yahoo.com**.

By installing, accessing, or using SyncX (the "Service"), you agree to this Privacy Policy and our [Terms of Service](./TERMS_OF_SERVICE.md). If you do not agree, do not use the Service.

---

SyncX stores minimal data to operate a search mirror queue. This document describes what we collect and how you can control it.

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

We do **not** sell your personal data.

## Data sharing

We do not sell data. AWS hosts cloud infrastructure under their privacy and security terms. We may disclose information if required by law or to protect our rights, subject to applicable legal process.

## Your rights

Depending on your jurisdiction, you may have rights to access, correct, delete, or export personal data. To exercise these rights, contact **Devom.b@yahoo.com**.

## Export

Contact: **Devom.b@yahoo.com** to request a copy of cloud-stored data.

## Deletion

- **Cloud:** Extension Settings → **Delete cloud data**, or `DELETE /v1/user` with your access token
- **Local:** Remove extension or clear extension storage in Chrome

## Security

- API requires Cognito JWT for all `/v1/*` routes
- DynamoDB encryption at rest (AWS default)
- TLS in transit for all API calls

No method of transmission or storage is 100% secure. We cannot guarantee absolute security.

## Children

SyncX is not directed at users under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, contact us to request deletion.

## International users

If you access the Service from outside the United States, you consent to the transfer and processing of your data in the United States and other countries where we or our service providers operate, which may have different data protection laws than your jurisdiction.

## Limitation of liability

To the fullest extent permitted by law, the Operator is not liable for any damages arising from unauthorized access to or disclosure of your data. See our [Terms of Service](./TERMS_OF_SERVICE.md) for full disclaimers, limitation of liability, and indemnification terms.

## Changes

We may update this policy; the "Last updated" date reflects the latest revision. Material changes will be posted on [syncx.devomb.com/privacy](https://syncx.devomb.com/privacy). Continued use after changes constitutes acceptance.

## Related documents

- [Terms of Service](./TERMS_OF_SERVICE.md)
- [Third-party Terms Notice](https://syncx.devomb.com/risks)
- [Legal Posture](./LEGAL_POSTURE.md) (informational — not legal advice)
