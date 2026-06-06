import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Microsoft Rewards Risk Notice",
};

export default function RisksPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <div className="callout callout-error">
        <p>
          <strong>This document is informational only and is not legal advice.</strong>
        </p>
      </div>

      <h1>Microsoft Rewards Risk Notice</h1>

      <p>
        SyncX replays search queries on Bing using automated browser navigation. That
        behavior may conflict with the Microsoft Rewards program rules you agreed to
        when creating a Microsoft account.
      </p>

      <h2>What Microsoft defines as a qualifying Search</h2>
      <p>
        From the{" "}
        <a
          href="https://www.microsoft.com/en-us/servicesagreement/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Microsoft Services Agreement
        </a>{" "}
        (Microsoft Rewards section):
      </p>
      <ul>
        <li>
          A <strong>Search</strong> is the act of an <strong>individual user manually
          entering text</strong> for the <strong>good-faith purpose</strong> of obtaining
          Bing search results for <strong>personal research</strong>.
        </li>
        <li>
          A Search <strong>does not include</strong> queries not intended for genuine
          good-faith personal research, or entered by a{" "}
          <strong>bot, macro, or other automated or fraudulent means of any kind</strong>.
        </li>
      </ul>

      <h2>What Microsoft Support says not to do</h2>
      <p>
        From{" "}
        <a
          href="https://support.microsoft.com/topic/limiting-your-searches-in-microsoft-rewards-439be015-897e-4a5f-ae01-b3aff4ea2404"
          target="_blank"
          rel="noopener noreferrer"
        >
          Limiting your searches in Microsoft Rewards
        </a>
        :
      </p>
      <ul>
        <li>Do <strong>not</strong> use programs, bots, or macros to help with searching</li>
        <li>Spread searches throughout the day; avoid rapid, back-to-back searches</li>
        <li>
          Repeated violations may result in temporary loss of earning from searches,
          account suspension, or <strong>invalidation of all earned points</strong>
        </li>
      </ul>

      <h2>How SyncX relates to these rules</h2>
      <p>
        SyncX is a <strong>search mirror queue</strong>. It captures queries you already
        ran on Google and later opens the same query on Bing in your browser with
        enforced delays and daily caps. That is <strong>automated assistance with
        searching</strong>, which Microsoft explicitly discourages for Rewards.
      </p>

      <h2>Likely consequences (most common first)</h2>
      <ol>
        <li>
          <strong>Search points stop counting</strong> for a period (throttling message on
          Bing)
        </li>
        <li>
          <strong>Longer earning restrictions</strong> until Microsoft considers your
          pattern normal
        </li>
        <li>
          <strong>Rewards account suspension</strong> and loss of accumulated points
        </li>
      </ol>

      <h2>What SyncX does NOT do (v1)</h2>
      <ul>
        <li>Does not store your Microsoft password</li>
        <li>Does not run Bing searches from a remote server</li>
        <li>Does not support multi-account farming</li>
        <li>Does not automate Rewards dashboard quizzes or daily sets</li>
      </ul>

      <h2>Your responsibility</h2>
      <p>By using SyncX you accept that:</p>
      <ul>
        <li>You may lose Microsoft Rewards points or account access</li>
        <li>
          SyncX is <strong>not affiliated with, endorsed by, or supported by Microsoft</strong>
        </li>
        <li>
          You should read Microsoft&apos;s current Services Agreement and Rewards policies
          before use
        </li>
      </ul>

      <p>
        If your account is restricted, Microsoft directs users to{" "}
        <a
          href="https://rewards.bing.com/support"
          target="_blank"
          rel="noopener noreferrer"
        >
          Rewards Support
        </a>
        .
      </p>

      <p>
        <Link href="/">← Back to home</Link>
      </p>
    </article>
  );
}
