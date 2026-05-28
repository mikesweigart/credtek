// Expirables — every time-bound credential across the roster that will
// lapse if not renewed: state licenses, DEA/CDS, board certs, malpractice
// (COI), and CAQH attestations. This is the dataset behind the Expirables
// command center.
//
// daysUntil is stored canonically (not computed from the wall clock) so
// the demo's urgency buckets stay stable no matter when it's viewed.
// Coherent with the dashboard scenarios — e.g. Daniel Kim's WA license at
// 21 days is the same item that drives the dashboard's expiring alert.

export type ExpirableKind =
  | "State License"
  | "DEA Registration"
  | "CDS Registration"
  | "Board Certification"
  | "Malpractice (COI)"
  | "CAQH Attestation";

export type Expirable = {
  id: string;
  providerSlug: string;
  kind: ExpirableKind;
  label: string;
  state?: string;
  expiresOn: string; // friendly display date
  daysUntil: number; // canonical countdown
  autoRenew: boolean; // is CredTek's renewal already drafted?
};

export type ExpWindow = "0-30" | "31-60" | "61-90" | "91-180";

export const WINDOW_META: Record<
  ExpWindow,
  { label: string; tone: "critical" | "warn" | "caution" | "planned" }
> = {
  "0-30": { label: "Next 30 days", tone: "critical" },
  "31-60": { label: "31–60 days", tone: "warn" },
  "61-90": { label: "61–90 days", tone: "caution" },
  "91-180": { label: "91–180 days", tone: "planned" },
};

export const EXPIRABLES: Expirable[] = [
  // ── 0–30 days · act now ──
  { id: "x-01", providerSlug: "daniel-kim", kind: "State License", label: "WA Medical License", state: "WA", expiresOn: "Jun 18, 2026", daysUntil: 21, autoRenew: true },
  { id: "x-02", providerSlug: "sarah-chen", kind: "DEA Registration", label: "DEA Registration", expiresOn: "Jun 9, 2026", daysUntil: 12, autoRenew: false },
  { id: "x-03", providerSlug: "robert-hayes", kind: "CAQH Attestation", label: "CAQH re-attestation", expiresOn: "Jun 5, 2026", daysUntil: 8, autoRenew: true },
  { id: "x-04", providerSlug: "priya-raman", kind: "Malpractice (COI)", label: "Malpractice COI", expiresOn: "Jun 24, 2026", daysUntil: 27, autoRenew: true },

  // ── 31–60 days ──
  { id: "x-05", providerSlug: "marcus-webb", kind: "State License", label: "ND Medical License", state: "ND", expiresOn: "Jul 8, 2026", daysUntil: 41, autoRenew: true },
  { id: "x-06", providerSlug: "james-mitchell", kind: "CAQH Attestation", label: "CAQH re-attestation", expiresOn: "Jul 14, 2026", daysUntil: 47, autoRenew: true },
  { id: "x-07", providerSlug: "maria-lopez", kind: "Malpractice (COI)", label: "Malpractice COI", expiresOn: "Jul 20, 2026", daysUntil: 53, autoRenew: false },
  { id: "x-08", providerSlug: "alex-johnson", kind: "CDS Registration", label: "MN CDS Registration", state: "MN", expiresOn: "Jul 26, 2026", daysUntil: 59, autoRenew: true },

  // ── 61–90 days ──
  { id: "x-09", providerSlug: "kevin-park", kind: "DEA Registration", label: "DEA Registration", expiresOn: "Aug 14, 2026", daysUntil: 78, autoRenew: true },
  { id: "x-10", providerSlug: "nicole-bauer", kind: "State License", label: "WA Nurse License", state: "WA", expiresOn: "Aug 5, 2026", daysUntil: 69, autoRenew: true },
  { id: "x-11", providerSlug: "thomas-greene", kind: "Board Certification", label: "EMS Medical Direction cert", expiresOn: "Aug 22, 2026", daysUntil: 86, autoRenew: false },

  // ── 91–180 days · planned ──
  { id: "x-12", providerSlug: "alex-johnson", kind: "State License", label: "MN Medical License", state: "MN", expiresOn: "Sep 30, 2026", daysUntil: 125, autoRenew: true },
  { id: "x-13", providerSlug: "sarah-chen", kind: "State License", label: "NY Medical License", state: "NY", expiresOn: "Oct 12, 2026", daysUntil: 137, autoRenew: true },
  { id: "x-14", providerSlug: "robert-hayes", kind: "Board Certification", label: "Emergency Medicine board cert", expiresOn: "Nov 4, 2026", daysUntil: 160, autoRenew: true },
  { id: "x-15", providerSlug: "sandra-brooks", kind: "Malpractice (COI)", label: "Malpractice COI", expiresOn: "Oct 28, 2026", daysUntil: 153, autoRenew: true },
  { id: "x-16", providerSlug: "henry-walsh", kind: "State License", label: "MN Medical License", state: "MN", expiresOn: "Nov 20, 2026", daysUntil: 176, autoRenew: true },
  { id: "x-17", providerSlug: "kevin-park", kind: "CAQH Attestation", label: "CAQH re-attestation", expiresOn: "Sep 18, 2026", daysUntil: 113, autoRenew: true },
];

export function windowOf(days: number): ExpWindow {
  if (days <= 30) return "0-30";
  if (days <= 60) return "31-60";
  if (days <= 90) return "61-90";
  return "91-180";
}

export function expirableTone(days: number): "critical" | "warn" | "caution" | "planned" {
  return WINDOW_META[windowOf(days)].tone;
}

/** All expirables, soonest first. */
export function expirablesSorted(): Expirable[] {
  return [...EXPIRABLES].sort((a, b) => a.daysUntil - b.daysUntil);
}

export function countInWindow(w: ExpWindow): number {
  return EXPIRABLES.filter((e) => windowOf(e.daysUntil) === w).length;
}

export function autoRenewCount(): number {
  return EXPIRABLES.filter((e) => e.autoRenew).length;
}
