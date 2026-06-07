import type { Metadata } from "next";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <h1>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: 2026-06-04</p>

      <p>
        SyncX (&quot;we&quot;, &quot;the extension&quot;) stores minimal data to operate a
        search mirror queue. This document describes what we collect and how you can
        control it.
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

      <h2>Data sharing</h2>
      <p>
        We do not sell data. AWS hosts cloud infrastructure under their privacy and
        security terms.
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

      <h2>Children</h2>
      <p>SyncX is not directed at users under 13.</p>

      <h2>Changes</h2>
      <p>
        We may update this policy; material changes will be noted in the repository
        changelog.
      </p>
    </article>
  );
}
