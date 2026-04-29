"use client";

// App-shell layout wraps every route under (app)/. Client component so we
// can read the active path with usePathname() and highlight the right
// sidebar item without server round-trips.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
  /** Set true for items where the route doesn't exist yet — they'll
   *  render but stay non-active and we can swap to real hrefs as
   *  pages land. */
  stub?: boolean;
};

const WORKSPACE: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "▣" },
  { label: "Providers", href: "/dashboard", icon: "◯", badge: "214" },
  { label: "Pipeline", href: "/dashboard", icon: "◇", badge: "31" },
  { label: "Payors", href: "#", icon: "▤", stub: true },
  { label: "Licenses", href: "#", icon: "⚐", stub: true },
];

const AGENTS: NavItem[] = [
  { label: "PSV Agent", href: "#", icon: "⚙", stub: true },
  { label: "Enrollment", href: "#", icon: "⚙", stub: true },
  { label: "Supervision", href: "#", icon: "⚙", stub: true },
];

const COMPLIANCE: NavItem[] = [
  { label: "NCQA Binder", href: "#", icon: "▤", stub: true },
  { label: "Reports", href: "#", icon: "▤", stub: true },
];

function isActive(pathname: string, item: NavItem): boolean {
  if (item.stub) return false;
  if (item.href === "/dashboard") {
    // Dashboard is "active" only on the dashboard route — not on every
    // sub-page that happens to link back to /dashboard.
    return pathname === "/dashboard" && item.label === "Dashboard";
  }
  return pathname.startsWith(item.href);
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
        const active = isActive(pathname, item);
        const className = active ? "shell-sb-item active" : "shell-sb-item";
        // Stubs render as <a href="#"> so they're click-without-navigation —
        // partners can hover the nav without us shipping a half-built page.
        if (item.stub) {
          return (
            <a
              key={item.label}
              className={className}
              href="#"
              onClick={(e) => e.preventDefault()}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.badge ? <span className="badge">{item.badge}</span> : null}
            </a>
          );
        }
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
    <div className="shell">
      <aside className="shell-sb">
        <div className="shell-sb-logo">
          <div className="shell-sb-logo-mark">C</div>
          <div className="shell-sb-logo-text">CredTek</div>
        </div>

        <NavGroup title="Workspace" items={WORKSPACE} pathname={pathname} />
        <NavGroup title="Agents" items={AGENTS} pathname={pathname} />
        <NavGroup title="Compliance" items={COMPLIANCE} pathname={pathname} />
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="shell-search">⌕ Search providers, payors…</div>
          <div className="shell-topbar-actions">
            <span className="shell-topbar-shortcut">⌘K</span>
            <div className="shell-av">MD</div>
          </div>
        </header>
        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}
