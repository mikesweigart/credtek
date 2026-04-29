"use client";

// App-shell layout wraps every route under (app)/. Client component so we
// can read the active path with usePathname() and highlight the right
// sidebar item without server round-trips.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { DemoBanner } from "./_components/DemoBanner";
import { DemoButton } from "./_components/DemoButton";
import { NotificationBell } from "./_components/NotificationBell";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

// Workspace nav. Order matters — top-to-bottom matches the daily-driver
// flow of a credentialing coordinator: see what's happening (Dashboard),
// review approvals (Approvals — primary daily action), see the roster
// (Providers), drill into the BH-specific differentiator (Supervision),
// then payor + license context.
const WORKSPACE: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "▣" },
  { label: "Approvals", href: "/approvals", icon: "✦", badge: "3" },
  { label: "Providers", href: "/providers", icon: "◯", badge: "214" },
  { label: "Supervision", href: "/supervision", icon: "⚐", badge: "12" },
  { label: "Payors", href: "/payors", icon: "▤" },
  { label: "Licenses", href: "/licenses", icon: "◇" },
];

const ACCOUNT: NavItem[] = [
  { label: "Settings", href: "/settings", icon: "⚙" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname.startsWith(href);
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
    <>
      <div className="shell-sb-section">{title}</div>
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        const className = active ? "shell-sb-item active" : "shell-sb-item";
        return (
          <Link key={item.label} className={className} href={item.href}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge ? <span className="badge">{item.badge}</span> : null}
          </Link>
        );
      })}
    </>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/dashboard";

  return (
    <>
      <DemoBanner />
      <div className="shell">
        <aside className="shell-sb">
          <div className="shell-sb-logo">
            <div className="shell-sb-logo-mark">C</div>
            <div className="shell-sb-logo-text">CredTek</div>
          </div>

          <NavGroup title="Workspace" items={WORKSPACE} pathname={pathname} />
          <NavGroup title="Account" items={ACCOUNT} pathname={pathname} />

          <div className="shell-sb-foot">
            <a
              className="shell-sb-foot-link"
              href="/onboard"
            >
              + Invite a provider
            </a>
            <span className="shell-sb-foot-meta">v0.2 · demo</span>
          </div>
        </aside>

        <div className="shell-main">
          <header className="shell-topbar">
            <DemoButton
              className="shell-search"
              asInput
              placeholder="⌕ Search providers, payors, licenses…"
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
          <main className="shell-content">{children}</main>
        </div>
      </div>
    </>
  );
}
