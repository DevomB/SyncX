import type { Metadata } from "next";
import Link from "next/link";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <article className={`container prose ${styles.page}`}>
      <h1>Terms of Service</h1>
      <p className={styles.updated}>Last updated: 2026-06-06</p>

      <div className="callout">
        <p>
          <strong>Please read carefully.</strong> By installing, accessing, or using
          SyncX, you agree to these Terms and our{" "}
          <Link href="/privacy">Privacy Policy</Link>. If you do not agree, do not use
          SyncX.
        </p>
      </div>

      <p>
        These Terms of Service (&quot;Terms&quot;) are a binding legal agreement between
        you (&quot;you&quot;, &quot;User&quot;) and Devom B (&quot;Operator&quot;,
        &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) governing your access to and
        use of SyncX — including the Chrome extension, this website, any cloud services
        we operate, and related documentation (collectively, the &quot;Service&quot;).
      </p>

      <p>
        These Terms supplement — and do not replace — the{" "}
        <a
          href="https://github.com/DevomB/SyncX/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License
        </a>{" "}
        for the open-source software. Your rights to view, modify, and redistribute
        the source code are governed by the MIT License. Your <strong>use</strong> of
        the Service (including our hosted website and cloud backend) is governed by
        these Terms.
      </p>

      <h2>1. Not legal advice</h2>
      <p>
        These Terms are not legal advice. The Operator is not your attorney. Consult a
        licensed attorney in your jurisdiction before relying on any legal document.
      </p>

      <h2>2. Description of the Service</h2>
      <p>
        SyncX is a browser extension that captures Google search query text and later
        replays those queries on Bing in your browser, with user-configurable pacing
        and limits. The Service may operate locally in Chrome storage or, optionally,
        sync data to a cloud backend (self-hosted AWS or Operator-hosted
        infrastructure).
      </p>
      <p>
        The Service is provided <strong>for personal, non-commercial use only</strong>{" "}
        unless we expressly authorize otherwise in writing.
      </p>

      <h2>3. Eligibility</h2>
      <p>
        You must be at least <strong>13 years old</strong> (or the minimum age required
        in your jurisdiction) to use the Service. By using the Service, you represent
        that you meet this requirement and have the legal capacity to enter into these
        Terms.
      </p>

      <h2>4. No affiliation with third parties</h2>
      <p>
        SyncX is <strong>not affiliated with, endorsed by, sponsored by, or connected
        to</strong> Microsoft, Google, Alphabet, Amazon, or any search engine, rewards
        program, or platform. All third-party product names, logos, and trademarks are
        the property of their respective owners.
      </p>

      <h2>5. Your responsibilities and acceptable use</h2>
      <p>
        You are solely responsible for your use of the Service and for compliance with
        all applicable laws, regulations, and <strong>third-party terms of service</strong>{" "}
        (including Microsoft Services Agreement, Google Terms of Service, Chrome Web
        Store policies, and any rewards or incentive program rules).
      </p>
      <p>You agree <strong>not</strong> to:</p>
      <ul>
        <li>Use the Service for any unlawful, fraudulent, or abusive purpose</li>
        <li>
          Use the Service to violate any third-party platform&apos;s terms, policies, or
          program rules
        </li>
        <li>
          Use the Service to farm, automate, or manipulate rewards, points, credits, or
          incentive programs
        </li>
        <li>Operate multiple accounts or identities to circumvent platform limits</li>
        <li>
          Reverse engineer, scrape, or attack third-party services through the Service
          beyond its intended personal search-mirror function
        </li>
        <li>Attempt to gain unauthorized access to our systems or other users&apos; data</li>
        <li>
          Resell, sublicense, or commercially exploit the Service without written
          permission
        </li>
        <li>Remove or alter legal notices, disclaimers, or attribution in the software</li>
      </ul>
      <p>
        <strong>You assume full responsibility</strong> for any account restrictions,
        suspensions, loss of rewards or points, or other consequences imposed by
        third-party platforms as a result of your use of the Service.
      </p>

      <h2>6. Third-party services disclaimer</h2>
      <p>
        The Service interacts with websites and services operated by third parties. We do{" "}
        <strong>not</strong> control and are <strong>not responsible</strong> for
        third-party services, their availability, their terms, their enforcement actions,
        or any data they collect independently of the Service.
      </p>
      <p>
        See also: <Link href="/risks">Third-party Terms Notice</Link>.
      </p>

      <h2>7. Open-source software</h2>
      <p>
        The SyncX source code is licensed under the MIT License. If you self-host the
        cloud backend on your own AWS account, you are the operator of that
        infrastructure and solely responsible for its security, compliance, and costs.
      </p>

      <h2>8. Disclaimer of warranties</h2>
      <p>
        <strong>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
          WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.
        </strong>
      </p>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, THE OPERATOR DISCLAIMS ALL
        WARRANTIES, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
        PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND WARRANTIES THAT THE SERVICE
        WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF HARMFUL COMPONENTS.
      </p>
      <p>
        Some jurisdictions do not allow exclusion of implied warranties; in those
        jurisdictions, the above exclusions apply to the maximum extent permitted by
        law.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        <strong>TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW:</strong>
      </p>
      <p>
        <strong>
          IN NO EVENT SHALL THE OPERATOR, HIS HEIRS, SUCCESSORS, ASSIGNS, AFFILIATES, OR
          LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL,
          EXEMPLARY, OR PUNITIVE DAMAGES
        </strong>
        , INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, GOODWILL, REWARDS POINTS,
        ACCOUNT ACCESS, BUSINESS INTERRUPTION, OR OTHER INTANGIBLE LOSSES,{" "}
        <strong>
          ARISING OUT OF OR RELATED TO YOUR USE OF OR INABILITY TO USE THE SERVICE
        </strong>
        , WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT
        LIABILITY, OR ANY OTHER LEGAL THEORY,{" "}
        <strong>
          EVEN IF THE OPERATOR HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </strong>
      </p>
      <p>
        <strong>
          THE OPERATOR&apos;S TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING OUT OF
          OR RELATED TO THESE TERMS OR THE SERVICE SHALL NOT EXCEED THE GREATER OF (A)
          US $0.00 OR (B) THE AMOUNT YOU PAID TO THE OPERATOR FOR THE SERVICE IN THE
          TWELVE (12) MONTHS PRECEDING THE CLAIM.
        </strong>
      </p>

      <h2>10. Assumption of risk and release</h2>
      <p>You acknowledge that:</p>
      <ul>
        <li>Automated browser behavior may conflict with third-party platform rules</li>
        <li>
          You may lose access to rewards programs, search points, or entire accounts on
          third-party platforms
        </li>
        <li>Software may contain bugs, errors, or security vulnerabilities</li>
        <li>Cloud data may be lost despite reasonable safeguards</li>
      </ul>
      <p>
        <strong>You voluntarily assume all risks</strong> associated with using the
        Service. To the fullest extent permitted by law,{" "}
        <strong>you hereby release, waive, and discharge the Operator</strong> from any
        and all claims arising from or related to your use of the Service, including
        claims related to third-party account actions, rewards loss, or data loss.
      </p>

      <h2>11. Indemnification</h2>
      <p>
        You agree to <strong>defend, indemnify, and hold harmless</strong> the Operator,
        his heirs, successors, assigns, and affiliates from and against any and all
        claims, damages, losses, liabilities, costs, and expenses (including reasonable
        attorneys&apos; fees) arising out of or related to your use or misuse of the
        Service, your violation of these Terms, your violation of any applicable law or
        third-party terms, or any dispute between you and a third-party platform.
      </p>

      <h2>12. Privacy</h2>
      <p>
        Our collection and use of personal information is described in the{" "}
        <Link href="/privacy">Privacy Policy</Link>. By using the Service, you consent
        to those practices.
      </p>

      <h2>13. Modifications</h2>
      <p>
        We may modify, suspend, or discontinue the Service at any time, with or without
        notice, without liability. We may update these Terms; continued use after
        changes become effective constitutes acceptance.
      </p>

      <h2>14. Termination</h2>
      <p>
        You may stop using the Service at any time by uninstalling the extension. We may
        suspend or terminate your access to Operator-hosted cloud services at any time,
        without liability. Disclaimer, liability, indemnification, and dispute resolution
        sections survive termination.
      </p>

      <h2>15. Dispute resolution</h2>
      <h3>Informal resolution</h3>
      <p>
        Before initiating formal proceedings, contact{" "}
        <strong>Devom.b@yahoo.com</strong> and attempt to resolve the dispute informally
        for at least thirty (30) days.
      </p>
      <h3>Binding arbitration</h3>
      <p>
        Except for disputes eligible for small claims court, disputes shall be resolved
        by <strong>binding individual arbitration</strong> (AAA or JAMS).{" "}
        <strong>Class action waiver:</strong> disputes are resolved only on an individual
        basis. You may opt out within thirty (30) days by emailing{" "}
        <strong>Devom.b@yahoo.com</strong> with subject &quot;Arbitration Opt-Out&quot;.
      </p>
      <h3>Governing law</h3>
      <p>
        These Terms are governed by the <strong>laws of the United States</strong>,
        without regard to conflict-of-law principles.
      </p>

      <h2>16. Export compliance</h2>
      <p>
        You agree to comply with all applicable export control and sanctions laws.
      </p>

      <h2>17. Severability</h2>
      <p>
        If any provision is held invalid, the remaining provisions remain in effect.
      </p>

      <h2>18. Entire agreement</h2>
      <p>
        These Terms, the <Link href="/privacy">Privacy Policy</Link>, and the MIT License
        constitute the entire agreement regarding the Service.
      </p>

      <h2>19. Contact</h2>
      <p>
        <strong>Devom B</strong>
        <br />
        Email: <strong>Devom.b@yahoo.com</strong>
      </p>

      <p style={{ marginTop: "2.5rem" }}>
        <Link href="/">← Back to home</Link>
      </p>
    </article>
  );
}
