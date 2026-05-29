// Provider credentialing workspace — the full lifecycle, live and
// persistent: stage stepper + advance/approve, and tabbed management of
// licenses, credentials, documents, and payer enrollments. Every form is
// a server action writing to Supabase, RLS-scoped to the tenant.

import Link from "next/link";
import { notFound } from "next/navigation";
import { getProviderById } from "../../../_lib/data/providers";
import {
  listLicenses, listCredentials, listDocuments, listEnrollments, listPayers,
  STAGE_ORDER, STAGE_LABEL, CREDENTIAL_KIND_LABEL, payerName,
  type Stage, type CredentialKind,
} from "../../../_lib/data/credentialing";
import {
  addLicense, addCredential, addDocument, addEnrollment,
  deleteSubRecord, advanceStage, approveProvider, deleteProvider,
} from "./actions";
import { ProviderTabs } from "./_components/ProviderTabs";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  active: "Active", enrolling: "Enrolling", supervision: "Supervision", flag: "Needs attention",
};
const EXP_OPTS = ["active", "pending", "expiring_soon", "expired"];
const ENR_OPTS = ["not_started", "drafted", "submitted", "awaiting_info", "active", "denied"];

function DeleteBtn({ table, id, providerId }: { table: string; id: string; providerId: string }) {
  return (
    <form action={deleteSubRecord} className="portal-del-form">
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="providerId" value={providerId} />
      <button type="submit" className="portal-del-btn" aria-label="Remove">✕</button>
    </form>
  );
}

export default async function ProviderWorkspace(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const p = await getProviderById(id);
  if (!p) return notFound();

  const [licenses, credentials, documents, enrollments, payers] = await Promise.all([
    listLicenses(id), listCredentials(id), listDocuments(id), listEnrollments(id), listPayers(),
  ]);

  const stage: Stage = (p.credentialing_stage as Stage) ?? "intake";
  const stageIdx = STAGE_ORDER.indexOf(stage);

  // ---------- Summary tab ----------
  const summary = (
    <div className="portal-card">
      <div className="portal-detail-grid">
        <div><dt>NPI</dt><dd>{p.npi ?? "—"}</dd></div>
        <div><dt>Specialty</dt><dd>{p.specialty ?? "—"}</dd></div>
        <div><dt>States</dt><dd>{p.license_states?.length ? p.license_states.join(" · ") : "—"}</dd></div>
        <div><dt>Status</dt><dd>{STATUS_LABEL[p.status] ?? p.status}</dd></div>
        <div><dt>Licenses on file</dt><dd>{licenses.length}</dd></div>
        <div><dt>Documents on file</dt><dd>{documents.length}</dd></div>
        <div><dt>Payer enrollments</dt><dd>{enrollments.length}</dd></div>
        <div><dt>Added</dt><dd>{new Date(p.created_at).toLocaleDateString()}</dd></div>
      </div>
    </div>
  );

  // ---------- Licenses tab ----------
  const licensesTab = (
    <div className="portal-card">
      <form action={addLicense} className="portal-inline-form">
        <input type="hidden" name="providerId" value={p.id} />
        <input name="state" placeholder="ST" maxLength={2} className="portal-input portal-input-sm" required />
        <input name="license_number" placeholder="License #" className="portal-input" />
        <select name="status" className="portal-input portal-input-sm" defaultValue="active">
          {EXP_OPTS.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
        </select>
        <input name="expires_on" type="date" className="portal-input portal-input-sm" aria-label="Expires" />
        <button type="submit" className="acct-btn-primary">Add license</button>
      </form>
      {licenses.length === 0 ? <p className="portal-muted">No licenses on file yet.</p> : (
        <ul className="portal-rows">
          {licenses.map((l) => (
            <li key={l.id} className="portal-row">
              <span className="portal-row-main">{l.state} · {l.license_number ?? "—"}</span>
              <span className={`portal-pill portal-pill-${l.status}`}>{l.status.replace("_", " ")}</span>
              <span className="portal-row-meta">{l.expires_on ? `exp ${l.expires_on}` : "—"}</span>
              <DeleteBtn table="provider_licenses" id={l.id} providerId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ---------- Credentials tab ----------
  const credentialsTab = (
    <div className="portal-card">
      <form action={addCredential} className="portal-inline-form">
        <input type="hidden" name="providerId" value={p.id} />
        <select name="kind" className="portal-input" defaultValue="dea">
          {(Object.keys(CREDENTIAL_KIND_LABEL) as CredentialKind[]).map((k) => (
            <option key={k} value={k}>{CREDENTIAL_KIND_LABEL[k]}</option>
          ))}
        </select>
        <input name="identifier" placeholder="Number / ID" className="portal-input" />
        <select name="status" className="portal-input portal-input-sm" defaultValue="active">
          {EXP_OPTS.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
        </select>
        <input name="expires_on" type="date" className="portal-input portal-input-sm" aria-label="Expires" />
        <button type="submit" className="acct-btn-primary">Add</button>
      </form>
      {credentials.length === 0 ? <p className="portal-muted">No credentials on file yet.</p> : (
        <ul className="portal-rows">
          {credentials.map((c) => (
            <li key={c.id} className="portal-row">
              <span className="portal-row-main">{CREDENTIAL_KIND_LABEL[c.kind] ?? c.kind}{c.identifier ? ` · ${c.identifier}` : ""}</span>
              <span className={`portal-pill portal-pill-${c.status}`}>{c.status.replace("_", " ")}</span>
              <span className="portal-row-meta">{c.expires_on ? `exp ${c.expires_on}` : "—"}</span>
              <DeleteBtn table="provider_credentials" id={c.id} providerId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ---------- Documents tab ----------
  const documentsTab = (
    <div className="portal-card">
      <form action={addDocument} className="portal-inline-form">
        <input type="hidden" name="providerId" value={p.id} />
        <input name="name" placeholder="Document name" className="portal-input" required />
        <input name="doc_type" placeholder="Type (CV, COI…)" className="portal-input portal-input-sm" />
        <input name="expires_on" type="date" className="portal-input portal-input-sm" aria-label="Expires" />
        <button type="submit" className="acct-btn-primary">Add document</button>
      </form>
      <p className="portal-help" style={{ marginBottom: 12 }}>
        Records the document and its metadata. File-upload storage attaches next.
      </p>
      {documents.length === 0 ? <p className="portal-muted">No documents recorded yet.</p> : (
        <ul className="portal-rows">
          {documents.map((d) => (
            <li key={d.id} className="portal-row">
              <span className="portal-row-main">📄 {d.name}</span>
              <span className="portal-row-meta">{d.doc_type}</span>
              <span className="portal-row-meta">{d.expires_on ? `exp ${d.expires_on}` : "—"}</span>
              <DeleteBtn table="documents" id={d.id} providerId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ---------- Enrollment tab ----------
  const enrollmentTab = (
    <div className="portal-card">
      <form action={addEnrollment} className="portal-inline-form">
        <input type="hidden" name="providerId" value={p.id} />
        <select name="payer_id" className="portal-input" required defaultValue="">
          <option value="" disabled>Select payer…</option>
          {payers.map((pa) => <option key={pa.id} value={pa.id}>{pa.name}</option>)}
        </select>
        <input name="state" placeholder="ST" maxLength={2} className="portal-input portal-input-sm" />
        <select name="status" className="portal-input portal-input-sm" defaultValue="submitted">
          {ENR_OPTS.map((o) => <option key={o} value={o}>{o.replace("_", " ")}</option>)}
        </select>
        <button type="submit" className="acct-btn-primary">Add enrollment</button>
      </form>
      {enrollments.length === 0 ? <p className="portal-muted">No payer enrollments yet.</p> : (
        <ul className="portal-rows">
          {enrollments.map((e) => (
            <li key={e.id} className="portal-row">
              <span className="portal-row-main">{payerName(e)}{e.state ? ` · ${e.state}` : ""}</span>
              <span className={`portal-pill portal-enr-${e.status}`}>{e.status.replace("_", " ")}</span>
              <span className="portal-row-meta">{e.effective_date ? `eff ${e.effective_date}` : e.submitted_on ? `sub ${e.submitted_on}` : "—"}</span>
              <DeleteBtn table="enrollments" id={e.id} providerId={p.id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div>
      <div className="portal-head">
        <Link href="/app/providers" className="portal-back">← Providers</Link>
        <div className="portal-head-row">
          <div>
            <h1 className="portal-h1">{p.name}{p.credential ? `, ${p.credential}` : ""}</h1>
            <p className="portal-sub">
              {p.specialty ?? "—"} ·{" "}
              <span className={`portal-status portal-status-${p.status}`}>{STATUS_LABEL[p.status] ?? p.status}</span>
            </p>
          </div>
          <div className="portal-head-actions">
            <Link href={`/app/providers/${p.id}/edit`} className="acct-btn-secondary">Edit</Link>
            <form action={deleteProvider}>
              <input type="hidden" name="providerId" value={p.id} />
              <button type="submit" className="portal-danger-btn">Delete</button>
            </form>
          </div>
        </div>
      </div>

      {/* Credentialing workflow stepper */}
      <div className="portal-card">
        <div className="portal-card-head">
          <h2>Credentialing workflow</h2>
          <div className="portal-workflow-actions">
            {stage !== "approved" && (
              <form action={advanceStage}>
                <input type="hidden" name="providerId" value={p.id} />
                <input type="hidden" name="current" value={stage} />
                <button type="submit" className="acct-btn-secondary">Advance stage →</button>
              </form>
            )}
            {stage !== "approved" && (
              <form action={approveProvider}>
                <input type="hidden" name="providerId" value={p.id} />
                <button type="submit" className="acct-btn-primary">✓ Final approval</button>
              </form>
            )}
            {stage === "approved" && <span className="portal-approved-badge">✓ Approved · ready to bill</span>}
          </div>
        </div>
        <ol className="portal-stepper">
          {STAGE_ORDER.map((st, i) => {
            const state = i < stageIdx ? "done" : i === stageIdx ? "current" : "todo";
            return (
              <li key={st} className={`portal-step portal-step-${state}`}>
                <span className="portal-step-dot">{state === "done" ? "✓" : i + 1}</span>
                <span className="portal-step-label">{STAGE_LABEL[st]}</span>
              </li>
            );
          })}
        </ol>
      </div>

      <ProviderTabs
        counts={{ licenses: licenses.length, credentials: credentials.length, documents: documents.length, enrollment: enrollments.length }}
        summary={summary}
        licenses={licensesTab}
        credentials={credentialsTab}
        documents={documentsTab}
        enrollment={enrollmentTab}
      />
    </div>
  );
}
