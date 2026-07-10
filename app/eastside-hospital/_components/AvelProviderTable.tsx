"use client";

// Providers table with WORKING client-side filters + clickable rows.
// Replaces the presentational-only table. Filters compose (search +
// service line + space + stage + readiness), show a live result count,
// and render an actionable empty state. Rows navigate to the provider
// detail page.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  PROVIDERS,
  SPACES,
  SERVICE_LINES,
  STAGE_LABEL,
  type Stage,
} from "../_data/seed";

const STAGE_OPTIONS: { label: string; value: Stage }[] = [
  { label: "Intake", value: "intake" },
  { label: "PSV", value: "psv" },
  { label: "Privileges", value: "privileges" },
  { label: "Compliance", value: "compliance" },
  { label: "Payer Enrollment", value: "enrollment" },
  { label: "Ready to Bill", value: "ready" },
];

export function AvelProviderTable() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [serviceLine, setServiceLine] = useState("");
  const [spaceId, setSpaceId] = useState("");
  const [stage, setStage] = useState("");
  const [readiness, setReadiness] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PROVIDERS.filter((p) => {
      if (
        needle &&
        !`${p.name} ${p.credentials} ${p.specialty}`.toLowerCase().includes(needle)
      )
        return false;
      if (serviceLine && !p.serviceLines.includes(serviceLine as never)) return false;
      if (spaceId && !p.spaceIds.includes(spaceId)) return false;
      if (stage && p.stage !== stage) return false;
      if (readiness === "ready-work" && !p.readyToWork) return false;
      if (readiness === "ready-bill" && !p.readyToBill) return false;
      if (readiness === "at-risk" && p.flags.length === 0) return false;
      if (readiness === "onboarding" && p.readyToWork) return false;
      return true;
    });
  }, [q, serviceLine, spaceId, stage, readiness]);

  const hasFilter = Boolean(q || serviceLine || spaceId || stage || readiness);

  function clearAll() {
    setQ("");
    setServiceLine("");
    setSpaceId("");
    setStage("");
    setReadiness("");
  }

  return (
    <>
      <div className="avel-toolbar">
        <div className="avel-toolbar-filters">
          <input
            className="avel-select avel-search"
            type="search"
            placeholder="⌕ Search providers…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search providers"
          />
          <select className="avel-select" value={serviceLine} onChange={(e) => setServiceLine(e.target.value)}>
            <option value="">All service lines</option>
            {SERVICE_LINES.map((sl) => (
              <option key={sl} value={sl}>{sl}</option>
            ))}
          </select>
          <select className="avel-select" value={spaceId} onChange={(e) => setSpaceId(e.target.value)}>
            <option value="">All spaces</option>
            {SPACES.map((s) => (
              <option key={s.id} value={s.id}>{s.shortName}</option>
            ))}
          </select>
          <select className="avel-select" value={stage} onChange={(e) => setStage(e.target.value)}>
            <option value="">All stages</option>
            {STAGE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <select className="avel-select" value={readiness} onChange={(e) => setReadiness(e.target.value)}>
            <option value="">Any readiness</option>
            <option value="ready-work">Ready to work</option>
            <option value="ready-bill">Ready to bill</option>
            <option value="at-risk">At risk (flagged)</option>
            <option value="onboarding">In onboarding</option>
          </select>
          {hasFilter && (
            <button type="button" className="avel-btn-ghost avel-clear" onClick={clearAll}>
              Clear ✕
            </button>
          )}
        </div>
        <div className="avel-toolbar-actions">
          <button type="button" className="avel-btn-ghost">Bulk import</button>
          <button type="button" className="avel-btn-primary">+ Add provider</button>
        </div>
      </div>

      <div className="avel-card avel-card-flush">
        <table className="avel-table">
          <thead>
            <tr>
              <th>Provider</th>
              <th>Role</th>
              <th>Service lines</th>
              <th>States</th>
              <th>Stage</th>
              <th>Ready to work</th>
              <th>Ready to bill</th>
              <th>Flags</th>
              <th aria-label="Open" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const href = `/eastside-hospital/providers/${p.slug}`;
              return (
                <tr
                  key={p.id}
                  className="avel-table-row avel-table-row-link"
                  onClick={() => router.push(href)}
                >
                  <td>
                    <div className="avel-table-name-cell">
                      <div className="avel-table-av">{p.initials}</div>
                      <div>
                        <Link
                          href={href}
                          className="avel-table-name avel-table-name-a"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {p.name}, {p.credentials}
                        </Link>
                        <div className="avel-table-spec">{p.specialty}</div>
                      </div>
                    </div>
                  </td>
                  <td className="avel-table-cell-soft">{p.role}</td>
                  <td>
                    <div className="avel-cell-chips">
                      {p.serviceLines.map((sl) => (
                        <span key={sl} className="avel-mini-chip">{sl.split(" / ")[0]}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="avel-cell-states">{p.statesLicensed.join(" · ")}</div>
                  </td>
                  <td>
                    <span className={`avel-stage-pill stage-${p.stage}`}>
                      {STAGE_LABEL[p.stage]}
                    </span>
                  </td>
                  <td>
                    {p.readyToWork ? (
                      <span className="avel-readiness avel-readiness-yes">Yes</span>
                    ) : (
                      <span className="avel-readiness avel-readiness-no">No</span>
                    )}
                  </td>
                  <td>
                    {p.readyToBill ? (
                      <span className="avel-readiness avel-readiness-yes">Yes</span>
                    ) : (
                      <span className="avel-readiness avel-readiness-no">No</span>
                    )}
                  </td>
                  <td className="avel-table-flags">
                    {p.flags.length > 0 ? (
                      <span className="avel-flag" title={p.flags.join("; ")}>
                        ⚐ {p.flags[0].length > 32 ? p.flags[0].slice(0, 30) + "…" : p.flags[0]}
                      </span>
                    ) : (
                      <span className="avel-table-cell-soft">—</span>
                    )}
                  </td>
                  <td className="avel-row-chevron" aria-hidden="true">›</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="avel-empty">
            <div className="avel-empty-icon">⌕</div>
            <div className="avel-empty-title">No providers match these filters</div>
            <div className="avel-empty-sub">Try widening your criteria.</div>
            <button type="button" className="avel-btn-ghost" onClick={clearAll}>
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <div className="avel-table-foot">
        Showing <strong>{filtered.length}</strong> of {PROVIDERS.length} providers
        {hasFilter ? " (filtered)" : ""} · Eastside Hospital clinician roster
        &nbsp;·&nbsp;
        <Link className="avel-link" href="/eastside-hospital">Back to Dashboard</Link>
      </div>
    </>
  );
}
