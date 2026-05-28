// Re-credentialing — the periodic full re-verification cycle (every ~3
// years per NCQA and most payers). Distinct from Expirables: that tracks
// individual documents lapsing; this tracks the scheduled event where a
// provider's ENTIRE file is re-verified (PSV re-run, re-attestation) and
// re-approved by the credentialing committee.
//
// monthsUntil is canonical (anchored to "now" ~ mid-2026) so the
// forecast buckets stay stable regardless of view date. Only providers
// already through initial credentialing appear — brand-new intakes are
// still in their first cycle.

export type RecredStatus =
  | "overdue"
  | "committee"
  | "in_progress"
  | "due_soon"
  | "on_schedule";

export type Recred = {
  providerSlug: string;
  lastCredentialed: string;
  dueDate: string;
  monthsUntil: number; // negative = overdue
  status: RecredStatus;
};

export const RECRED_STATUS_LABEL: Record<RecredStatus, string> = {
  overdue: "Overdue",
  committee: "Committee review",
  in_progress: "In progress",
  due_soon: "Due this quarter",
  on_schedule: "On schedule",
};

export const RECREDS: Recred[] = [
  { providerSlug: "henry-walsh", lastCredentialed: "Apr 2023", dueDate: "Apr 2026", monthsUntil: -1, status: "overdue" },
  { providerSlug: "marcus-webb", lastCredentialed: "Jun 2023", dueDate: "Jun 2026", monthsUntil: 0, status: "committee" },
  { providerSlug: "daniel-kim", lastCredentialed: "Jun 2023", dueDate: "Jun 2026", monthsUntil: 1, status: "in_progress" },
  { providerSlug: "priya-raman", lastCredentialed: "Jul 2023", dueDate: "Jul 2026", monthsUntil: 2, status: "in_progress" },
  { providerSlug: "robert-hayes", lastCredentialed: "Aug 2023", dueDate: "Aug 2026", monthsUntil: 3, status: "due_soon" },
  { providerSlug: "nicole-bauer", lastCredentialed: "Oct 2023", dueDate: "Oct 2026", monthsUntil: 5, status: "on_schedule" },
  { providerSlug: "sandra-brooks", lastCredentialed: "Nov 2023", dueDate: "Nov 2026", monthsUntil: 6, status: "on_schedule" },
  { providerSlug: "kevin-park", lastCredentialed: "Jan 2024", dueDate: "Jan 2027", monthsUntil: 8, status: "on_schedule" },
  { providerSlug: "thomas-greene", lastCredentialed: "Mar 2024", dueDate: "Mar 2027", monthsUntil: 10, status: "on_schedule" },
  { providerSlug: "james-mitchell", lastCredentialed: "Jun 2024", dueDate: "Jun 2027", monthsUntil: 13, status: "on_schedule" },
];

// Quarter buckets for the capacity-planning forecast.
export type Quarter = "Q3 2026" | "Q4 2026" | "Q1 2027" | "Q2 2027" | "Later";

export function quarterOf(monthsUntil: number): Quarter {
  if (monthsUntil <= 3) return "Q3 2026";
  if (monthsUntil <= 6) return "Q4 2026";
  if (monthsUntil <= 9) return "Q1 2027";
  if (monthsUntil <= 12) return "Q2 2027";
  return "Later";
}

export const QUARTER_ORDER: Quarter[] = ["Q3 2026", "Q4 2026", "Q1 2027", "Q2 2027", "Later"];

export function recredsByDue(): Recred[] {
  return [...RECREDS].sort((a, b) => a.monthsUntil - b.monthsUntil);
}

export function countByStatus(s: RecredStatus): number {
  return RECREDS.filter((r) => r.status === s).length;
}

export function countInQuarter(q: Quarter): number {
  return RECREDS.filter((r) => quarterOf(r.monthsUntil) === q).length;
}
