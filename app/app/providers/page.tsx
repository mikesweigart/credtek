// Real providers list — the tenant's own clinicians from Supabase.

import Link from "next/link";
import { listProviders, countProviders } from "../../_lib/data/providers";
import { getSessionContext, canEdit } from "../../_lib/data/workspace";

export const dynamic = "force-dynamic";

// Page the table so a tenant with hundreds of providers doesn't ship one
// giant <table> to the browser. countProviders() gives the true total for
// the header + pager without pulling every row.
const PAGE_SIZE = 50;

const STATUS_LABEL: Record<string, string> = {
  active: "Active",
  enrolling: "Enrolling",
  supervision: "Supervision",
  flag: "Needs attention",
};

export default async function PortalProviders(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await props.searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const total = await countProviders();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * PAGE_SIZE;

  const [providers, ctx] = await Promise.all([
    listProviders({ limit: PAGE_SIZE, offset }),
    getSessionContext(),
  ]);
  const editor = canEdit(ctx.role);

  const showingFrom = total === 0 ? 0 : offset + 1;
  const showingTo = Math.min(offset + providers.length, total);

  return (
    <div>
      <div className="portal-head portal-head-row">
        <div>
          <h1 className="portal-h1">Providers</h1>
          <p className="portal-sub">{total} clinician{total === 1 ? "" : "s"} in your workspace</p>
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

      {totalPages > 1 && (
        <nav className="portal-pager" aria-label="Providers pagination">
          <span className="portal-pager-info">
            Showing {showingFrom}–{showingTo} of {total}
          </span>
          <div className="portal-pager-actions">
            {page > 1 ? (
              <Link href={`/app/providers?page=${page - 1}`} className="acct-btn-secondary" rel="prev">
                ← Prev
              </Link>
            ) : (
              <span className="acct-btn-secondary is-disabled" aria-disabled="true">← Prev</span>
            )}
            <span className="portal-pager-page">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link href={`/app/providers?page=${page + 1}`} className="acct-btn-secondary" rel="next">
                Next →
              </Link>
            ) : (
              <span className="acct-btn-secondary is-disabled" aria-disabled="true">Next →</span>
            )}
          </div>
        </nav>
      )}
    </div>
  );
}
