"use client";

// TopNav — landing-page top navigation, mobile-aware. Replaces the
// inline <nav> HTML that used to live inside the dangerouslySetInnerHTML
// block so we can manage open/close state for a real hamburger drawer.
//
// Below 900px the link row collapses behind a hamburger button. Tap the
// hamburger to slide a drawer down from the top of the screen with the
// same links + CTA. Drawer closes on link tap, on outside tap, on Esc,
// and when the viewport grows back past the breakpoint.

import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS: { href: string; label: string }[] = [
  { href: "#pricing", label: "Pricing" },
  { href: "#calc", label: "ROI" },
  { href: "/dashboard", label: "See it live" },
  { href: "/resources", label: "Resources" },
];

const CALENDLY = "https://calendly.com/mike-fusion-advisory/30min";

export function TopNav() {
  const [open, setOpen] = useState(false);

  // Lock body scroll when the drawer is open + close on Esc + close if
  // the viewport grows past the mobile breakpoint (rotate to landscape).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <>
      <nav className="topnav">
        <div className="topnav-inner">
          <Link href="/" className="logo" aria-label="CredTek home">
            <div className="logo-mark">C</div>
            <span>CredTek</span>
          </Link>

          <div className="topnav-links">
            {LINKS.map((l) => (
              <a key={l.href} href={l.href}>
                {l.label}
              </a>
            ))}
          </div>

          <div className="topnav-right">
            <Link
              className="topnav-login"
              href="/sign-in"
            >
              Log in
            </Link>
            <a
              className="topnav-cta"
              href={CALENDLY}
              target="_blank"
              rel="noopener"
            >
              Book a demo
            </a>
            <button
              type="button"
              className="topnav-burger"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-drawer"
              onClick={() => setOpen((v) => !v)}
            >
              <span className={open ? "is-open" : ""} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer — rendered always; transitions opacity + transform
          via the .is-open class. Pointer events disabled when closed so
          it can't intercept taps. */}
      <div
        id="mobile-drawer"
        className={`mobile-drawer${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        onClick={(e) => {
          // Click on the backdrop (not a child element) closes.
          if (e.target === e.currentTarget) setOpen(false);
        }}
      >
        <div className="mobile-drawer-panel">
          <ul className="mobile-drawer-list">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/sign-in"
            className="mobile-drawer-login"
            onClick={() => setOpen(false)}
          >
            Log in
          </Link>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener"
            className="mobile-drawer-cta"
            onClick={() => setOpen(false)}
          >
            Book a demo →
          </a>
          <p className="mobile-drawer-meta">
            US medical credentialing · 40+ years of operator experience
          </p>
        </div>
      </div>
    </>
  );
}
