// Shared data model + helpers for the group onboarding / intake experience.
//
// This is the CLIENT-FACING group intake (a credentialing manager or
// practice administrator onboarding one or many providers) — distinct from
// the per-provider token flow in app/intake/[token]. Keeping the canonical
// option lists, validation, and the roster template in one module means the
// wizard, the /api/intake summary email, and the landing showcase all speak
// the same vocabulary a credentialing operator expects.
//
// No React, no DOM — safe to import from both the client wizard and the
// server route.

/* ----------------------------------------------------------------------- *
 * States & territories
 * ----------------------------------------------------------------------- */

export type UsState = { code: string; name: string };

// 50 states + DC + the five inhabited U.S. territories. Credentialing is
// state-by-state (each board, each Medicaid program), so the territories
// matter for groups with Puerto Rico / Guam footprints.
export const US_STATES: UsState[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
  { code: "PR", name: "Puerto Rico" },
  { code: "VI", name: "U.S. Virgin Islands" },
  { code: "GU", name: "Guam" },
  { code: "AS", name: "American Samoa" },
  { code: "MP", name: "Northern Mariana Islands" },
];

export const STATE_NAME_BY_CODE: Record<string, string> = Object.fromEntries(
  US_STATES.map((s) => [s.code, s.name]),
);

/* ----------------------------------------------------------------------- *
 * Payors / health plans
 * ----------------------------------------------------------------------- */

export type PayorCategory =
  | "government"
  | "national"
  | "managed"
  | "military"
  | "other";

export type Payor = {
  id: string;
  name: string;
  category: PayorCategory;
  note?: string;
};

// Ordered category metadata drives the grouped chip layout in the wizard.
export const PAYOR_CATEGORIES: { id: PayorCategory; label: string }[] = [
  { id: "government", label: "Government" },
  { id: "national", label: "National commercial" },
  { id: "managed", label: "Managed / behavioral networks" },
  { id: "military", label: "Military & federal" },
  { id: "other", label: "Other" },
];

// The plans groups ask for most. We deliberately keep "Blue Cross Blue
// Shield" as one selection and map it to the right state plan during
// kickoff (there are 30+ independent BCBS licensees). Medicaid is one
// selection too — we enroll the right state program(s) from the states
// chosen earlier in the form.
export const PAYORS: Payor[] = [
  // Government
  { id: "medicare", name: "Medicare", category: "government", note: "PECOS / Medicare Part B" },
  { id: "medicaid", name: "Medicaid", category: "government", note: "Enrolled per state you select" },
  // National commercial
  { id: "aetna", name: "Aetna", category: "national" },
  { id: "anthem", name: "Anthem / Elevance Health", category: "national" },
  { id: "bcbs", name: "Blue Cross Blue Shield", category: "national", note: "Mapped to your state plan" },
  { id: "cigna", name: "Cigna Healthcare", category: "national" },
  { id: "uhc", name: "UnitedHealthcare", category: "national" },
  { id: "humana", name: "Humana", category: "national" },
  { id: "kaiser", name: "Kaiser Permanente", category: "national" },
  // Managed / behavioral networks
  { id: "optum", name: "Optum", category: "managed", note: "UHC behavioral" },
  { id: "evernorth", name: "Evernorth", category: "managed", note: "Cigna behavioral" },
  { id: "carelon", name: "Carelon Behavioral Health", category: "managed", note: "formerly Beacon" },
  { id: "magellan", name: "Magellan Health", category: "managed" },
  { id: "centene", name: "Centene", category: "managed" },
  { id: "molina", name: "Molina Healthcare", category: "managed" },
  { id: "wellcare", name: "WellCare", category: "managed" },
  // Military & federal
  { id: "tricare", name: "TRICARE", category: "military" },
  { id: "va-ccn", name: "VA Community Care Network", category: "military" },
  // Other
  { id: "other", name: "Other / regional plan", category: "other", note: "Tell us in the notes" },
];

export const PAYOR_NAME_BY_ID: Record<string, string> = Object.fromEntries(
  PAYORS.map((p) => [p.id, p.name]),
);

/* ----------------------------------------------------------------------- *
 * Provider credential / license type
 * ----------------------------------------------------------------------- */

export type Credential = { id: string; label: string; note?: string };

// Degree / license abbreviations that drive the verification path. Spans
// medical, dental, behavioral, and allied health so the same intake serves
// a multispecialty group, an MSO, or a behavioral practice.
export const CREDENTIALS: Credential[] = [
  { id: "MD", label: "MD — Physician" },
  { id: "DO", label: "DO — Osteopathic physician" },
  { id: "NP", label: "NP — Nurse practitioner" },
  { id: "PA", label: "PA — Physician associate" },
  { id: "CRNA", label: "CRNA — Nurse anesthetist" },
  { id: "CNM", label: "CNM — Nurse midwife" },
  { id: "DPM", label: "DPM — Podiatrist" },
  { id: "DDS", label: "DDS — Dentist" },
  { id: "DMD", label: "DMD — Dentist" },
  { id: "DC", label: "DC — Chiropractor" },
  { id: "OD", label: "OD — Optometrist" },
  { id: "PharmD", label: "PharmD — Pharmacist" },
  { id: "PT", label: "PT / DPT — Physical therapist" },
  { id: "OT", label: "OT — Occupational therapist" },
  { id: "SLP", label: "SLP — Speech-language pathologist" },
  { id: "RD", label: "RD — Dietitian" },
  { id: "RN", label: "RN — Registered nurse" },
  { id: "PsyD", label: "PsyD — Psychologist" },
  { id: "PhD", label: "PhD — Psychologist" },
  { id: "LCSW", label: "LCSW — Clinical social worker" },
  { id: "LMSW", label: "LMSW — Master social worker" },
  { id: "LPC", label: "LPC / LPCC — Professional counselor" },
  { id: "LMFT", label: "LMFT — Marriage & family therapist" },
  { id: "BCBA", label: "BCBA — Behavior analyst" },
  { id: "Other", label: "Other" },
];

// Free-text specialty with helpful suggestions (a full taxonomy is hundreds
// of entries — a datalist of the common ones keeps data clean without
// trapping anyone).
export const PRIMARY_SPECIALTIES: string[] = [
  "Family Medicine",
  "Internal Medicine",
  "Pediatrics",
  "Psychiatry",
  "Behavioral Health / Therapy",
  "Obstetrics & Gynecology",
  "Cardiology",
  "Dermatology",
  "Emergency Medicine",
  "Orthopedic Surgery",
  "General Surgery",
  "Anesthesiology",
  "Radiology",
  "Urgent Care",
  "Physical Therapy",
  "Dental",
  "Optometry",
  "Podiatry",
];

/* ----------------------------------------------------------------------- *
 * Group size buckets — aligned to the pricing tiers on the landing page
 * (Starter 1–99 · Growth 100–499 · Enterprise 500+).
 * ----------------------------------------------------------------------- */

export type SizeBucket = { id: string; label: string };

export const SIZE_BUCKETS: SizeBucket[] = [
  { id: "solo", label: "Solo provider" },
  { id: "2-49", label: "2–49 providers" },
  { id: "50-99", label: "50–99 providers" },
  { id: "100-499", label: "100–499 providers" },
  { id: "500+", label: "500+ providers" },
];

/* ----------------------------------------------------------------------- *
 * NPI validation — Luhn check digit on the ISO 7812 number, with the
 * "80840" health-application prefix prepended to the first 9 digits.
 * (CMS NPI standard.) Lets us catch typos at the point of entry.
 * ----------------------------------------------------------------------- */

/** Compute the NPI check digit for the first 9 digits (string of 9). */
export function npiCheckDigit(first9: string): number {
  // Prefix the 80840 health identifier, then run Luhn over the 14 digits.
  const base = "80840" + first9;
  let sum = 0;
  // Double every second digit from the right (the check digit position is
  // to the right of `base`, so the rightmost base digit is "doubled").
  for (let i = 0; i < base.length; i++) {
    let d = base.charCodeAt(base.length - 1 - i) - 48;
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return (10 - (sum % 10)) % 10;
}

/** True when `npi` is a 10-digit string whose final digit is a valid Luhn check. */
export function isValidNpi(npi: string): boolean {
  const clean = npi.replace(/\D/g, "");
  if (!/^\d{10}$/.test(clean)) return false;
  return npiCheckDigit(clean.slice(0, 9)) === Number(clean[9]);
}

/* ----------------------------------------------------------------------- *
 * Roster template — for the concierge "upload your roster, we'll enter it"
 * path. We expose both the raw CSV (download) and the column metadata (to
 * render an on-screen "what we need" table).
 * ----------------------------------------------------------------------- */

export type RosterColumn = { key: string; label: string; example: string };

export const ROSTER_COLUMNS: RosterColumn[] = [
  { key: "first_name", label: "First name", example: "Aisha" },
  { key: "last_name", label: "Last name", example: "Patel" },
  { key: "credential", label: "Credential", example: "MD" },
  { key: "npi", label: "NPI", example: "1234567893" },
  { key: "primary_state", label: "Primary state", example: "TX" },
  { key: "states_to_credential", label: "States to credential (; separated)", example: "TX; OK; NM" },
  { key: "payors", label: "Payors (; separated)", example: "Medicare; Aetna; UHC" },
  { key: "specialty", label: "Specialty", example: "Family Medicine" },
  { key: "email", label: "Email", example: "aisha.patel@example.com" },
  { key: "phone", label: "Mobile phone", example: "512-555-0142" },
];

export const ROSTER_CSV_TEMPLATE: string =
  ROSTER_COLUMNS.map((c) => c.label).join(",") +
  "\n" +
  // Two example rows so the format is unmistakable.
  '"Aisha","Patel","MD","1234567893","TX","TX; OK; NM","Medicare; Aetna; UHC","Family Medicine","aisha.patel@example.com","512-555-0142"' +
  "\n" +
  '"Marcus","Lee","LCSW","1992739338","CA","CA","Medicaid; Optum; Magellan","Behavioral Health / Therapy","marcus.lee@example.com","415-555-0188"' +
  "\n";

/* ----------------------------------------------------------------------- *
 * Draft types — the shape the wizard builds and POSTs to /api/intake.
 * ----------------------------------------------------------------------- */

export type ProviderDraft = {
  id: string;
  firstName: string;
  lastName: string;
  credential: string;
  npi: string;
  primaryState: string;
  specialty: string;
  email: string;
};

export type IntakePath = "self" | "concierge";

export type IntakeDraft = {
  path: IntakePath;
  // Organization / contact
  orgName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  sizeBucket: string;
  // Scope
  states: string[];
  payors: string[];
  // Providers (self-serve) — repeatable
  providers: ProviderDraft[];
  // Concierge roster
  rosterFileName: string;
  rosterRowCount: number | null;
  // Shared
  notes: string;
  // Authorizations (self-serve submit gate)
  authPsv: boolean;
  authBaa: boolean;
};

/** A short stable-ish id for repeatable rows (SSR-safe; no crypto needed). */
let _seq = 0;
export function uid(prefix = "p"): string {
  _seq += 1;
  return `${prefix}_${Date.now().toString(36)}_${_seq.toString(36)}`;
}

/** A blank provider row. */
export function newProvider(): ProviderDraft {
  return {
    id: uid("prov"),
    firstName: "",
    lastName: "",
    credential: "",
    npi: "",
    primaryState: "",
    specialty: "",
    email: "",
  };
}

/** A blank intake draft for the chosen path. */
export function newDraft(path: IntakePath): IntakeDraft {
  return {
    path,
    orgName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    sizeBucket: "",
    states: [],
    payors: [],
    providers: path === "self" ? [newProvider()] : [],
    rosterFileName: "",
    rosterRowCount: null,
    notes: "",
    authPsv: false,
    authBaa: false,
  };
}

/* ----------------------------------------------------------------------- *
 * Concierge pricing copy — single source so the wizard, landing showcase,
 * and chat all quote the same "nominal fee" language.
 * ----------------------------------------------------------------------- */

export const CONCIERGE_FEE: {
  headline: string;
  detail: string;
  bullets: string[];
} = {
  headline: "Prefer to hand us a spreadsheet? We'll enter the whole roster for you.",
  detail:
    "Send your provider roster as Excel, CSV, Google Sheet, or PDF and our credentialing team keys in every provider, validates each NPI, and builds out the states and payors — a one-time concierge data-entry fee of $99 per 25 providers (waived for groups starting on an annual plan).",
  bullets: [
    "We validate every NPI and flag duplicates or typos before anything is submitted.",
    "Your data lands straight in CredTek — no re-keying on your end.",
    "A coordinator confirms scope with you before any verification starts.",
  ],
};

export const INTAKE_TURNAROUND =
  "Most groups are fully scoped within one business day and live in CredTek within 14 days.";
