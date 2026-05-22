"use client";

// AvelNav — left-sidebar navigation for the AVEL eCare portal.
// Built fresh (not reusing the CredTek .shell-sb classes) so the
// brand expression is fully owned by AVEL eCare: navy column, teal active
// state, no CredTek logo or accent. The "AVEL eCare" wordmark is
// the only branded text in the chrome — visitor should feel they
// are inside AVEL eCare's tool.

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type Item = { label: string; href: string; icon: ReactNode; badge?: string };

const WORKSPACE: Item[] = [
  { label: "Dashboard", href: "/avelecare", icon: "▣" },
  { label: "Providers", href: "/avelecare/providers", icon: "◯", badge: "15" },
  { label: "Spaces & Programs", href: "/avelecare/spaces", icon: "◇", badge: "6" },
  { label: "Workflows", href: "/avelecare/workflows", icon: "▤" },
];

const SUPPORT: Item[] = [
  { label: "Documents & Compliance", href: "/avelecare/documents", icon: "📄" },
  { label: "Reports & Analytics", href: "/avelecare/reports", icon: "▥" },
  { label: "Admin & Settings", href: "/avelecare/settings", icon: "⚙" },
  { label: "Help & Chat", href: "/avelecare/help", icon: "✦" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/avelecare") return pathname === "/avelecare";
  return pathname.startsWith(href);
}

export function AvelNav() {
  const pathname = usePathname() ?? "/avelecare";

  return (
    <aside className="avel-sb">
      {/* Logo lockup — icon SVG inlined via background-image, wordmark
          rendered via CSS mask-image so the single-color SVG can be
          recolored white on the dark sidebar without filter hacks. */}
      <Link href="/avelecare" className="avel-sb-logo" aria-label="AVEL eCare home">
        <span className="avel-sb-mark" role="img" aria-hidden="true" />
        <span className="avel-sb-wordmark" role="img" aria-label="AVEL eCare" />
      </Link>
      <div className="avel-sb-tagline">Credentialing Portal</div>

      <div className="avel-sb-section">Workspace</div>
      {WORKSPACE.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "avel-sb-item is-active" : "avel-sb-item"}
          >
            <span className="avel-sb-icon">{item.icon}</span>
            <span className="avel-sb-label">{item.label}</span>
            {item.badge ? <span className="avel-sb-badge">{item.badge}</span> : null}
          </Link>
        );
      })}

      <div className="avel-sb-section">Operations</div>
      {SUPPORT.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "avel-sb-item is-active" : "avel-sb-item"}
          >
            <span className="avel-sb-icon">{item.icon}</span>
            <span className="avel-sb-label">{item.label}</span>
          </Link>
        );
      })}

      <div className="avel-sb-foot">
        <div className="avel-sb-foot-org">
          <span className="avel-sb-foot-org-mark" role="img" aria-hidden="true" />
          <div>
            <div className="avel-sb-foot-org-name">AVEL eCare</div>
            <div className="avel-sb-foot-org-meta">Virtual Health System</div>
          </div>
        </div>
        <div className="avel-sb-foot-meta">
          Tagline: <em>Virtual care, perfected.</em>
          <br />
          Credentialing, simplified.
        </div>
      </div>
    </aside>
  );
}

export function AvelTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="avel-topbar">
      <div className="avel-topbar-titles">
        <div className="avel-topbar-title">{title}</div>
        {subtitle ? <div className="avel-topbar-subtitle">{subtitle}</div> : null}
      </div>
      <div className="avel-topbar-actions">
        <div className="avel-topbar-search" aria-hidden="true">
          ⌕ Search providers, spaces, documents…
        </div>
        <button type="button" className="avel-topbar-bell" aria-label="Notifications">
          🔔
          <span className="avel-topbar-bell-dot" />
        </button>
        <div className="avel-topbar-av" aria-label="Account">MK</div>
      </div>
    </header>
  );
}
