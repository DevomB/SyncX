import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <h1>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: 2026-06-06</p>

      <div className="callout">
        <p>
          By using SyncX, you agree to this Privacy Policy and our{" "}
          <Link href="/terms">Terms of Service</Link>. If you do not agree, do not use
          SyncX.
        </p>
      </div>

      <h2>Operator</h2>
      <p>
        This Privacy Policy is issued by <strong>Devom B</strong> (&quot;Operator&quot;,
        &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operator of SyncX. Contact:{" "}
        <strong>Devom.b@yahoo.com</strong>.
      </p>

      <p>
        SyncX stores minimal data to operate a search mirror queue. This document
        describes what we collect and how you can control it.
      </p>

      <h2>Data we store</h2>
      <h3>On your device (Chrome local storage)</h3>
      <ul>
        <li>Pending replay queue (search query text, timestamps, status)</li>
        <li>Daily replay counters</li>
        <li>User settings (delays, caps, active hours, pause state)</li>
        <li>Optional: OAuth tokens in session storage when signed in to SyncX cloud</li>
      </ul>

      <h3>On SyncX cloud (when you sign in)</h3>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Purpose</th>
            <th>Retention</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Search query text</td>
            <td>Replay on Bing</td>
            <td>30 days (TTL on event rows)</td>
          </tr>
          <tr>
            <td>Capture timestamp</td>
            <td>Ordering queue</td>
            <td>30 days on events; queue rows until completed</td>
          </tr>
          <tr>
            <td>Source URL (Google search URL)</td>
            <td>Debugging / context</td>
            <td>30 days</td>
          </tr>
          <tr>
            <td>Cognito sub (anonymous user ID)</td>
            <td>Account isolation</td>
            <td>Until account deletion</td>
          </tr>
          <tr>
            <td>Email (via Cognito)</td>
            <td>Authentication only</td>
            <td>Managed by Amazon Cognito</td>
          </tr>
        </tbody>
      </table>

      <h2>What we do NOT store</h2>
      <ul>
        <li>Microsoft or Google passwords</li>
        <li>Full browsing history</li>
        <li>Page content beyond search query strings</li>
        <li>Payment information (v1 has no billing)</li>
      </ul>

      <h2>How data is used</h2>
      <ul>
        <li>Queue Google search queries for later replay on Bing in your browser</li>
        <li>Enforce pacing and daily caps you configure</li>
        <li>Display status in the extension popup</li>
      </ul>
      <p>We do <strong>not</strong> sell your personal data.</p>

      <h2>Data sharing</h2>
      <p>
        We do not sell data. AWS hosts cloud infrastructure under their privacy and
        security terms. We may disclose information if required by law or to protect
        our rights, subject to applicable legal process.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on your jurisdiction, you may have rights to access, correct, delete,
        or export personal data. Contact <strong>Devom.b@yahoo.com</strong> to
        exercise these rights.
      </p>

      <h2>Export</h2>
      <p>
        Contact <strong>Devom.b@yahoo.com</strong> to request a copy of cloud-stored
        data.
      </p>

      <h2>Deletion</h2>
      <ul>
        <li>
          <strong>Cloud:</strong> Extension Settings → Delete cloud data, or{" "}
          <code>DELETE /v1/user</code> with your access token
        </li>
        <li>
          <strong>Local:</strong> Remove extension or clear extension storage in Chrome
        </li>
      </ul>

      <h2>Security</h2>
      <ul>
        <li>API requires Cognito JWT for all <code>/v1/*</code> routes</li>
        <li>DynamoDB encryption at rest (AWS default)</li>
        <li>TLS in transit for all API calls</li>
      </ul>
      <p>
        No method of transmission or storage is 100% secure. We cannot guarantee
        absolute security.
      </p>

      <h2>Children</h2>
      <p>
        SyncX is not directed at users under 13. We do not knowingly collect personal
        information from children under 13. If you believe we have collected such
        information, contact us to request deletion.
      </p>

      <h2>International users</h2>
      <p>
        If you access the Service from outside the United States, you consent to the
        transfer and processing of your data in the United States and other countries
        where we or our service providers operate, which may have different data
        protection laws than your jurisdiction.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, the Operator is not liable for any
        damages arising from unauthorized access to or disclosure of your data. See our{" "}
        <Link href="/terms">Terms of Service</Link> for full disclaimers, limitation of
        liability, and indemnification terms.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy; continued use after changes constitutes acceptance.
        Material changes will be posted on this page.
      </p>

      <h2>Related documents</h2>
      <ul>
        <li>
          <Link href="/terms">Terms of Service</Link>
        </li>
        <li>
          <Link href="/risks">Third-party Terms Notice</Link>
        </li>
      </ul>

      <p style={{ marginTop: "2.5rem" }}>
        <Link href="/">← Back to home</Link>
      </p>
    </article>
  );
}
