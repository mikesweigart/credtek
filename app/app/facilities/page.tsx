// Real facilities list — the tenant's own facilities from Supabase.
// A facility is credentialed in its own right (licensure, accreditation,
// CLIA, CMS-855A, payer facility contracts), parallel to providers.

import Link from "next/link";
import {
  listFacilities,
  countFacilities,
  FACILITY_TYPE_LABEL,
  FACILITY_STATUS_LABEL,
} from "../../_lib/data/facilities";
import { getSessionContext, canEdit } from "../../_lib/data/workspace";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function PortalFacilities(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await props.searchParams;
  const requestedPage = Math.max(1, Number.parseInt(pageParam ?? "1", 10) || 1);

  const total = await countFacilities();
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);
  const offset = (page - 1) * PAGE_SIZE;

  const [facilities, ctx] = await Promise.all([
    listFacilities({ limit: PAGE_SIZE, offset }),
    getSessionContext(),
  ]);
  const editor = canEdit(ctx.role);

  const showingFrom = total === 0 ? 0 : offset + 1;
  const showingTo = Math.min(offset + facilities.length, total);

  return (
    <div>
      <div className="portal-head portal-head-row">
        <div>
          <h1 className="portal-h1">Facilities</h1>
          <p className="portal-sub">
            {total} facilit{total === 1 ? "y" : "ies"} in your workspace
          </p>
        </div>
        {editor && (
          <div className="portal-head-actions">
            <Link href="/app/facilities/new" className="acct-btn-primary">+ Add facility</Link>
          </div>
        )}
      </div>

      {facilities.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">▢</div>
          <h2>No facilities yet</h2>
          <p>
            {editor
              ? "Add your first facility to start tracking its licensure, accreditation, and payer contracts."
              : "No facilities have been added to this workspace yet."}
          </p>
          {editor && (
            <Link
              href="/app/facilities/new"
              className="acct-btn-primary"
              style={{ display: "inline-flex", marginTop: 8 }}
            >
              + Add a facility
            </Link>
          )}
        </div>
      ) : (
        <div className="portal-card portal-card-flush">
          <table className="portal-table">
            <thead>
              <tr>
                <th>Facility</th>
                <th>Type</th>
                <th>State</th>
                <th>Locations</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f.id}>
                  <td>
                    <Link href={`/app/facilities/${f.id}`} className="portal-table-name">
                      {f.name}
                    </Link>
                  </td>
                  <td>{FACILITY_TYPE_LABEL[f.facility_type] ?? f.facility_type}</td>
                  <td>{f.primary_state ?? "—"}</td>
                  <td>{f.locations ?? 1}</td>
                  <td>
                    <span className={`portal-status portal-status-${f.status}`}>
                      {FACILITY_STATUS_LABEL[f.status] ?? f.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="portal-pager" aria-label="Facilities pagination">
          <span className="portal-pager-info">
            Showing {showingFrom}–{showingTo} of {total}
          </span>
          <div className="portal-pager-actions">
            {page > 1 ? (
              <Link href={`/app/facilities?page=${page - 1}`} className="acct-btn-secondary" rel="prev">
                ← Prev
              </Link>
            ) : (
              <span className="acct-btn-secondary is-disabled" aria-disabled="true">← Prev</span>
            )}
            <span className="portal-pager-page">Page {page} of {totalPages}</span>
            {page < totalPages ? (
              <Link href={`/app/facilities?page=${page + 1}`} className="acct-btn-secondary" rel="next">
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
