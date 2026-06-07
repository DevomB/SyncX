"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { CHROME_STORE_URL } from "@/lib/links";
import { MenuIcon, CloseIcon } from "@/components/icons";
import styles from "./Header.module.css";

const nav = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
] as const;

function NavLink({
  item,
  className,
  onNavigate,
}: {
  item: (typeof nav)[number];
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link href={item.href} className={className} onClick={onNavigate}>
      {item.label}
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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

  const navLinks = (linkClassName?: string, onNavigate?: () => void): ReactNode =>
    nav.map((item) => (
      <NavLink key={item.href} item={item} className={linkClassName} onNavigate={onNavigate} />
    ));

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={close}>
          <img src="/icon.svg" alt="" width={28} height={28} className={styles.logo} />
          <span>SyncX</span>
        </Link>

        <nav className={styles.nav} aria-label="Main">
          {navLinks()}
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

      <button
        type="button"
        className={`${styles.mobileBackdrop} ${open ? styles.mobileBackdropOpen : ""}`}
        aria-label="Close menu"
        hidden={!open}
        onClick={close}
      />

      <div
        id="mobile-nav"
        className={`${styles.mobilePanel} ${open ? styles.mobilePanelOpen : ""}`}
        hidden={!open}
      >
        <nav className={styles.mobileNav} aria-label="Mobile">
          {navLinks(undefined, close)}
          <a
            href={CHROME_STORE_URL}
            className={`btn btn-primary ${styles.mobileCta}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            Install extension
          </a>
        </nav>
      </div>
    </header>
  );
}
