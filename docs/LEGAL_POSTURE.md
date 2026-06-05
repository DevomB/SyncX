# SyncX Legal Posture (Informational — Not Legal Advice)

SyncX v1 is designed as a **personal search-mirror tool** with conservative defaults. This document describes product choices intended to reduce legal and platform risk. **Consult a licensed attorney** before commercial distribution, monetization, or public marketing.

## v1 defaults

| Choice | Rationale |
|--------|-----------|
| Personal-use framing | No landing page promising gift cards or Rewards farming |
| No monetization in v1 | Avoids commercial fraud / unfair competition angles |
| No multi-account support | Reduces program abuse signals |
| No Microsoft credential storage | User stays logged into Bing via normal browser cookies only |
| No server-side Bing execution | Searches run only in the user's Chrome profile |
| Query text only on server | Minimize sensitive data; 30-day TTL on events |
| Delete-user API | User can remove cloud data |

## Distribution tiers and escalating risk

| Tier | Description | Primary risks |
|------|-------------|---------------|
| **Private / sideload** | Extension loaded unpacked on your machine only | Microsoft Rewards account throttle or ban (most likely) |
| **Public GitHub** | Source visible; README must not market Rewards circumvention | Informal takedown, platform scrutiny if traction grows |
| **Chrome Web Store** | Public install; store policy review | Store rejection/removal; increased visibility to Microsoft |
| **Paid SaaS / sold tool** | Subscriptions tied to automation | Higher C&D and enforcement risk; consult attorney first |

## Documented industry precedent

Public automation tools marketed for Bing Rewards have reportedly received **cease and desist** demands requiring takedown. Private experimentation on a single account is a different exposure profile than shipping a commercial bot.

## Trademark and branding

- Do **not** use Microsoft, Bing, or Rewards logos in the extension
- Do **not** imply official partnership or endorsement
- Name the product a **search mirror queue**, not a "Rewards bot"

## What forming an LLC does and does not do

- **May** limit certain business liabilities for a company
- **Does not** make Microsoft Rewards ToS violations permitted
- **Does not** prevent account bans or platform enforcement

## Before you distribute publicly

1. Read [REWARDS_RISK.md](./REWARDS_RISK.md)
2. Read [PRIVACY.md](./PRIVACY.md)
3. Speak with an attorney in your jurisdiction about your intended use and distribution model
