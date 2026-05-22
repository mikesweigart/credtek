// Workflows — credentialing templates AVEL eCare uses across service
// lines. Each template lists its stages, SLA targets, and the
// roles responsible. Visual-only in Phase 1; editable in Phase 2.

import { AvelTopbar } from "../_components/AvelNav";

export const metadata = { title: "Workflows" };

type Stage = { name: string; sla: string; owner: string };
type Template = {
  name: string;
  serviceLine: string;
  description: string;
  stages: Stage[];
};

const TEMPLATES: Template[] = [
  {
    name: "Emergency Telemedicine Credentialing",
    serviceLine: "Emergency",
    description:
      "End-to-end workflow for new AVEL eCare Emergency clinicians across partner hospitals and states.",
    stages: [
      { name: "Intake & Application", sla: "3 days", owner: "AVEL eCare MSO" },
      { name: "Primary Source Verification", sla: "10 days", owner: "AVEL eCare MSO" },
      { name: "Facility Privileges", sla: "21 days", owner: "Facility med staff office" },
      { name: "Compliance & HR", sla: "5 days", owner: "AVEL eCare HR" },
      { name: "Payer Enrollment", sla: "30–45 days", owner: "AVEL eCare payer liaison" },
      { name: "Final Approval & Go-Live", sla: "2 days", owner: "AVEL eCare MSO Lead" },
    ],
  },
  {
    name: "Virtual ICU / Critical Care Credentialing",
    serviceLine: "Critical Care / ICU",
    description:
      "Critical Care credentialing with extra emphasis on group privileging across the partner network.",
    stages: [
      { name: "Intake & Application", sla: "3 days", owner: "AVEL eCare MSO" },
      { name: "Primary Source Verification", sla: "10 days", owner: "AVEL eCare MSO" },
      { name: "Group Privileging Packet", sla: "30 days", owner: "Network MSO" },
      { name: "Compliance & HR", sla: "5 days", owner: "AVEL eCare HR" },
      { name: "Payer Enrollment", sla: "30–45 days", owner: "AVEL eCare payer liaison" },
      { name: "Final Approval & Go-Live", sla: "2 days", owner: "AVEL eCare MSO Lead" },
    ],
  },
  {
    name: "Hospitalist Credentialing",
    serviceLine: "Hospitalist",
    description:
      "Standard inpatient hospitalist credentialing for the Minnesota Rural Hospital Network and partner systems.",
    stages: [
      { name: "Intake & Application", sla: "3 days", owner: "AVEL eCare MSO" },
      { name: "Primary Source Verification", sla: "10 days", owner: "AVEL eCare MSO" },
      { name: "Hospital Privileges (per site)", sla: "21 days", owner: "Facility med staff office" },
      { name: "Compliance & HR", sla: "5 days", owner: "AVEL eCare HR" },
      { name: "Payer Enrollment", sla: "30–45 days", owner: "AVEL eCare payer liaison" },
      { name: "Final Approval & Go-Live", sla: "2 days", owner: "AVEL eCare MSO Lead" },
    ],
  },
  {
    name: "Behavioral Health & Crisis Care Credentialing",
    serviceLine: "Behavioral Health",
    description:
      "Behavioral health credentialing including 988 partnership protocols and state OMH attestations.",
    stages: [
      { name: "Intake & Application", sla: "3 days", owner: "AVEL eCare MSO" },
      { name: "Primary Source Verification", sla: "10 days", owner: "AVEL eCare MSO" },
      { name: "State OMH / Crisis Attestations", sla: "14 days", owner: "AVEL eCare BH program lead" },
      { name: "Compliance & HR", sla: "5 days", owner: "AVEL eCare HR" },
      { name: "BH Payer Enrollment", sla: "30–45 days", owner: "AVEL eCare payer liaison" },
      { name: "Final Approval & Go-Live", sla: "2 days", owner: "AVEL eCare MSO Lead" },
    ],
  },
  {
    name: "School Health Provider Onboarding",
    serviceLine: "School Health",
    description:
      "School-based virtual care credentialing with district-specific background checks and pediatric attestations.",
    stages: [
      { name: "Intake & Application", sla: "3 days", owner: "AVEL eCare MSO" },
      { name: "Primary Source Verification", sla: "10 days", owner: "AVEL eCare MSO" },
      { name: "District Background Checks", sla: "10–21 days", owner: "AVEL eCare HR" },
      { name: "Pediatric Care Attestation", sla: "5 days", owner: "AVEL eCare SH lead" },
      { name: "Medicaid + CHIP Enrollment", sla: "30–45 days", owner: "AVEL eCare payer liaison" },
      { name: "Final Approval & Go-Live", sla: "2 days", owner: "AVEL eCare MSO Lead" },
    ],
  },
  {
    name: "Rural Health & Critical Access Onboarding",
    serviceLine: "Rural Health",
    description:
      "Multi-facility credentialing tuned for critical access hospitals and rural health transformation programs.",
    stages: [
      { name: "Intake & Application", sla: "3 days", owner: "AVEL eCare MSO" },
      { name: "Primary Source Verification", sla: "10 days", owner: "AVEL eCare MSO" },
      { name: "Facility Privileges (per site)", sla: "21 days", owner: "Facility med staff office" },
      { name: "Compliance & HR", sla: "5 days", owner: "AVEL eCare HR" },
      { name: "State Medicaid + RHTP Enrollment", sla: "30–60 days", owner: "AVEL eCare payer liaison" },
      { name: "Final Approval & Go-Live", sla: "2 days", owner: "AVEL eCare MSO Lead" },
    ],
  },
];

export default function AvelWorkflows() {
  return (
    <>
      <AvelTopbar
        title="Credentialing Workflows"
        subtitle="Standardize and scale credentialing for every AVEL eCare service line. Each template defines stages, SLAs, and who owns each step."
      />

      <div className="avel-content">
        <div className="avel-workflow-grid">
          {TEMPLATES.map((t) => (
            <div key={t.name} className="avel-card avel-workflow-card">
              <div className="avel-workflow-head">
                <div className="avel-workflow-tag">{t.serviceLine}</div>
                <div className="avel-workflow-name">{t.name}</div>
                <div className="avel-workflow-desc">{t.description}</div>
              </div>

              <ol className="avel-workflow-stages">
                {t.stages.map((s, i) => (
                  <li key={i} className="avel-workflow-stage">
                    <span className="avel-workflow-stage-num">{i + 1}</span>
                    <div className="avel-workflow-stage-body">
                      <div className="avel-workflow-stage-name">{s.name}</div>
                      <div className="avel-workflow-stage-meta">
                        SLA <strong>{s.sla}</strong> · {s.owner}
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
