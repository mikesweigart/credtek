// Catalog of every external system CredTek connects to. The strategic
// thesis: pull data in automatically wherever possible, push outbound
// communications wherever a vendor exposes an API. Every line below is
// a real vendor or government source a credentialing operator works
// with — this isn't aspirational, it's the day-to-day map.
//
// Status legend:
//   connected — live in this build, ready to query
//   beta      — wired up, polishing
//   available — vendor confirmed, signing/contracting in flight
//   roadmap   — on the roadmap, not yet started

export type IntegrationStatus = "connected" | "beta" | "available" | "roadmap";

export type IntegrationCategory =
  | "psv"
  | "boards"
  | "caqh"
  | "payers"
  | "clearinghouse"
  | "ehr"
  | "comms"
  | "documents"
  | "identity"
  | "background";

export type DataFlow = "in" | "out" | "both";

export type Integration = {
  id: string;
  name: string;
  vendor: string;
  category: IntegrationCategory;
  status: IntegrationStatus;
  dataFlow: DataFlow;
  cadence: string; // human-readable run cadence
  summary: string; // what this does for credentialing
};

export const CATEGORY_LABEL: Record<IntegrationCategory, string> = {
  psv:           "Primary Source Verification",
  boards:        "State licensing boards",
  caqh:          "CAQH",
  payers:        "Payer enrollment portals",
  clearinghouse: "Clearinghouses",
  ehr:           "EHR & practice management",
  comms:         "Communications",
  documents:     "Document storage & e-signature",
  identity:      "Identity verification",
  background:    "Background checks",
};

export const CATEGORY_BLURB: Record<IntegrationCategory, string> = {
  psv:           "Every federal + national PSV source CredTek queries automatically. No manual lookups.",
  boards:        "Direct queries to each state's medical, nursing, and behavioral-health licensure board.",
  caqh:          "CAQH ProView profile sync + re-attestation tracking + enrollment hub access.",
  payers:        "Direct payer-portal connections so applications submit, status checks pull, and effective dates land in your file the moment they're issued.",
  clearinghouse: "Once a provider is billable, the EDI handshake into your clearinghouse closes the loop.",
  ehr:           "Sync your provider roster + practice locations from your EHR so CredTek stays the system of truth.",
  comms:         "Email, fax, SMS and e-sign — every outbound touchpoint in the credentialing lifecycle.",
  documents:     "Your existing document repo is the file of record. CredTek attaches to it; nothing moves.",
  identity:      "Real-ID verification at intake so you're not credentialing someone who isn't them.",
  background:    "Court-record, sanctions, and reference checks pulled with the click of a button.",
};

export const STATUS_PILL: Record<IntegrationStatus, { label: string; cls: string }> = {
  connected: { label: "Connected",      cls: "int-pill-ok" },
  beta:      { label: "Beta",           cls: "int-pill-beta" },
  available: { label: "Available now",  cls: "int-pill-avail" },
  roadmap:   { label: "On roadmap",     cls: "int-pill-roadmap" },
};

export const FLOW_LABEL: Record<DataFlow, string> = {
  in:   "Pulls data in",
  out:  "Pushes data out",
  both: "Two-way sync",
};

// 50-state board listing helper — kept terse, used to render the boards
// category without typing every state by hand.
const STATE_BOARDS: { code: string; name: string }[] = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }, { code: "DC", name: "District of Columbia" },
];

const STATE_BOARD_INTEGRATIONS: Integration[] = STATE_BOARDS.map((s) => {
  // Bigger / more API-mature boards are "connected" today; the rest are
  // on the active roadmap. The classification mirrors which state boards
  // expose public verification APIs vs. require headless scrape today.
  const apiReady = ["CA", "TX", "FL", "NY", "WA", "MN", "OR", "GA", "NJ", "MA", "CO", "AZ", "PA", "IL", "OH", "NC", "VA"];
  const status: IntegrationStatus = apiReady.includes(s.code) ? "connected" : "beta";
  return {
    id: `board-${s.code.toLowerCase()}`,
    name: `${s.name} licensure board`,
    vendor: `${s.name} state board`,
    category: "boards" as IntegrationCategory,
    status,
    dataFlow: "in" as DataFlow,
    cadence: "On-demand + nightly recheck",
    summary: `Verify ${s.code} license number, status, expiration, and disciplinary actions directly from the state board.`,
  };
});

export const INTEGRATIONS: Integration[] = [
  // ---- PSV ----
  {
    id: "nppes",
    name: "NPPES NPI Registry",
    vendor: "CMS",
    category: "psv",
    status: "connected",
    dataFlow: "in",
    cadence: "On-demand",
    summary: "Confirm NPI is active, taxonomy matches, and provider/organization details are current.",
  },
  {
    id: "oig-leie",
    name: "OIG LEIE",
    vendor: "HHS Office of Inspector General",
    category: "psv",
    status: "connected",
    dataFlow: "in",
    cadence: "Daily + on-demand",
    summary: "Federal exclusion check — disqualifies provider from any federal-payer program.",
  },
  {
    id: "sam",
    name: "SAM.gov Exclusions",
    vendor: "GSA / federal",
    category: "psv",
    status: "connected",
    dataFlow: "in",
    cadence: "Daily + on-demand",
    summary: "Federal debarment / suspension check across all government programs.",
  },
  {
    id: "npdb",
    name: "NPDB Continuous Query",
    vendor: "HRSA National Practitioner Data Bank",
    category: "psv",
    status: "connected",
    dataFlow: "in",
    cadence: "Continuous subscription",
    summary: "Adverse-action and malpractice reports — subscribed continuously, alerts the moment anything posts.",
  },
  {
    id: "dea",
    name: "DEA Registration Verification",
    vendor: "DEA",
    category: "psv",
    status: "connected",
    dataFlow: "in",
    cadence: "On-demand + monthly",
    summary: "Active DEA registration, scheduled-drug authorities, and expiration date.",
  },
  {
    id: "ama-profile",
    name: "AMA Physician Profile",
    vendor: "American Medical Association",
    category: "psv",
    status: "available",
    dataFlow: "in",
    cadence: "On-demand",
    summary: "Verified education, training, and board certification history for MDs.",
  },
  {
    id: "aoa-profile",
    name: "AOA Physician Profile",
    vendor: "American Osteopathic Association",
    category: "psv",
    status: "available",
    dataFlow: "in",
    cadence: "On-demand",
    summary: "Verified education, training, and board certification history for DOs.",
  },
  {
    id: "ecfmg",
    name: "ECFMG Certification",
    vendor: "Educational Commission for Foreign Medical Graduates",
    category: "psv",
    status: "available",
    dataFlow: "in",
    cadence: "On-demand",
    summary: "International medical graduate certification verification.",
  },

  // ---- State boards (auto-expanded) ----
  ...STATE_BOARD_INTEGRATIONS,

  // ---- CAQH ----
  {
    id: "caqh-proview",
    name: "CAQH ProView",
    vendor: "CAQH",
    category: "caqh",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time + 120-day attestation alerts",
    summary: "Pull the provider's full credentialing profile; push updates; track 120-day re-attestation cycle.",
  },
  {
    id: "caqh-enrollment-hub",
    name: "CAQH EnrollHub",
    vendor: "CAQH",
    category: "caqh",
    status: "beta",
    dataFlow: "out",
    cadence: "On-demand",
    summary: "Submit EFT and ERA enrollments to multiple payers from a single hub.",
  },

  // ---- Payer enrollment portals ----
  {
    id: "pecos",
    name: "PECOS (Medicare)",
    vendor: "CMS",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "On-demand submission + status check every 7 days",
    summary: "Medicare provider enrollment — submit 855I/855R/855B, pull effective date, track revalidation.",
  },
  {
    id: "uhc",
    name: "UnitedHealthcare",
    vendor: "UHC",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "Status check every 7 days",
    summary: "Commercial + Medicare Advantage + Medicaid enrollment via Optum One Healthcare ID.",
  },
  {
    id: "aetna",
    name: "Aetna",
    vendor: "CVS Health",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "Status check every 7 days",
    summary: "Commercial + Medicare + Medicaid enrollment submission and status tracking.",
  },
  {
    id: "anthem",
    name: "Anthem / Elevance",
    vendor: "Elevance Health",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "Status check every 7 days",
    summary: "Anthem BCBS across 14 states + Wellpoint Medicaid + Anthem Medicare.",
  },
  {
    id: "bcbs-fed",
    name: "BCBS FEP + state plans",
    vendor: "Blue Cross Blue Shield Association",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "Per-plan cadence",
    summary: "Federal Employee Program plus per-state Blue plans — 36 plans nationally.",
  },
  {
    id: "cigna",
    name: "Cigna Healthcare",
    vendor: "Cigna",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "Status check every 7 days",
    summary: "Commercial + Medicare Advantage enrollment.",
  },
  {
    id: "humana",
    name: "Humana",
    vendor: "Humana",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "Status check every 7 days",
    summary: "Medicare Advantage + Tricare + commercial — submit and track.",
  },
  {
    id: "molina",
    name: "Molina Healthcare",
    vendor: "Molina",
    category: "payers",
    status: "beta",
    dataFlow: "both",
    cadence: "Per-state cadence",
    summary: "State Medicaid + Marketplace enrollment across 19 states.",
  },
  {
    id: "centene",
    name: "Centene / Ambetter / WellCare",
    vendor: "Centene",
    category: "payers",
    status: "beta",
    dataFlow: "both",
    cadence: "Per-line cadence",
    summary: "Medicaid (multiple state brands), WellCare Medicare Advantage, Ambetter Marketplace.",
  },
  {
    id: "kaiser",
    name: "Kaiser Permanente",
    vendor: "Kaiser",
    category: "payers",
    status: "available",
    dataFlow: "out",
    cadence: "On-demand",
    summary: "Submission for the closed-network plans + Medicare Advantage where applicable.",
  },
  {
    id: "tricare-east",
    name: "Tricare East (Humana Military)",
    vendor: "Humana Military",
    category: "payers",
    status: "connected",
    dataFlow: "both",
    cadence: "Status check every 7 days",
    summary: "Tricare enrollment for the eastern region.",
  },
  {
    id: "tricare-west",
    name: "Tricare West (TriWest)",
    vendor: "TriWest",
    category: "payers",
    status: "available",
    dataFlow: "both",
    cadence: "Status check every 7 days",
    summary: "Tricare enrollment for the western region.",
  },
  {
    id: "medicaid-state",
    name: "State Medicaid (per state)",
    vendor: "State Medicaid agencies",
    category: "payers",
    status: "beta",
    dataFlow: "both",
    cadence: "Per-state cadence",
    summary: "State Medicaid provider enrollment portals — connection status tracked per state.",
  },

  // ---- Clearinghouses ----
  {
    id: "availity",
    name: "Availity Essentials",
    vendor: "Availity",
    category: "clearinghouse",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "EDI handshake confirmation, eligibility lookups, claim status — the moment a provider is loaded.",
  },
  {
    id: "waystar",
    name: "Waystar",
    vendor: "Waystar",
    category: "clearinghouse",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Payer enrollment status confirmation + claim readiness from your clearinghouse.",
  },
  {
    id: "change",
    name: "Optum / Change Healthcare",
    vendor: "Optum",
    category: "clearinghouse",
    status: "available",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Provider data exchange with the largest clearinghouse footprint.",
  },
  {
    id: "trizetto",
    name: "TriZetto Provider Solutions",
    vendor: "Cognizant",
    category: "clearinghouse",
    status: "available",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Provider master sync + EDI loop closure.",
  },

  // ---- EHR / practice management ----
  {
    id: "epic",
    name: "Epic",
    vendor: "Epic",
    category: "ehr",
    status: "available",
    dataFlow: "in",
    cadence: "Nightly + real-time webhooks",
    summary: "Roster sync via SER (Serviced Encounter Record) + practice location data via FHIR.",
  },
  {
    id: "cerner",
    name: "Oracle Cerner",
    vendor: "Oracle",
    category: "ehr",
    status: "available",
    dataFlow: "in",
    cadence: "Nightly",
    summary: "Provider master + facility privileging sync via Cerner FHIR.",
  },
  {
    id: "athena",
    name: "athenahealth",
    vendor: "athenahealth",
    category: "ehr",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Provider roster, scheduling locations, and payer-contract loading via athena's More Disruption Please APIs.",
  },
  {
    id: "ecw",
    name: "eClinicalWorks",
    vendor: "eCW",
    category: "ehr",
    status: "available",
    dataFlow: "in",
    cadence: "Nightly",
    summary: "Provider and facility sync.",
  },
  {
    id: "nextgen",
    name: "NextGen Healthcare",
    vendor: "NextGen",
    category: "ehr",
    status: "available",
    dataFlow: "in",
    cadence: "Nightly",
    summary: "Provider and facility sync.",
  },
  {
    id: "advancedmd",
    name: "AdvancedMD",
    vendor: "AdvancedMD",
    category: "ehr",
    status: "roadmap",
    dataFlow: "in",
    cadence: "Nightly",
    summary: "Provider and facility sync.",
  },

  // ---- Communications ----
  {
    id: "resend",
    name: "Resend (transactional email)",
    vendor: "Resend",
    category: "comms",
    status: "connected",
    dataFlow: "out",
    cadence: "Real-time",
    summary: "All CredTek outbound emails — intake docs, reminders, payer-status updates, expirable warnings.",
  },
  {
    id: "twilio-email",
    name: "SendGrid (email overflow)",
    vendor: "Twilio",
    category: "comms",
    status: "available",
    dataFlow: "out",
    cadence: "Real-time",
    summary: "Secondary email channel for high-volume sends.",
  },
  {
    id: "twilio-fax",
    name: "eFax",
    vendor: "Twilio / Concord",
    category: "comms",
    status: "available",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Payer and facility outbound fax for the portals still on fax-only intake.",
  },
  {
    id: "docusign",
    name: "DocuSign",
    vendor: "DocuSign",
    category: "comms",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time webhooks",
    summary: "Provider attestation, BAA, malpractice declarations and committee approvals — e-sign with audit trail.",
  },
  {
    id: "adobesign",
    name: "Adobe Acrobat Sign",
    vendor: "Adobe",
    category: "comms",
    status: "available",
    dataFlow: "both",
    cadence: "Real-time webhooks",
    summary: "Alternative e-signature provider with Adobe document storage tie-in.",
  },

  // ---- Document storage ----
  {
    id: "box",
    name: "Box",
    vendor: "Box",
    category: "documents",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Mirror credentialing files into your Box account; pull existing documents into the provider record.",
  },
  {
    id: "googledrive",
    name: "Google Drive / Workspace",
    vendor: "Google",
    category: "documents",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Two-way sync against shared Drive folders.",
  },
  {
    id: "sharepoint",
    name: "SharePoint / OneDrive",
    vendor: "Microsoft",
    category: "documents",
    status: "connected",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Sync to your SharePoint document libraries; AD-secured.",
  },
  {
    id: "dropbox",
    name: "Dropbox Business",
    vendor: "Dropbox",
    category: "documents",
    status: "available",
    dataFlow: "both",
    cadence: "Real-time",
    summary: "Mirror credentialing files into a Dropbox team folder.",
  },

  // ---- Identity verification ----
  {
    id: "persona",
    name: "Persona ID verification",
    vendor: "Persona",
    category: "identity",
    status: "connected",
    dataFlow: "in",
    cadence: "Real-time",
    summary: "At intake — confirm the provider is who they say they are before any document is collected.",
  },
  {
    id: "jumio",
    name: "Jumio",
    vendor: "Jumio",
    category: "identity",
    status: "available",
    dataFlow: "in",
    cadence: "Real-time",
    summary: "Alternative real-ID verification provider with global doc coverage.",
  },

  // ---- Background checks ----
  {
    id: "hireright",
    name: "HireRight",
    vendor: "HireRight",
    category: "background",
    status: "connected",
    dataFlow: "in",
    cadence: "On-demand",
    summary: "Criminal court records, employment + education verification, sanctions checks.",
  },
  {
    id: "sterling",
    name: "Sterling",
    vendor: "Sterling",
    category: "background",
    status: "available",
    dataFlow: "in",
    cadence: "On-demand",
    summary: "Background screening with healthcare-specific package.",
  },
];

export function groupIntegrations(): { category: IntegrationCategory; items: Integration[] }[] {
  const order: IntegrationCategory[] = [
    "psv", "caqh", "boards", "payers", "clearinghouse", "ehr",
    "documents", "comms", "identity", "background",
  ];
  return order.map((category) => ({
    category,
    items: INTEGRATIONS.filter((i) => i.category === category),
  }));
}

export function countByStatus(): Record<IntegrationStatus, number> {
  return INTEGRATIONS.reduce(
    (acc, i) => ({ ...acc, [i.status]: (acc[i.status] ?? 0) + 1 }),
    { connected: 0, beta: 0, available: 0, roadmap: 0 } as Record<IntegrationStatus, number>
  );
}
