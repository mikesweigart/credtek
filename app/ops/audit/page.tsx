// Audit log viewer — every PHI access, every state transition, every
// auth decision, every external system call. Each row hashed with the
// previous row's hash forming a tamper-evident chain (per IAL §9).
//
// Mocked here with deterministic-looking SHA-256 prefixes so the chain
// reads convincingly during a demo.

import Link from "next/link";

export const metadata = {
  title: "Audit log · Ops",
};

type AuditEntry = {
  id: string;
  ts: string;
  actor: string;
  actorType: "specialist" | "user" | "system" | "agent";
  action: string;
  resourceType: string;
  resourceId: string;
  detail: string;
  hashPrefix: string;
  prevHashPrefix: string | null;
};

// Generated to mimic a 24-hour window of activity for one customer org.
// Hash prefixes are hand-crafted to look realistic while staying stable.
const AUDIT_LOG: AuditEntry[] = [
  { id: "01HZX9A1", ts: "Apr 28 · 02:18:42 PM", actor: "System", actorType: "system", action: "transition", resourceType: "integration_job", resourceId: "job_01HZX7M8FRQ2Y6XN", detail: "submitted → in_progress (Anthem BH escalation auto-routed)", hashPrefix: "9f3c2e", prevHashPrefix: "8a1d44" },
  { id: "01HZX9A2", ts: "Apr 28 · 02:14:08 PM", actor: "System", actorType: "system", action: "create", resourceType: "operations_queue_ticket", resourceId: "01HZX7P5RDCFV6ZH", detail: "SLA monitor escalated stalled Anthem BH submission (47d in submitted)", hashPrefix: "8a1d44", prevHashPrefix: "5b9e07" },
  { id: "01HZX9A3", ts: "Apr 28 · 11:42:11 AM", actor: "Patricia Yang (CVO)", actorType: "specialist", action: "edit", resourceType: "operations_queue_ticket", resourceId: "01HZX7K3VNCP9TQA", detail: "Marked sub_task complete: 'Send verification request to CA BBS'", hashPrefix: "5b9e07", prevHashPrefix: "3c8f12" },
  { id: "01HZX9A4", ts: "Apr 28 · 11:08:33 AM", actor: "Patricia Yang (CVO)", actorType: "specialist", action: "create", resourceType: "audit_artifact", resourceId: "ca-bbs-verify-request-2026-04-25.eml", detail: "Uploaded artifact (4.7 KB) to ticket 01HZX7K3VNCP9TQA", hashPrefix: "3c8f12", prevHashPrefix: "7a4b91" },
  { id: "01HZX9A5", ts: "Apr 28 · 09:14:02 AM", actor: "agent_psv_state_board", actorType: "agent", action: "external_call", resourceType: "state_board", resourceId: "tx_lpc_board", detail: "Verified TX LPC license for A. Patel · returned status: active · confidence 0.994", hashPrefix: "7a4b91", prevHashPrefix: "1f6c83" },
  { id: "01HZX9A6", ts: "Apr 28 · 09:13:47 AM", actor: "agent_psv_state_board", actorType: "agent", action: "view", resourceType: "provider", resourceId: "aisha-patel", detail: "Read provider.licenseStates, provider.npi for PSV", hashPrefix: "1f6c83", prevHashPrefix: "4d2a59" },
  { id: "01HZX9A7", ts: "Apr 28 · 08:42:01 AM", actor: "Marisol Diaz", actorType: "user", action: "auth", resourceType: "session", resourceId: "sess_01HZX98...", detail: "Login successful · MFA challenge passed · IP 73.181.14.221", hashPrefix: "4d2a59", prevHashPrefix: "9b8e22" },
  { id: "01HZX9A8", ts: "Apr 28 · 08:14:18 AM", actor: "Aisha Patel", actorType: "user", action: "create", resourceType: "provider", resourceId: "aisha-patel", detail: "Provider self-completed /intake/[token] flow · 5/5 steps · auto-CAQH consent: yes", hashPrefix: "9b8e22", prevHashPrefix: "2e7f04" },
  { id: "01HZX9A9", ts: "Apr 28 · 08:14:18 AM", actor: "Aisha Patel", actorType: "user", action: "auth", resourceType: "intake_token", resourceId: "demo-aisha", detail: "Intake token validated · single-use · IP 99.34.121.57", hashPrefix: "2e7f04", prevHashPrefix: "6c1a87" },
  { id: "01HZX9AA", ts: "Apr 28 · 08:14:02 AM", actor: "Aisha Patel", actorType: "user", action: "edit", resourceType: "provider", resourceId: "aisha-patel", detail: "Set credential, license_number, supervision_supervisor_id (3 fields)", hashPrefix: "6c1a87", prevHashPrefix: "8d4f31" },
  { id: "01HZX9AB", ts: "Apr 28 · 08:13:59 AM", actor: "agent_intake_extract", actorType: "agent", action: "external_call", resourceType: "anthropic_claude", resourceId: "vision_v4", detail: "OCR + structured extraction of TX LPC license PNG (1.2 MB)", hashPrefix: "8d4f31", prevHashPrefix: "f3a960" },
  { id: "01HZX9AC", ts: "Apr 27 · 09:14:37 AM", actor: "Avery Chen", actorType: "specialist", action: "transition", resourceType: "integration_job", resourceId: "job_01HZX7T7CG8ZR2NW", detail: "in_progress → completed (Optum credentialing committee scheduled May 7)", hashPrefix: "f3a960", prevHashPrefix: "5e2c14" },
  { id: "01HZX9AD", ts: "Apr 27 · 09:14:37 AM", actor: "Avery Chen", actorType: "specialist", action: "edit", resourceType: "operations_queue_ticket", resourceId: "01HZX7T8FVQ4DJK2", detail: "Set result = { committee_date: '2026-05-07', reference: 'OPT-2026-04-CR-92831' }", hashPrefix: "5e2c14", prevHashPrefix: "1a7d28" },
  { id: "01HZX9AE", ts: "Apr 27 · 06:00:00 AM", actor: "agent_oig_screen", actorType: "agent", action: "external_call", resourceType: "oig_leie", resourceId: "monthly_2026_04", detail: "Bulk screened 214 providers · 0 hits", hashPrefix: "1a7d28", prevHashPrefix: "3b9c51" },
  { id: "01HZX9AF", ts: "Apr 27 · 06:00:00 AM", actor: "agent_sam_screen", actorType: "agent", action: "external_call", resourceType: "sam_gov", resourceId: "monthly_2026_04", detail: "Bulk screened 214 providers · 0 hits", hashPrefix: "3b9c51", prevHashPrefix: "8f6a09" },
  { id: "01HZX9AG", ts: "Apr 27 · 02:38:14 AM", actor: "System", actorType: "system", action: "create", resourceType: "operations_queue_ticket", resourceId: "01HZX7U3HJ7BVKR2", detail: "Auto-created reference outreach ticket (Tier 4) for J. Williams from intake completion", hashPrefix: "8f6a09", prevHashPrefix: "4e2d76" },
  { id: "01HZX9AH", ts: "Apr 26 · 11:42:38 AM", actor: "Aisha Patel", actorType: "user", action: "create", resourceType: "supervision_log", resourceId: "log_2026-04-26_aisha", detail: "Logged 24 hrs (16 direct, 6 group, 2 admin) · supervisor cosigned 11:42 AM", hashPrefix: "4e2d76", prevHashPrefix: "7c3b81" },
  { id: "01HZX9AI", ts: "Apr 26 · 11:42:38 AM", actor: "Dr. Sarah Reyes", actorType: "user", action: "edit", resourceType: "supervision_log", resourceId: "log_2026-04-26_aisha", detail: "Cosigned supervision log · IP 73.181.14.221", hashPrefix: "7c3b81", prevHashPrefix: "2a9d44" },
  { id: "01HZX9AJ", ts: "Apr 25 · 04:13:09 PM", actor: "Marisol Diaz", actorType: "user", action: "approve", resourceType: "integration_job", resourceId: "job_01HZX7P0FZ5R8YT2", detail: "Approved Magellan enrollment draft for R. Bennett · queued for submission", hashPrefix: "2a9d44", prevHashPrefix: "6f1e08" },
  { id: "01HZX9AK", ts: "Apr 25 · 09:43:21 AM", actor: "Rachel Bennett", actorType: "user", action: "external_call", resourceType: "notarycam", resourceId: "notary_appt_2026-04-30", detail: "Booked notary appointment Apr 30 11:00 AM via NotaryCam OAuth", hashPrefix: "6f1e08", prevHashPrefix: "4b7c52" },
];

export default function OpsAuditPage() {
  return (
    <>
      <div className="ops-back">
        <Link href="/ops/queue">← Queue</Link>
      </div>

      <header className="ops-greet">
        <span className="ops-eyebrow">IAL §9 · Tamper-evident audit log</span>
        <h1>Audit log</h1>
        <p>
          Every PHI access, every state transition, every external system
          call, every auth decision. Each row's <code>log_hash</code> is{" "}
          <code>SHA-256(prev_log_hash || canonical_json(this_row))</code>,
          forming a tamper-evident chain. Tampering with any historical
          row breaks every subsequent hash, detectable in O(n).
        </p>
      </header>

      <div className="ops-kpis" style={{ marginBottom: 16 }}>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Entries (24h)</div>
          <div className="ops-kpi-val">1,847</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Hash chain</div>
          <div className="ops-kpi-val" style={{ color: "#4F6B58" }}>✓ Intact</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">PHI reads</div>
          <div className="ops-kpi-val">412</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">PHI writes</div>
          <div className="ops-kpi-val">183</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">External calls</div>
          <div className="ops-kpi-val">274</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Failed auth</div>
          <div className="ops-kpi-val" style={{ color: "#4F6B58" }}>0</div>
        </div>
      </div>

      <div className="ops-table-wrap">
        <table className="ops-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Detail</th>
              <th>Hash chain</th>
            </tr>
          </thead>
          <tbody>
            {AUDIT_LOG.map((e) => (
              <tr key={e.id} className="ops-row audit-row">
                <td className="audit-ts">{e.ts}</td>
                <td>
                  <span className={`audit-actor actor-${e.actorType}`}>
                    {e.actor}
                  </span>
                  <div className="ops-row-meta">{e.actorType}</div>
                </td>
                <td>
                  <span className={`audit-action action-${e.action}`}>
                    {e.action}
                  </span>
                </td>
                <td>
                  <div className="audit-resource-type">{e.resourceType}</div>
                  <div className="ops-row-meta audit-resource-id">{e.resourceId}</div>
                </td>
                <td className="audit-detail">{e.detail}</td>
                <td>
                  <div className="audit-hash">
                    <span className="audit-hash-label">prev</span>{" "}
                    <code>{e.prevHashPrefix ?? "(genesis)"}…</code>
                  </div>
                  <div className="audit-hash">
                    <span className="audit-hash-label">this</span>{" "}
                    <code className="audit-hash-this">{e.hashPrefix}…</code>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ops-foot">
        <strong>How to verify the chain:</strong> recompute{" "}
        <code>SHA-256(prev_log_hash || canonical_json(row))</code> for each
        row and compare against <code>log_hash</code>. Mismatches surface
        the exact row that was tampered with. Production: nightly background
        job verifies the entire chain and pages on-call if a break is
        detected.
      </div>
    </>
  );
}
