// Provider list. Same row layout as the dashboard pipeline panel — clicks
// route to /providers/[slug] for the full profile.

import Link from "next/link";
import { PROVIDERS } from "../../_lib/mockProviders";

export const metadata = {
  title: "Providers",
};

const STATUS_PILL_CLASS: Record<string, string> = {
  active: "pstat s-active",
  enrolling: "pstat s-pending",
  supervision: "pstat s-pending",
  flag: "pstat s-flag",
};

export default function ProvidersPage() {
  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">All providers</span>
        <h1>Providers</h1>
        <p>
          {PROVIDERS.length} of 214 shown · click any row for the full profile
        </p>
      </section>

      <div
        style={{
          marginBottom: 16,
          display: "flex",
          gap: 12,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          className="shell-search"
          placeholder="⌕ Filter by name, license, payor, state…"
          style={{ maxWidth: 480, flex: 1 }}
          readOnly
        />
        <span
          style={{
            fontSize: 11,
            color: "var(--muted)",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
          }}
        >
          FILTERS · ALL · ACTIVE · ENROLLING · SUPERVISION · FLAGGED
        </span>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <h3>Roster</h3>
          <span className="filt">CLICK ANY ROW →</span>
        </div>
        {PROVIDERS.map((p) => (
          <Link
            key={p.slug}
            href={`/providers/${p.slug}`}
            className="dash-row"
          >
            <div className="dash-row-av">{p.initials}</div>
            <div>
              <div className="dash-row-name">
                {p.name}, {p.credential}
              </div>
              <div className="dash-row-meta">{p.meta}</div>
            </div>
            <div className="dash-row-states">
              {p.licenseStates.join("·")}
            </div>
            <div className={STATUS_PILL_CLASS[p.status]}>{p.statusLabel}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
