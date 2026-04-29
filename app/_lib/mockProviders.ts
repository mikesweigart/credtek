// Mock provider data for the demo dashboard. The shape of `Provider`
// is intentionally close to what we'll need for the real Supabase
// schema — same fields, same enum values — so swapping the data
// source later is a small refactor, not a rewrite.

export type ProviderStatus = "active" | "enrolling" | "supervision" | "flag";

export type SupervisionPlan = {
  /** Credential the supervisee is working toward, e.g. "LPC". */
  targetCredential: string;
  /** State the supervision is governed by. */
  state: string;
  requiredHours: number;
  completedHours: number;
  requiredDirectClient: number;
  completedDirectClient: number;
  requiredGroup: number;
  completedGroup: number;
  supervisor: string;
  weeklyHours: number;
  /** Friendly month-year string for the projected independent-licensure date. */
  projectedLicensure: string;
};

export type Provider = {
  slug: string;
  initials: string;
  /** Full name with prefix, e.g. "Dr. Sarah Reyes". */
  name: string;
  /** Credential abbreviation, e.g. "PsyD", "LCSW", "LPC-A". */
  credential: string;
  /** 10-digit NPI string. */
  npi: string;
  status: ProviderStatus;
  statusLabel: string;
  licenseStates: string[];
  /** One-line context shown next to the name on the pipeline row. */
  meta: string;
  /** Set when the provider is pre-licensed; drives the supervision tracker. */
  preLicensed?: SupervisionPlan;
};

export const PROVIDERS: Provider[] = [
  {
    slug: "sarah-reyes",
    initials: "SR",
    name: "Dr. Sarah Reyes",
    credential: "PsyD",
    npi: "1487209456",
    status: "active",
    statusLabel: "Active",
    licenseStates: ["TX", "FL", "GA"],
    meta: "PSYPACT · Psychologist",
  },
  {
    slug: "james-mitchell",
    initials: "JM",
    name: "James Mitchell",
    credential: "LCSW",
    npi: "2109834567",
    status: "enrolling",
    statusLabel: "Enrolling",
    licenseStates: ["CA", "OR"],
    meta: "Optum · Day 12",
  },
  {
    slug: "aisha-patel",
    initials: "AP",
    name: "Aisha Patel",
    credential: "LPC-A",
    npi: "3216549870",
    status: "supervision",
    statusLabel: "Supervision",
    licenseStates: ["TX"],
    meta: "1,840 / 3,000 hrs",
    preLicensed: {
      targetCredential: "LPC",
      state: "Texas",
      requiredHours: 3000,
      completedHours: 1840,
      requiredDirectClient: 1500,
      completedDirectClient: 962,
      requiredGroup: 200,
      completedGroup: 120,
      supervisor: "Dr. Sarah Reyes, PsyD",
      weeklyHours: 24,
      projectedLicensure: "September 2026",
    },
  },
  {
    slug: "daniel-kim",
    initials: "DK",
    name: "Dr. Daniel Kim",
    credential: "MD",
    npi: "4321098765",
    status: "flag",
    statusLabel: "21 days",
    licenseStates: ["CA", "NV"],
    meta: "CA license expiring",
  },
  {
    slug: "rachel-bennett",
    initials: "RB",
    name: "Rachel Bennett",
    credential: "LMFT",
    npi: "5678901234",
    status: "enrolling",
    statusLabel: "Enrolling",
    licenseStates: ["CO"],
    meta: "Magellan · Day 4",
  },
  {
    slug: "marcus-singh",
    initials: "MS",
    name: "Marcus Singh",
    credential: "LCSW",
    npi: "6789012345",
    status: "active",
    statusLabel: "Active",
    licenseStates: ["GA", "AL", "SC"],
    meta: "Carelon · 31 days in",
  },
  {
    slug: "maya-chen",
    initials: "MC",
    name: "Maya Chen",
    credential: "LMSW",
    npi: "7890123456",
    status: "supervision",
    statusLabel: "Supervision",
    licenseStates: ["CA"],
    meta: "2,750 / 3,200 hrs",
    preLicensed: {
      targetCredential: "LCSW",
      state: "California",
      requiredHours: 3200,
      completedHours: 2750,
      requiredDirectClient: 1700,
      completedDirectClient: 1480,
      requiredGroup: 250,
      completedGroup: 210,
      supervisor: "Dr. Elena Park, LCSW",
      weeklyHours: 28,
      projectedLicensure: "August 2026",
    },
  },
  {
    slug: "tyler-brooks",
    initials: "TB",
    name: "Tyler Brooks",
    credential: "LPC-A",
    npi: "8901234567",
    status: "supervision",
    statusLabel: "Supervision",
    licenseStates: ["NY"],
    meta: "1,200 / 4,000 hrs",
    preLicensed: {
      targetCredential: "LMHC",
      state: "New York",
      requiredHours: 4000,
      completedHours: 1200,
      requiredDirectClient: 2000,
      completedDirectClient: 640,
      requiredGroup: 200,
      completedGroup: 80,
      supervisor: "Dr. Rachel Bennett, LMFT",
      weeklyHours: 22,
      projectedLicensure: "March 2028",
    },
  },
  {
    slug: "jordan-williams",
    initials: "JW",
    name: "Jordan Williams",
    credential: "LMFT-A",
    npi: "9012345678",
    status: "supervision",
    statusLabel: "Supervision",
    licenseStates: ["FL"],
    meta: "2,950 / 3,000 hrs",
    preLicensed: {
      targetCredential: "LMFT",
      state: "Florida",
      requiredHours: 3000,
      completedHours: 2950,
      requiredDirectClient: 1500,
      completedDirectClient: 1480,
      requiredGroup: 200,
      completedGroup: 195,
      supervisor: "Dr. Sarah Reyes, PsyD",
      weeklyHours: 26,
      projectedLicensure: "May 2026",
    },
  },
  {
    slug: "priya-shah",
    initials: "PS",
    name: "Priya Shah",
    credential: "LPC-A",
    npi: "0123456789",
    status: "flag",
    statusLabel: "Cosig due",
    licenseStates: ["TX"],
    meta: "supervisor cosig 6 days late",
    preLicensed: {
      targetCredential: "LPC",
      state: "Texas",
      requiredHours: 3000,
      completedHours: 1620,
      requiredDirectClient: 1500,
      completedDirectClient: 820,
      requiredGroup: 200,
      completedGroup: 95,
      supervisor: "Dr. Sarah Reyes, PsyD",
      weeklyHours: 0,
      projectedLicensure: "December 2026",
    },
  },
];

export type AgentEvent = {
  /** "gold" = approval needed, "danger" = expiring/escalation, default sage = info. */
  tone: "default" | "gold" | "danger";
  text: string;
  time: string;
};

export const AGENT_FEED: AgentEvent[] = [
  {
    tone: "gold",
    text: "<strong>Approval needed</strong> — Optum submission for J. Mitchell",
    time: "2 MIN AGO",
  },
  {
    tone: "default",
    text: "<strong>PSV</strong> verified TX LPC license · 99.4% confidence",
    time: "14 MIN AGO",
  },
  {
    tone: "danger",
    text: "<strong>Expiring</strong> D. Kim CA license · 21 days",
    time: "1 HR AGO",
  },
  {
    tone: "default",
    text: "<strong>Supervision</strong> 24 hrs logged · A. Patel · cosigned by Dr. Reyes",
    time: "3 HR AGO",
  },
  {
    tone: "gold",
    text: "<strong>Approval needed</strong> — Carelon submission for A. Patel",
    time: "4 HR AGO",
  },
  {
    tone: "default",
    text: "<strong>CAQH</strong> attestation auto-completed for S. Reyes · awaiting provider sign-off via SMS",
    time: "6 HR AGO",
  },
];

export function findProvider(slug: string): Provider | undefined {
  return PROVIDERS.find((p) => p.slug === slug);
}

// ============================================================================
// State licenses — drives the /licenses 50-state matrix page. Statuses are
// aggregated across the team (e.g., "TX = licensed" means the team holds at
// least one TX license; "OH = compact eligible" means our PSYPACT/Counseling
// Compact members can practice there without a separate state license).
// ============================================================================

export type StateStatus =
  | "licensed"
  | "compact"
  | "pending"
  | "expiring"
  | "eligible";

export type StateRow = { code: string; name: string; status: StateStatus };

export const STATES: StateRow[] = [
  { code: "CA", name: "California", status: "licensed" },
  { code: "TX", name: "Texas", status: "licensed" },
  { code: "FL", name: "Florida", status: "licensed" },
  { code: "NY", name: "New York", status: "expiring" },
  { code: "PA", name: "Pennsylvania", status: "licensed" },
  { code: "IL", name: "Illinois", status: "licensed" },
  { code: "OH", name: "Ohio", status: "compact" },
  { code: "GA", name: "Georgia", status: "compact" },
  { code: "NC", name: "North Carolina", status: "compact" },
  { code: "MI", name: "Michigan", status: "licensed" },
  { code: "NJ", name: "New Jersey", status: "pending" },
  { code: "VA", name: "Virginia", status: "licensed" },
  { code: "WA", name: "Washington", status: "compact" },
  { code: "AZ", name: "Arizona", status: "compact" },
  { code: "MA", name: "Massachusetts", status: "licensed" },
  { code: "TN", name: "Tennessee", status: "compact" },
  { code: "IN", name: "Indiana", status: "compact" },
  { code: "MO", name: "Missouri", status: "licensed" },
  { code: "MD", name: "Maryland", status: "pending" },
  { code: "WI", name: "Wisconsin", status: "compact" },
  { code: "CO", name: "Colorado", status: "compact" },
  { code: "MN", name: "Minnesota", status: "compact" },
  { code: "SC", name: "South Carolina", status: "compact" },
  { code: "AL", name: "Alabama", status: "licensed" },
  { code: "LA", name: "Louisiana", status: "compact" },
  { code: "KY", name: "Kentucky", status: "compact" },
  { code: "OR", name: "Oregon", status: "compact" },
  { code: "OK", name: "Oklahoma", status: "compact" },
  { code: "CT", name: "Connecticut", status: "pending" },
  { code: "UT", name: "Utah", status: "compact" },
  { code: "IA", name: "Iowa", status: "compact" },
  { code: "NV", name: "Nevada", status: "compact" },
  { code: "AR", name: "Arkansas", status: "compact" },
  { code: "MS", name: "Mississippi", status: "compact" },
  { code: "KS", name: "Kansas", status: "compact" },
  { code: "NM", name: "New Mexico", status: "expiring" },
  { code: "NE", name: "Nebraska", status: "compact" },
  { code: "WV", name: "West Virginia", status: "compact" },
  { code: "ID", name: "Idaho", status: "compact" },
  { code: "HI", name: "Hawaii", status: "eligible" },
  { code: "NH", name: "New Hampshire", status: "compact" },
  { code: "ME", name: "Maine", status: "compact" },
  { code: "MT", name: "Montana", status: "compact" },
  { code: "RI", name: "Rhode Island", status: "compact" },
  { code: "DE", name: "Delaware", status: "compact" },
  { code: "SD", name: "South Dakota", status: "compact" },
  { code: "ND", name: "North Dakota", status: "compact" },
  { code: "AK", name: "Alaska", status: "eligible" },
  { code: "VT", name: "Vermont", status: "compact" },
  { code: "WY", name: "Wyoming", status: "compact" },
];

/** Headline numbers shown under the state grid. These are aggregate license
 *  counts across the team, NOT state-cell counts (a 200-provider group holds
 *  many more individual licenses than 50 states). Matches the landing page. */
export const LICENSE_TOTALS = {
  active: 187,
  compactEligible: 31,
  inProgress: 7,
  expiringSoon: 3,
};

// ============================================================================
// Payor enrollments — drives the /payors Kanban. Each row is one
// (provider, payor) pair; the column it lives in is `stage`.
// ============================================================================

export type PayorStage = "drafted" | "submitted" | "info_needed" | "in_network";

export type PayorEnrollment = {
  /** Slug for the provider (matches PROVIDERS.slug so cards link to the detail page). */
  providerSlug: string;
  /** Display name shortened for Kanban density: "Mitchell, J.". */
  providerLabel: string;
  payor: string;
  /** Compact context line: "CA · LCSW", "PSYPACT · PsyD". */
  context: string;
  stage: PayorStage;
  /** Day count for visible context. Negative meaning depends on stage. */
  dayLabel: string;
  /** Set true to render the danger style (escalation needed). */
  danger?: boolean;
  /** Set true to render the success style (active in-network). */
  success?: boolean;
};

export const PAYOR_ENROLLMENTS: PayorEnrollment[] = [
  // --- Drafted (awaiting coordinator approval before submit) ---
  {
    providerSlug: "james-mitchell",
    providerLabel: "Mitchell, J.",
    payor: "Optum",
    context: "CA · LCSW",
    stage: "drafted",
    dayLabel: "READY · APPROVE",
  },
  {
    providerSlug: "aisha-patel",
    providerLabel: "Patel, A.",
    payor: "Carelon",
    context: "TX · LPC-A",
    stage: "drafted",
    dayLabel: "READY · APPROVE",
  },
  {
    providerSlug: "rachel-bennett",
    providerLabel: "Bennett, R.",
    payor: "Magellan",
    context: "CO · LMFT",
    stage: "drafted",
    dayLabel: "READY · APPROVE",
  },
  // --- Submitted (waiting on payor response) ---
  {
    providerSlug: "sarah-reyes",
    providerLabel: "Reyes, S.",
    payor: "Evernorth",
    context: "PSYPACT · PsyD",
    stage: "submitted",
    dayLabel: "DAY 6",
  },
  {
    providerSlug: "james-mitchell",
    providerLabel: "Mitchell, J.",
    payor: "Carelon",
    context: "CA · LCSW",
    stage: "submitted",
    dayLabel: "DAY 12",
  },
  {
    providerSlug: "marcus-singh",
    providerLabel: "Singh, M.",
    payor: "Anthem BH",
    context: "GA · LCSW",
    stage: "submitted",
    dayLabel: "DAY 47 · ESCALATE",
    danger: true,
  },
  // --- Info Needed (payor came back asking for something) ---
  {
    providerSlug: "daniel-kim",
    providerLabel: "Kim, D.",
    payor: "TX Medicaid",
    context: "Superior · MD",
    stage: "info_needed",
    dayLabel: "DEA UPDATE · SMS SENT",
  },
  {
    providerSlug: "aisha-patel",
    providerLabel: "Patel, A.",
    payor: "Optum",
    context: "TX · LPC-A",
    stage: "info_needed",
    dayLabel: "CAQH ATTEST · DUE",
  },
  // --- In-Network (active) ---
  {
    providerSlug: "sarah-reyes",
    providerLabel: "Reyes, S.",
    payor: "Optum",
    context: "PSYPACT · PsyD",
    stage: "in_network",
    dayLabel: "ACTIVE · 38 DAYS",
    success: true,
  },
  {
    providerSlug: "aisha-patel",
    providerLabel: "Patel, A.",
    payor: "Optum",
    context: "TX · LPC-A",
    stage: "in_network",
    dayLabel: "ACTIVE · 42 DAYS",
    success: true,
  },
  {
    providerSlug: "marcus-singh",
    providerLabel: "Singh, M.",
    payor: "Carelon",
    context: "GA · LCSW",
    stage: "in_network",
    dayLabel: "ACTIVE · 31 DAYS",
    success: true,
  },
];

/** Headline column counts. Includes records not visualized as cards (the
 *  Kanban shows ~3 per column for visual density; the count reflects total
 *  pipeline volume). */
export const PAYOR_COLUMN_COUNTS: Record<PayorStage, number> = {
  drafted: 8,
  submitted: 14,
  info_needed: 5,
  in_network: 4,
};
