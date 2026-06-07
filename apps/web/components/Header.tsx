import Image from "next/image";
import Link from "next/link";
import { CHROME_STORE_URL, GITHUB_URL } from "@/lib/links";
import styles from "./Header.module.css";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
  { href: GITHUB_URL, label: "GitHub", external: true },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <Image src="/icon-128.png" alt="" width={28} height={28} />
          <span>SyncX</span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
          {nav.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            )
          )}
        </nav>
        <a
          href={CHROME_STORE_URL}
          className={`btn btn-primary ${styles.cta}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Install
        </a>
      </div>
    </header>
  );
}
