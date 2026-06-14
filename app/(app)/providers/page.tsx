// Provider list. URL-driven filter chips (?status=enrolling etc.) so a
// partner can deep-link a filtered roster during a demo. Search bar uses
// the DemoButton-as-input so click → toast instead of dead input.

import Link from "next/link";
import { DemoButton } from "../_components/DemoButton";
import { NavIcon } from "../../_components/NavIcon";
import {
  PROVIDERS,
  type ProviderStatus,
} from "../../_lib/mockProviders";

export const metadata = {
  title: "Providers",
};

const STATUS_PILL_CLASS: Record<ProviderStatus, string> = {
  active: "pstat s-active",
  enrolling: "pstat s-pending",
  supervision: "pstat s-pending",
  flag: "pstat s-flag",
};

// How far through the pipeline each status sits — drives the per-row progress
// bar so the roster reads momentum at a glance, matching the dashboard.
const STAGE_PCT: Record<ProviderStatus, number> = {
  active: 100,
  enrolling: 65,
  supervision: 45,
  flag: 30,
};

const FILTERS: { id: string; label: string; predicate: (s: ProviderStatus) => boolean }[] =
  [
    { id: "all", label: "All", predicate: () => true },
    { id: "active", label: "Active", predicate: (s) => s === "active" },
    {
      id: "enrolling",
      label: "In credentialing",
      predicate: (s) => s === "enrolling",
    },
    {
      id: "supervision",
      label: "Supervision",
      predicate: (s) => s === "supervision",
    },
    { id: "flag", label: "Flagged", predicate: (s) => s === "flag" },
  ];

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function ProvidersPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const activeFilter = FILTERS.find((f) => f.id === status) ?? FILTERS[0];
  const visible = PROVIDERS.filter((p) => activeFilter.predicate(p.status));

  const counts = {
    total: PROVIDERS.length,
    active: PROVIDERS.filter((p) => p.status === "active").length,
    enrolling: PROVIDERS.filter((p) => p.status === "enrolling").length,
    flagged: PROVIDERS.filter((p) => p.status === "flag").length,
  };

  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">All providers</span>
        <h1>Providers</h1>
        <p>
          {visible.length} of {PROVIDERS.length} shown · click any row for the
          full profile
        </p>
        <Link href="/get-started" className="btn-primary">
          Onboard providers
          <span className="arrow">→</span>
        </Link>
      </section>

      <section className="kpi-row" style={{ marginBottom: 18 }}>
        <div className="kpi kpi-hero">
          <div className="kpi-top">
            <span className="kpi-ic">
              <NavIcon name="providers" size={17} />
            </span>
            <span className="kpi-trend t-neutral">all statuses</span>
          </div>
          <div className="kpi-val">
            <em>{counts.total}</em>
          </div>
          <div className="kpi-lbl">Total roster</div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <span className="kpi-ic">
              <NavIcon name="approvals" size={17} />
            </span>
            <span className="kpi-trend t-up">in-network</span>
          </div>
          <div className="kpi-val">{counts.active}</div>
          <div className="kpi-lbl">Active &amp; billing</div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <span className="kpi-ic">
              <NavIcon name="recred" size={17} />
            </span>
            <span className="kpi-trend t-neutral">in progress</span>
          </div>
          <div className="kpi-val">{counts.enrolling}</div>
          <div className="kpi-lbl">In credentialing</div>
        </div>
        <div className="kpi">
          <div className="kpi-top">
            <span className="kpi-ic">
              <NavIcon name="alert" size={17} />
            </span>
            <span className={counts.flagged > 0 ? "kpi-trend t-flag" : "kpi-trend t-up"}>
              {counts.flagged > 0 ? (
                <>
                  <NavIcon name="alert" size={11} /> needs review
                </>
              ) : (
                "all clear"
              )}
            </span>
          </div>
          <div className="kpi-val">{counts.flagged}</div>
          <div className="kpi-lbl">Flagged</div>
        </div>
      </section>

      <div className="filter-row">
        <DemoButton
          asInput
          className="filter-search"
          placeholder="⌕ Filter by name, license, payor, state…"
          demoMessage="Demo — typeahead search filters the roster live across name, NPI, license number, payor, and state. Book a demo to see live."
        >
          search
        </DemoButton>
        <div className="filter-chips">
          {FILTERS.map((f) => {
            const count = PROVIDERS.filter((p) => f.predicate(p.status)).length;
            const className =
              activeFilter.id === f.id
                ? "filter-chip active"
                : "filter-chip";
            return (
              <Link
                key={f.id}
                href={
                  f.id === "all"
                    ? "/providers"
                    : `/providers?status=${f.id}`
                }
                className={className}
              >
                {f.label} <span className="filter-chip-count">{count}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="dash-panel">
        <div className="dash-panel-head">
          <h3>Roster</h3>
          <span className="filt">CLICK ANY ROW →</span>
        </div>
        {visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">∅</div>
            <h4>No providers in this view</h4>
            <p>Try a different filter.</p>
          </div>
        ) : (
          visible.map((p) => (
            <Link
              key={p.slug}
              href={`/providers/${p.slug}`}
              className="dash-row"
            >
              <div className="dash-row-av">{p.initials}</div>
              <div className="dash-row-main">
                <div className="dash-row-name">
                  {p.name}, {p.credential}
                </div>
                <div className="dash-row-meta">{p.meta}</div>
                <div className="dash-row-prog" aria-hidden="true">
                  <span
                    className={`dash-row-prog-bar s-${p.status}`}
                    style={{ width: `${STAGE_PCT[p.status] ?? 50}%` }}
                  />
                </div>
              </div>
              <div className="dash-row-states">
                {p.licenseStates.join("·")}
              </div>
              <div className={STATUS_PILL_CLASS[p.status]}>
                {p.statusLabel}
              </div>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
