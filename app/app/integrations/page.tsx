// Integrations hub — every external system CredTek connects with,
// grouped by category, with a clear connection status and what data
// flows in or out. The strategic message: "we connect everywhere,
// so you never type the same thing twice."

import {
  CATEGORY_BLURB,
  CATEGORY_LABEL,
  FLOW_LABEL,
  INTEGRATIONS,
  STATUS_PILL,
  countByStatus,
  groupIntegrations,
} from "../../_lib/data/integrations-catalog";
import { getSessionContext } from "../../_lib/data/workspace";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const ctx = await getSessionContext();
  const groups = groupIntegrations();
  const counts = countByStatus();
  const total = INTEGRATIONS.length;
  const connectedPct = Math.round((counts.connected / total) * 100);

  return (
    <div>
      <div className="portal-head">
        <h1 className="portal-h1">Integrations</h1>
        <p className="portal-sub">
          CredTek connects directly to every system a credentialing operation touches — PSV sources, state boards, CAQH, payer enrollment portals, clearinghouses, EHRs, document repos, e-sign and identity vendors. Data flows in automatically, communications go out automatically, and your file is always the source of truth.
        </p>
      </div>

      <div className="portal-kpis">
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Live connections</div>
          <div className="portal-kpi-val portal-kpi-pos">{counts.connected}</div>
          <div className="portal-kpi-sub">of {total} catalog systems</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">In beta</div>
          <div className="portal-kpi-val">{counts.beta}</div>
          <div className="portal-kpi-sub">wired, polishing</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Available now</div>
          <div className="portal-kpi-val">{counts.available}</div>
          <div className="portal-kpi-sub">turn on in a click</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Coverage</div>
          <div className="portal-kpi-val portal-kpi-auto">⚡ {connectedPct}%</div>
          <div className="portal-kpi-sub">connected today</div>
        </div>
      </div>

      <div className="portal-card int-strategy-card">
        <h2 style={{ margin: 0, fontSize: 16 }}>The CredTek connectivity thesis</h2>
        <p className="portal-muted" style={{ marginTop: 8, marginBottom: 0 }}>
          Every credentialing system that exposes an API, CredTek calls. Every system that exposes a webhook, CredTek listens for. Every signature you used to chase, CredTek requests electronically. Every document repository your team already lives in, CredTek attaches to. <strong>The data never leaves your house — it just stops being typed by hand.</strong> {ctx.tenantName ? <>Configured for <strong>{ctx.tenantName}</strong>.</> : null}
        </p>
      </div>

      {groups.map((g) => (
        <div key={g.category} className="portal-card int-cat-card">
          <div className="portal-card-head">
            <div>
              <h2>{CATEGORY_LABEL[g.category]}</h2>
              <div className="portal-muted" style={{ fontSize: 12.5, marginTop: 2 }}>
                {CATEGORY_BLURB[g.category]}
              </div>
            </div>
            <span className="portal-muted" style={{ fontSize: 12 }}>
              {g.items.length} integration{g.items.length === 1 ? "" : "s"}
            </span>
          </div>
          <ul className="int-grid">
            {g.items.map((i) => {
              const pill = STATUS_PILL[i.status];
              return (
                <li key={i.id} className={`int-card int-card-${i.status}`}>
                  <div className="int-card-head">
                    <div className="int-card-name">{i.name}</div>
                    <span className={`psv-pill ${pill.cls}`}>{pill.label}</span>
                  </div>
                  <div className="int-card-vendor">{i.vendor}</div>
                  <p className="int-card-summary">{i.summary}</p>
                  <div className="int-card-meta">
                    <span>{FLOW_LABEL[i.dataFlow]}</span>
                    <span>·</span>
                    <span>{i.cadence}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="portal-card portal-card-auto" style={{ marginTop: 18 }}>
        <div className="portal-card-head">
          <h2>⚡ Don&apos;t see your system?</h2>
        </div>
        <p className="portal-muted" style={{ marginTop: 0 }}>
          We add new integrations on a 2-week sprint. If your team relies on a PM system, payer portal, or document repo not listed here, send Mike a note from the in-app guide (the 💬 Feedback tab on Cred) and it goes on the next-up list.
        </p>
      </div>
    </div>
  );
}
