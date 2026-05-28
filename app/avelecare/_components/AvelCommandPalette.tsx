"use client";

// ⌘K command palette — jump to any provider, space, page, or action
// from anywhere in the portal. Opens on Cmd/Ctrl+K or via the topbar
// search. Full keyboard navigation (↑/↓/↵/esc). Mounted globally in
// the AVEL layout; open state lives in the shell context so the topbar
// button and the global shortcut share it.

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useShell } from "./AvelNav";
import { PROVIDERS, SPACES, STAGE_LABEL } from "../_data/seed";

type Group = "Pages" | "Providers" | "Spaces" | "Actions";
type Cmd = { id: string; group: Group; label: string; sub?: string; href: string; icon: string };

const GROUP_ORDER: Group[] = ["Actions", "Pages", "Providers", "Spaces"];

const PAGES: Cmd[] = [
  { id: "pg-dash", group: "Pages", label: "Dashboard", href: "/avelecare", icon: "▣" },
  { id: "pg-followups", group: "Pages", label: "Follow-ups", href: "/avelecare/followups", icon: "↗" },
  { id: "pg-prov", group: "Pages", label: "Providers", href: "/avelecare/providers", icon: "◯" },
  { id: "pg-spaces", group: "Pages", label: "Spaces & Programs", href: "/avelecare/spaces", icon: "◇" },
  { id: "pg-exp", group: "Pages", label: "Expirables & Renewals", href: "/avelecare/expirables", icon: "⏱" },
  { id: "pg-wf", group: "Pages", label: "Workflows", href: "/avelecare/workflows", icon: "▤" },
  { id: "pg-docs", group: "Pages", label: "Documents & Compliance", href: "/avelecare/documents", icon: "📄" },
  { id: "pg-audit", group: "Pages", label: "NCQA Audit Binder", href: "/avelecare/audit", icon: "▣" },
  { id: "pg-rep", group: "Pages", label: "Reports & Analytics", href: "/avelecare/reports", icon: "▥" },
  { id: "pg-set", group: "Pages", label: "Admin & Settings", href: "/avelecare/settings", icon: "⚙" },
  { id: "pg-help", group: "Pages", label: "Help & Chat", href: "/avelecare/help", icon: "✦" },
];

const ACTIONS: Cmd[] = [
  { id: "ac-add", group: "Actions", label: "Add a provider", sub: "Start intake", href: "/avelecare/providers", icon: "＋" },
  { id: "ac-followups", group: "Actions", label: "Review follow-ups", sub: "What needs a nudge", href: "/avelecare/followups", icon: "↗" },
  { id: "ac-renew", group: "Actions", label: "Review expiring credentials", sub: "Renewals due soon", href: "/avelecare/expirables", icon: "⏱" },
  { id: "ac-audit", group: "Actions", label: "Generate NCQA audit binder", sub: "Delegated credentialing", href: "/avelecare/audit", icon: "▣" },
  { id: "ac-email", group: "Actions", label: "Connect email", sub: "Send follow-ups from your inbox", href: "/avelecare/settings?tab=email", icon: "✉" },
];

const PROVIDER_CMDS: Cmd[] = PROVIDERS.map((p) => ({
  id: `pr-${p.slug}`,
  group: "Providers",
  label: `${p.name}, ${p.credentials}`,
  sub: `${p.specialty} · ${STAGE_LABEL[p.stage]}`,
  href: `/avelecare/providers/${p.slug}`,
  icon: p.initials,
}));

const SPACE_CMDS: Cmd[] = SPACES.map((s) => ({
  id: `sp-${s.slug}`,
  group: "Spaces",
  label: s.name,
  sub: `${s.region} · ${s.serviceLine}`,
  href: `/avelecare/spaces/${s.slug}`,
  icon: "◇",
}));

const ALL: Cmd[] = [...ACTIONS, ...PAGES, ...PROVIDER_CMDS, ...SPACE_CMDS];

export function AvelCommandPalette() {
  const router = useRouter();
  const { paletteOpen, setPaletteOpen } = useShell();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Global Cmd/Ctrl+K toggles the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(!paletteOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paletteOpen, setPaletteOpen]);

  // On open: reset, focus, lock scroll.
  useEffect(() => {
    if (!paletteOpen) return;
    setQuery("");
    setActive(0);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [paletteOpen]);

  // Filtered, flattened results (in group order).
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const pool = q
      ? ALL.filter((c) => `${c.label} ${c.sub ?? ""}`.toLowerCase().includes(q))
      : [...ACTIONS, ...PAGES]; // empty query → quick actions + pages
    // keep group order
    return [...pool].sort(
      (a, b) => GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group)
    );
  }, [query]);

  // Clamp active index when results change.
  useEffect(() => {
    setActive((i) => Math.min(i, Math.max(0, results.length - 1)));
  }, [results.length]);

  function go(cmd: Cmd | undefined) {
    if (!cmd) return;
    setPaletteOpen(false);
    router.push(cmd.href);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setPaletteOpen(false);
    }
  }

  // Scroll the active row into view.
  useEffect(() => {
    if (!paletteOpen || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, paletteOpen]);

  if (!paletteOpen) return null;

  // Group the flat results for rendering while tracking a running index.
  let runningIdx = -1;
  const grouped: { group: Group; items: { cmd: Cmd; idx: number }[] }[] = [];
  for (const g of GROUP_ORDER) {
    const items = results
      .filter((c) => c.group === g)
      .map((cmd) => ({ cmd, idx: ++runningIdx }));
    if (items.length) grouped.push({ group: g, items });
  }

  return (
    <div
      className="cmdk-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) setPaletteOpen(false);
      }}
    >
      <div className="cmdk-panel">
        <div className="cmdk-input-row">
          <span className="cmdk-input-icon">⌕</span>
          <input
            ref={inputRef}
            className="cmdk-input"
            placeholder="Search providers, spaces, pages, actions…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
          />
          <kbd className="cmdk-esc">esc</kbd>
        </div>

        <div className="cmdk-results" ref={listRef}>
          {results.length === 0 && (
            <div className="cmdk-empty">No matches for “{query}”.</div>
          )}
          {grouped.map(({ group, items }) => (
            <div key={group} className="cmdk-group">
              <div className="cmdk-group-label">{group}</div>
              {items.map(({ cmd, idx }) => (
                <button
                  key={cmd.id}
                  type="button"
                  data-idx={idx}
                  className={`cmdk-item${idx === active ? " is-active" : ""}`}
                  onMouseMove={() => setActive(idx)}
                  onClick={() => go(cmd)}
                >
                  <span className="cmdk-item-icon">{cmd.icon}</span>
                  <span className="cmdk-item-label">{cmd.label}</span>
                  {cmd.sub && <span className="cmdk-item-sub">{cmd.sub}</span>}
                  <span className="cmdk-item-enter" aria-hidden="true">↵</span>
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="cmdk-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}
