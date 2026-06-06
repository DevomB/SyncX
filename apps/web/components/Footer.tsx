import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div>
            <p className={styles.brand}>SyncX</p>
            <p className={styles.tagline}>Search mirror queue for Chrome</p>
          </div>
          <div className={styles.links}>
            <Link href="/docs">Self-host guide</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/risks">Rewards risk notice</Link>
          </div>
        </div>
        <p className={styles.disclaimer}>
          Not affiliated with Microsoft. SyncX may conflict with Microsoft Rewards
          program rules. Use at your own risk.
        </p>
        <p className={styles.copy}>© {new Date().getFullYear()} SyncX</p>
      </div>
    </footer>
  );
}
