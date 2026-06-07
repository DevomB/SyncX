import Link from "next/link";
import { CHROME_STORE_URL, GITHUB_URL } from "@/lib/links";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.brandName}>SyncX</p>
            <p className={styles.tagline}>Open-source Chrome extension</p>
          </div>
          <div className={styles.cols}>
            <div className={styles.col}>
              <p className={styles.colTitle}>Extension</p>
              <a href={CHROME_STORE_URL} target="_blank" rel="noopener noreferrer">
                Chrome Web Store
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                Source code
              </a>
            </div>
            <div className={styles.col}>
              <p className={styles.colTitle}>Info</p>
              <Link href="/docs">Setup guide</Link>
              <Link href="/privacy">Privacy</Link>
              <Link href="/risks">Terms notice</Link>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} SyncX — MIT License</p>
          <p className={styles.disclaimer}>
            Not affiliated with Microsoft or Google.
          </p>
        </div>
      </div>
    </footer>
  );
}
