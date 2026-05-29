// Real workspace dashboard — live counts from the tenant's own data.

import Link from "next/link";
import { listProviders } from "../_lib/data/providers";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const providers = await listProviders();
  const total = providers.length;
  const ready = providers.filter((p) => p.status === "active").length;
  const enrolling = providers.filter((p) => p.status === "enrolling").length;
  const supervision = providers.filter((p) => p.status === "supervision").length;

  return (
    <div>
      <div className="portal-head">
        <h1 className="portal-h1">Your credentialing workspace</h1>
        <p className="portal-sub">
          This is your live workspace — everything here is your own data, saved to your account.
        </p>
      </div>

      {total === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">◯</div>
          <h2>Add your first provider</h2>
          <p>
            Start by adding a clinician. CredTek will track their licensure, credentialing,
            and payer enrollment from here.
          </p>
          <Link href="/app/providers/new" className="acct-btn-primary" style={{ display: "inline-flex", marginTop: 8 }}>
            + Add a provider
          </Link>
        </div>
      ) : (
        <>
          <div className="portal-kpis">
            <div className="portal-kpi">
              <div className="portal-kpi-lbl">Total providers</div>
              <div className="portal-kpi-val">{total}</div>
            </div>
            <div className="portal-kpi">
              <div className="portal-kpi-lbl">Active</div>
              <div className="portal-kpi-val portal-kpi-pos">{ready}</div>
            </div>
            <div className="portal-kpi">
              <div className="portal-kpi-lbl">Enrolling</div>
              <div className="portal-kpi-val">{enrolling}</div>
            </div>
            <div className="portal-kpi">
              <div className="portal-kpi-lbl">In supervision</div>
              <div className="portal-kpi-val">{supervision}</div>
            </div>
          </div>

          <div className="portal-card">
            <div className="portal-card-head">
              <h2>Recent providers</h2>
              <Link href="/app/providers" className="portal-link">View all →</Link>
            </div>
            <ul className="portal-recent">
              {providers.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <Link href={`/app/providers/${p.id}`}>
                    <strong>{p.name}</strong>
                    {p.credential ? `, ${p.credential}` : ""}
                    <span>{p.specialty ?? "—"}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/app/providers/new" className="acct-btn-secondary" style={{ display: "inline-flex", marginTop: 14 }}>
              + Add a provider
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
