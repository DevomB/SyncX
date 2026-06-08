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
            <p className={styles.tagline}>Chrome extension for mirrored searches</p>
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
            </div>
            <div className={styles.col}>
              <p className={styles.colTitle}>Legal</p>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/risks">Third-party notice</Link>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className={styles.copy}>© {new Date().getFullYear()} SyncX — MIT License</p>
          <p className={styles.disclaimer}>
            Independent project. Not affiliated with Microsoft or Google. See Terms
            of Service.
          </p>
        </div>
      </div>
    </footer>
  );
}
