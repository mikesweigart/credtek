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
