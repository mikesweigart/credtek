// Spaces & Programs — Eastside Hospital organizes credentialing by facility
// and program. Each space card shows real-time readiness counts
// computed from the seed data so the dashboard rollup and these
// cards always agree.

import Link from "next/link";
import { AvelTopbar } from "../_components/AvelNav";
import { SPACES, spaceStats } from "../_data/seed";

export const metadata = { title: "Spaces & Programs" };

export default function AvelSpaces() {
  return (
    <>
      <AvelTopbar
        title="Spaces & Programs"
        subtitle="Organize Eastside Hospital clinicians by facility, program, and geography. Click any space for credentialing readiness and risks."
      />

      <div className="avel-content">
        <div className="avel-space-grid">
          {SPACES.map((s) => {
            const stats = spaceStats(s.id);
            const pct =
              stats.total > 0 ? Math.round((stats.ready / stats.total) * 100) : 0;
            return (
              <Link
                key={s.id}
                href={`/eastside-hospital/spaces/${s.slug}`}
                className="avel-space-card"
              >
                <div className="avel-space-card-head">
                  <div className="avel-space-card-icon">◇</div>
                  <div>
                    <div className="avel-space-card-name">{s.name}</div>
                    <div className="avel-space-card-meta">
                      {s.region} · {s.serviceLine}
                    </div>
                  </div>
                </div>

                <p className="avel-space-card-desc">{s.description}</p>

                <div className="avel-space-stats">
                  <div className="avel-space-stat">
                    <div className="avel-space-stat-num">{stats.total}</div>
                    <div className="avel-space-stat-lbl">Active providers</div>
                  </div>
                  <div className="avel-space-stat">
                    <div className="avel-space-stat-num">{stats.onboarding}</div>
                    <div className="avel-space-stat-lbl">In onboarding</div>
                  </div>
                  <div className="avel-space-stat">
                    <div className="avel-space-stat-num avel-space-stat-num-pos">
                      {stats.ready}
                    </div>
                    <div className="avel-space-stat-lbl">Ready to bill</div>
                  </div>
                  <div className="avel-space-stat">
                    <div className={`avel-space-stat-num ${stats.atRisk > 0 ? "avel-space-stat-num-warn" : ""}`}>
                      {stats.atRisk}
                    </div>
                    <div className="avel-space-stat-lbl">At risk</div>
                  </div>
                </div>

                <div className="avel-space-card-bar">
                  <div className="avel-space-card-bar-track">
                    <span
                      className="avel-space-card-bar-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="avel-space-card-bar-pct">
                    <strong>{pct}%</strong> ready to bill
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer call-out — purely informational, no sales push */}
        <div className="avel-callout">
          <strong>Adding a new space?</strong> Spaces represent any facility
          or program where Eastside Hospital clinicians deliver virtual care.
          Once created, you can attach a credentialing workflow template
          and Eastside Hospital will track every required item, state-by-state, until
          the space is fully staffed.
        </div>
      </div>
    </>
  );
}
