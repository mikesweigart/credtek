// Operations Queue ticket detail. The specialist does the actual work
// here — running through the sub-task checklist, jotting notes, and
// capturing structured results that flow back to the customer-facing
// IntegrationJob via transition_job() (mocked).

import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoButton } from "../../../(app)/_components/DemoButton";
import {
  findOpsTicket,
  POOL_LABELS,
  STATUS_LABELS,
  TASK_TEMPLATE_LABELS,
  type OpsTaskTemplate,
} from "../../../_lib/mockOpsQueue";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const t = findOpsTicket(id);
  if (!t) return { title: "Ticket not found · Ops" };
  return { title: `${t.taskTitle} · Ops` };
}

export default async function OpsTicketPage({ params }: PageProps) {
  const { id } = await params;
  const t = findOpsTicket(id);
  if (!t) notFound();

  const slaToneClass =
    t.slaTone === "red"
      ? "ops-sla danger big"
      : t.slaTone === "amber"
        ? "ops-sla warn big"
        : "ops-sla big";

  return (
    <>
      <div className="ops-back">
        <Link href="/ops/queue">← Queue</Link>
      </div>

      <header className="ops-detail-head">
        <div>
          <span className="ops-eyebrow">
            {TASK_TEMPLATE_LABELS[t.taskTemplate]} ·{" "}
            <span className="ops-id">{t.id}</span>
          </span>
          <h1>{t.taskTitle}</h1>
          <div className="ops-detail-meta">
            <Link
              href={`/providers/${t.providerSlug}`}
              className="ops-detail-meta-link"
            >
              {t.providerName} · {t.providerContext}
            </Link>
            <span className="ops-detail-meta-sep">·</span>
            <span>{t.customerOrg}</span>
            <span className="ops-detail-meta-sep">·</span>
            <span>Pool: {POOL_LABELS[t.pool]}</span>
            <span className="ops-detail-meta-sep">·</span>
            <span>Created {t.createdAt}</span>
          </div>
        </div>
        <div className="ops-detail-sla">
          <span className="ops-detail-sla-label">SLA</span>
          <span className={slaToneClass}>{t.slaDue}</span>
        </div>
      </header>

      <section className="ops-detail-actions">
        <span
          className={
            t.status === "complete"
              ? "ops-status big status-complete"
              : `ops-status big status-${t.status}`
          }
        >
          {STATUS_LABELS[t.status]}
        </span>
        {t.assignedTo ? (
          <span className="ops-detail-owner">
            Owner: <strong>{t.assignedTo}</strong>
          </span>
        ) : (
          <DemoButton
            className="ops-btn primary"
            demoMessage="Demo — would assign this ticket to the next available specialist in the pool, with auto-routing based on workload + SLA urgency."
          >
            Claim ticket
          </DemoButton>
        )}
        {t.status !== "complete" ? (
          <>
            <DemoButton
              className="ops-btn"
              demoMessage="Demo — would mark this ticket blocked with a structured reason (Provider not responding / Payer system down / Awaiting state board / Need coordinator follow-up). Customer org admin gets a notification."
            >
              Mark blocked
            </DemoButton>
            <DemoButton
              className="ops-btn"
              demoMessage="Demo — would re-route to a different specialist or escalate to ops manager. Used when the current owner is OOO or the work needs senior attention."
            >
              Reassign / escalate
            </DemoButton>
          </>
        ) : null}
      </section>

      <div className="ops-detail-grid">
        <div className="ops-detail-col">
          {/* Sub-tasks checklist */}
          <div className="ops-card">
            <h3>Sub-tasks</h3>
            <p className="ops-card-sub">
              Structured steps for{" "}
              <code>{t.taskTemplate}</code>. Production: each toggle writes to
              the ticket&apos;s sub-task array and the audit log.
            </p>
            <div className="ops-checklist">
              {t.subTasks.map((st, i) => (
                <div
                  key={i}
                  className={
                    st.done ? "ops-check-row done" : "ops-check-row"
                  }
                >
                  <div className="ops-check-mark">{st.done ? "✓" : ""}</div>
                  <div>
                    <div className="ops-check-label">{st.label}</div>
                    {st.ts ? (
                      <div className="ops-check-ts">{st.ts}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Result capture form (varies by task template) */}
          <div className="ops-card">
            <h3>Capture result</h3>
            <p className="ops-card-sub">
              When complete, this structured payload writes back to the
              customer-facing IntegrationJob{" "}
              <code>result</code> field via{" "}
              <code>transition_job(&apos;completed&apos;)</code>.
            </p>
            <ResultForm template={t.taskTemplate} />
          </div>

          {/* Artifacts */}
          <div className="ops-card">
            <h3>Artifacts</h3>
            <p className="ops-card-sub">
              Documents, screenshots, fax confirmations — anything that
              constitutes evidence the work happened. Encrypted at rest,
              audit-logged on every access.
            </p>
            {t.artifacts.length === 0 ? (
              <div className="ops-empty">
                No artifacts yet. Required for completion of this template.
              </div>
            ) : (
              <div className="ops-artifacts">
                {t.artifacts.map((a) => (
                  <div key={a.name} className="ops-artifact">
                    <div className="ops-artifact-icon">📎</div>
                    <div>
                      <div className="ops-artifact-name">{a.name}</div>
                      <div className="ops-artifact-meta">
                        {a.ts} · {fmtBytes(a.bytes)}
                      </div>
                    </div>
                    <DemoButton
                      className="ops-btn"
                      demoMessage="Demo — would download via signed S3 URL with audit log entry. Real PHI documents only viewable by ticket owner + customer admins."
                    >
                      Open
                    </DemoButton>
                  </div>
                ))}
                <DemoButton
                  className="ops-btn"
                  demoMessage="Demo — would open file picker / drag-drop zone. Files virus-scanned, OCR'd, and PHI-redacted in metadata before storage."
                >
                  + Upload artifact
                </DemoButton>
              </div>
            )}
          </div>
        </div>

        <div className="ops-detail-col">
          {/* Notes thread */}
          <div className="ops-card">
            <h3>Internal notes</h3>
            <p className="ops-card-sub">
              Specialist-only thread. Customer-facing job timeline is
              separate and curated.
            </p>
            <div className="ops-notes">
              {t.notes.length === 0 ? (
                <div className="ops-empty">No notes yet.</div>
              ) : (
                t.notes.map((n, i) => (
                  <div key={i} className="ops-note">
                    <div className="ops-note-head">
                      <strong>{n.author}</strong>
                      <span className="ops-note-ts">{n.ts}</span>
                    </div>
                    <div className="ops-note-body">{n.text}</div>
                  </div>
                ))
              )}
            </div>
            <div className="ops-note-compose">
              <textarea
                className="ops-note-input"
                placeholder="Add an internal note (specialist-only — never visible to the customer)…"
                rows={3}
                readOnly
              />
              <div className="ops-note-actions">
                <DemoButton
                  className="ops-btn primary"
                  demoMessage="Demo — would append the note to this ticket's thread, broadcast to other specialists watching it, and log to the audit trail."
                >
                  Add note
                </DemoButton>
              </div>
            </div>
          </div>

          {/* Customer-facing context */}
          <div className="ops-card">
            <h3>Customer-facing job</h3>
            <div className="ops-job-link">
              <div className="ops-job-id">
                <code>{t.jobId}</code>
              </div>
              <div className="ops-job-meta">
                The coordinator at <strong>{t.customerOrg}</strong> sees this
                as a tracked workflow with status, ETA, and last-action
                visible. They never see this internal queue.
              </div>
              <Link
                href={`/providers/${t.providerSlug}`}
                className="ops-btn"
              >
                Open customer view of provider →
              </Link>
            </div>
          </div>

          {/* Cost & time */}
          <div className="ops-card">
            <h3>Cost &amp; time</h3>
            <div className="ops-stat-row">
              <span>Estimated specialist hours</span>
              <strong>{specialistHours(t.taskTemplate)}h</strong>
            </div>
            <div className="ops-stat-row">
              <span>Actual hours so far</span>
              <strong>{actualHours(t)}h</strong>
            </div>
            <div className="ops-stat-row">
              <span>Cost (loaded $50/hr)</span>
              <strong>${(actualHours(t) * 50).toFixed(0)}</strong>
            </div>
            <div className="ops-stat-row">
              <span>Customer price</span>
              <strong>${customerPrice(t.taskTemplate)}</strong>
            </div>
            <div className="ops-stat-row highlight">
              <span>Margin (est.)</span>
              <strong>
                $
                {(
                  customerPrice(t.taskTemplate) -
                  actualHours(t) * 50
                ).toFixed(0)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Mark complete CTA */}
      {t.status !== "complete" ? (
        <div className="ops-complete-bar">
          <div>
            <strong>Ready to mark complete?</strong> All required sub-tasks
            and the result form must be filled in.
          </div>
          <DemoButton
            className="ops-btn primary big"
            demoMessage={`Demo — would call transition_job('${t.jobId}', 'completed', specialist_id, ...) which: (1) writes the structured result back to the customer's IntegrationJob, (2) appends to the audit log hash chain, (3) fires the ticket-completed webhook to the customer's CredTek workspace, (4) updates billing.`}
          >
            Mark complete &amp; send result →
          </DemoButton>
        </div>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------

function ResultForm({ template }: { template: OpsTaskTemplate }) {
  switch (template) {
    case "state_board_email_verification":
      return (
        <div className="ops-form-grid">
          <Field label="License number" placeholder="e.g. LCSW-86421" />
          <Field
            label="License status"
            select={["active", "expired", "disciplinary", "not_found"]}
          />
          <Field label="Verification date" type="date" />
          <Field
            label="Verifying source / email"
            placeholder="bbs-license-verify@dca.ca.gov"
          />
          <Field label="Notes for customer-facing job" full />
        </div>
      );
    case "state_medicaid_mco_enrollment":
      return (
        <div className="ops-form-grid">
          <Field label="MCO" placeholder="Superior HealthPlan" />
          <Field label="Provider ID assigned" placeholder="SUP-2026-04-…" />
          <Field label="Effective date" type="date" />
          <Field
            label="Network status"
            select={["in_network", "pending", "denied"]}
          />
          <Field label="Contracting letter PDF" placeholder="(uploaded above)" />
          <Field label="Notes for customer-facing job" full />
        </div>
      );
    case "payer_escalation_call":
      return (
        <div className="ops-form-grid">
          <Field label="Payer + dept" placeholder="Anthem BH · Provider Relations" />
          <Field label="Contact name" placeholder="Joycelyn M." />
          <Field label="Reference number" placeholder="ABH-2026-…" />
          <Field
            label="Call outcome"
            select={[
              "in_review_committee",
              "additional_info_requested",
              "denied",
              "approved",
              "voicemail_left",
            ]}
          />
          <Field label="Updated ETA (date)" type="date" />
          <Field label="Notes for customer-facing job" full />
        </div>
      );
    case "notarized_document_coordination":
      return (
        <div className="ops-form-grid">
          <Field label="Document type" placeholder="Supervision attestation" />
          <Field label="Notary service" placeholder="NotaryCam" />
          <Field label="Appointment date" type="date" />
          <Field
            label="Status"
            select={["scheduled", "completed", "no_show", "rescheduled"]}
          />
          <Field label="Notarized PDF" placeholder="(uploaded above)" />
          <Field label="Notes" full />
        </div>
      );
    case "reference_check_outreach":
      return (
        <div className="ops-form-grid">
          <Field label="Reference 1 — name" placeholder="Dr. Sarah Reyes" />
          <Field
            label="Reference 1 — outcome"
            select={["positive", "neutral", "no_response", "concerning"]}
          />
          <Field label="Reference 2 — name" placeholder="Dr. Eduardo Hernandez" />
          <Field
            label="Reference 2 — outcome"
            select={["positive", "neutral", "no_response", "concerning"]}
          />
          <Field label="Reference 3 — name" placeholder="(if applicable)" />
          <Field
            label="Reference 3 — outcome"
            select={["positive", "neutral", "no_response", "concerning", "n_a"]}
          />
          <Field label="Summary for customer-facing job" full />
        </div>
      );
  }
}

function Field({
  label,
  placeholder,
  type,
  select,
  full,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  select?: string[];
  full?: boolean;
}) {
  return (
    <div className={full ? "ops-field full" : "ops-field"}>
      <label>{label}</label>
      {select ? (
        <select defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {select.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      ) : full ? (
        <textarea rows={3} placeholder={placeholder} />
      ) : (
        <input type={type ?? "text"} placeholder={placeholder} />
      )}
    </div>
  );
}

function specialistHours(template: OpsTaskTemplate): number {
  switch (template) {
    case "state_board_email_verification":
      return 0.5;
    case "state_medicaid_mco_enrollment":
      return 4.0;
    case "payer_escalation_call":
      return 0.5;
    case "notarized_document_coordination":
      return 1.0;
    case "reference_check_outreach":
      return 1.5;
  }
}

function customerPrice(template: OpsTaskTemplate): number {
  // Public-facing $300 flat for now; tiered pricing per IAL spec is a
  // separate backend decision.
  switch (template) {
    case "state_medicaid_mco_enrollment":
      return 600;
    case "notarized_document_coordination":
      return 250;
    default:
      return 300;
  }
}

function actualHours(t: { subTasks: { done: boolean }[] }): number {
  // Rough proxy for demo: 0.4h per completed sub-task.
  return Number(
    (t.subTasks.filter((s) => s.done).length * 0.4).toFixed(1),
  );
}

function fmtBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}
