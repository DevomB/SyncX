import type { Metadata } from "next";
import { CHROME_STORE_URL, GITHUB_URL } from "@/lib/links";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Setup guide",
};

export default function DocsPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <h1>Setup guide</h1>
      <p>
        SyncX runs entirely in Chrome — no account or cloud setup required.
      </p>

      <h2 id="install">Install</h2>
      <ol>
        <li>
          <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer">
            Install from the Chrome Web Store
          </a>
        </li>
        <li>
          Sign in to{" "}
          <a href="https://www.bing.com" target="_blank" rel="noopener noreferrer">
            bing.com
          </a>{" "}
          in the same Chrome profile
        </li>
        <li>Search on Google — SyncX queues and replays on Bing automatically</li>
      </ol>

      <h2 id="settings">Settings</h2>
      <p>
        Open the extension popup and click <strong>Settings</strong> to adjust
        pacing, daily limits, active hours, or pause the queue.
      </p>

      <p style={{ marginTop: "2.5rem" }}>
        Building from source or self-hosting the optional cloud backend?{" "}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
          See the GitHub repo
        </a>
        .
      </p>
    </article>
  );
}
