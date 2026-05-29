// Follow-up queue — what CredTek should send next, derived live from
// real provider data. Every row knows: the provider, what stage they're
// in, how overdue (or due soon) the next nudge is, and what email
// content would go out.
//
// This is intentionally a derivation, not a separate table — the source
// of truth is the providers row + the stage SLA model. That way the
// dashboard, the follow-ups page, and any future automation runner all
// agree on what's "due".

import { listProviders, type DbProvider } from "./providers";
import {
  STAGE_META,
  daysInStage,
  isOverdue,
  nextFollowUpInDays,
} from "./credentialing-model";
import type { Stage } from "./credentialing";

export type FollowUpKind = "overdue" | "scheduled" | "intake_welcome";

export type FollowUp = {
  id: string; // synthesized: provider.id + ":" + kind
  providerId: string;
  providerName: string;
  providerEmail: string | null; // provider's contact email (best-effort)
  credential: string | null;
  stage: Stage;
  stageLabel: string;
  daysInStage: number;
  cadenceDays: number;
  dueIn: number; // days until next scheduled (negative = overdue by N days)
  overdue: boolean;
  kind: FollowUpKind;
  subject: string;
  bodyHtml: string;
  bodyText: string;
};

function firstName(name: string): string {
  return name.split(/\s+/)[0] || name;
}

function providerEmail(p: DbProvider): string | null {
  // The provider row may carry an email in meta as JSON, e.g. {"email":"..."}.
  // We tolerate raw strings too. Real schemas will likely add a column —
  // until then this keeps the demo honest.
  const m = p.meta;
  if (!m) return null;
  try {
    const j = JSON.parse(m as string);
    if (j && typeof j === "object" && typeof j.email === "string") return j.email;
  } catch {
    if (typeof m === "string" && /@/.test(m)) return m;
  }
  return null;
}

function compose(p: DbProvider, stage: Stage, overdueDays: number) {
  const meta = STAGE_META[stage];
  const fname = firstName(p.name);
  const subject =
    overdueDays > 0
      ? `Action needed for your ${meta.short} step (${overdueDays}d overdue)`
      : `Quick CredTek update — ${meta.label}`;

  // Plain English body that matches the stage's automation/follow-up plan.
  const lines: string[] = [];
  lines.push(`Hi ${fname},`);
  lines.push("");
  if (overdueDays > 0) {
    lines.push(
      `Your credentialing file is currently in <strong>${meta.label}</strong>, which has a ${meta.slaDays}-day target — we're now ${overdueDays} day${
        overdueDays === 1 ? "" : "s"
      } past that. We're escalating on your behalf today and would appreciate anything you can send to keep things moving.`
    );
  } else {
    lines.push(
      `Just a heads-up — your file is in <strong>${meta.label}</strong>. ${meta.automation}`
    );
  }
  lines.push("");
  lines.push(`<strong>Next step:</strong> ${meta.followUp}`);
  lines.push("");
  lines.push(
    `You can reply to this email at any time and it will reach your CredTek coordinator directly.`
  );
  lines.push("");
  lines.push("— CredTek");

  const bodyHtml = lines
    .map((l) => (l ? `<p style="margin:0 0 10px 0;">${l}</p>` : ""))
    .join("");
  const bodyText = lines.map((l) => l.replace(/<[^>]+>/g, "")).join("\n");

  return { subject, bodyHtml, bodyText };
}

export async function listFollowUps(): Promise<FollowUp[]> {
  const providers = await listProviders();
  const items: FollowUp[] = [];

  for (const p of providers) {
    const stage = (p.credentialing_stage as Stage) ?? "intake";
    if (stage === "approved") continue; // ongoing monitoring, not a nudge
    const days = daysInStage(p.stage_entered_at, p.created_at);
    const cadence = STAGE_META[stage].followUpDays;
    if (cadence <= 0) continue;

    const overdueB = isOverdue(stage, days);
    const dueIn = overdueB ? -(days - STAGE_META[stage].slaDays) : nextFollowUpInDays(stage, days);
    const kind: FollowUpKind = overdueB ? "overdue" : days === 0 ? "intake_welcome" : "scheduled";

    const { subject, bodyHtml, bodyText } = compose(
      p,
      stage,
      overdueB ? days - STAGE_META[stage].slaDays : 0
    );

    items.push({
      id: `${p.id}:${kind}`,
      providerId: p.id,
      providerName: p.name,
      providerEmail: providerEmail(p),
      credential: p.credential,
      stage,
      stageLabel: STAGE_META[stage].label,
      daysInStage: days,
      cadenceDays: cadence,
      dueIn,
      overdue: overdueB,
      kind,
      subject,
      bodyHtml,
      bodyText,
    });
  }

  // Overdue first, then soonest due, then alpha by name.
  items.sort((a, b) => {
    if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
    if (a.dueIn !== b.dueIn) return a.dueIn - b.dueIn;
    return a.providerName.localeCompare(b.providerName);
  });

  return items;
}
