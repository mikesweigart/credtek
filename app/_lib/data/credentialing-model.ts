// The credentialing workflow intelligence model. Defines, for every
// stage: its SLA target, what CredTek automates there, and how often the
// automated follow-up runs. This is what powers the progress
// visualization, the "what's automated / when does follow-up fire"
// explanations, and the SLA red flags.

import type { Stage } from "./credentialing";

export type StageMeta = {
  stage: Stage;
  label: string;
  short: string;
  slaDays: number; // target days in this stage (0 = terminal)
  automated: boolean; // is this stage primarily automated by CredTek
  automation: string; // what the platform does automatically here
  followUp: string; // the automated follow-up cadence
  followUpDays: number; // cadence in days (0 = none)
};

export const STAGE_SEQUENCE: Stage[] = [
  "intake",
  "psv",
  "privileging",
  "committee",
  "enrollment",
  "approved",
];

export const STAGE_META: Record<Stage, StageMeta> = {
  intake: {
    stage: "intake",
    label: "Intake",
    short: "Intake",
    slaDays: 3,
    automated: true,
    automation:
      "SMS + email document request sent to the provider; OCR extracts every field from uploaded licenses, DEA, and COI with confidence scoring.",
    followUp: "Auto-reminder to the provider every 2 days until documents arrive.",
    followUpDays: 2,
  },
  psv: {
    stage: "psv",
    label: "Primary Source Verification",
    short: "PSV",
    slaDays: 10,
    automated: true,
    automation:
      "NPPES, OIG LEIE, SAM.gov, state board, NPDB and DEA queries run automatically and continuously.",
    followUp: "Auto-escalate to a credentialing specialist if any source is silent for 5 days.",
    followUpDays: 5,
  },
  privileging: {
    stage: "privileging",
    label: "Privileging",
    short: "Privileging",
    slaDays: 21,
    automated: false,
    automation: "Privileging packet auto-assembled and sent to the facility medical-staff office.",
    followUp: "Auto-reminder to the facility every 7 days until privileges are granted.",
    followUpDays: 7,
  },
  committee: {
    stage: "committee",
    label: "Committee review",
    short: "Committee",
    slaDays: 7,
    automated: false,
    automation: "Audit-ready file auto-compiled and routed to the credentialing committee.",
    followUp: "Reminder to the committee chair 2 days before the meeting.",
    followUpDays: 2,
  },
  enrollment: {
    stage: "enrollment",
    label: "Payer enrollment",
    short: "Enrollment",
    slaDays: 40,
    automated: true,
    automation:
      "Payer applications auto-filled from the golden profile — every submission passes a human approval gate first.",
    followUp: "Auto status-check and payer escalation every 7 days.",
    followUpDays: 7,
  },
  approved: {
    stage: "approved",
    label: "Approved · ready to bill",
    short: "Approved",
    slaDays: 0,
    automated: false,
    automation: "Provider is billable. Continuous sanctions + expirables monitoring begins.",
    followUp: "Ongoing expirables and re-credentialing monitoring.",
    followUpDays: 0,
  },
};

/** Whole days since the provider entered the current stage. */
export function daysInStage(stageEnteredAt?: string | null, createdAt?: string | null): number {
  const ts = stageEnteredAt ?? createdAt;
  if (!ts) return 0;
  const ms = Date.now() - new Date(ts).getTime();
  if (Number.isNaN(ms)) return 0;
  return Math.max(0, Math.floor(ms / 86_400_000));
}

/** Over the stage's SLA → red flag. */
export function isOverdue(stage: Stage, days: number): boolean {
  const sla = STAGE_META[stage].slaDays;
  return sla > 0 && days > sla;
}

export function overdueBy(stage: Stage, days: number): number {
  const sla = STAGE_META[stage].slaDays;
  return sla > 0 ? Math.max(0, days - sla) : 0;
}

/** 0–100 progress through the pipeline. */
export function progressPct(stage: Stage): number {
  const i = STAGE_SEQUENCE.indexOf(stage);
  if (i < 0) return 0;
  return Math.round((i / (STAGE_SEQUENCE.length - 1)) * 100);
}

/** Days until the next automated follow-up fires for this stage. */
export function nextFollowUpInDays(stage: Stage, days: number): number {
  const cadence = STAGE_META[stage].followUpDays;
  if (cadence <= 0) return 0;
  const r = cadence - (days % cadence);
  return r === 0 ? cadence : r;
}

/** Total target days from intake start to approved-and-billable. */
export const TARGET_DAYS_TO_BILLABLE: number = STAGE_SEQUENCE
  .filter((s) => s !== "approved")
  .reduce((sum, s) => sum + STAGE_META[s].slaDays, 0);

/** Projected days remaining until this provider is approved & billable. */
export function projectedDaysToBillable(stage: Stage, daysInCurrentStage: number): number {
  if (stage === "approved") return 0;
  const idx = STAGE_SEQUENCE.indexOf(stage);
  if (idx < 0) return TARGET_DAYS_TO_BILLABLE;
  const remainingInCurrent = Math.max(0, STAGE_META[stage].slaDays - daysInCurrentStage);
  const futureStages = STAGE_SEQUENCE.slice(idx + 1).filter((s) => s !== "approved");
  const futureDays = futureStages.reduce((sum, s) => sum + STAGE_META[s].slaDays, 0);
  return remainingInCurrent + futureDays;
}

/** Days already invested in this provider since they were added. */
export function daysSinceAdded(createdAt: string): number {
  const ms = Date.now() - new Date(createdAt).getTime();
  if (Number.isNaN(ms)) return 0;
  return Math.max(0, Math.floor(ms / 86_400_000));
}
