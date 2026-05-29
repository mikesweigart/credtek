// Per-provider activity timeline — the operational story behind the
// progress bar. Past events are derived deterministically from the
// provider's stage history (stage_entered_at, created_at) and the
// stage model's automation/cadence rules. Projected events show what
// CredTek will do next so credentialing managers can see "what's
// happening behind the scenes."
//
// This is presentation — no DB writes. Once we wire real automation
// runners, they'll log to an activity_log table and this component
// will read that. The shape stays the same.

import {
  STAGE_META,
  STAGE_SEQUENCE,
  daysInStage,
  nextFollowUpInDays,
} from "../../_lib/data/credentialing-model";
import type { Stage } from "../../_lib/data/credentialing";

type Props = {
  stage: Stage;
  stageEnteredAt?: string | null;
  createdAt: string;
  providerName: string;
};

type Tone = "info" | "ok" | "warn" | "auto";

type Event = {
  ts: Date;
  tone: Tone;
  label: string;
  detail?: string;
  future?: boolean;
};

function fmt(d: Date): string {
  const today = new Date(); today.setHours(0,0,0,0);
  const that = new Date(d); that.setHours(0,0,0,0);
  const diffDays = Math.round((that.getTime() - today.getTime()) / 86_400_000);
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (diffDays === 0) return `Today · ${time}`;
  if (diffDays === -1) return `Yesterday · ${time}`;
  if (diffDays === 1) return `Tomorrow · ${time}`;
  if (diffDays > 1 && diffDays <= 7) return `${d.toLocaleDateString([], { weekday: "long" })} · ${time}`;
  if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago · ${time}`;
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function addDays(base: Date, days: number, hour = 9, minute = 0): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function ActivityTimeline({ stage, stageEnteredAt, createdAt, providerName }: Props) {
  const created = new Date(createdAt);
  const entered = new Date(stageEnteredAt ?? createdAt);
  const currentDays = daysInStage(stageEnteredAt, createdAt);
  const currentIdx = STAGE_SEQUENCE.indexOf(stage);

  const events: Event[] = [];

  // -------- Past — provider creation --------
  events.push({
    ts: created,
    tone: "info",
    label: "Provider added to workspace",
    detail: `${providerName} created — credentialing intake started automatically.`,
  });

  // -------- Past — stage history (synthesized from current stage + cadence) --------
  // Walk every stage prior to the current and synthesize a "completed" event.
  // This will be replaced by the activity_log table when the automation
  // runners go live; the timeline shape stays identical.
  for (let i = 0; i < currentIdx; i++) {
    const past = STAGE_SEQUENCE[i];
    const meta = STAGE_META[past];
    // Space them across the gap between created and current-stage-entry.
    const totalGap = Math.max(1, Math.round((entered.getTime() - created.getTime()) / 86_400_000));
    const stride = Math.max(1, Math.round(totalGap / Math.max(1, currentIdx)));
    const stageDate = addDays(created, stride * (i + 1), 14, 0);

    events.push({
      ts: stageDate,
      tone: "ok",
      label: `${meta.short} complete`,
      detail: meta.automation,
    });
  }

  // -------- Past — automated follow-ups already fired in the current stage --------
  const cadence = STAGE_META[stage].followUpDays;
  if (cadence > 0 && currentDays >= cadence) {
    const firedCount = Math.floor(currentDays / cadence);
    for (let n = 1; n <= firedCount && n <= 4; n++) {
      events.push({
        ts: addDays(entered, n * cadence, 9, 30),
        tone: "auto",
        label: `Automated ${STAGE_META[stage].short.toLowerCase()} follow-up fired`,
        detail: STAGE_META[stage].followUp,
      });
    }
  }

  // -------- Now — current state --------
  const slaDays = STAGE_META[stage].slaDays;
  const overdue = slaDays > 0 && currentDays > slaDays;
  events.push({
    ts: entered,
    tone: overdue ? "warn" : "info",
    label: `Entered ${STAGE_META[stage].label}`,
    detail: overdue
      ? `${currentDays}d in stage — ${currentDays - slaDays}d over the ${slaDays}-day SLA target.`
      : `${currentDays}d in stage — SLA target is ${slaDays || "ongoing"}d.`,
  });

  // -------- Future — projected next automation events --------
  const projected: Event[] = [];
  if (stage !== "approved") {
    if (cadence > 0) {
      const inDays = nextFollowUpInDays(stage, currentDays);
      projected.push({
        ts: addDays(new Date(), inDays, 9, 0),
        tone: "auto",
        label: `Next ${STAGE_META[stage].short.toLowerCase()} follow-up scheduled`,
        detail: STAGE_META[stage].followUp,
        future: true,
      });
    }
    // Escalation projection
    if (stage === "psv") {
      const silentInDays = Math.max(0, 5 - currentDays);
      projected.push({
        ts: addDays(new Date(), silentInDays, 10, 0),
        tone: "warn",
        label: silentInDays === 0 ? "Escalate to credentialing specialist (any silent source)" : "Auto-escalate trigger",
        detail: "If any PSV source is silent for 5 days, file is auto-escalated to a coordinator.",
        future: true,
      });
    }
    // Projected stage advance — earliest plausible completion based on SLA target.
    const remaining = Math.max(1, slaDays - currentDays);
    const nextStage = STAGE_SEQUENCE[currentIdx + 1];
    if (nextStage) {
      projected.push({
        ts: addDays(new Date(), remaining, 17, 0),
        tone: "info",
        label: `Projected advance to ${STAGE_META[nextStage].short}`,
        detail: `If automation completes within SLA, file advances to ${STAGE_META[nextStage].label}.`,
        future: true,
      });
    }
  } else {
    projected.push({
      ts: addDays(new Date(), 1, 9, 0),
      tone: "auto",
      label: "Continuous sanctions monitoring active",
      detail: "OIG + SAM monitored daily; expirables forecasted on a rolling 90-day window.",
      future: true,
    });
  }

  // Sort past chronologically, then append projected (also chronologically).
  const past = events.sort((a, b) => a.ts.getTime() - b.ts.getTime());
  const future = projected.sort((a, b) => a.ts.getTime() - b.ts.getTime());

  return (
    <div className="portal-card at-card">
      <div className="portal-card-head">
        <h2>Activity timeline</h2>
        <span className="portal-muted at-head-meta">Past · Projected</span>
      </div>
      <ol className="at-list" aria-label="Provider activity timeline">
        {past.map((e, i) => (
          <li key={`p-${i}`} className={`at-row at-tone-${e.tone}`}>
            <div className="at-dot" aria-hidden />
            <div className="at-row-body">
              <div className="at-row-when">{fmt(e.ts)}</div>
              <div className="at-row-label">{e.label}</div>
              {e.detail && <div className="at-row-detail">{e.detail}</div>}
            </div>
          </li>
        ))}

        {future.length > 0 && (
          <li className="at-divider" aria-hidden>
            <span>Projected</span>
          </li>
        )}

        {future.map((e, i) => (
          <li key={`f-${i}`} className={`at-row at-tone-${e.tone} at-row-future`}>
            <div className="at-dot at-dot-future" aria-hidden />
            <div className="at-row-body">
              <div className="at-row-when">{fmt(e.ts)}</div>
              <div className="at-row-label">{e.label}</div>
              {e.detail && <div className="at-row-detail">{e.detail}</div>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
