import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Third-party Terms Notice",
};

export default function RisksPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <h1>Third-party Terms Notice</h1>
      <p className={styles.updated}>Last updated: 2026-06-06</p>

      <div className="callout">
        <p>
          <strong>This is not legal advice.</strong> Review the terms of service for
          any third-party platform you use before installing SyncX.
        </p>
      </div>

      <h2>What SyncX does</h2>
      <p>
        SyncX is a browser extension that automates navigation to Bing search result
        pages using queries captured from your own Google searches. It operates
        entirely within your browser, under your Chrome profile, and at the pace and
        limits you configure.
      </p>

      <h2>Third-party platforms</h2>
      <p>
        SyncX interacts with Google and Bing. Both platforms have terms of service
        that govern automated access and use of their services. It is your
        responsibility to review those terms and determine whether your use of SyncX
        is consistent with them.
      </p>
      <p>
        SyncX is <strong>not affiliated with, endorsed by, or connected to</strong>{" "}
        Microsoft, Google, or any other third party.
      </p>

      <h2>Rewards programs</h2>
      <p>
        If you participate in any search-based rewards or incentive program, review
        that program&apos;s rules before using SyncX. SyncX does not make any
        representations about compatibility with such programs.
      </p>

      <h2>No warranty</h2>
      <p>
        SyncX is provided as-is, without any warranty of any kind. See the{" "}
        <a
          href="https://github.com/DevomB/SyncX/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>{" "}
        for the full disclaimer.
      </p>

      <p>
        <Link href="/">← Back to home</Link>
      </p>
    </article>
  );
}
