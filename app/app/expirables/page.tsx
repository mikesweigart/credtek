// Expirables dashboard — every license + credential expiring in the
// next 90 days, sorted by urgency. The page credentialing managers live
// in. Bucketed 30 / 60 / 90 + already-expired so triage is instant.

import Link from "next/link";
import { listExpirables } from "../../_lib/data/expirables";
import { getSessionContext, canEdit } from "../../_lib/data/workspace";

export const dynamic = "force-dynamic";

function dueLabel(d: number | null): { text: string; cls: string } {
  if (d == null) return { text: "—", cls: "fu-due fu-due-ok" };
  if (d < 0) return { text: `${Math.abs(d)}d expired`, cls: "fu-due fu-due-over" };
  if (d === 0) return { text: "expires today", cls: "fu-due fu-due-now" };
  if (d <= 30) return { text: `${d}d`, cls: "fu-due fu-due-over" };
  if (d <= 60) return { text: `${d}d`, cls: "fu-due fu-due-now" };
  return { text: `${d}d`, cls: "fu-due fu-due-soon" };
}

export default async function ExpirablesPage() {
  const [rows, ctx] = await Promise.all([listExpirables(), getSessionContext()]);
  const editor = canEdit(ctx.role);

  const expired = rows.filter((r) => r.bucket === "expired");
  const in30 = rows.filter((r) => r.bucket === "30");
  const in60 = rows.filter((r) => r.bucket === "60");
  const in90 = rows.filter((r) => r.bucket === "90");

  return (
    <div>
      <div className="portal-head">
        <h1 className="portal-h1">Expirables — next 90 days</h1>
        <p className="portal-sub">
          Every license, DEA, board cert, malpractice COI and CAQH attestation expiring inside the 90-day window — sorted by urgency. Click any row to open the provider&apos;s file.
        </p>
      </div>

      <div className="portal-kpis">
        <div className={`portal-kpi${expired.length ? " portal-kpi-flagcard" : ""}`}>
          <div className="portal-kpi-lbl">Already expired</div>
          <div className={`portal-kpi-val ${expired.length ? "portal-kpi-flag" : "portal-kpi-pos"}`}>{expired.length}</div>
          <div className="portal-kpi-sub">act today</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">In 30 days</div>
          <div className="portal-kpi-val">{in30.length}</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">In 60 days</div>
          <div className="portal-kpi-val">{in60.length}</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">In 90 days</div>
          <div className="portal-kpi-val">{in90.length}</div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">✓</div>
          <h2>Nothing expiring soon</h2>
          <p>
            No licenses or credentials are expiring inside the 90-day window. CredTek will surface them here automatically as soon as anything crosses that threshold.
          </p>
          {editor && (
            <Link href="/app/providers" className="acct-btn-primary" style={{ marginTop: 8 }}>
              View providers
            </Link>
          )}
        </div>
      ) : (
        <div className="portal-card portal-card-flush">
          <ul className="fu-list">
            {rows.map((r) => {
              const d = dueLabel(r.daysUntil);
              return (
                <li key={r.id} className={`fu-row${r.bucket === "expired" || r.bucket === "30" ? " fu-row-over" : ""}`}>
                  <div className="fu-row-l">
                    <Link href={`/app/providers/${r.providerId}`} className="fu-row-name">
                      {r.providerName}
                      {r.providerCredential ? `, ${r.providerCredential}` : ""}
                    </Link>
                    <div className="fu-row-meta">
                      <span className="fu-stage">{r.what}</span>
                      {r.state && <span className="fu-cadence">{r.state}</span>}
                      <span className={d.cls}>{d.text}</span>
                      <span className="fu-cadence">
                        expires {r.expiresOn ? new Date(r.expiresOn).toLocaleDateString() : "—"}
                      </span>
                    </div>
                    <div className="fu-subject">{r.label}</div>
                  </div>
                  <div className="fu-row-r">
                    <Link href={`/app/providers/${r.providerId}`} className="acct-btn-secondary fu-send-btn">
                      Open file →
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="portal-card portal-card-auto" style={{ marginTop: 18 }}>
        <div className="portal-card-head"><h2>⚡ How CredTek handles expirables</h2></div>
        <ul className="portal-auto-list">
          <li><strong>30 days out:</strong> first reminder to the provider, plus a heads-up to your coordinator.</li>
          <li><strong>14 days out:</strong> second reminder + a draft renewal packet auto-assembled in the provider&apos;s file.</li>
          <li><strong>Day 0:</strong> red flag fires, provider auto-moves to <em>Supervision</em> if no renewal received, all impacted payer enrollments mark as at-risk.</li>
          <li><strong>CAQH:</strong> re-attestation tracked every 120 days independently — separate cadence, separate reminder.</li>
        </ul>
      </div>
    </div>
  );
}
