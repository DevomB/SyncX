import type { Metadata } from "next";
import Link from "next/link";
import { GITHUB_URL } from "@/lib/links";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Setup guide",
};

export default function DocsPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <h1>Setup guide</h1>
      <p>
        SyncX has two modes: local-only (no account required) and cloud-backed
        (self-hosted AWS). Start with local — you can add the cloud later.
      </p>

      <h2 id="get-started">Install from Chrome Web Store</h2>
      <p>
        The easiest path. Install, sign in to Bing in the same Chrome profile,
        then search on Google as normal. That&apos;s it.
      </p>

      <h2 id="build-source">Build from source</h2>
      <p>Requires Node.js 20+ and pnpm.</p>
      <pre>
        <code>{`git clone https://github.com/DevomB/SyncX
cd SyncX
pnpm install
pnpm build`}</code>
      </pre>
      <ol>
        <li>
          Open <code>chrome://extensions</code> in Chrome → enable Developer mode
        </li>
        <li>
          Click <strong>Load unpacked</strong> → select{" "}
          <code>apps/extension/dist</code>
        </li>
        <li>
          Sign in to <a href="https://www.bing.com" target="_blank" rel="noopener noreferrer">bing.com</a> in the same profile
        </li>
        <li>Search on Google — SyncX handles the rest</li>
      </ol>

      <h2 id="self-host">Self-host cloud backend (optional)</h2>
      <p>
        Deploying the backend syncs your queue and stats across devices. It runs on
        your own AWS account — no shared server. Estimated cost: ~$0–5/month for
        personal use.
      </p>

      <h3>Requirements</h3>
      <ul>
        <li>AWS CLI configured with appropriate permissions</li>
        <li>AWS CDK bootstrapped once per account/region</li>
      </ul>

      <h3>Deploy</h3>
      <pre>
        <code>{`pnpm deploy:cloud`}</code>
      </pre>

      <h3>Connect the extension</h3>
      <ol>
        <li>
          Open <code>infra/outputs.json</code> and copy <code>ApiUrl</code>,{" "}
          <code>CognitoDomain</code>, and <code>UserPoolClientId</code>
        </li>
        <li>
          In the extension: open <strong>Settings</strong> → paste the three values
          → <strong>Save</strong>
        </li>
        <li>
          Add the OAuth callback URL (shown in Settings) to your Cognito app client
        </li>
        <li>
          Click <strong>Sign in to SyncX</strong> in the popup
        </li>
      </ol>

      <div className="callout">
        <p>
          Cloud settings are optional. The extension works fully without them — your
          queue and settings stay in Chrome local storage.
        </p>
      </div>

      <h2>Tear down</h2>
      <pre>
        <code>pnpm --filter @syncx/infra exec cdk destroy</code>
      </pre>

      <p style={{ marginTop: "2.5rem" }}>
        Questions?{" "}
        <a href={GITHUB_URL + "/issues"} target="_blank" rel="noopener noreferrer">
          Open an issue on GitHub
        </a>{" "}
        · <Link href="/terms">Terms of Service</Link>
        {" "}
        · <Link href="/privacy">Privacy policy</Link>
      </p>
    </article>
  );
}
