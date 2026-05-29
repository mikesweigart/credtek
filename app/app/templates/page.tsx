// Communications template library — the credentialing CRM messaging
// layer. Every prebuilt email, letter, and form CredTek can send on
// behalf of the operator, grouped by stage, with audience and trigger
// metadata so a credentialing manager can see at a glance which
// touchpoints are covered.

import { TemplateBrowser } from "./_components/TemplateBrowser";
import { TEMPLATES } from "../../_lib/data/templates-catalog";

export const dynamic = "force-dynamic";

export default async function TemplatesPage() {
  const total = TEMPLATES.length;
  const byChannel = TEMPLATES.reduce<Record<string, number>>((acc, t) => {
    acc[t.channel] = (acc[t.channel] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="portal-head">
        <h1 className="portal-h1">Communications library</h1>
        <p className="portal-sub">
          Every email, letter, and e-sign form CredTek sends on your behalf — prebuilt, lawyer-friendly, fork-able per workspace. The credentialing CRM that keeps providers moving.
        </p>
      </div>

      <div className="portal-kpis">
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Prebuilt templates</div>
          <div className="portal-kpi-val">{total}</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Emails</div>
          <div className="portal-kpi-val portal-kpi-pos">{byChannel.email ?? 0}</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">Letters</div>
          <div className="portal-kpi-val">{byChannel.letter ?? 0}</div>
        </div>
        <div className="portal-kpi">
          <div className="portal-kpi-lbl">E-sign forms</div>
          <div className="portal-kpi-val portal-kpi-auto">⚡ DocuSign</div>
        </div>
      </div>

      <TemplateBrowser />

      <div className="portal-card portal-card-auto" style={{ marginTop: 18 }}>
        <div className="portal-card-head">
          <h2>⚡ How templates power the CRM</h2>
        </div>
        <ul className="portal-auto-list">
          <li><strong>Triggered automatically</strong> by stage transitions, SLA breaches, and expirable thresholds — no human picks the template.</li>
          <li><strong>Variables auto-fill</strong> from the provider, tenant, and payer records so every send is personalized without retyping.</li>
          <li><strong>Forked per tenant</strong> — every workspace can customize tone, signoff, and any clause without breaking the upgrade path.</li>
          <li><strong>Audit-logged</strong> on the SHA-256 hash chain — every send is provable for NCQA / AAAHC review.</li>
        </ul>
      </div>
    </div>
  );
}
