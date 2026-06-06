import Image from "next/image";
import Link from "next/link";
import styles from "./Header.module.css";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Self-host" },
  { href: "/privacy", label: "Privacy" },
];

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          <Image src="/icon-128.png" alt="" width={32} height={32} />
          <span>SyncX</span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
          {nav.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link href="/docs#get-started" className={`btn btn-primary ${styles.cta}`}>
          Get started
        </Link>
      </div>
    </header>
  );
}
