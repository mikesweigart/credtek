// Approvals queue — every pending agent action waiting on a coordinator's
// click. The mockup explicitly surfaces the human-in-the-loop guardrail:
// nothing leaves CredTek without coordinator review.

import Link from "next/link";
import { DemoButton } from "../_components/DemoButton";
import { PAYOR_ENROLLMENTS } from "../../_lib/mockProviders";

export const metadata = {
  title: "Approvals",
};

type ApprovalKind =
  | "payor_enrollment"
  | "license_renewal"
  | "caqh_attestation"
  | "psv_anomaly";

type Approval = {
  kind: ApprovalKind;
  providerSlug: string;
  providerName: string;
  credential: string;
  initials: string;
  title: string;
  detail: string;
  agentNote: string;
  timeAgo: string;
  highlight?: boolean;
};

// Pull the drafted payor enrollments and surface them as approvals.
const ENROLLMENT_APPROVALS: Approval[] = PAYOR_ENROLLMENTS.filter(
  (e) => e.stage === "drafted",
).map((e) => ({
  kind: "payor_enrollment",
  providerSlug: e.providerSlug,
  providerName: e.providerLabel.replace(",", "").split(" ").reverse().join(" "),
  credential: e.context.split("·")[1]?.trim() ?? "",
  initials:
    e.providerLabel
      .replace(",", "")
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "??",
  title: `${e.payor} enrollment for ${e.providerLabel.replace(",", "")}`,
  detail: e.context,
  agentNote:
    "Application fully drafted. CAQH data pulled, license + DEA attached, supervisor cosignature on file.",
  timeAgo: "drafted 6 min ago",
  highlight: true,
}));

const OTHER_APPROVALS: Approval[] = [
  {
    kind: "license_renewal",
    providerSlug: "daniel-kim",
    providerName: "Dr. Daniel Kim",
    credential: "MD",
    initials: "DK",
    title: "CA medical license renewal · D. Kim",
    detail: "Expires in 21 days · CME hours verified",
    agentNote:
      "Renewal application drafted from current profile. Credit card payment field needs final selection — defaulted to org card on file.",
    timeAgo: "drafted 32 min ago",
  },
  {
    kind: "caqh_attestation",
    providerSlug: "sarah-reyes",
    providerName: "Dr. Sarah Reyes",
    credential: "PsyD",
    initials: "SR",
    title: "CAQH attestation re-up · S. Reyes",
    detail: "Auto-attest scheduled · provider SMS approval received",
    agentNote:
      "Provider approved via SMS at 2:14 PM. Ready to submit on coordinator click.",
    timeAgo: "ready 12 min ago",
  },
  {
    kind: "psv_anomaly",
    providerSlug: "tyler-brooks",
    providerName: "Tyler Brooks",
    credential: "LPC-A",
    initials: "TB",
    title: "PSV anomaly · T. Brooks",
    detail: "NY state board returned: license number formatted differently than on file",
    agentNote:
      "Likely a state-board UI change — CredTek pulled the new format. Confirm to update profile and re-run PSV.",
    timeAgo: "flagged 1 hr ago",
  },
];

const ALL_APPROVALS: Approval[] = [
  ...ENROLLMENT_APPROVALS,
  ...OTHER_APPROVALS,
];

export default function ApprovalsPage() {
  return (
    <>
      <section className="shell-greet">
        <span className="app-eyebrow">Human-in-the-loop</span>
        <h1>Approvals queue</h1>
        <p>
          Every agent action waiting on you. Nothing leaves CredTek without
          a coordinator click —{" "}
          <strong style={{ color: "var(--ink)" }}>
            no AI submission ever reaches a payor or state board unreviewed.
          </strong>
        </p>
      </section>

      <section className="kpi-row" style={{ marginBottom: 22 }}>
        <div className="kpi">
          <div className="kpi-lbl">Waiting on you</div>
          <div className="kpi-val">
            <em>{ALL_APPROVALS.length}</em>
          </div>
          <div className="kpi-delta up">all from the last 4 hours</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Avg time to approve</div>
          <div className="kpi-val">42s</div>
          <div className="kpi-delta up">from open to send</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Approved this week</div>
          <div className="kpi-val">87</div>
          <div className="kpi-delta up">↑ 24 vs. last week</div>
        </div>
        <div className="kpi">
          <div className="kpi-lbl">Edits before send</div>
          <div className="kpi-val">3%</div>
          <div className="kpi-delta up">agent draft accuracy</div>
        </div>
      </section>

      <div className="approvals-list">
        {ALL_APPROVALS.map((a, i) => (
          <article
            key={i}
            className={
              a.highlight ? "approval-card highlight" : "approval-card"
            }
          >
            <div className="approval-card-head">
              <Link
                href={`/providers/${a.providerSlug}`}
                className="approval-av"
                aria-label={`Open ${a.providerName} profile`}
              >
                {a.initials}
              </Link>
              <div>
                <div className="approval-title">{a.title}</div>
                <div className="approval-meta">
                  <Link
                    href={`/providers/${a.providerSlug}`}
                    className="approval-meta-link"
                  >
                    {a.providerName}, {a.credential}
                  </Link>
                  <span className="approval-meta-sep">·</span>
                  <span>{a.detail}</span>
                  <span className="approval-meta-sep">·</span>
                  <span className="approval-time">{a.timeAgo}</span>
                </div>
              </div>
              <div className="approval-tag">
                {kindLabel(a.kind)}
              </div>
            </div>

            <div className="approval-note">
              <span className="approval-note-icon">✦</span>
              <span>
                <strong>Agent note:</strong> {a.agentNote}
              </span>
            </div>

            <div className="approval-actions">
              <DemoButton
                className="prov-btn primary"
                demoMessage={`Demo — would submit the ${a.kind === "payor_enrollment" ? "enrollment to the payor portal" : a.kind === "license_renewal" ? "renewal application" : a.kind === "caqh_attestation" ? "CAQH attestation" : "profile correction"}, log to the audit trail, and remove this card from the queue.`}
              >
                Approve & send
              </DemoButton>
              <DemoButton
                className="prov-btn"
                demoMessage="Demo — would open an inline editor to tweak the drafted submission before sending. Most coordinators never need this — agent drafts have a 97% accept-as-is rate."
              >
                Edit
              </DemoButton>
              <DemoButton
                className="prov-btn"
                demoMessage="Demo — would dismiss this approval and ask the agent for a new draft (or stop the workflow, depending on the action type)."
              >
                Reject
              </DemoButton>
              <Link
                href={`/providers/${a.providerSlug}`}
                className="approval-link"
              >
                Open full profile →
              </Link>
            </div>
          </article>
        ))}
      </div>

      {ALL_APPROVALS.length === 0 ? (
        <div className="approvals-empty">
          <div className="approvals-empty-icon">✓</div>
          <h3>You're caught up.</h3>
          <p>
            Agents will surface anything new here as it's drafted. Average
            cadence: ~4 approvals per hour during business hours.
          </p>
        </div>
      ) : null}
    </>
  );
}

function kindLabel(k: ApprovalKind): string {
  switch (k) {
    case "payor_enrollment":
      return "Payor enrollment";
    case "license_renewal":
      return "License renewal";
    case "caqh_attestation":
      return "CAQH attestation";
    case "psv_anomaly":
      return "PSV anomaly";
  }
}
