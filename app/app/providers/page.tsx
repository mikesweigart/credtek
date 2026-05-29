// Real providers list — the tenant's own clinicians from Supabase.

import Link from "next/link";
import { listProviders } from "../../_lib/data/providers";
import { getSessionContext, canEdit } from "../../_lib/data/workspace";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  enrolling: "Enrolling",
  supervision: "Supervision",
  flag: "Needs attention",
};

export default async function PortalProviders() {
  const [providers, ctx] = await Promise.all([listProviders(), getSessionContext()]);
  const editor = canEdit(ctx.role);

  return (
    <div>
      <div className="portal-head portal-head-row">
        <div>
          <h1 className="portal-h1">Providers</h1>
          <p className="portal-sub">{providers.length} clinician{providers.length === 1 ? "" : "s"} in your workspace</p>
        </div>
        {editor && (
          <div className="portal-head-actions">
            <Link href="/app/providers/import" className="acct-btn-secondary">⤓ Bulk import</Link>
            <Link href="/app/providers/new" className="acct-btn-primary">+ Add provider</Link>
          </div>
        )}
      </div>

      {providers.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">◯</div>
          <h2>No providers yet</h2>
          <p>{editor ? "Add your first clinician to start tracking credentialing." : "No providers have been added to this workspace yet."}</p>
          {editor && (
            <Link href="/app/providers/new" className="acct-btn-primary" style={{ display: "inline-flex", marginTop: 8 }}>
              + Add a provider
            </Link>
          )}
        </div>
      ) : (
        <div className="portal-card portal-card-flush">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Provider</th>
                <th>Credential</th>
                <th>Specialty</th>
                <th>States</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/app/providers/${p.id}`} className="portal-table-name">
                      {p.name}
                    </Link>
                  </td>
                  <td>{p.credential ?? "—"}</td>
                  <td>{p.specialty ?? "—"}</td>
                  <td>{p.license_states?.length ? p.license_states.join(" · ") : "—"}</td>
                  <td>
                    <span className={`portal-status portal-status-${p.status}`}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
