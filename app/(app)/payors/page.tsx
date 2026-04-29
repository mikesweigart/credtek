// Payor enrollment Kanban. Cards link to /providers/[slug] so a partner
// demo flows naturally from this page back into provider detail.

import Link from "next/link";
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

export default function PayorsPage() {
  const totalActive = Object.values(PAYOR_COLUMN_COUNTS).reduce(
    (a, b) => a + b,
    0,
  );
  const draftedCount = PAYOR_ENROLLMENTS.filter(
    (e) => e.stage === "drafted",
  ).length;

  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Payor enrollment, automated</span>
        <h1>Payor Pipeline</h1>
        <p>
          {totalActive} active enrollments · {draftedCount} approvals waiting ·
          4 stages
        </p>
      </section>

      <div className="kb-cols" style={{ marginTop: 8 }}>
        {COLUMNS.map((col) => (
          <div className="kb-col" key={col.stage}>
            <div className="kb-col-head">
              <span className="kb-col-title">{col.title}</span>
              <span className="kb-col-count">
                {PAYOR_COLUMN_COUNTS[col.stage]}
              </span>
            </div>
            {PAYOR_ENROLLMENTS.filter((e) => e.stage === col.stage).map(
              (e, i) => (
                <PayorCard key={`${e.providerSlug}-${e.payor}-${i}`} e={e} />
              ),
            )}
          </div>
        ))}
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
        }}
      >
        <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
          Human-in-the-loop approval gate:
        </strong>{" "}
        no submission leaves CredTek without a coordinator click. Cards in the{" "}
        <strong style={{ color: "var(--ink)" }}>Drafted</strong> column are
        agent-prepared and awaiting your review.
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
      href={`/providers/${e.providerSlug}`}
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
