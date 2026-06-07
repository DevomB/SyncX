"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CHROME_STORE_URL, GITHUB_URL } from "@/lib/links";
import { MenuIcon, CloseIcon } from "@/components/icons";
import styles from "./Header.module.css";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
  { href: GITHUB_URL, label: "GitHub", external: true },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
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

        <button
          type="button"
          className={styles.menuButton}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
        hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {nav.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            )
          )}
          <a
            href={CHROME_STORE_URL}
            className={`btn btn-primary ${styles.mobileCta}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            Install extension
          </a>
        </nav>
      </div>
    </header>
  );
}
