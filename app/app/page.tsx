// Real workspace dashboard — pipeline health at a glance: where every
// provider is, what's automated, what's overdue (red flags), and the
// next follow-ups. Role-aware (clients see a read-only portal).

import Link from "next/link";
import { listProviders } from "../_lib/data/providers";
import { getSessionContext, canEdit } from "../_lib/data/workspace";
import { ProviderProgress } from "./_components/ProviderProgress";
import {
  daysInStage,
  isOverdue,
  STAGE_META,
  TARGET_DAYS_TO_BILLABLE,
  projectedDaysToBillable,
} from "../_lib/data/credentialing-model";
import type { Stage } from "../_lib/data/credentialing";
import { seedSampleData, resetSampleData } from "./_actions/sampleData";

export const dynamic = "force-dynamic";

export default async function PortalDashboard(props: {
  searchParams: Promise<{ seeded?: string; error?: string }>;
}) {
  const { seeded, error } = await props.searchParams;
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

  // Speed-to-billable — the headline outcome metric.
  const projections = inProgress.map((e) => projectedDaysToBillable(e.stage, e.days));
  const avgDaysToBillable =
    projections.length === 0
      ? 0
      : Math.round(projections.reduce((s, n) => s + n, 0) / projections.length);
  const fastest = projections.length ? Math.min(...projections) : 0;

  // Are these sample/demo rows? We mark them in meta JSON.
  const hasSample = providers.some((p) => p.meta?.includes("credtek:sample"));

  return (
    <div>
      {/* Inline toasts driven by ?seeded=…/?error=… */}
      {seeded === "ok" && (
        <div className="portal-card fu-toast fu-toast-ok">
          ✓ Sample data loaded — explore the platform, then clear it when you&apos;re ready to go live.
        </div>
      )}
      {seeded === "exists" && (
        <div className="portal-card fu-toast fu-toast-fail">
          You already have providers in your workspace — sample data was not loaded so nothing of yours could be overwritten.
        </div>
      )}
      {seeded === "cleared" && (
        <div className="portal-card fu-toast fu-toast-ok">
          ✓ Sample data cleared. Your workspace is fresh.
        </div>
      )}
      {error === "role" && (
        <div className="portal-card fu-toast fu-toast-fail">
          ✗ Your role isn&apos;t allowed to make that change.
        </div>
      )}

      <div className="portal-head">
        <h1 className="portal-h1">Credentialing workspace</h1>
        <p className="portal-sub">
          {editor
            ? <>The fastest path from <strong>intake</strong> to <strong>billable</strong>. CredTek connects to every PSV source, every state board, every payer portal, and runs the prebuilt CRM messaging in between — you watch progress and approve gates.</>
            : <>A live view of every provider in your file — what&apos;s automated, what&apos;s queued, and how close each one is to billable.</>}
        </p>
      </div>

      {total === 0 ? (
        <div className="portal-empty portal-empty-rich">
          <div className="portal-empty-icon">◯</div>
          <h2>{editor ? "Let's get you moving" : "No providers yet"}</h2>
          <p>
            {editor
              ? "Two ways to feel the platform working in under a minute — load a small set of sample providers across stages (one will be flagged so you can see the red flag flow), or add your first real clinician."
              : "Once providers are added to this workspace, you'll see their live credentialing status here."}
          </p>
          {editor && (
            <div className="portal-empty-actions">
              <form action={seedSampleData}>
                <button type="submit" className="acct-btn-primary portal-empty-cta">
                  ✨ Load 5 sample providers
                </button>
              </form>
              <Link href="/app/providers/new" className="acct-btn-secondary">+ Add a real provider</Link>
              <Link href="/app/providers/import" className="acct-btn-secondary">⤓ Bulk import CSV</Link>
            </div>
          )}
          {editor && (
            <p className="portal-empty-hint">
              Sample data is tagged — you can clear it any time, your real providers are never touched.
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Speed-to-billable hero */}
          <div className="portal-card portal-stb-card">
            <div className="portal-stb-grid">
              <div className="portal-stb-main">
                <div className="portal-stb-lbl">Avg projected time to billable</div>
                <div className="portal-stb-val">
                  {avgDaysToBillable}
                  <span className="portal-stb-unit">days</span>
                </div>
                <div className="portal-stb-sub">
                  Across {inProgress.length} provider{inProgress.length === 1 ? "" : "s"} still in pipeline · industry avg ~120 days · CredTek target {TARGET_DAYS_TO_BILLABLE} days
                </div>
              </div>
              <div className="portal-stb-side">
                <div className="portal-stb-sidecard">
                  <div className="portal-stb-side-lbl">Fastest in pipeline</div>
                  <div className="portal-stb-side-val">{fastest}d</div>
                </div>
                <div className="portal-stb-sidecard">
                  <div className="portal-stb-side-lbl">Ready to bill</div>
                  <div className="portal-stb-side-val portal-kpi-pos">{ready}</div>
                </div>
              </div>
            </div>
          </div>

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

          {/* Demo data tag + reset, when sample data is loaded */}
          {editor && hasSample && (
            <div className="portal-card portal-demo-banner">
              <div>
                <strong>You&apos;re viewing sample data.</strong>{" "}
                <span className="portal-muted">
                  These five providers are tagged as demo so you can play freely. Clear them whenever you&apos;re ready to use the workspace for real.
                </span>
              </div>
              <form action={resetSampleData}>
                <button type="submit" className="acct-btn-secondary">Clear sample data</button>
              </form>
            </div>
          )}

          {/* Red flags first */}
          {flagged.length > 0 && (
            <div className="portal-card portal-card-flag">
              <div className="portal-card-head">
                <h2>⚑ Needs attention — running over SLA</h2>
              </div>
              <ul className="portal-pl-list">
                {flagged.map(({ p, stage }) => (
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
            <div className="portal-card-head">
              <h2>⚡ What CredTek is doing for you</h2>
              <div className="portal-card-headlinks">
                <Link href="/app/integrations" className="portal-link">View integrations →</Link>
                <Link href="/app/templates" className="portal-link">View templates →</Link>
              </div>
            </div>
            <ul className="portal-auto-list">
              <li><strong>API connectivity:</strong> NPPES, OIG LEIE, SAM.gov, NPDB, DEA, 17+ state boards, CAQH, PECOS, UHC, Aetna, Anthem, Cigna, Humana — pulled continuously.</li>
              <li><strong>Outbound CRM:</strong> 20+ prebuilt emails &amp; letters fire on schedule — intake reminders, facility status checks, payer follow-ups, denial appeals, billing handoffs.</li>
              <li><strong>Document repos:</strong> two-way sync with Box, Google Drive, SharePoint &amp; OneDrive — your file is the source of truth.</li>
              <li><strong>E-signature:</strong> DocuSign for provider attestations, BAAs, and committee approvals — full audit trail.</li>
              <li><strong>Clearinghouse loop:</strong> Availity + Waystar handshake confirms billable status the moment enrollment lands.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
