// Task template catalog — every Tier 4 template the IAL knows how to
// instantiate, with SLAs, default pool routing, structured result
// schemas, and unit-economics. Reference for ops managers and
// engineering when adding new templates.

import Link from "next/link";

export const metadata = {
  title: "Templates · Ops",
};

type Template = {
  id: string;
  displayName: string;
  description: string;
  defaultSlaHours: number;
  defaultPool: "cvo_partner" | "internal_ops";
  estimatedHours: number;
  customerPriceCents: number;
  steps: string[];
  resultFields: { name: string; type: string }[];
  requiredArtifacts: string[];
  notes?: string;
};

const TEMPLATES: Template[] = [
  {
    id: "state_board_email_verification",
    displayName: "State board · email verification",
    description:
      "Verify a clinician's license with a state board that requires email or fax verification. Specialist sends the request, awaits response, captures structured result.",
    defaultSlaHours: 120, // 5 business days
    defaultPool: "cvo_partner",
    estimatedHours: 0.5,
    customerPriceCents: 30000,
    steps: [
      "Send verification request to state board",
      "Await response (typically 3-5 business days)",
      "Capture verification details",
      "Upload board response email/PDF",
    ],
    resultFields: [
      { name: "license_number", type: "string" },
      { name: "license_status", type: "enum:active|expired|disciplinary|not_found" },
      { name: "verification_date", type: "date" },
      { name: "verified_by_email", type: "string" },
      { name: "verification_artifact_key", type: "string" },
    ],
    requiredArtifacts: ["board_response_email_or_pdf"],
    notes:
      "30-state coverage by state board. NJ, MD, CT, NY, AL, MS still require this template; the rest have web-portal Tier 3 agents.",
  },
  {
    id: "state_medicaid_mco_enrollment",
    displayName: "State Medicaid MCO enrollment",
    description:
      "Full enrollment of a provider with a state Medicaid managed-care organization. Multi-stage with portal submissions, additional info responses, and committee review.",
    defaultSlaHours: 90 * 24,
    defaultPool: "cvo_partner",
    estimatedHours: 4.0,
    customerPriceCents: 60000,
    steps: [
      "Submit provider application",
      "Receive application acknowledgement",
      "Respond to additional info requests",
      "Receive contracted-effective-date letter",
      "Update CredTek profile + fire webhook",
    ],
    resultFields: [
      { name: "mco_provider_id", type: "string" },
      { name: "effective_date", type: "date" },
      { name: "network_status", type: "enum:in_network|pending|denied" },
      { name: "contracting_letter_artifact_key", type: "string" },
    ],
    requiredArtifacts: ["application_submission", "ack_letter", "contracting_letter"],
    notes:
      "Most variability of any template — state Medicaid timelines range from 30 to 120+ days. Margin on this template is thinnest; flag for renegotiation if cost trends 2x estimate.",
  },
  {
    id: "payer_escalation_call",
    displayName: "Payor escalation call",
    description:
      "When a portal submission stalls past its SLA, internal ops calls the payor's provider relations team to unblock. Typically 1-2 calls + email follow-up.",
    defaultSlaHours: 24,
    defaultPool: "internal_ops",
    estimatedHours: 0.5,
    customerPriceCents: 30000,
    steps: [
      "Pull payor portal status + reference number",
      "Call payor provider relations (M-F 9-5 ET typical)",
      "Capture escalation reason + contact name",
      "Update job status with new ETA",
    ],
    resultFields: [
      { name: "payer_dept", type: "string" },
      { name: "contact_name", type: "string" },
      { name: "reference_number", type: "string" },
      {
        name: "call_outcome",
        type: "enum:in_review_committee|additional_info_requested|denied|approved|voicemail_left",
      },
      { name: "updated_eta", type: "date" },
    ],
    requiredArtifacts: ["call_notes_pdf"],
    notes:
      "Auto-escalates when Tier 3 jobs stay in submitted > 45 days. Most-used template — accounts for ~30% of Tier 4 volume.",
  },
  {
    id: "notarized_document_coordination",
    displayName: "Notarized document coordination",
    description:
      "Schedule a notary appointment via NotaryCam, coordinate with the provider, receive the notarized PDF, upload to CredTek.",
    defaultSlaHours: 7 * 24,
    defaultPool: "cvo_partner",
    estimatedHours: 1.0,
    customerPriceCents: 25000,
    steps: [
      "Send notary scheduling link to provider",
      "Provider books notary appointment",
      "Receive notarized PDF from notary service",
      "Upload to CredTek + fire job webhook",
    ],
    resultFields: [
      { name: "document_type", type: "string" },
      { name: "notary_service", type: "string" },
      { name: "appointment_date", type: "date" },
      { name: "status", type: "enum:scheduled|completed|no_show|rescheduled" },
      { name: "notarized_pdf_artifact_key", type: "string" },
    ],
    requiredArtifacts: ["notary_booking_confirmation", "notarized_pdf"],
  },
  {
    id: "reference_check_outreach",
    displayName: "Reference check outreach",
    description:
      "Email each reference (typically 2-3 contacts), follow up after 5 days, capture responses in a structured rubric.",
    defaultSlaHours: 14 * 24,
    defaultPool: "cvo_partner",
    estimatedHours: 1.5,
    customerPriceCents: 30000,
    steps: [
      "Email each reference",
      "Follow up on day 5 if no response",
      "Capture responses in structured form",
      "Mark complete or escalate after 2 attempts",
    ],
    resultFields: [
      { name: "reference_1_name", type: "string" },
      { name: "reference_1_outcome", type: "enum:positive|neutral|no_response|concerning" },
      { name: "reference_2_name", type: "string" },
      { name: "reference_2_outcome", type: "enum:positive|neutral|no_response|concerning" },
      { name: "reference_3_name", type: "string" },
      { name: "reference_3_outcome", type: "enum:positive|neutral|no_response|concerning|n_a" },
      { name: "summary", type: "string" },
    ],
    requiredArtifacts: [],
  },
];

export default function TemplatesPage() {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(cents / 100);

  return (
    <>
      <div className="ops-back">
        <Link href="/ops/queue">← Queue</Link>
      </div>

      <header className="ops-greet">
        <span className="ops-eyebrow">IAL §6 · Tier 4 task templates</span>
        <h1>Templates</h1>
        <p>
          Every Tier 4 task type the IAL knows how to instantiate. Each
          template defines its SLA, default pool routing, the structured
          steps a specialist runs through, the result schema that flows
          back to the customer-facing IntegrationJob, and the
          required artifacts.
        </p>
      </header>

      <div className="template-grid">
        {TEMPLATES.map((t) => {
          const cost = t.estimatedHours * 50 * 100; // $50/hr loaded
          const margin = t.customerPriceCents - cost;
          const marginPct = (margin / t.customerPriceCents) * 100;
          return (
            <article key={t.id} className="template-card">
              <div className="template-head">
                <code className="template-id">{t.id}</code>
                <span
                  className={`tier-badge tier-${t.defaultPool === "internal_ops" ? "3" : "4"}`}
                >
                  {t.defaultPool === "internal_ops" ? "INTERNAL" : "CVO"}
                </span>
              </div>
              <h3 className="template-name">{t.displayName}</h3>
              <p className="template-desc">{t.description}</p>

              <div className="template-stats">
                <div className="template-stat">
                  <div className="template-stat-label">SLA</div>
                  <div className="template-stat-val">
                    {formatHours(t.defaultSlaHours)}
                  </div>
                </div>
                <div className="template-stat">
                  <div className="template-stat-label">Est. specialist hrs</div>
                  <div className="template-stat-val">{t.estimatedHours}h</div>
                </div>
                <div className="template-stat">
                  <div className="template-stat-label">Cost · loaded</div>
                  <div className="template-stat-val">{fmt(cost)}</div>
                </div>
                <div className="template-stat">
                  <div className="template-stat-label">Customer price</div>
                  <div className="template-stat-val">
                    {fmt(t.customerPriceCents)}
                  </div>
                </div>
                <div className="template-stat highlight">
                  <div className="template-stat-label">Margin</div>
                  <div
                    className="template-stat-val"
                    style={{
                      color: marginPct > 50 ? "#4F6B58" : "var(--gold-deep)",
                    }}
                  >
                    {fmt(margin)} ({marginPct.toFixed(0)}%)
                  </div>
                </div>
              </div>

              <div className="template-section">
                <div className="template-section-label">Steps</div>
                <ol className="template-steps">
                  {t.steps.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>

              <div className="template-section">
                <div className="template-section-label">Result schema</div>
                <div className="template-result">
                  {t.resultFields.map((f) => (
                    <div key={f.name} className="template-result-row">
                      <code>{f.name}</code>
                      <span className="template-result-type">{f.type}</span>
                    </div>
                  ))}
                </div>
              </div>

              {t.requiredArtifacts.length > 0 ? (
                <div className="template-section">
                  <div className="template-section-label">Required artifacts</div>
                  <div className="template-artifacts">
                    {t.requiredArtifacts.map((a) => (
                      <code key={a} className="template-artifact-pill">
                        {a}
                      </code>
                    ))}
                  </div>
                </div>
              ) : null}

              {t.notes ? (
                <div className="template-notes">
                  <strong>Note:</strong> {t.notes}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <div className="ops-foot">
        <strong>Adding a new template:</strong> implement{" "}
        <code>Tier4HumanTask</code> subclass at{" "}
        <code>src/integrations/tier4/&lt;name&gt;.ts</code>, declare the{" "}
        <code>TaskTemplate</code> shape above, and register in the
        catalog. SLA defaults are tunable per customer org.
      </div>
    </>
  );
}

function formatHours(h: number): string {
  if (h < 24) return `${h}h`;
  if (h < 24 * 14) return `${(h / 24).toFixed(0)} days`;
  return `${(h / 24).toFixed(0)} days (~${Math.round(h / 24 / 7)}w)`;
}
