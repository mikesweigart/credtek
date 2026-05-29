// Pure view-layer types + constants for the coverage matrix. No DB
// imports — safe to consume from both server components and client
// components. The server-side query lives in coverage.ts.

import type { EnrollmentStatus } from "./credentialing";

export type CoverageCell = {
  status: EnrollmentStatus | "no_enrollment";
  enrollmentId: string | null;
  effectiveDate: string | null;
  submittedOn: string | null;
};

export type CoverageProvider = {
  id: string;
  name: string;
  credential: string | null;
  states: string[];
  cells: Map<string, CoverageCell>;
  billableCount: number;
  pendingCount: number;
  gapCount: number;
};

export type CoveragePayer = {
  id: string;
  name: string;
  short_name: string | null;
  kind: string | null;
};

export type CoverageData = {
  providers: CoverageProvider[];
  payers: CoveragePayer[];
  totals: {
    enrollments: number;
    active: number;
    pending: number;
    denied: number;
    notStarted: number;
    gaps: number;
    states: number;
    payers: number;
    billableProviders: number;
  };
};

export const STATUS_DISPLAY: Record<CoverageCell["status"], { label: string; cls: string; short: string }> = {
  active:         { label: "Active",         cls: "cov-cell-active",   short: "Active" },
  drafted:        { label: "Drafted",        cls: "cov-cell-drafted",  short: "Draft" },
  submitted:      { label: "Submitted",      cls: "cov-cell-submitted",short: "Sent" },
  awaiting_info:  { label: "Awaiting info",  cls: "cov-cell-awaiting", short: "Info?" },
  denied:         { label: "Denied",         cls: "cov-cell-denied",   short: "Denied" },
  termed:         { label: "Terminated",     cls: "cov-cell-denied",   short: "Termed" },
  not_started:    { label: "Not started",    cls: "cov-cell-notstart", short: "—" },
  no_enrollment:  { label: "No enrollment (licensed only)", cls: "cov-cell-gap", short: "GAP" },
};
