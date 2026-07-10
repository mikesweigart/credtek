"use client";

// Re-credentialing forecast — the 3-year cycle, planned. Two intel
// layers: (1) a quarterly capacity forecast so the MSO can staff the
// re-cred workload, and (2) a due-sorted worklist with one-click
// actions. Distinct from Expirables (single-document renewals) — this
// is the full committee re-approval event.

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  RECREDS,
  RECRED_STATUS_LABEL,
  QUARTER_ORDER,
  quarterOf,
  recredsByDue,
  countByStatus,
  countInQuarter,
  type RecredStatus,
} from "../_data/recredentialing";
import { getProvider } from "../_data/seed";

const STATUS_CLASS: Record<RecredStatus, string> = {
  overdue: "rc-status-overdue",
  committee: "rc-status-committee",
  in_progress: "rc-status-progress",
  due_soon: "rc-status-due",
  on_schedule: "rc-status-ok",
};

function monthsLabel(m: number): string {
  if (m < 0) return `${Math.abs(m)} mo overdue`;
  if (m === 0) return "Due now";
  return `${m} mo`;
}

export function AvelRecred() {
  const [status, setStatus] = useState<"" | RecredStatus>("");
  const [queued, setQueued] = useState<Set<string>>(new Set());

  const rows = useMemo(
    () => recredsByDue().filter((r) => !status || r.status === status),
    [status]
  );

  const peakQuarter = useMemo(() => {
    let best = QUARTER_ORDER[0];
    let max = -1;
    for (const q of QUARTER_ORDER) {
      const n = countInQuarter(q);
      if (n > max) { max = n; best = q; }
    }
    return { quarter: best, count: max };
  }, []);

  return (
    <div className="avel-content">
      {/* KPI tiles (clickable filters) */}
      <div className="avel-kpis avel-kpis-4">
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${status === "overdue" ? " is-active" : ""}`}
          onClick={() => setStatus(status === "overdue" ? "" : "overdue")}
        >
          <div className="avel-kpi-lbl">Overdue</div>
          <div className="avel-kpi-val avel-kpi-val-warn">{countByStatus("overdue")}</div>
          <div className="avel-kpi-delta">Re-cred past due</div>
        </button>
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${status === "due_soon" ? " is-active" : ""}`}
          onClick={() => setStatus(status === "due_soon" ? "" : "due_soon")}
        >
          <div className="avel-kpi-lbl">Due this quarter</div>
          <div className="avel-kpi-val">{countByStatus("due_soon") + countByStatus("committee") + countByStatus("in_progress")}</div>
          <div className="avel-kpi-delta">Start now</div>
        </button>
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${status === "in_progress" ? " is-active" : ""}`}
          onClick={() => setStatus(status === "in_progress" ? "" : "in_progress")}
        >
          <div className="avel-kpi-lbl">In progress</div>
          <div className="avel-kpi-val avel-kpi-val-pos">{countByStatus("in_progress") + countByStatus("committee")}</div>
          <div className="avel-kpi-delta">Re-verification underway</div>
        </button>
        <div className="avel-kpi">
          <div className="avel-kpi-lbl">Peak quarter</div>
          <div className="avel-kpi-val">{peakQuarter.count}</div>
          <div className="avel-kpi-delta">{peakQuarter.quarter} · plan capacity</div>
        </div>
      </div>

      {/* Quarterly forecast — capacity planning */}
      <div className="avel-card">
        <div className="avel-card-head">
          <div>
            <div className="avel-card-title">Re-credentialing forecast</div>
            <div className="avel-card-sub">
              How many full re-credentialing cycles land each quarter — staff the workload before it hits.
            </div>
          </div>
        </div>
        <div className="rc-forecast">
          {QUARTER_ORDER.map((q) => {
            const n = countInQuarter(q);
            const pct = peakQuarter.count > 0 ? (n / peakQuarter.count) * 100 : 0;
            return (
              <div key={q} className="rc-fc-col">
                <div className="rc-fc-bar-wrap">
                  <div className="rc-fc-bar" style={{ height: `${Math.max(pct, 6)}%` }}>
                    <span className="rc-fc-count">{n}</span>
                  </div>
                </div>
                <div className="rc-fc-label">{q}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worklist */}
      <div className="avel-card avel-card-flush">
        <table className="avel-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Last credentialed</th>
              <th>Re-cred due</th>
              <th>Countdown</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const p = getProvider(r.providerSlug);
              const done = queued.has(r.providerSlug);
              const overdue = r.monthsUntil < 0;
              return (
                <tr key={r.providerSlug} className="avel-table-row">
                  <td>
                    <Link href={`/eastside-hospital/providers/${r.providerSlug}`} className="avel-table-name avel-table-name-a">
                      {p?.name ?? r.providerSlug}{p ? `, ${p.credentials}` : ""}
                    </Link>
                  </td>
                  <td className="avel-table-cell-soft">{r.lastCredentialed}</td>
                  <td className="avel-table-cell-soft">{r.dueDate}</td>
                  <td>
                    <span className={`rc-count ${overdue ? "rc-count-over" : r.monthsUntil <= 3 ? "rc-count-soon" : "rc-count-ok"}`}>
                      {monthsLabel(r.monthsUntil)}
                    </span>
                  </td>
                  <td>
                    <span className={`rc-status ${STATUS_CLASS[r.status]}`}>
                      {RECRED_STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td>
                    {done ? (
                      <span className="fu-queued">✓ Started</span>
                    ) : (
                      <button
                        type="button"
                        className="fu-btn"
                        onClick={() => setQueued((prev) => new Set(prev).add(r.providerSlug))}
                      >
                        {r.status === "committee" ? "Send to committee" : "Start re-credentialing"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="avel-empty">
            <div className="avel-empty-icon">✓</div>
            <div className="avel-empty-title">Nothing in this view</div>
          </div>
        )}
      </div>

      <div className="avel-table-foot">
        Showing <strong>{rows.length}</strong> of {RECREDS.length} re-credentialing cycles
        &nbsp;·&nbsp;
        <Link className="avel-link" href="/eastside-hospital">Back to Dashboard</Link>
      </div>
    </div>
  );
}
