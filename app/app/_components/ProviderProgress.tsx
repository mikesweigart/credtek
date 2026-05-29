// Animated credentialing progress for a provider. Shows where they are
// in the pipeline, what's automated, when the next follow-up fires, and
// a RED FLAG (pulsing) when the current stage is over its SLA.
//
// Server component — all animation is CSS, so it's fast and works in the
// list and on the detail page.

import {
  STAGE_SEQUENCE,
  STAGE_META,
  daysInStage,
  isOverdue,
  overdueBy,
  progressPct,
  nextFollowUpInDays,
} from "../../_lib/data/credentialing-model";
import type { Stage } from "../../_lib/data/credentialing";

type Props = {
  stage: Stage;
  stageEnteredAt?: string | null;
  createdAt?: string | null;
  compact?: boolean;
};

export function ProviderProgress({ stage, stageEnteredAt, createdAt, compact }: Props) {
  const days = daysInStage(stageEnteredAt, createdAt);
  const meta = STAGE_META[stage];
  const overdue = isOverdue(stage, days);
  const pct = progressPct(stage);
  const idx = STAGE_SEQUENCE.indexOf(stage);
  const fu = nextFollowUpInDays(stage, days);

  if (compact) {
    return (
      <div className="pp">
        <div className="pp-track">
          <div className={`pp-fill${overdue ? " pp-fill-flag" : ""}`} style={{ width: `${Math.max(pct, 4)}%` }} />
        </div>
        <div className="pp-compact-meta">
          <span className="pp-stage-name">{meta.short}</span>
          {stage !== "approved" ? (
            overdue ? (
              <span className="pp-flag-pill">⚑ {overdueBy(stage, days)}d over SLA</span>
            ) : (
              <span className="pp-ontrack-pill">on track · {days}/{meta.slaDays}d</span>
            )
          ) : (
            <span className="pp-done-pill">✓ Ready to bill</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pp-full">
      {/* Stepper */}
      <ol className="pp-stepper">
        {STAGE_SEQUENCE.map((st, i) => {
          const state = i < idx ? "done" : i === idx ? "current" : "todo";
          const flagged = i === idx && overdue;
          return (
            <li key={st} className={`pp-step pp-step-${state}${flagged ? " pp-step-flag" : ""}`}>
              <span className="pp-step-dot">{state === "done" ? "✓" : i + 1}</span>
              <span className="pp-step-label">{STAGE_META[st].short}</span>
              {STAGE_META[st].automated && <span className="pp-step-auto" title="Automated">⚡</span>}
            </li>
          );
        })}
      </ol>

      {/* Current-stage status card */}
      {stage !== "approved" ? (
        <div className={`pp-status${overdue ? " pp-status-flag" : ""}`}>
          <div className="pp-status-left">
            <div className="pp-status-stage">
              {meta.label}
              <span className={`pp-auto-badge ${meta.automated ? "pp-auto-on" : "pp-auto-off"}`}>
                {meta.automated ? "⚡ Automated" : "👤 Coordinator"}
              </span>
            </div>
            <div className="pp-status-time">
              {overdue ? (
                <span className="pp-flag-text">⚑ Overdue by {overdueBy(stage, days)} day{overdueBy(stage, days) === 1 ? "" : "s"} — past the {meta.slaDays}-day SLA</span>
              ) : (
                <span className="pp-ontrack-text">Day {days} of {meta.slaDays} · on track</span>
              )}
            </div>
          </div>
          {fu > 0 && (
            <div className="pp-followup">
              <div className="pp-followup-lbl">Next auto follow-up</div>
              <div className="pp-followup-val">in {fu} day{fu === 1 ? "" : "s"}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="pp-status pp-status-done">
          <div className="pp-status-stage">✓ Approved · ready to bill</div>
          <div className="pp-status-time">Continuous expirables &amp; re-credentialing monitoring is active.</div>
        </div>
      )}

      {/* What's happening now */}
      <div className="pp-detail">
        <div className="pp-detail-row">
          <span className="pp-detail-lbl">What&apos;s automated here</span>
          <span className="pp-detail-val">{meta.automation}</span>
        </div>
        {meta.followUpDays > 0 && (
          <div className="pp-detail-row">
            <span className="pp-detail-lbl">Follow-up cadence</span>
            <span className="pp-detail-val">{meta.followUp}</span>
          </div>
        )}
      </div>
    </div>
  );
}
