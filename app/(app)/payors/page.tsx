// Payor enrollment Kanban. URL-driven filter chips so partners can
// deep-link "show me the Optum pipeline" during a demo. Cards link back
// to /providers/[slug] for the full profile.

import Link from "next/link";
import { DemoButton } from "../_components/DemoButton";
import {
  PAYOR_COLUMN_COUNTS,
  PAYOR_ENROLLMENTS,
  type PayorEnrollment,
  type PayorStage,
} from "../../_lib/mockProviders";

export const metadata = {
  title: "Payor Pipeline",
};

const COLUMNS: { stage: PayorStage; title: string }[] = [
  { stage: "drafted", title: "Drafted" },
  { stage: "submitted", title: "Submitted" },
  { stage: "info_needed", title: "Info Needed" },
  { stage: "in_network", title: "In-Network" },
];

const PAYOR_FILTERS: { id: string; label: string; matches: (e: PayorEnrollment) => boolean }[] =
  [
    { id: "all", label: "All payors", matches: () => true },
    {
      id: "optum",
      label: "Optum / UBH",
      matches: (e) => e.payor.toLowerCase().includes("optum"),
    },
    {
      id: "carelon",
      label: "Carelon",
      matches: (e) => e.payor.toLowerCase().includes("carelon"),
    },
    {
      id: "magellan",
      label: "Magellan",
      matches: (e) => e.payor.toLowerCase().includes("magellan"),
    },
    {
      id: "evernorth",
      label: "Evernorth",
      matches: (e) => e.payor.toLowerCase().includes("evernorth"),
    },
    {
      id: "anthem",
      label: "Anthem BH",
      matches: (e) => e.payor.toLowerCase().includes("anthem"),
    },
    {
      id: "medicaid",
      label: "State Medicaid",
      matches: (e) => e.payor.toLowerCase().includes("medicaid"),
    },
  ];

type PageProps = {
  searchParams: Promise<{ payor?: string }>;
};

export default async function PayorsPage({ searchParams }: PageProps) {
  const { payor } = await searchParams;
  const activeFilter =
    PAYOR_FILTERS.find((f) => f.id === payor) ?? PAYOR_FILTERS[0];
  const visible = PAYOR_ENROLLMENTS.filter(activeFilter.matches);

  const totalActive = Object.values(PAYOR_COLUMN_COUNTS).reduce(
    (a, b) => a + b,
    0,
  );
  const draftedCount = visible.filter((e) => e.stage === "drafted").length;

  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Payor enrollment, automated</span>
        <h1>Payor Pipeline</h1>
        <p>
          {totalActive} active enrollments · {draftedCount} approvals waiting
          in this view · 4 stages
        </p>
      </section>

      <div className="filter-row">
        <div className="filter-chips" style={{ width: "100%" }}>
          {PAYOR_FILTERS.map((f) => {
            const count = PAYOR_ENROLLMENTS.filter(f.matches).length;
            const className =
              activeFilter.id === f.id ? "filter-chip active" : "filter-chip";
            return (
              <Link
                key={f.id}
                href={f.id === "all" ? "/payors" : `/payors?payor=${f.id}`}
                className={className}
              >
                {f.label} <span className="filter-chip-count">{count}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="kb-cols" style={{ marginTop: 8 }}>
        {COLUMNS.map((col) => {
          const cardsInCol = visible.filter((e) => e.stage === col.stage);
          return (
            <div className="kb-col" key={col.stage}>
              <div className="kb-col-head">
                <span className="kb-col-title">{col.title}</span>
                <span className="kb-col-count">
                  {activeFilter.id === "all"
                    ? PAYOR_COLUMN_COUNTS[col.stage]
                    : cardsInCol.length}
                </span>
              </div>
              {cardsInCol.length === 0 ? (
                <div className="kb-empty">No items</div>
              ) : (
                cardsInCol.map((e, i) => (
                  <PayorCard key={`${e.providerSlug}-${e.payor}-${i}`} e={e} />
                ))
              )}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 24,
          padding: "16px 20px",
          background: "var(--cream)",
          border: "1px solid var(--line)",
          borderRadius: 12,
          fontSize: 13,
          color: "var(--ink-soft)",
          lineHeight: 1.55,
          display: "flex",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <span>
          <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
            Human-in-the-loop approval gate:
          </strong>{" "}
          no submission leaves CredTek without a coordinator click.
        </span>
        <DemoButton
          className="prov-btn primary"
          demoMessage="Demo — would batch-approve every Drafted card with one click. Most coordinators do this once a morning."
        >
          Batch approve all Drafted
        </DemoButton>
      </div>
    </>
  );
}

function PayorCard({ e }: { e: PayorEnrollment }) {
  const className = e.danger
    ? "kb-card danger"
    : e.success
      ? "kb-card success"
      : "kb-card";
  return (
    <Link
      href={`/providers/${e.providerSlug}?tab=payors`}
      className={className}
      style={{ display: "block", textDecoration: "none", color: "inherit" }}
    >
      <div className="name">
        {e.providerLabel} — {e.payor}
      </div>
      <div className="meta">{e.context}</div>
      <div className="day">{e.dayLabel}</div>
    </Link>
  );
}
