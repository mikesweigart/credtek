// Coverage matrix — the "what's billable where?" answer. Each provider
// gets a state × payer grid; cells render status with a clear color
// pattern and "GAP" labels for licensed-but-unenrolled combinations.

import Link from "next/link";
import { getCoverage } from "../../_lib/data/coverage";
import { getSessionContext } from "../../_lib/data/workspace";
import { CoverageBoard } from "./_components/CoverageBoard";

export const dynamic = "force-dynamic";

export default async function CoveragePage() {
  const [data, ctx] = await Promise.all([getCoverage(), getSessionContext()]);
  const { totals } = data;

  return (
    <div>
      <div className="portal-head">
        <h1 className="portal-h1">Coverage — what&apos;s billable where</h1>
        <p className="portal-sub">
          Every provider as a <strong>state × payer matrix</strong>. Green is billable today. Yellow is in flight. Red is a denial that needs an appeal. Empty <strong>GAP</strong> cells are states where the provider is licensed but not yet enrolled — that&apos;s the work queue.
        </p>
      </div>

      <div className="portal-kpis">
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Active billable lines</div>
          <div className="portal-kpi-val portal-kpi-pos">{totals.active}</div>
          <div className="portal-kpi-sub">across {totals.billableProviders} provider{totals.billableProviders === 1 ? "" : "s"}</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">In flight</div>
          <div className="portal-kpi-val">{totals.pending}</div>
          <div className="portal-kpi-sub">drafted · submitted · awaiting</div>
        </div>
        <div className={`portal-kpi${totals.denied ? " portal-kpi-flagcard" : ""}`}>
          <div className="portal-kpi-lbl">Denials</div>
          <div className={`portal-kpi-val ${totals.denied ? "portal-kpi-flag" : "portal-kpi-pos"}`}>{totals.denied}</div>
          <div className="portal-kpi-sub">needing appeal</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Gaps</div>
          <div className="portal-kpi-val portal-kpi-auto">⚡ {totals.gaps}</div>
          <div className="portal-kpi-sub">licensed, not yet billable</div>
        </div>
      </div>

      <div className="portal-card int-strategy-card">
        <h2 style={{ margin: 0, fontSize: 16 }}>
          Network footprint — {ctx.tenantName ?? "this workspace"}
        </h2>
        <p className="portal-muted" style={{ marginTop: 8, marginBottom: 0 }}>
          {totals.billableProviders} of {data.providers.length} provider{data.providers.length === 1 ? "" : "s"} are billable somewhere · across {totals.states} state{totals.states === 1 ? "" : "s"} and {totals.payers} payer{totals.payers === 1 ? "" : "s"}. Every cell below is a real enrollment row (or the absence of one). Click any provider name to open the file; click a non-empty cell to open the enrollment.
        </p>
      </div>

      {data.providers.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">◯</div>
          <h2>No providers yet</h2>
          <p>Add providers to build a coverage map. Sample data on the dashboard seeds five providers + realistic enrollments so you can see how the matrix renders.</p>
          <Link href="/app" className="acct-btn-primary" style={{ marginTop: 8 }}>
            Go to dashboard
          </Link>
        </div>
      ) : data.payers.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">⇄</div>
          <h2>No payers loaded yet</h2>
          <p>Once payers are loaded into your workspace (Medicare, UHC, Aetna, BCBS, Anthem and friends), this matrix lights up across every licensed state.</p>
          <Link href="/app/integrations" className="acct-btn-secondary" style={{ marginTop: 8 }}>
            View integrations
          </Link>
        </div>
      ) : (
        <CoverageBoard data={data} />
      )}
    </div>
  );
}
