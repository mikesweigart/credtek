"use client";

// AvelNav — left-sidebar navigation + topbar header for the AVEL eCare
// portal. Built fresh (not reusing the CredTek .shell-sb classes) so the
// brand expression is fully owned by AVEL eCare: navy column, teal active
// state, AVEL wordmark + icon mark only.
//
// MOBILE behavior:
//   - Below 900px the sidebar becomes a slide-out drawer (-100% to 0).
//   - The topbar shows a hamburger button on the left.
//   - Drawer state lives in AvelShellContext (provider wraps the layout).
//   - Tap a nav link → drawer closes.
//   - Tap backdrop, press Escape, or resize past 900px → drawer closes.
//   - Body scroll is locked while drawer is open.

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type Item = { label: string; href: string; icon: ReactNode; badge?: string };

const WORKSPACE: Item[] = [
  { label: "Dashboard", href: "/avelecare", icon: "▣" },
  { label: "Follow-ups", href: "/avelecare/followups", icon: "↗", badge: "5" },
  { label: "Providers", href: "/avelecare/providers", icon: "◯", badge: "15" },
  { label: "Spaces & Programs", href: "/avelecare/spaces", icon: "◇", badge: "6" },
  { label: "Expirables", href: "/avelecare/expirables", icon: "⏱", badge: "4" },
  { label: "Re-credentialing", href: "/avelecare/recredentialing", icon: "↻" },
  { label: "Workflows", href: "/avelecare/workflows", icon: "▤" },
];

const SUPPORT: Item[] = [
  { label: "Documents & Compliance", href: "/avelecare/documents", icon: "📄" },
  { label: "NCQA Audit Binder", href: "/avelecare/audit", icon: "▣" },
  { label: "Reports & Analytics", href: "/avelecare/reports", icon: "▥" },
  { label: "Admin & Settings", href: "/avelecare/settings", icon: "⚙" },
  { label: "Help & Chat", href: "/avelecare/help", icon: "✦" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/avelecare") return pathname === "/avelecare";
  return pathname.startsWith(href);
}

// ──────────────────────────────────────────────────────────────
// Shell context — drawer state shared between sidebar + topbar.
// ──────────────────────────────────────────────────────────────
type ShellCtx = {
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
};
const ShellContext = createContext<ShellCtx | null>(null);

export function AvelShellProvider({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Lock body scroll while drawer is open + close on Esc + close if the
  // viewport grows past mobile breakpoint (landscape rotation, etc.).
  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth > 900) setDrawerOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [drawerOpen]);

  const value = useMemo(
    () => ({ drawerOpen, setDrawerOpen, paletteOpen, setPaletteOpen }),
    [drawerOpen, paletteOpen]
  );
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

export function useShell(): ShellCtx {
  const ctx = useContext(ShellContext);
  // In a tree without the provider (e.g. tests, errors), fall back to a
  // no-op so the components don't throw. Provider IS always present in
  // the real app via the layout.
  if (!ctx)
    return {
      drawerOpen: false,
      setDrawerOpen: () => {},
      paletteOpen: false,
      setPaletteOpen: () => {},
    };
  return ctx;
}

// ──────────────────────────────────────────────────────────────
// AvelNav — sidebar / mobile drawer
// ──────────────────────────────────────────────────────────────
export function AvelNav() {
  const pathname = usePathname() ?? "/avelecare";
  const { drawerOpen, setDrawerOpen } = useShell();

  const close = useCallback(() => setDrawerOpen(false), [setDrawerOpen]);

  return (
    <>
      {/* Backdrop — only rendered when drawer is open on mobile. Tap to close. */}
      {drawerOpen && (
        <button
          type="button"
          className="avel-sb-backdrop"
          aria-label="Close menu"
          onClick={close}
        />
      )}

      <aside
        className={`avel-sb${drawerOpen ? " is-open" : ""}`}
        aria-label="Primary navigation"
      >
        <Link
          href="/avelecare"
          className="avel-sb-logo"
          aria-label="AVEL eCare home"
          onClick={close}
        >
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
              onClick={close}
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
              onClick={close}
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
          {/* White-label credit + the visitor's way back to CredTek. A
              relative "/" is correct in both contexts: on the apex it
              lands on cred-tek.com's home; on the avelecare.cred-tek.com
              white-label subdomain the middleware keeps it in-portal. */}
          <Link className="avel-sb-powered" href="/" onClick={close}>
            Powered by <strong>CredTek</strong>
          </Link>
        </div>
      </aside>
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// AvelTopbar — page header. Renders a hamburger on the left when
// mobile, the page title + actions on the right.
// ──────────────────────────────────────────────────────────────
export function AvelTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { drawerOpen, setDrawerOpen, setPaletteOpen } = useShell();

  return (
    <header className="avel-topbar">
      <button
        type="button"
        className="avel-topbar-burger"
        aria-label={drawerOpen ? "Close menu" : "Open menu"}
        aria-expanded={drawerOpen}
        onClick={() => setDrawerOpen(!drawerOpen)}
      >
        <span className={drawerOpen ? "is-open" : ""} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      <div className="avel-topbar-titles">
        <div className="avel-topbar-title">{title}</div>
        {subtitle ? <div className="avel-topbar-subtitle">{subtitle}</div> : null}
      </div>

      <div className="avel-topbar-actions">
        <button
          type="button"
          className="avel-topbar-search"
          onClick={() => setPaletteOpen(true)}
          aria-label="Search (Command/Ctrl K)"
        >
          <span>⌕ Search providers, spaces, actions…</span>
          <kbd className="avel-topbar-kbd">⌘K</kbd>
        </button>
        <button type="button" className="avel-topbar-bell" aria-label="Notifications">
          🔔
          <span className="avel-topbar-bell-dot" />
        </button>
        <div className="avel-topbar-av" aria-label="Account">MK</div>
      </div>
    </header>
  );
}
