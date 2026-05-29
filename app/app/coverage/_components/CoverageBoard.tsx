"use client";

// Coverage board — renders one card per provider with their states ×
// payers matrix. The data is fully derived server-side; this component
// only owns view state (filters + which cell is hovered).
//
// Layout choice: states down the left, payers across the top. That
// matches how every credentialing manager reads "where is Dr. X
// billable?" — they think state-first.

import { useMemo, useState } from "react";
import Link from "next/link";
import type { CoverageData } from "../../../_lib/data/coverage-view";
import { STATUS_DISPLAY } from "../../../_lib/data/coverage-view";

type Props = { data: CoverageData };
type ViewFilter = "all" | "active" | "pending" | "gaps" | "denied";

export function CoverageBoard({ data }: Props) {
  const [filter, setFilter] = useState<ViewFilter>("all");
  const [query, setQuery] = useState("");

  // Apply filters to provider list. A provider is shown if any of its
  // cells match the current filter — so "gaps" hides fully-covered
  // providers, "active" hides providers with no billable lines, etc.
  const visibleProviders = useMemo(() => {
    return data.providers.filter((prov) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!prov.name.toLowerCase().includes(q)) return false;
      }
      if (filter === "all") return true;
      for (const cell of prov.cells.values()) {
        if (filter === "active" && cell.status === "active") return true;
        if (filter === "pending" && (cell.status === "drafted" || cell.status === "submitted" || cell.status === "awaiting_info")) return true;
        if (filter === "denied" && (cell.status === "denied" || cell.status === "termed")) return true;
        if (filter === "gaps" && cell.status === "no_enrollment") return true;
      }
      return false;
    });
  }, [data.providers, filter, query]);

  return (
    <>
      <div className="portal-card cov-filters">
        <input
          type="search"
          className="portal-input cov-search"
          placeholder="Filter providers by name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Filter providers"
        />
        <div className="cov-filter-row">
          {[
            { v: "all", l: "All" },
            { v: "active", l: "Has active" },
            { v: "pending", l: "Has in-flight" },
            { v: "denied", l: "Has denial" },
            { v: "gaps", l: "Has gaps" },
          ].map((f) => (
            <button
              key={f.v}
              type="button"
              className={`pg-topic${filter === f.v ? " pg-topic-on" : ""}`}
              onClick={() => setFilter(f.v as ViewFilter)}
            >
              {f.l}
            </button>
          ))}
        </div>
        <div className="cov-legend">
          <span className="cov-legend-lbl">Legend</span>
          <span className="cov-legend-cell cov-cell-active">Active</span>
          <span className="cov-legend-cell cov-cell-submitted">Submitted</span>
          <span className="cov-legend-cell cov-cell-awaiting">Awaiting info</span>
          <span className="cov-legend-cell cov-cell-drafted">Drafted</span>
          <span className="cov-legend-cell cov-cell-denied">Denied</span>
          <span className="cov-legend-cell cov-cell-gap">GAP</span>
        </div>
      </div>

      {visibleProviders.length === 0 ? (
        <div className="portal-card portal-muted" style={{ textAlign: "center" }}>
          No providers match the current filter.
        </div>
      ) : (
        <div className="cov-list">
          {visibleProviders.map((prov) => (
            <ProviderMatrixCard key={prov.id} provider={prov} payers={data.payers} />
          ))}
        </div>
      )}
    </>
  );
}

function ProviderMatrixCard({
  provider,
  payers,
}: {
  provider: CoverageData["providers"][number];
  payers: CoverageData["payers"];
}) {
  const states = provider.states.length ? provider.states : [];
  const totalPossible = states.length * payers.length;
  const billablePct =
    totalPossible === 0 ? 0 : Math.round((provider.billableCount / totalPossible) * 100);

  return (
    <div className="portal-card cov-card">
      <div className="cov-card-head">
        <div>
          <Link href={`/app/providers/${provider.id}`} className="cov-card-name">
            {provider.name}
            {provider.credential ? `, ${provider.credential}` : ""}
          </Link>
          <div className="cov-card-meta">
            Licensed in <strong>{states.length}</strong> state{states.length === 1 ? "" : "s"} ·{" "}
            <strong>{provider.billableCount}</strong> billable now ·{" "}
            <strong>{provider.pendingCount}</strong> in flight ·{" "}
            <strong className={provider.gapCount ? "cov-meta-gap" : ""}>
              {provider.gapCount}
            </strong>{" "}
            gap{provider.gapCount === 1 ? "" : "s"}
          </div>
        </div>
        <div className="cov-card-pct">
          <div className="cov-card-pct-val">{billablePct}%</div>
          <div className="cov-card-pct-lbl">billable footprint</div>
        </div>
      </div>

      {states.length === 0 ? (
        <p className="portal-muted" style={{ margin: "12px 0 0" }}>
          No license states recorded yet — add states on the provider page to map coverage.
        </p>
      ) : (
        <div className="cov-table-wrap">
          <table className="cov-table">
            <thead>
              <tr>
                <th className="cov-th-state">State</th>
                {payers.map((py) => (
                  <th key={py.id} className="cov-th-payer" title={py.name}>
                    {py.short_name ?? py.name}
                  </th>
                ))}
                <th className="cov-th-rollup">Per-state</th>
              </tr>
            </thead>
            <tbody>
              {states.map((st) => {
                const cells = payers.map((py) => provider.cells.get(`${st}:${py.id}`)!);
                const stateBillable = cells.filter((c) => c?.status === "active").length;
                const stateGaps = cells.filter((c) => c?.status === "no_enrollment").length;
                return (
                  <tr key={st}>
                    <th className="cov-th-state-row">{st}</th>
                    {payers.map((py, i) => {
                      const cell = cells[i];
                      const disp = STATUS_DISPLAY[cell.status];
                      const title = `${st} · ${py.short_name ?? py.name}: ${disp.label}${
                        cell.effectiveDate ? ` · effective ${cell.effectiveDate}` : ""
                      }${cell.submittedOn ? ` · submitted ${cell.submittedOn}` : ""}`;
                      return (
                        <td key={py.id} className="cov-td">
                          {cell.enrollmentId ? (
                            <Link
                              href={`/app/providers/${provider.id}`}
                              className={`cov-cell ${disp.cls}`}
                              title={title}
                            >
                              {disp.short}
                            </Link>
                          ) : (
                            <span className={`cov-cell ${disp.cls}`} title={title}>
                              {disp.short}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td className="cov-td cov-td-rollup">
                      <span className="cov-rollup">
                        <strong>{stateBillable}</strong>/{payers.length}
                        {stateGaps > 0 && <em className="cov-rollup-gap"> · {stateGaps} gap</em>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
