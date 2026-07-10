"use client";

// Expirables command center — urgency-first. The whole point is "what
// needs action soonest" so the default view is one list sorted by
// days-until, each row badged with its window + a renewal state. Filter
// by window, kind, and auto-renew. Every row drills to the provider.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  EXPIRABLES,
  WINDOW_META,
  windowOf,
  expirablesSorted,
  countInWindow,
  autoRenewCount,
  type ExpWindow,
  type ExpirableKind,
} from "../_data/expirables";
import { getProvider } from "../_data/seed";

const KINDS: ExpirableKind[] = [
  "State License",
  "DEA Registration",
  "CDS Registration",
  "Board Certification",
  "Malpractice (COI)",
  "CAQH Attestation",
];

export function AvelExpirables() {
  const router = useRouter();
  const [win, setWin] = useState<"" | ExpWindow>("");
  const [kind, setKind] = useState<"" | ExpirableKind>("");
  const [autoOnly, setAutoOnly] = useState(false);

  const rows = useMemo(() => {
    return expirablesSorted().filter((e) => {
      if (win && windowOf(e.daysUntil) !== win) return false;
      if (kind && e.kind !== kind) return false;
      if (autoOnly && !e.autoRenew) return false;
      return true;
    });
  }, [win, kind, autoOnly]);

  const hasFilter = Boolean(win || kind || autoOnly);

  return (
    <div className="avel-content">
      {/* KPI row — windows + auto-renew coverage */}
      <div className="avel-kpis avel-kpis-4">
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${win === "0-30" ? " is-active" : ""}`}
          onClick={() => setWin(win === "0-30" ? "" : "0-30")}
        >
          <div className="avel-kpi-lbl">Next 30 days</div>
          <div className="avel-kpi-val avel-kpi-val-warn">{countInWindow("0-30")}</div>
          <div className="avel-kpi-delta">Act now</div>
        </button>
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${win === "31-60" ? " is-active" : ""}`}
          onClick={() => setWin(win === "31-60" ? "" : "31-60")}
        >
          <div className="avel-kpi-lbl">31–60 days</div>
          <div className="avel-kpi-val">{countInWindow("31-60")}</div>
          <div className="avel-kpi-delta">Queue renewals</div>
        </button>
        <button
          type="button"
          className={`avel-kpi avel-kpi-btn${win === "61-90" ? " is-active" : ""}`}
          onClick={() => setWin(win === "61-90" ? "" : "61-90")}
        >
          <div className="avel-kpi-lbl">61–90 days</div>
          <div className="avel-kpi-val">{countInWindow("61-90")}</div>
          <div className="avel-kpi-delta">On the radar</div>
        </button>
        <div className="avel-kpi">
          <div className="avel-kpi-lbl">Auto-renewal coverage</div>
          <div className="avel-kpi-val avel-kpi-val-pos">
            {Math.round((autoRenewCount() / EXPIRABLES.length) * 100)}%
          </div>
          <div className="avel-kpi-delta">{autoRenewCount()} of {EXPIRABLES.length} auto-drafted</div>
        </div>
      </div>

      {/* Filters */}
      <div className="avel-toolbar">
        <div className="avel-toolbar-filters">
          <select className="avel-select" value={win} onChange={(e) => setWin(e.target.value as "" | ExpWindow)}>
            <option value="">All windows</option>
            <option value="0-30">Next 30 days</option>
            <option value="31-60">31–60 days</option>
            <option value="61-90">61–90 days</option>
            <option value="91-180">91–180 days</option>
          </select>
          <select className="avel-select" value={kind} onChange={(e) => setKind(e.target.value as "" | ExpirableKind)}>
            <option value="">All credential types</option>
            {KINDS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <button
            type="button"
            className={`avel-chip${autoOnly ? " avel-chip-active" : ""}`}
            onClick={() => setAutoOnly((v) => !v)}
            style={{ minHeight: 38 }}
          >
            {autoOnly ? "✓ " : ""}Auto-renew drafted
          </button>
          {hasFilter && (
            <button type="button" className="avel-btn-ghost avel-clear" onClick={() => { setWin(""); setKind(""); setAutoOnly(false); }}>
              Clear ✕
            </button>
          )}
        </div>
        <div className="avel-toolbar-actions">
          <button type="button" className="avel-btn-ghost">Export CSV</button>
          <button type="button" className="avel-btn-primary">Draft all renewals</button>
        </div>
      </div>

      {/* Urgency-sorted list */}
      <div className="avel-card avel-card-flush">
        <table className="avel-table">
          <thead>
            <tr>
              <th>Credential</th>
              <th>Provider</th>
              <th>Expires</th>
              <th>Countdown</th>
              <th>Renewal</th>
              <th aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => {
              const provider = getProvider(e.providerSlug);
              const w = windowOf(e.daysUntil);
              const tone = WINDOW_META[w].tone;
              const href = `/eastside-hospital/providers/${e.providerSlug}`;
              return (
                <tr
                  key={e.id}
                  className="avel-table-row avel-table-row-link"
                  onClick={() => router.push(href)}
                >
                  <td>
                    <div className="exp-cred">
                      <span className={`exp-bar exp-bar-${tone}`} aria-hidden="true" />
                      <div>
                        <div className="exp-cred-label">{e.label}</div>
                        <div className="exp-cred-kind">{e.kind}{e.state ? ` · ${e.state}` : ""}</div>
                      </div>
                    </div>
                  </td>
                  <td className="avel-table-cell-soft">{provider?.name ?? e.providerSlug}</td>
                  <td className="avel-table-cell-soft">{e.expiresOn}</td>
                  <td>
                    <span className={`exp-count exp-count-${tone}`}>
                      {e.daysUntil} day{e.daysUntil === 1 ? "" : "s"}
                    </span>
                  </td>
                  <td>
                    {e.autoRenew ? (
                      <span className="exp-renew exp-renew-auto">⟳ Auto-drafted</span>
                    ) : (
                      <span className="exp-renew exp-renew-manual">Needs review</span>
                    )}
                  </td>
                  <td className="avel-row-chevron" aria-hidden="true">›</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {rows.length === 0 && (
          <div className="avel-empty">
            <div className="avel-empty-icon">✓</div>
            <div className="avel-empty-title">Nothing expiring in this view</div>
            <div className="avel-empty-sub">No credentials match these filters.</div>
            <button type="button" className="avel-btn-ghost" onClick={() => { setWin(""); setKind(""); setAutoOnly(false); }}>
              Clear filters
            </button>
          </div>
        )}
      </div>

      <div className="avel-table-foot">
        Showing <strong>{rows.length}</strong> of {EXPIRABLES.length} upcoming expirations
        {hasFilter ? " (filtered)" : ""}
        &nbsp;·&nbsp;
        <Link className="avel-link" href="/eastside-hospital">Back to Dashboard</Link>
      </div>
    </div>
  );
}
