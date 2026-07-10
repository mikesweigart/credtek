// Follow-ups — the "what needs a human nudge right now" intelligence
// layer. Each item is something the credentialing team would otherwise
// have to remember to chase: an expiring credential, a missing document,
// a stalled payer enrollment, an overdue attestation, a supervision
// cosignature. Each carries a one-click action that — once the user's
// email is connected — sends from their inbox.

export type FollowupKind =
  | "renewal"
  | "missing_doc"
  | "enrollment"
  | "attestation"
  | "supervision"
  | "psv";

export type FollowupChannel = "provider" | "payer" | "supervisor" | "board";
export type Urgency = "high" | "medium" | "low";

export type Followup = {
  id: string;
  providerSlug: string;
  kind: FollowupKind;
  urgency: Urgency;
  title: string;
  detail: string;
  action: string; // button label
  channel: FollowupChannel;
};

export const CHANNEL_LABEL: Record<FollowupChannel, string> = {
  provider: "To provider",
  payer: "To payer",
  supervisor: "To supervisor",
  board: "To state board",
};

export const FOLLOWUPS: Followup[] = [
  {
    id: "f-01",
    providerSlug: "robert-hayes",
    kind: "attestation",
    urgency: "high",
    title: "CAQH re-attestation due in 8 days",
    detail: "Dr. Robert Hayes must re-attest his CAQH profile or downstream enrollments stall.",
    action: "Send attestation reminder",
    channel: "provider",
  },
  {
    id: "f-02",
    providerSlug: "sarah-chen",
    kind: "renewal",
    urgency: "high",
    title: "DEA registration expires in 12 days",
    detail: "Dr. Sarah Chen's DEA lapses soon; no auto-renewal on file yet.",
    action: "Send renewal reminder",
    channel: "provider",
  },
  {
    id: "f-03",
    providerSlug: "daniel-kim",
    kind: "renewal",
    urgency: "high",
    title: "WA license expires in 21 days",
    detail: "Renewal is auto-drafted — needs Dr. Kim's signature to submit.",
    action: "Request signature",
    channel: "provider",
  },
  {
    id: "f-04",
    providerSlug: "alex-johnson",
    kind: "enrollment",
    urgency: "high",
    title: "MN Medicaid enrollment pending 37 days",
    detail: "Dr. Johnson is ready to work but not billable in MN until Medicaid clears.",
    action: "Escalate to payer",
    channel: "payer",
  },
  {
    id: "f-05",
    providerSlug: "olivia-reed",
    kind: "missing_doc",
    urgency: "high",
    title: "Background check not uploaded",
    detail: "Onboarding for Olivia Reed is blocked pending her district background check.",
    action: "Request document",
    channel: "provider",
  },
  {
    id: "f-06",
    providerSlug: "olivia-reed",
    kind: "missing_doc",
    urgency: "medium",
    title: "Pediatric care attestation outstanding",
    detail: "Required for the National School Health Network space.",
    action: "Request document",
    channel: "provider",
  },
  {
    id: "f-07",
    providerSlug: "james-mitchell",
    kind: "enrollment",
    urgency: "medium",
    title: "NY Medicaid BH MCO enrollment pending",
    detail: "James Mitchell, LCSW — application submitted, awaiting MCO response.",
    action: "Follow up with payer",
    channel: "payer",
  },
  {
    id: "f-08",
    providerSlug: "sarah-chen",
    kind: "psv",
    urgency: "medium",
    title: "PSV awaiting board verification (Day 11)",
    detail: "Psychiatry board verification outstanding for Dr. Chen.",
    action: "Follow up with board",
    channel: "board",
  },
  {
    id: "f-09",
    providerSlug: "maria-lopez",
    kind: "psv",
    urgency: "medium",
    title: "KS RHTP privileging 3 of 5 sites complete",
    detail: "Two facility privileging packets still open for Dr. Lopez.",
    action: "Follow up with facilities",
    channel: "board",
  },
  {
    id: "f-10",
    providerSlug: "aisha-patel",
    kind: "supervision",
    urgency: "medium",
    title: "Weekly supervision cosignature due",
    detail: "Aisha Patel's supervisor needs to cosign this week's logged hours.",
    action: "Remind supervisor",
    channel: "supervisor",
  },
  {
    id: "f-11",
    providerSlug: "priya-raman",
    kind: "renewal",
    urgency: "low",
    title: "Malpractice COI expires in 27 days",
    detail: "Auto-drafted — courtesy reminder recommended.",
    action: "Send renewal reminder",
    channel: "provider",
  },
  {
    id: "f-12",
    providerSlug: "marcus-webb",
    kind: "renewal",
    urgency: "low",
    title: "ND license renewal in 41 days",
    detail: "Auto-drafted; on track.",
    action: "Send renewal reminder",
    channel: "provider",
  },
];

export function followupsByUrgency(): Followup[] {
  const rank: Record<Urgency, number> = { high: 0, medium: 1, low: 2 };
  return [...FOLLOWUPS].sort((a, b) => rank[a.urgency] - rank[b.urgency]);
}

export function countByUrgency(u: Urgency): number {
  return FOLLOWUPS.filter((f) => f.urgency === u).length;
}
