"use client";

// App-shell layout wraps every route under (app)/. Client component so we
// can read the active path with usePathname() (to highlight the right rail
// item) and run a lightweight mobile drawer — no server round-trips.
//
// The nav is config-driven (NAV arrays below) and icons come from the shared
// NavIcon set, so adding a destination is a one-line change and every shell
// speaks the same visual vocabulary.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { DemoBanner } from "./_components/DemoBanner";
import { DemoButton } from "./_components/DemoButton";
import { NotificationBell } from "./_components/NotificationBell";
import { DemoGuide } from "../_components/DemoGuide";
import { NavIcon } from "../_components/NavIcon";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

// Workspace nav. Order matches the daily-driver flow of a credentialing
// coordinator: see what's happening (Dashboard), clear approvals (the primary
// daily action), work the roster (Providers), drill into the BH differentiator
// (Supervision), then payor + license context.
const WORKSPACE: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Approvals", href: "/approvals", icon: "approvals", badge: "3" },
  { label: "Providers", href: "/providers", icon: "providers", badge: "214" },
  { label: "Supervision", href: "/supervision", icon: "supervision", badge: "12" },
  { label: "Payors", href: "/payors", icon: "payors" },
  { label: "Licenses", href: "/licenses", icon: "licenses" },
];

const ACCOUNT: NavItem[] = [{ label: "Settings", href: "/settings", icon: "settings" }];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(href + "/");
}

function NavGroup({
  title,
  items,
  pathname,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="shell-sb-group">
      <div className="shell-sb-section">{title}</div>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.label}
            className={active ? "shell-sb-item active" : "shell-sb-item"}
            href={item.href}
            aria-current={active ? "page" : undefined}
          >
            <span className="shell-sb-item-ic">
              <NavIcon name={item.icon} size={18} />
            </span>
            <span className="shell-sb-item-label">{item.label}</span>
            {item.badge ? <span className="badge">{item.badge}</span> : null}
          </Link>
        );
      })}
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/dashboard";
  const [drawer, setDrawer] = useState(false);

  // Close the mobile drawer on navigation.
  useEffect(() => {
    setDrawer(false);
  }, [pathname]);

  // Close on Esc + when the viewport grows back past the mobile breakpoint.
  useEffect(() => {
    if (!drawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawer(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setDrawer(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [drawer]);

  return (
    <>
      <DemoBanner />
      <div className="shell">
        <div
          className={drawer ? "shell-scrim open" : "shell-scrim"}
          onClick={() => setDrawer(false)}
          aria-hidden="true"
        />

        <aside className={drawer ? "shell-sb open" : "shell-sb"} aria-label="Primary navigation">
          <div className="shell-sb-logo">
            <Link href="/dashboard" className="shell-sb-logo-lock" aria-label="CredTek dashboard">
              <span className="shell-sb-logo-mark">C</span>
              <span className="shell-sb-logo-text">CredTek</span>
            </Link>
            <button
              type="button"
              className="shell-sb-close"
              onClick={() => setDrawer(false)}
              aria-label="Close menu"
            >
              <NavIcon name="close" size={18} />
            </button>
          </div>

          <Link className="shell-sb-cta" href="/invite">
            <NavIcon name="invite" size={16} />
            Invite a provider
          </Link>

          <nav className="shell-sb-nav">
            <NavGroup title="Workspace" items={WORKSPACE} pathname={pathname} />
            <NavGroup title="Account" items={ACCOUNT} pathname={pathname} />
          </nav>

          <Link href="/settings" className="shell-sb-user">
            <span className="shell-sb-user-av">MD</span>
            <span className="shell-sb-user-meta">
              <span className="shell-sb-user-name">Dr. Megan Doyle</span>
              <span className="shell-sb-user-role">Credentialing lead</span>
            </span>
            <span className="shell-sb-user-chev">
              <NavIcon name="chevron" size={15} />
            </span>
          </Link>
        </aside>

        <div className="shell-main">
          <header className="shell-topbar">
            <button
              type="button"
              className="shell-burger"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <NavIcon name="menu" size={20} />
            </button>
            <DemoButton
              className="shell-search"
              asInput
              placeholder="Search providers, payors, licenses…"
              demoMessage="Demo — the real ⌘K palette jumps to any provider, payor, or action across CredTek. Book a demo to see live."
            >
              search
            </DemoButton>
            <div className="shell-topbar-actions">
              <DemoButton
                className="shell-topbar-shortcut"
                demoMessage="Demo — ⌘K opens a global keyboard palette. Book a demo to see the live version."
              >
                ⌘K
              </DemoButton>
              <NotificationBell />
              <Link href="/settings" className="shell-av" aria-label="Account">
                MD
              </Link>
            </div>
          </header>
          <main className="shell-content" key={pathname}>
            {children}
          </main>
        </div>
      </div>
      {/* Scripted demo guide — only renders when the URL has
          ?demo=true, set by EmailDemoModal on the landing page. */}
      <Suspense fallback={null}>
        <DemoGuide />
      </Suspense>
    </>
  );
}
