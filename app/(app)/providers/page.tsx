// Provider list. URL-driven filter chips (?status=enrolling etc.) so a
// partner can deep-link a filtered roster during a demo. Search bar uses
// the DemoButton-as-input so click → toast instead of dead input.

import Link from "next/link";
import { DemoButton } from "../_components/DemoButton";
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

  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">All providers</span>
        <h1>Providers</h1>
        <p>
          {visible.length} of {PROVIDERS.length} shown · click any row for the
          full profile
        </p>
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
              <div>
                <div className="dash-row-name">
                  {p.name}, {p.credential}
                </div>
                <div className="dash-row-meta">{p.meta}</div>
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
