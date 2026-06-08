import type { ComponentType, SVGProps } from "react";
import Link from "next/link";
import { CHROME_STORE_URL, GITHUB_URL } from "@/lib/links";
import {
  BoltIcon,
  SlidersIcon,
  HomeIcon,
  ShieldIcon,
  PauseIcon,
  CodeIcon,
  GitHubIcon,
} from "@/components/icons";
import styles from "./page.module.css";

type Feature = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: BoltIcon,
    title: "Search like usual",
    description:
      "Use Google normally. SyncX saves the search text locally and sends it to Bing later.",
  },
  {
    icon: SlidersIcon,
    title: "Pick the limits",
    description:
      "Choose the delay, daily cap, and active hours. The defaults start slow on purpose.",
  },
  {
    icon: HomeIcon,
    title: "Local by default",
    description:
      "Your queue can stay in Chrome's local storage. No account is required to use the extension.",
  },
  {
    icon: ShieldIcon,
    title: "No mystery server",
    description:
      "SyncX stores search text only. If you want cloud sync, you can host the AWS backend yourself.",
  },
  {
    icon: PauseIcon,
    title: "Stops when Bing pushes back",
    description:
      "When SyncX sees throttling signals from Bing, it pauses the queue until you resume it.",
  },
  {
    icon: CodeIcon,
    title: "Open source",
    description:
      "MIT licensed. Read the code, fork it, self-host it, or just install the extension.",
  },
];

const steps = [
  {
    step: "01",
    title: "Search normally",
    body: "Keep using Google the way you already do. SyncX watches for search query text.",
  },
  {
    step: "02",
    title: "Queue builds up",
    body: "The extension keeps a local queue, removes duplicates, and waits for the right time.",
  },
  {
    step: "03",
    title: "Bing runs it too",
    body: "SyncX opens Bing in your browser on the schedule and limits you set.",
  },
];

const flowSteps = [
  {
    label: "Google",
    query: "“best coffee in portland”",
    status: "Captured",
    chipClass: styles.flowChipCaptured,
    dotClass: styles.flowStepDot,
  },
  {
    label: "SyncX queue",
    query: "1 item pending",
    status: "Paced",
    chipClass: styles.flowChipPending,
    dotClass: `${styles.flowStepDot} ${styles.flowStepDotPending}`,
  },
  {
    label: "Bing",
    query: "“best coffee in portland”",
    status: "Done",
    chipClass: styles.flowChipDone,
    dotClass: `${styles.flowStepDot} ${styles.flowStepDotDone}`,
  },
];

export default function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroCopy}>
            <span className="badge">Chrome Extension · Open Source</span>
            <h1>Search once. Run it on Bing too.</h1>
            <p>
              SyncX is a small Chrome extension for people who already search on
              Google but also want those searches to run on Bing. It keeps a local
              queue, moves at the pace you choose, and does not require an account.
            </p>
            <div className={styles.heroActions}>
              <a
                href={CHROME_STORE_URL}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Install extension
              </a>
              <a
                href={GITHUB_URL}
                className={styles.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
                View source
              </a>
            </div>
          </div>
          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.flowStage}>
              <div className={styles.flowTrack}>
                <span className={styles.flowPacket}>query</span>
              </div>
              <div className={styles.flowRoute}>
                {flowSteps.map((step) => (
                  <div key={step.label} className={styles.flowNode}>
                    <div className={styles.flowStepHead}>
                      <span className={styles.flowStepLabel}>{step.label}</span>
                      <span className={`${styles.flowChip} ${step.chipClass}`}>
                        {step.status}
                      </span>
                    </div>
                    <p className={styles.flowStepQuery}>{step.query}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Built for daily use</h2>
          <p className={styles.sectionLead}>
            Small controls, clear defaults, and no account to manage.
          </p>
          <div className={styles.featureGrid}>
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className={`card ${styles.featureCard}`}>
                  <span className={styles.featureIcon} aria-hidden="true">
                    <Icon />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How it works</h2>
          <p className={styles.sectionLead}>Install it, sign in to Bing, then keep using Google.</p>
          <div className={styles.steps}>
            {steps.map((item) => (
              <article key={item.step} className={styles.step}>
                <span className={styles.stepNum}>{item.step}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.ctaBlock}`}>
          <div>
            <h2>Ready when you are.</h2>
            <p>
              Install from the Chrome Web Store, sign in to Bing, and use Google
              like you normally would.
            </p>
          </div>
          <div className="btnStack">
            <a
              href={CHROME_STORE_URL}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Install extension
            </a>
            <Link href="/docs" className="btn btn-secondary">
              Setup guide
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
