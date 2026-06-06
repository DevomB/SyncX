import Image from "next/image";
import Link from "next/link";
import {
  DEFAULT_MAX_REPLAYS_PER_DAY,
  DEFAULT_MIN_DELAY_MS,
  DEFAULT_MAX_DELAY_MS,
  DEFAULT_USER_SETTINGS,
} from "@syncx/shared";
import styles from "./page.module.css";

const minDelaySec = DEFAULT_MIN_DELAY_MS / 1000;
const maxDelayMin = DEFAULT_MAX_DELAY_MS / 60_000;

const features = [
  {
    title: "Automatic mirroring",
    description:
      "Captures queries you already run on Google and queues them for later replay on Bing in your browser.",
  },
  {
    title: "Conservative pacing",
    description: `Defaults to ${minDelaySec}s–${maxDelayMin} min delays, ${DEFAULT_MAX_REPLAYS_PER_DAY} replays/day, and active hours ${DEFAULT_USER_SETTINGS.activeStartHour}:00–${DEFAULT_USER_SETTINGS.activeEndHour}:00.`,
  },
  {
    title: "Local-first",
    description:
      "Phase A works entirely in Chrome local storage — no cloud account required to get started.",
  },
  {
    title: "Self-hostable cloud",
    description:
      "Deploy your own AWS backend (Lambda, DynamoDB, Cognito) and paste three values into extension Settings.",
  },
  {
    title: "Privacy-conscious",
    description:
      "Stores query text only. No Microsoft or Google passwords. 30-day TTL on cloud events with delete-user API.",
  },
  {
    title: "Throttle detection",
    description:
      "Pauses automatically when Bing throttling signals are detected, with manual pause/resume control.",
  },
];

const steps = [
  {
    step: "1",
    title: "Capture",
    body: "Search on Google as you normally would. SyncX records the query in your queue.",
  },
  {
    step: "2",
    title: "Queue",
    body: "Items wait locally or in your self-hosted cloud backend with deduplication and daily caps.",
  },
  {
    step: "3",
    title: "Replay",
    body: "SyncX opens Bing in your browser and runs the same query with enforced delays.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className="badge">Chrome extension · v0.1</span>
            <h1>Search mirror queue for Chrome</h1>
            <p>
              SyncX captures Google search queries and replays them on Bing in your
              browser — with enforced pacing, daily caps, and full user control.
            </p>
            <div className={styles.heroActions}>
              <Link href="/docs#get-started" className="btn btn-primary">
                Get started
              </Link>
              <Link href="/docs#self-host" className="btn btn-secondary">
                Self-host on AWS
              </Link>
            </div>
            <p className={styles.heroDisclaimer}>
              Not affiliated with Microsoft. May conflict with Rewards program rules.{" "}
              <Link href="/risks">Read the risk notice</Link>.
            </p>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.flowCard}>
              <div className={styles.flowRow}>
                <span className={styles.flowLabel}>Google</span>
                <span className={styles.flowQuery}>&quot;best hiking trails oregon&quot;</span>
              </div>
              <div className={styles.flowArrow}>↓</div>
              <div className={styles.flowRow}>
                <span className={styles.flowLabel}>SyncX queue</span>
                <span className={styles.flowMeta}>Pending · paced replay</span>
              </div>
              <div className={styles.flowArrow}>↓</div>
              <div className={styles.flowRow}>
                <span className={styles.flowLabel}>Bing</span>
                <span className={styles.flowQuery}>Same query · your browser</span>
              </div>
            </div>
            <Image
              src="/icon-128.png"
              alt="SyncX icon"
              width={64}
              height={64}
              className={styles.heroIcon}
            />
          </div>
        </div>
      </section>

      <section id="features" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Built for personal search mirroring</h2>
          <p className={styles.sectionLead}>
            Local-first by default. Optional cloud sync you deploy yourself. No vendor
            API keys baked into the build.
          </p>
          <div className={styles.featureGrid}>
            {features.map((feature) => (
              <article key={feature.title} className="card">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.steps}>
            {steps.map((item) => (
              <article key={item.step} className={styles.step}>
                <span className={styles.stepNum}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
          <pre className={styles.diagram}>
            <code>{`Google search (capture) → SyncX queue (local or AWS) → Bing tab replay (your browser)`}</code>
          </pre>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.ctaBlock}`}>
          <div>
            <h2>Ready to try SyncX?</h2>
            <p>
              Build the extension locally, load it unpacked in Chrome, and start with
              Phase A — no cloud setup required.
            </p>
          </div>
          <Link href="/docs#get-started" className="btn btn-primary">
            View setup guide
          </Link>
        </div>
      </section>
    </>
  );
}
