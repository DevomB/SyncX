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
    title: "Zero extra effort",
    description:
      "Search on Google the way you always have. SyncX quietly queues each query for later replay on Bing — no new habits needed.",
  },
  {
    icon: SlidersIcon,
    title: "You control the pace",
    description:
      "Set your own delays, daily limits, and active hours. Defaults are conservative by design.",
  },
  {
    icon: HomeIcon,
    title: "Local-first",
    description:
      "Works entirely out of Chrome's local storage. No account, no cloud, nothing phoning home.",
  },
  {
    icon: ShieldIcon,
    title: "Your data stays yours",
    description:
      "Stores query text only. Optionally deploy your own AWS backend — no shared server, no vendor lock-in.",
  },
  {
    icon: PauseIcon,
    title: "Auto-pause on detection",
    description:
      "Detects Bing throttle signals and pauses automatically. Resume any time from the popup.",
  },
  {
    icon: CodeIcon,
    title: "Fully open source",
    description:
      "MIT licensed. Read the code, fork it, self-host the backend, or just use the extension.",
  },
];

const steps = [
  {
    step: "01",
    title: "Search normally",
    body: "Go about your day on Google. SyncX captures each query in the background.",
  },
  {
    step: "02",
    title: "Queue builds up",
    body: "Queries sit in your local queue, deduplicated and ready for replay.",
  },
  {
    step: "03",
    title: "Bing gets the same query",
    body: "SyncX opens Bing in your browser on a paced schedule — within the limits you set.",
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
            <h1>Mirror your searches to Bing.</h1>
            <p>
              SyncX runs entirely in your browser. It picks up what you search on Google
              and quietly replays it on Bing — with configurable pacing, daily limits,
              and no cloud required.
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
          <h2 className={styles.sectionTitle}>Everything you need, nothing you don&apos;t</h2>
          <p className={styles.sectionLead}>
            Lightweight, transparent, and built to stay out of your way.
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
          <p className={styles.sectionLead}>Three steps. No configuration required to get started.</p>
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
            <h2>Get started in under a minute.</h2>
            <p>
              Install from the Chrome Web Store or clone the repo and load it
              unpacked — your choice.
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
              Build from source
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
