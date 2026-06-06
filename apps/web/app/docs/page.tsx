import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Self-hosting guide",
};

export default function DocsPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <h1>Self-hosting SyncX</h1>
      <p>
        SyncX is designed so anyone can deploy their own backend and plug credentials
        into the extension — no vendor lock-in, no shared API keys in the build.
      </p>

      <h2 id="get-started">Quick start (Phase A — local only)</h2>
      <p>No cloud setup required. The queue lives entirely in Chrome local storage.</p>
      <pre>
        <code>{`pnpm install
pnpm --filter @syncx/shared build
pnpm --filter @syncx/extension build`}</code>
      </pre>
      <ol>
        <li>
          Chrome → <code>chrome://extensions</code> → Developer mode →{" "}
          <strong>Load unpacked</strong> → <code>apps/extension/dist</code>
        </li>
        <li>
          Sign in to <a href="https://www.bing.com">bing.com</a> in the same Chrome
          profile
        </li>
        <li>Search on Google — SyncX queues and replays on Bing automatically</li>
      </ol>

      <h2 id="self-host">Self-host on AWS (Phase B)</h2>
      <p>
        Deploy to your AWS account, then paste three values into the extension Settings
        UI. Target cost: ~$0–5/month for personal use.
      </p>

      <h3>Prerequisites</h3>
      <ul>
        <li>Node.js 20+, pnpm, AWS CLI configured</li>
        <li>AWS CDK bootstrapped once per account/region</li>
      </ul>

      <h3>Deploy</h3>
      <pre>
        <code>{`pnpm install
pnpm deploy:cloud
# optional budget alerts: add -c budgetEmail=you@example.com after --`}</code>
      </pre>

      <h3>Configure the extension</h3>
      <ol>
        <li>
          Open <code>infra/outputs.json</code> — copy <code>ApiUrl</code>,{" "}
          <code>CognitoDomain</code>, <code>UserPoolClientId</code>
        </li>
        <li>
          Extension <strong>Settings → Your cloud backend</strong> → paste values →{" "}
          <strong>Save</strong>
        </li>
        <li>
          Add the OAuth callback URL (shown in Settings) to Cognito app client
        </li>
        <li>Popup → <strong>Sign in to SyncX</strong></li>
      </ol>

      <table>
        <thead>
          <tr>
            <th>Settings field</th>
            <th>CDK output key</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>API URL</td>
            <td><code>ApiUrl</code></td>
          </tr>
          <tr>
            <td>Cognito domain</td>
            <td><code>CognitoDomain</code></td>
          </tr>
          <tr>
            <td>Cognito client ID</td>
            <td><code>UserPoolClientId</code></td>
          </tr>
        </tbody>
      </table>

      <h2>Local-only mode</h2>
      <p>
        Leave cloud backend fields empty in Settings. Phase A behavior: queue stored in{" "}
        <code>chrome.storage.local</code> only.
      </p>

      <h2>Deploy this website on Vercel</h2>
      <ol>
        <li>Import the SyncX repository in Vercel</li>
        <li>Set <strong>Root Directory</strong> to <code>apps/web</code></li>
        <li>
          Vercel reads <code>vercel.json</code> for monorepo install/build commands
        </li>
        <li>Deploy — no AWS required for the marketing site</li>
      </ol>

      <div className="callout">
        <p>
          The marketing site is separate from the SyncX API stack. Your AWS CDK deploy
          serves the extension backend, not this website.
        </p>
      </div>

      <h2>Tear down</h2>
      <pre>
        <code>pnpm --filter @syncx/infra exec cdk destroy</code>
      </pre>

      <p>
        See also: <Link href="/privacy">Privacy policy</Link> ·{" "}
        <Link href="/risks">Rewards risk notice</Link>
      </p>
    </article>
  );
}
