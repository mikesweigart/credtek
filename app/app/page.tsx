// Real workspace dashboard — pipeline health at a glance: where every
// provider is, what's automated, what's overdue (red flags), and the
// next follow-ups. Role-aware (clients see a read-only portal).

import Link from "next/link";
import { listProviders } from "../_lib/data/providers";
import { getSessionContext, canEdit } from "../_lib/data/workspace";
import { ProviderProgress } from "./_components/ProviderProgress";
import { daysInStage, isOverdue, STAGE_META } from "../_lib/data/credentialing-model";
import type { Stage } from "../_lib/data/credentialing";

export const dynamic = "force-dynamic";

export default async function PortalDashboard() {
  const [providers, ctx] = await Promise.all([listProviders(), getSessionContext()]);
  const editor = canEdit(ctx.role);

  const enriched = providers.map((p) => {
    const stage = (p.credentialing_stage as Stage) ?? "intake";
    const days = daysInStage(p.stage_entered_at, p.created_at);
    return { p, stage, days, overdue: isOverdue(stage, days) };
  });

  const total = enriched.length;
  const ready = enriched.filter((e) => e.stage === "approved").length;
  const flagged = enriched.filter((e) => e.overdue);
  const automatedStages = enriched.filter((e) => STAGE_META[e.stage].automated && e.stage !== "approved").length;
  const inProgress = enriched.filter((e) => e.stage !== "approved");

  return (
    <div>
      <div className="portal-head">
        <h1 className="portal-h1">Credentialing workspace</h1>
        <p className="portal-sub">
          {editor
            ? "Every provider, from intake to final approval — with what's automated, when the next follow-up runs, and a red flag the moment any step runs long."
            : "A live, read-only view of where each of your providers stands in credentialing — what's automated and what's flagged."}
        </p>
      </div>

      {total === 0 ? (
        <div className="portal-empty">
          <div className="portal-empty-icon">◯</div>
          <h2>{editor ? "Add your first provider" : "No providers yet"}</h2>
          <p>
            {editor
              ? "Add a clinician (or bulk-import a roster) and CredTek tracks them through every credentialing stage automatically."
              : "Once providers are added to this workspace, you'll see their live credentialing status here."}
          </p>
          {editor && (
            <div className="portal-empty-actions">
              <Link href="/app/providers/new" className="acct-btn-primary">+ Add a provider</Link>
              <Link href="/app/providers/import" className="acct-btn-secondary">⤓ Bulk import</Link>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="portal-kpis">
            <div className="portal-kpi">
              <div className="portal-kpi-lbl">Providers</div>
              <div className="portal-kpi-val">{total}</div>
            </div>
            <div className="portal-kpi">
              <div className="portal-kpi-lbl">Ready to bill</div>
              <div className="portal-kpi-val portal-kpi-pos">{ready}</div>
            </div>
            <div className={`portal-kpi${flagged.length ? " portal-kpi-flagcard" : ""}`}>
              <div className="portal-kpi-lbl">Red flags</div>
              <div className={`portal-kpi-val ${flagged.length ? "portal-kpi-flag" : "portal-kpi-pos"}`}>{flagged.length}</div>
              <div className="portal-kpi-sub">{flagged.length ? "over SLA — act now" : "all on track"}</div>
            </div>
            <div className="portal-kpi">
              <div className="portal-kpi-lbl">Automated now</div>
              <div className="portal-kpi-val portal-kpi-auto">⚡ {automatedStages}</div>
              <div className="portal-kpi-sub">stages running hands-free</div>
            </div>
          </div>

          {/* Red flags first */}
          {flagged.length > 0 && (
            <div className="portal-card portal-card-flag">
              <div className="portal-card-head">
                <h2>⚑ Needs attention — running over SLA</h2>
              </div>
              <ul className="portal-pl-list">
                {flagged.map(({ p, stage, days }) => (
                  <li key={p.id} className="portal-pl-row">
                    <Link href={`/app/providers/${p.id}`} className="portal-pl-name">
                      {p.name}{p.credential ? `, ${p.credential}` : ""}
                    </Link>
                    <ProviderProgress stage={stage} stageEnteredAt={p.stage_entered_at} createdAt={p.created_at} compact />
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Pipeline health */}
          <div className="portal-card">
            <div className="portal-card-head">
              <h2>Pipeline health</h2>
              {editor && <Link href="/app/providers/new" className="portal-link">+ Add provider</Link>}
            </div>
            <ul className="portal-pl-list">
              {inProgress.filter((e) => !e.overdue).map(({ p, stage }) => (
                <li key={p.id} className="portal-pl-row">
                  <Link href={`/app/providers/${p.id}`} className="portal-pl-name">
                    {p.name}{p.credential ? `, ${p.credential}` : ""}
                  </Link>
                  <ProviderProgress stage={stage} stageEnteredAt={p.stage_entered_at} createdAt={p.created_at} compact />
                </li>
              ))}
              {inProgress.filter((e) => !e.overdue).length === 0 && (
                <li className="portal-muted" style={{ padding: "10px 0" }}>Everything in progress is flagged above, or already approved.</li>
              )}
            </ul>
          </div>

          {/* Automation summary */}
          <div className="portal-card portal-card-auto">
            <div className="portal-card-head"><h2>⚡ What CredTek is doing for you</h2></div>
            <ul className="portal-auto-list">
              <li><strong>Intake:</strong> SMS + email document requests, OCR extraction, auto-reminders every 2 days.</li>
              <li><strong>PSV:</strong> NPPES, OIG, SAM, state board, NPDB &amp; DEA run continuously; auto-escalate after 5 silent days.</li>
              <li><strong>Enrollment:</strong> payer applications auto-filled (with your approval gate); status-check &amp; escalation every 7 days.</li>
              <li><strong>Always-on:</strong> sanctions monitoring + expirables &amp; re-credentialing forecasting.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
