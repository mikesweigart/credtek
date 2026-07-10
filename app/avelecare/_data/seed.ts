// Seeded demo data for the Eastside Hospital credentialing portal.
// All providers, spaces, and statuses below are fictional but
// realistic — modelled on Eastside Hospital's actual service lines, partner
// states (WA / MN / KS / NY / SD / multi-state), and required
// scenarios from the build spec:
//
//   1. One provider ready to work clinically but NOT yet ready
//      to bill — payer enrollment pending.
//   2. One provider with an expiring license that triggers alerts.
//
// Counts and KPIs across the portal are computed from this file
// so the data stays consistent across pages.

export type Stage =
  | "intake"
  | "psv"
  | "privileges"
  | "compliance"
  | "enrollment"
  | "ready";

export const STAGE_LABEL: Record<Stage, string> = {
  intake: "Intake",
  psv: "Primary Source Verification",
  privileges: "Privileges",
  compliance: "Compliance",
  enrollment: "Payer Enrollment",
  ready: "Ready to Bill",
};

export const SERVICE_LINES = [
  "Emergency",
  "Critical Care / ICU",
  "Hospitalist",
  "Behavioral Health",
  "Crisis Care",
  "EMS",
  "Pharmacy",
  "Senior Care",
  "School Health",
  "Specialty Clinic",
] as const;

export type ServiceLine = (typeof SERVICE_LINES)[number];

export type Provider = {
  id: string;
  slug: string;
  initials: string;
  name: string;
  role: string; // "Physician", "Nurse Practitioner", etc.
  credentials: string; // "MD", "DO", "MD, FACEP", "PharmD", "LCSW"
  specialty: string;
  serviceLines: ServiceLine[];
  statesLicensed: string[];
  spaceIds: string[];
  stage: Stage;
  readyToWork: boolean;
  readyToBill: boolean;
  flags: string[]; // human-readable risk strings
  /** Days the provider has been in the current credentialing stage. */
  daysInStage: number;
};

export type Space = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  serviceLine: ServiceLine | "Multi-line";
  region: string;
  description: string;
  requirements: string[];
};

export const SPACES: Space[] = [
  {
    id: "east-adams",
    slug: "east-adams-rural-healthcare",
    name: "East Adams Rural Healthcare",
    shortName: "East Adams",
    serviceLine: "Emergency",
    region: "Washington",
    description:
      "Virtual Emergency Department coverage delivered by Eastside Hospital telemedicine experts for the East Adams Rural Healthcare critical access hospital.",
    requirements: [
      "Active Washington medical licensure",
      "East Adams hospital privileging packet",
      "Annual airway and trauma training certification",
      "WA Medicaid + Medicare enrollment",
    ],
  },
  {
    id: "mn-rural",
    slug: "minnesota-rural-hospitals",
    name: "Minnesota Rural Hospital Network",
    shortName: "MN Rural",
    serviceLine: "Multi-line",
    region: "Minnesota",
    description:
      "Hospitalist and Virtual ICU coverage across 12 rural Minnesota hospitals, supporting 24/7 inpatient care without on-site specialist availability.",
    requirements: [
      "Active Minnesota medical licensure",
      "MN-specific telemedicine attestation",
      "Network privileging across 12 sites (group privileging packet)",
      "MN Medicaid + at least one commercial payer enrollment",
    ],
  },
  {
    id: "ks-rhtp",
    slug: "kansas-rhtp",
    name: "Kansas Rural Health Transformation Program",
    shortName: "Kansas RHTP",
    serviceLine: "Multi-line",
    region: "Kansas",
    description:
      "Emergency, EMS, and Critical Care coverage delivered to Kansas rural and critical access hospitals participating in the state's Rural Health Transformation Program.",
    requirements: [
      "Active Kansas medical licensure",
      "KS RHTP-specific facility privileging",
      "KS Medicaid managed-care MCO enrollment",
      "EMS medical-direction credentialing (where applicable)",
    ],
  },
  {
    id: "ny-crisis",
    slug: "new-york-crisis-care",
    name: "New York Crisis Care Program",
    shortName: "NY Crisis Care",
    serviceLine: "Behavioral Health",
    region: "New York",
    description:
      "Virtual Behavioral Health Crisis response for the New York State 988 partnership and partner emergency departments across the state.",
    requirements: [
      "Active New York behavioral-health licensure",
      "NY Office of Mental Health crisis-response training",
      "988 partnership protocols",
      "NY Medicaid + commercial behavioral health enrollment",
    ],
  },
  {
    id: "school-health",
    slug: "national-school-health-network",
    name: "National School Health Network",
    shortName: "School Health",
    serviceLine: "School Health",
    region: "Multi-state",
    description:
      "School-based virtual care across K–12 districts in SD, ND, IA, MN, NE, and TX. Same-day acute care, behavioral health triage, and chronic-condition management.",
    requirements: [
      "State licensure for each participating district",
      "School-based pediatric care attestation",
      "Background checks compliant with district policies",
      "State Medicaid + CHIP enrollment",
    ],
  },
  {
    id: "senior-care",
    slug: "senior-care-network",
    name: "Senior Care Network",
    shortName: "Senior Care",
    serviceLine: "Senior Care",
    region: "Multi-state",
    description:
      "Virtual rounding, medication management, and dementia-specialist consults across 84 long-term care and skilled nursing facilities nationwide.",
    requirements: [
      "Active medical licensure in each LTC facility state",
      "DEA registration for medication management",
      "Geriatric-care competency attestation",
      "Medicare + state Medicaid LTC enrollment",
    ],
  },
];

export const PROVIDERS: Provider[] = [
  {
    id: "p-001",
    slug: "alex-johnson",
    initials: "AJ",
    name: "Dr. Alex Johnson",
    role: "Physician",
    credentials: "MD, FACEP",
    specialty: "Emergency Medicine",
    serviceLines: ["Emergency", "Critical Care / ICU"],
    statesLicensed: ["WA", "MN", "ID"],
    spaceIds: ["east-adams", "mn-rural"],
    stage: "enrollment",
    readyToWork: true,
    readyToBill: false,
    flags: ["MN Medicaid enrollment pending 37 days"],
    daysInStage: 37,
  },
  {
    id: "p-002",
    slug: "priya-raman",
    initials: "PR",
    name: "Dr. Priya Raman",
    role: "Physician",
    credentials: "MD",
    specialty: "Critical Care",
    serviceLines: ["Critical Care / ICU"],
    statesLicensed: ["MN", "IA", "WI"],
    spaceIds: ["mn-rural"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 4,
  },
  {
    id: "p-003",
    slug: "marcus-webb",
    initials: "MW",
    name: "Dr. Marcus Webb",
    role: "Physician",
    credentials: "DO",
    specialty: "Hospitalist",
    serviceLines: ["Hospitalist"],
    statesLicensed: ["MN", "ND", "SD"],
    spaceIds: ["mn-rural"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 8,
  },
  {
    id: "p-004",
    slug: "sarah-chen",
    initials: "SC",
    name: "Dr. Sarah Chen",
    role: "Physician",
    credentials: "MD",
    specialty: "Psychiatry",
    serviceLines: ["Behavioral Health", "Crisis Care"],
    statesLicensed: ["NY", "NJ", "CT"],
    spaceIds: ["ny-crisis"],
    stage: "psv",
    readyToWork: false,
    readyToBill: false,
    flags: ["PSV awaiting board verification (Day 11)"],
    daysInStage: 11,
  },
  {
    id: "p-005",
    slug: "james-mitchell",
    initials: "JM",
    name: "James Mitchell",
    role: "Social Worker",
    credentials: "LCSW",
    specialty: "Behavioral Health",
    serviceLines: ["Behavioral Health", "Crisis Care"],
    statesLicensed: ["NY", "CT"],
    spaceIds: ["ny-crisis"],
    stage: "enrollment",
    readyToWork: true,
    readyToBill: false,
    flags: ["NY Medicaid BH MCO enrollment pending"],
    daysInStage: 22,
  },
  {
    id: "p-006",
    slug: "robert-hayes",
    initials: "RH",
    name: "Dr. Robert Hayes",
    role: "Physician",
    credentials: "MD, FACEP",
    specialty: "Emergency Medicine",
    serviceLines: ["Emergency"],
    statesLicensed: ["KS", "MO", "OK"],
    spaceIds: ["ks-rhtp"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 12,
  },
  {
    id: "p-007",
    slug: "aisha-patel",
    initials: "AP",
    name: "Aisha Patel",
    role: "Counselor",
    credentials: "LPC-A",
    specialty: "Behavioral Health (Pre-licensed Supervision)",
    serviceLines: ["School Health", "Behavioral Health"],
    statesLicensed: ["TX"],
    spaceIds: ["school-health"],
    stage: "compliance",
    readyToWork: false,
    readyToBill: false,
    flags: ["Pre-licensed supervision: 1,840 / 3,000 hours"],
    daysInStage: 18,
  },
  {
    id: "p-008",
    slug: "daniel-kim",
    initials: "DK",
    name: "Dr. Daniel Kim",
    role: "Physician",
    credentials: "MD",
    specialty: "Hospitalist",
    serviceLines: ["Hospitalist", "Emergency"],
    statesLicensed: ["WA", "OR"],
    spaceIds: ["east-adams"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: ["WA license expires in 21 days — renewal in flight"],
    daysInStage: 2,
  },
  {
    id: "p-009",
    slug: "nicole-bauer",
    initials: "NB",
    name: "Nicole Bauer",
    role: "Nurse Practitioner",
    credentials: "DNP, FNP-C",
    specialty: "Emergency",
    serviceLines: ["Emergency"],
    statesLicensed: ["WA", "ID"],
    spaceIds: ["east-adams"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 6,
  },
  {
    id: "p-010",
    slug: "maria-lopez",
    initials: "ML",
    name: "Dr. Maria Lopez",
    role: "Physician",
    credentials: "MD",
    specialty: "Critical Care",
    serviceLines: ["Critical Care / ICU"],
    statesLicensed: ["KS", "NE"],
    spaceIds: ["ks-rhtp"],
    stage: "privileges",
    readyToWork: false,
    readyToBill: false,
    flags: ["3 of 5 KS RHTP site privileges complete"],
    daysInStage: 14,
  },
  {
    id: "p-011",
    slug: "henry-walsh",
    initials: "HW",
    name: "Dr. Henry Walsh",
    role: "Physician",
    credentials: "MD",
    specialty: "Dermatology",
    serviceLines: ["Specialty Clinic"],
    statesLicensed: ["MN"],
    spaceIds: ["mn-rural"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 3,
  },
  {
    id: "p-012",
    slug: "sandra-brooks",
    initials: "SB",
    name: "Sandra Brooks",
    role: "Nurse Practitioner",
    credentials: "DNP, AGNP-C",
    specialty: "Geriatric Care",
    serviceLines: ["Senior Care"],
    statesLicensed: ["MN", "WI", "IA"],
    spaceIds: ["senior-care"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 5,
  },
  {
    id: "p-013",
    slug: "kevin-park",
    initials: "KP",
    name: "Dr. Kevin Park",
    role: "Pharmacist",
    credentials: "PharmD, BCGP",
    specialty: "Geriatric Pharmacy",
    serviceLines: ["Pharmacy", "Senior Care"],
    statesLicensed: ["MN", "WI", "IA", "ND"],
    spaceIds: ["senior-care"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 9,
  },
  {
    id: "p-014",
    slug: "olivia-reed",
    initials: "OR",
    name: "Olivia Reed",
    role: "Nurse Practitioner",
    credentials: "DNP, FNP-C",
    specialty: "Pediatrics",
    serviceLines: ["School Health"],
    statesLicensed: ["SD", "ND", "IA"],
    spaceIds: ["school-health"],
    stage: "intake",
    readyToWork: false,
    readyToBill: false,
    flags: ["Onboarding — CV and licensure submitted, awaiting PSV"],
    daysInStage: 3,
  },
  {
    id: "p-015",
    slug: "thomas-greene",
    initials: "TG",
    name: "Dr. Thomas Greene",
    role: "Physician",
    credentials: "MD, EMT-P",
    specialty: "EMS Medical Direction",
    serviceLines: ["EMS", "Emergency"],
    statesLicensed: ["SD", "ND"],
    spaceIds: ["ks-rhtp"],
    stage: "ready",
    readyToWork: true,
    readyToBill: true,
    flags: [],
    daysInStage: 7,
  },
];

// ──────────────────────────────────────────────────────────────
// Derived helpers — every page on the portal computes its numbers
// from PROVIDERS so the demo always feels internally consistent.
// ──────────────────────────────────────────────────────────────

export function getSpace(slug: string): Space | undefined {
  return SPACES.find((s) => s.slug === slug || s.id === slug);
}

export function getProvider(slug: string): Provider | undefined {
  return PROVIDERS.find((p) => p.slug === slug || p.id === slug);
}

export function providersInSpace(spaceId: string): Provider[] {
  return PROVIDERS.filter((p) => p.spaceIds.includes(spaceId));
}

export function providersByStage(stage: Stage): Provider[] {
  return PROVIDERS.filter((p) => p.stage === stage);
}

export function readyToBill(): Provider[] {
  return PROVIDERS.filter((p) => p.readyToBill);
}

export function readyToWork(): Provider[] {
  return PROVIDERS.filter((p) => p.readyToWork);
}

export function inPipeline(): Provider[] {
  return PROVIDERS.filter((p) => !p.readyToBill);
}

export function withExpiringCredentials(): Provider[] {
  return PROVIDERS.filter((p) =>
    p.flags.some((f) => /expir/i.test(f))
  );
}

export function spaceStats(spaceId: string) {
  const inSpace = providersInSpace(spaceId);
  return {
    total: inSpace.length,
    ready: inSpace.filter((p) => p.readyToBill).length,
    onboarding: inSpace.filter((p) => !p.readyToWork).length,
    atRisk: inSpace.filter((p) => p.flags.length > 0).length,
  };
}
