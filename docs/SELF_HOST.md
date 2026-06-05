# Self-hosting SyncX (BYOK cloud backend)

SyncX is designed so **anyone can deploy their own backend** and plug credentials into the extension — no vendor lock-in, no shared API keys in the build.

## Architecture

```
┌─────────────────┐     your AWS          ┌──────────────────┐
│  SyncX extension │ ──────────────────► │ API Gateway      │
│  (Chrome)        │     JWT (Cognito)   │ Lambda + DynamoDB│
└─────────────────┘                     │ Cognito User Pool│
                                        └──────────────────┘
```

Each user (or your startup's customers) runs their **own** stack and enters three values in **Settings → Your cloud backend**:

| Field | CDK output key |
|-------|----------------|
| API URL | `ApiUrl` |
| Cognito domain | `CognitoDomain` |
| Cognito client ID | `UserPoolClientId` |

Or paste the combined JSON from `ExtensionConfigJson`.

## Deploy to AWS (~$0–5/mo personal use)

### Prerequisites

- Node.js 20+, pnpm, AWS CLI configured (`aws sts get-caller-identity`)
- AWS CDK bootstrapped once per account/region

### Commands

```bash
pnpm install
pnpm build

# Bootstrap CDK (first time only)
pnpm --filter @syncx/infra exec cdk bootstrap

# Deploy stack (optional budget alerts)
pnpm --filter @syncx/infra deploy -- -c budgetEmail=you@example.com
```

Outputs are written to `infra/outputs.json`.

### Configure Cognito OAuth callback

1. Load the SyncX extension in Chrome.
2. Open **Settings** — copy the **OAuth callback URL** shown (format: `https://<extension-id>.chromiumapp.org/syncx`).
3. AWS Console → **Cognito** → your user pool → **App client** → **Hosted UI**.
4. Add the callback URL under **Allowed callback URLs**. Save.

### Configure the extension

1. Open SyncX **Settings**.
2. Paste **API URL**, **Cognito domain**, and **Client ID** from `infra/outputs.json` (or use **Test API /health** after entering URL).
3. Click **Save cloud backend** — approve host permissions when prompted.
4. Open the popup → **Sign in to SyncX** → create account or sign in.

## Local-only mode (no cloud)

Leave cloud backend fields empty. Phase A behavior: queue stored in `chrome.storage.local` only.

## Public distribution model

When you open-source or publish SyncX:

1. Ship the **extension** publicly (GitHub / Chrome Web Store).
2. Ship the **CDK infra** in this repo — users run `cdk deploy` on **their** AWS account.
3. Users never receive your credentials; they configure their own backend in Settings.

Build-time `VITE_*` env vars are **optional dev shortcuts** only. Production flow is always **Settings UI**.

## Tear down

```bash
pnpm --filter @syncx/infra exec cdk destroy
```

DynamoDB and Cognito use `RemovalPolicy.DESTROY` for dev stacks.

## AWS organization (myApplications)

The CDK stack registers everything under:

- **myApplications / AppRegistry:** `syncx-prod`
- **Resource Group:** `syncx-prod` (tag `Application=syncx-prod`)
- **Stack tags:** `Project=SyncX`, `Environment=prod`

Find in AWS Console:

- **myApplications** → Applications → **syncx-prod**
- **Resource Groups & Tag Editor** → **syncx-prod**
- **CloudFormation** → **SyncXStack** (still the deploy unit)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Login redirect error | Callback URL in Cognito must match `chrome.identity.getRedirectURL('syncx')` exactly |
| API fetch blocked | Re-save cloud config to grant host permissions for your API + Cognito domains |
| `/health` fails | Confirm stack deployed; URL has no trailing slash |
| 401 on `/v1/*` | Sign out and sign in again; check client ID matches deployed pool |

See also [MANUAL_TEST_PHASE_B.md](./MANUAL_TEST_PHASE_B.md).
