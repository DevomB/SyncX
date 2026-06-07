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
          <strong>This is not legal advice.</strong> By using SyncX, you agree to our{" "}
          <Link href="/terms">Terms of Service</Link> and{" "}
          <Link href="/privacy">Privacy Policy</Link>, including all disclaimers,
          limitation of liability, indemnification, and release provisions therein.
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
        that govern automated access and use of their services. It is your sole
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
        representations about compatibility with such programs.{" "}
        <strong>
          You assume all risk of account restrictions, loss of points, or suspension.
        </strong>
      </p>

      <h2>No warranty</h2>
      <p>
        SyncX is provided <strong>as-is, without any warranty of any kind</strong>.
        See the{" "}
        <Link href="/terms">Terms of Service</Link> and{" "}
        <a
          href="https://github.com/DevomB/SyncX/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>{" "}
        for full disclaimers.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Devom B (the Operator) shall not be
        liable for any damages arising from your use of SyncX, including but not
        limited to loss of rewards points, account suspensions, data loss, or
        third-party enforcement actions. See the{" "}
        <Link href="/terms">Terms of Service</Link> for complete liability limitations,
        indemnification, and dispute resolution terms.
      </p>

      <p style={{ marginTop: "2.5rem" }}>
        <Link href="/">← Back to home</Link>
      </p>
    </article>
  );
}
