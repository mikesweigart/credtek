// Operations Queue list view — every Tier 4 ticket awaiting specialist
// work. Sortable/filterable in production; today the URL drives status +
// pool filters. Click any row to drill into the detail view.

import Link from "next/link";
import {
  OPS_FILTERS,
  OPS_TICKETS,
  POOL_LABELS,
  STATUS_LABELS,
  TASK_TEMPLATE_LABELS,
  type OpsPool,
  type OpsStatus,
  type OpsTicket,
} from "../../_lib/mockOpsQueue";

export const metadata = {
  title: "Ops queue · CredTek",
};

type PageProps = {
  searchParams: Promise<{ status?: string; pool?: string }>;
};

export default async function OpsQueuePage({ searchParams }: PageProps) {
  const { status, pool } = await searchParams;
  const activeStatus = (status ?? "all") as OpsStatus | "all";
  const activePool = (pool ?? "all") as OpsPool | "all";

  const visible = OPS_TICKETS.filter((t) => {
    if (activeStatus !== "all" && t.status !== activeStatus) return false;
    if (activePool !== "all" && t.pool !== activePool) return false;
    return true;
  });

  // Sort: red SLA first, then amber, then green; within each, lower priority number first
  const sorted = [...visible].sort((a, b) => {
    const toneOrder = { red: 0, amber: 1, green: 2 };
    const tDiff = toneOrder[a.slaTone] - toneOrder[b.slaTone];
    if (tDiff !== 0) return tDiff;
    return a.priority - b.priority;
  });

  // KPI counts (across the full set, not filtered — gives ops manager
  // the overall picture even when filtering)
  const total = OPS_TICKETS.length;
  const unassigned = OPS_TICKETS.filter((t) => t.status === "unassigned").length;
  const overdue = OPS_TICKETS.filter((t) => t.slaTone === "red").length;
  const due24h = OPS_TICKETS.filter(
    (t) => t.slaTone === "amber" || t.slaTone === "red",
  ).length;

  return (
    <>
      <section className="ops-greet">
        <div>
          <span className="ops-eyebrow">Operations Queue · Tier 4 work</span>
          <h1>Queue</h1>
          <p>
            Manual work that can&apos;t (or shouldn&apos;t) be automated:
            email-based state board verifications, payer escalation calls,
            notarized documents, complex Medicaid MCO enrollments. Every
            ticket links back to the customer-facing IntegrationJob it
            fulfills.
          </p>
        </div>
      </section>

      <section className="ops-kpis">
        <div className="ops-kpi">
          <div className="ops-kpi-label">Open tickets</div>
          <div className="ops-kpi-val">{total}</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Unassigned</div>
          <div className={unassigned > 0 ? "ops-kpi-val warn" : "ops-kpi-val"}>
            {unassigned}
          </div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Overdue SLA</div>
          <div className={overdue > 0 ? "ops-kpi-val danger" : "ops-kpi-val"}>
            {overdue}
          </div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Due &lt; 24h</div>
          <div className={due24h > 0 ? "ops-kpi-val warn" : "ops-kpi-val"}>
            {due24h}
          </div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Avg cycle (last 30d)</div>
          <div className="ops-kpi-val">3.2d</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">SLA hit rate</div>
          <div className="ops-kpi-val">94%</div>
        </div>
      </section>

      <section className="ops-filters">
        <div className="ops-filter-group">
          <span className="ops-filter-label">Status</span>
          {OPS_FILTERS.status.map((f) => {
            const className =
              activeStatus === f.id
                ? "ops-filter-chip active"
                : "ops-filter-chip";
            const href =
              f.id === "all"
                ? activePool === "all"
                  ? "/ops/queue"
                  : `/ops/queue?pool=${activePool}`
                : activePool === "all"
                  ? `/ops/queue?status=${f.id}`
                  : `/ops/queue?status=${f.id}&pool=${activePool}`;
            return (
              <Link key={f.id} href={href} className={className}>
                {f.label}
              </Link>
            );
          })}
        </div>
        <div className="ops-filter-group">
          <span className="ops-filter-label">Pool</span>
          {OPS_FILTERS.pool.map((f) => {
            const className =
              activePool === f.id
                ? "ops-filter-chip active"
                : "ops-filter-chip";
            const href =
              f.id === "all"
                ? activeStatus === "all"
                  ? "/ops/queue"
                  : `/ops/queue?status=${activeStatus}`
                : activeStatus === "all"
                  ? `/ops/queue?pool=${f.id}`
                  : `/ops/queue?status=${activeStatus}&pool=${f.id}`;
            return (
              <Link key={f.id} href={href} className={className}>
                {f.label}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="ops-table-wrap">
        <table className="ops-table">
          <thead>
            <tr>
              <th>Ticket / provider</th>
              <th>Task</th>
              <th>Customer</th>
              <th>Pool</th>
              <th>Owner</th>
              <th>SLA</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="ops-table-empty">
                  No tickets match the current filter.
                </td>
              </tr>
            ) : (
              sorted.map((t) => <OpsRow key={t.id} t={t} />)
            )}
          </tbody>
        </table>
      </section>

      <div className="ops-foot">
        <strong>Specs note:</strong> in production, this list is driven by{" "}
        <code>operations_queue</code> joined to{" "}
        <code>integration_jobs</code> (per IAL spec §6). Status changes
        write through <code>transition_job()</code> so the customer-facing
        UI updates in lockstep.
      </div>
    </>
  );
}

function OpsRow({ t }: { t: OpsTicket }) {
  const slaToneClass =
    t.slaTone === "red"
      ? "ops-sla danger"
      : t.slaTone === "amber"
        ? "ops-sla warn"
        : "ops-sla";
  const statusClass = `ops-status status-${t.status}`;
  const priorityLabel = t.priority === 1 ? "P1" : t.priority === 2 ? "P2" : "P3";
  return (
    <tr className="ops-row">
      <td>
        <Link href={`/ops/queue/${t.id}`} className="ops-row-title">
          {t.taskTitle}
        </Link>
        <div className="ops-row-meta">
          <span className={`ops-priority p${t.priority}`}>{priorityLabel}</span>{" "}
          <span>{t.providerName}</span> ·{" "}
          <span className="ops-row-context">{t.providerContext}</span>
        </div>
      </td>
      <td>{TASK_TEMPLATE_LABELS[t.taskTemplate]}</td>
      <td>
        <span className="ops-customer">{t.customerOrg}</span>
        <div className="ops-row-meta">{t.createdAt}</div>
      </td>
      <td>{POOL_LABELS[t.pool]}</td>
      <td>
        {t.assignedTo ?? <em className="ops-unassigned">Unassigned</em>}
      </td>
      <td>
        <span className={slaToneClass}>{t.slaDue}</span>
      </td>
      <td>
        <span className={statusClass}>{STATUS_LABELS[t.status]}</span>
      </td>
    </tr>
  );
}
