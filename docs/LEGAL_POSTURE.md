# SyncX Legal Posture (Informational — Not Legal Advice)

SyncX v1 is designed as a **personal search-mirror tool** with conservative defaults. This document describes product choices intended to reduce legal and platform risk. **Consult a licensed attorney** before commercial distribution, monetization, or public marketing.

**No legal document eliminates all liability.** The Operator has published binding [Terms of Service](./TERMS_OF_SERVICE.md) and a [Privacy Policy](./PRIVACY.md) that users accept by installing or using SyncX. Those documents — not this file — govern the legal relationship with users.

## Legal document stack

| Document | Purpose | Binding? |
|----------|---------|----------|
| [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md) | User agreement: acceptable use, disclaimers, liability cap, indemnification, arbitration | **Yes** — accepted on use |
| [PRIVACY.md](./PRIVACY.md) | Data collection, retention, deletion, user rights | **Yes** — accepted on use |
| [REWARDS_RISK.md](./REWARDS_RISK.md) | Microsoft Rewards conflict disclosure | Informational |
| [LICENSE](../LICENSE) (MIT) | Open-source software redistribution rights | Yes — for code |
| This file | Internal product/risk notes for maintainers | No |

**Live URLs (update after deploy):**

- Terms: https://syncx.devomb.com/terms
- Privacy: https://syncx.devomb.com/privacy
- Third-party notice: https://syncx.devomb.com/risks

## Key liability protections in the Terms of Service

The Terms of Service include, among other provisions:

- **"As is" disclaimer of warranties** — no guarantee the Service works or won't cause account issues
- **Limitation of liability** — cap at $0 (v1 is free) or amounts paid in the prior 12 months
- **Assumption of risk and release** — user accepts platform enforcement consequences
- **Indemnification** — user defends the Operator against claims arising from user's use
- **Binding individual arbitration and class action waiver** (where permitted by law)
- **Third-party platform disclaimer** — Operator not responsible for Microsoft/Google actions

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
| Published ToS + Privacy Policy | Users accept binding terms on install/use |

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
- **Does not** replace the need for proper Terms of Service and attorney review

## Before you distribute publicly

1. Read [TERMS_OF_SERVICE.md](./TERMS_OF_SERVICE.md)
2. Read [PRIVACY.md](./PRIVACY.md)
3. Read [REWARDS_RISK.md](./REWARDS_RISK.md)
4. Have a licensed attorney review all legal documents for your jurisdiction and distribution model
5. Ensure the marketing site and extension link to `/terms` and `/privacy`
