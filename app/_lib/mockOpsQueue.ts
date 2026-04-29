// Mock data for the /ops/queue admin route. Models the spec's
// operations_queue table — Tier 4 work tickets that a CredTek-side or
// CVO-partner credentialing specialist actually does manually.
//
// Each ticket maps 1:1 to a customer-facing IntegrationJob. Status
// progression here updates the customer's job status via the IAL's
// transition_job() function (in production; mocked here).

export type OpsStatus =
  | "unassigned"
  | "assigned"
  | "in_progress"
  | "awaiting_response"
  | "blocked"
  | "complete";

export type OpsPool = "cvo_partner" | "internal_ops";

export type OpsTaskTemplate =
  | "state_board_email_verification"
  | "state_medicaid_mco_enrollment"
  | "payer_escalation_call"
  | "notarized_document_coordination"
  | "reference_check_outreach";

export type OpsSubTask = {
  label: string;
  done: boolean;
  /** Display timestamp; null if not yet completed. */
  ts: string | null;
};

export type OpsNote = {
  ts: string;
  author: string;
  text: string;
};

export type OpsArtifact = {
  name: string;
  ts: string;
  bytes: number;
};

export type OpsTicket = {
  id: string;
  /** Customer-facing IntegrationJob ID this ticket fulfills. */
  jobId: string;
  /** Provider name as displayed in the customer's CredTek workspace. */
  providerName: string;
  /** Provider slug — links into the customer-facing app for context. */
  providerSlug: string;
  /** Customer org / tenant name. */
  customerOrg: string;
  /** Compact context line: "TX · LCSW", "OK · LMFT-A". */
  providerContext: string;
  taskTemplate: OpsTaskTemplate;
  /** What the specialist is doing in plain language. */
  taskTitle: string;
  status: OpsStatus;
  /** 1 = highest, 3 = normal. */
  priority: 1 | 2 | 3;
  pool: OpsPool;
  /** Display string like "in 2 days", "overdue 6h", "today 4 PM". */
  slaDue: string;
  /** Color tone for the SLA badge. */
  slaTone: "green" | "amber" | "red";
  /** Specialist name, or null if unassigned. */
  assignedTo: string | null;
  /** When the ticket was created — display string. */
  createdAt: string;
  attempts: number;
  subTasks: OpsSubTask[];
  notes: OpsNote[];
  artifacts: OpsArtifact[];
};

export const TASK_TEMPLATE_LABELS: Record<OpsTaskTemplate, string> = {
  state_board_email_verification: "State board · email verification",
  state_medicaid_mco_enrollment: "State Medicaid MCO enrollment",
  payer_escalation_call: "Payer escalation call",
  notarized_document_coordination: "Notarized document coordination",
  reference_check_outreach: "Reference check outreach",
};

export const POOL_LABELS: Record<OpsPool, string> = {
  cvo_partner: "CVO partner",
  internal_ops: "Internal ops",
};

export const STATUS_LABELS: Record<OpsStatus, string> = {
  unassigned: "Unassigned",
  assigned: "Assigned",
  in_progress: "In progress",
  awaiting_response: "Awaiting response",
  blocked: "Blocked",
  complete: "Complete",
};

export const OPS_TICKETS: OpsTicket[] = [
  {
    id: "01HZX7K3VNCP9TQA2X9MR4D5BV",
    jobId: "job_01HZX7K2QKBR5Y8FN9V3W1ZP1A",
    providerName: "James Mitchell",
    providerSlug: "james-mitchell",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "CA · LCSW",
    taskTemplate: "state_board_email_verification",
    taskTitle: "Verify CA BBS LCSW license · J. Mitchell",
    status: "in_progress",
    priority: 2,
    pool: "cvo_partner",
    slaDue: "in 2 days · Apr 30",
    slaTone: "green",
    assignedTo: "Patricia Yang (CVO)",
    createdAt: "Apr 25 · 10:22 AM",
    attempts: 1,
    subTasks: [
      {
        label: "Send verification request to CA BBS",
        done: true,
        ts: "Apr 25 · 11:08 AM",
      },
      {
        label: "Await response (typically 3–5 business days)",
        done: false,
        ts: null,
      },
      { label: "Capture verification details", done: false, ts: null },
      {
        label: "Upload board response (email or PDF)",
        done: false,
        ts: null,
      },
    ],
    notes: [
      {
        ts: "Apr 25 · 11:08 AM",
        author: "Patricia Yang (CVO)",
        text: "Sent verification request to bbs-license-verify@dca.ca.gov. CA usually responds within 4 business days; will check Tuesday morning.",
      },
    ],
    artifacts: [
      {
        name: "ca-bbs-verify-request-2026-04-25.eml",
        ts: "Apr 25 · 11:08 AM",
        bytes: 4_812,
      },
    ],
  },
  {
    id: "01HZX7M9VFCWP3JK4RS6T8AB2C",
    jobId: "job_01HZX7M8FRQ2Y6XN9V8WD3ZTRA",
    providerName: "Dr. Daniel Kim",
    providerSlug: "daniel-kim",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "TX Medicaid · MD",
    taskTemplate: "state_medicaid_mco_enrollment",
    taskTitle: "Texas Superior HealthPlan enrollment · D. Kim",
    status: "awaiting_response",
    priority: 1,
    pool: "cvo_partner",
    slaDue: "in 47 days · Jun 15",
    slaTone: "green",
    assignedTo: "Patricia Yang (CVO)",
    createdAt: "Apr 10 · 09:14 AM",
    attempts: 2,
    subTasks: [
      { label: "Submit Superior provider application", done: true, ts: "Apr 10 · 02:41 PM" },
      { label: "Receive application acknowledgement", done: true, ts: "Apr 14 · 11:08 AM" },
      { label: "Respond to additional info request (DEA refresh)", done: true, ts: "Apr 22 · 03:47 PM" },
      { label: "Receive contracted-effective-date letter", done: false, ts: null },
      { label: "Update CredTek profile + fire webhook", done: false, ts: null },
    ],
    notes: [
      {
        ts: "Apr 22 · 03:47 PM",
        author: "Patricia Yang (CVO)",
        text: "Superior asked for DEA refresh — pulled new DEA from CredTek profile (still active until 2027), faxed back same day. Their typical turnaround on the contracting letter is 30-45 days from this point.",
      },
      {
        ts: "Apr 14 · 11:08 AM",
        author: "Patricia Yang (CVO)",
        text: "Application received and routed to credentialing. Reference: SUP-2026-04-EN-887412.",
      },
    ],
    artifacts: [
      { name: "superior-app-submission.pdf", ts: "Apr 10 · 02:41 PM", bytes: 1_244_120 },
      { name: "superior-ack-letter.pdf", ts: "Apr 14 · 11:08 AM", bytes: 84_116 },
      { name: "dea-refresh-fax-confirmation.pdf", ts: "Apr 22 · 03:47 PM", bytes: 24_801 },
    ],
  },
  {
    id: "01HZX7P5RDCFV6ZH8SJ4Y2KE7B",
    jobId: "job_01HZX7P4TBNGH9VWE6D2RJK1ZX",
    providerName: "Marcus Singh",
    providerSlug: "marcus-singh",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "GA · LCSW",
    taskTemplate: "payer_escalation_call",
    taskTitle: "Anthem BH escalation — submission stalled at day 47",
    status: "assigned",
    priority: 1,
    pool: "internal_ops",
    slaDue: "today · 5:00 PM",
    slaTone: "amber",
    assignedTo: "Avery Chen",
    createdAt: "Apr 28 · 02:14 PM",
    attempts: 0,
    subTasks: [
      { label: "Pull Anthem BH portal status + reference number", done: true, ts: "Apr 28 · 02:18 PM" },
      { label: "Call Anthem BH provider relations (M-F 9-5 ET)", done: false, ts: null },
      { label: "Capture escalation reason + contact name", done: false, ts: null },
      { label: "Update job status with new ETA", done: false, ts: null },
    ],
    notes: [
      {
        ts: "Apr 28 · 02:18 PM",
        author: "System",
        text: "Auto-escalated by SLA monitor — submission stalled in Anthem BH 'submitted' status for 47 days; threshold is 45. Reference: ABH-2026-03-EN-204198.",
      },
    ],
    artifacts: [
      { name: "anthem-bh-portal-status-screenshot.png", ts: "Apr 28 · 02:18 PM", bytes: 612_404 },
    ],
  },
  {
    id: "01HZX7Q1HG6DZ4XN3KP9MT2VWA",
    jobId: "job_01HZX7Q0FZ5R8YT2W7VN6DSXBA",
    providerName: "Aisha Patel",
    providerSlug: "aisha-patel",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "TX · LPC-A",
    taskTemplate: "reference_check_outreach",
    taskTitle: "Reference outreach × 3 — A. Patel onboarding",
    status: "unassigned",
    priority: 3,
    pool: "cvo_partner",
    slaDue: "in 12 days · May 10",
    slaTone: "green",
    assignedTo: null,
    createdAt: "Apr 28 · 09:03 AM",
    attempts: 0,
    subTasks: [
      { label: "Email each reference (3 contacts)", done: false, ts: null },
      { label: "Follow up on day 5 if no response", done: false, ts: null },
      { label: "Capture responses in structured form", done: false, ts: null },
      { label: "Mark complete or escalate after 2 attempts", done: false, ts: null },
    ],
    notes: [
      {
        ts: "Apr 28 · 09:03 AM",
        author: "System",
        text: "Created from intake — A. Patel listed 3 references during /intake/[token] flow. Awaiting CVO pool assignment.",
      },
    ],
    artifacts: [],
  },
  {
    id: "01HZX7R7XJ8VBKQ4F3HS6P1NTC",
    jobId: "job_01HZX7R6PD9ZW8M2VNRT4GBYAX",
    providerName: "Tyler Brooks",
    providerSlug: "tyler-brooks",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "NY · LPC-A",
    taskTemplate: "state_board_email_verification",
    taskTitle: "NY OP license number reconciliation · T. Brooks",
    status: "blocked",
    priority: 2,
    pool: "cvo_partner",
    slaDue: "overdue · 6 hours",
    slaTone: "red",
    assignedTo: "Marco Reyes (CVO)",
    createdAt: "Apr 21 · 11:50 AM",
    attempts: 3,
    subTasks: [
      { label: "Initial verification request to NY OP", done: true, ts: "Apr 21 · 11:55 AM" },
      { label: "Capture response + format anomaly flagged", done: true, ts: "Apr 24 · 03:28 PM" },
      { label: "Resolve format mismatch with provider", done: false, ts: null },
      { label: "Re-run verification on corrected number", done: false, ts: null },
    ],
    notes: [
      {
        ts: "Apr 27 · 04:18 PM",
        author: "Marco Reyes (CVO)",
        text: "Provider not responding to SMS/email about the format question. Suggesting we route to coordinator — Marisol may have direct line. Marking blocked pending coordinator follow-up.",
      },
      {
        ts: "Apr 24 · 03:28 PM",
        author: "Marco Reyes (CVO)",
        text: "NY OP returned a license number with a hyphen (123-4567); CredTek profile has it concatenated (1234567). Need provider to confirm which is correct on their card. SMSed provider 4 PM.",
      },
    ],
    artifacts: [
      { name: "ny-op-response-2026-04-24.pdf", ts: "Apr 24 · 03:28 PM", bytes: 102_344 },
    ],
  },
  {
    id: "01HZX7S2LM3VZ8KH9R4FT6BXNCA",
    jobId: "job_01HZX7S1HG4DRZ7VNW2KP6XBYA",
    providerName: "Rachel Bennett",
    providerSlug: "rachel-bennett",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "CO · LMFT",
    taskTemplate: "notarized_document_coordination",
    taskTitle: "Notarized supervision attestation · R. Bennett",
    status: "in_progress",
    priority: 3,
    pool: "cvo_partner",
    slaDue: "in 4 days · May 02",
    slaTone: "green",
    assignedTo: "Patricia Yang (CVO)",
    createdAt: "Apr 24 · 04:11 PM",
    attempts: 1,
    subTasks: [
      { label: "Send notary scheduling link to provider", done: true, ts: "Apr 24 · 04:18 PM" },
      { label: "Provider books notary appointment", done: true, ts: "Apr 25 · 09:43 AM" },
      { label: "Receive notarized PDF from notary service", done: false, ts: null },
      { label: "Upload to CredTek + fire job webhook", done: false, ts: null },
    ],
    notes: [
      {
        ts: "Apr 25 · 09:43 AM",
        author: "Patricia Yang (CVO)",
        text: "Provider booked Apr 30 11:00 AM with NotaryCam. Notarized doc usually arrives same-day after appointment.",
      },
    ],
    artifacts: [
      { name: "notarycam-booking-confirmation.pdf", ts: "Apr 25 · 09:43 AM", bytes: 18_234 },
    ],
  },
  {
    id: "01HZX7T8FVQ4DJK2HN6PMR3XBCA",
    jobId: "job_01HZX7T7CG8ZR2NWY5MPVBXTAH",
    providerName: "Maya Chen",
    providerSlug: "maya-chen",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "CA · LMSW",
    taskTemplate: "payer_escalation_call",
    taskTitle: "Optum credentialing review delay — M. Chen",
    status: "complete",
    priority: 2,
    pool: "internal_ops",
    slaDue: "completed Apr 27",
    slaTone: "green",
    assignedTo: "Avery Chen",
    createdAt: "Apr 26 · 09:55 AM",
    attempts: 0,
    subTasks: [
      { label: "Pull Optum portal status", done: true, ts: "Apr 26 · 10:01 AM" },
      { label: "Call Optum provider relations", done: true, ts: "Apr 26 · 10:38 AM" },
      { label: "Capture committee schedule + ETA", done: true, ts: "Apr 26 · 11:02 AM" },
      { label: "Update job status with new ETA", done: true, ts: "Apr 27 · 09:14 AM" },
    ],
    notes: [
      {
        ts: "Apr 27 · 09:14 AM",
        author: "Avery Chen",
        text: "Optum credentialing committee meets May 7. Updated job ETA in CredTek. Customer notified automatically via in-app + email.",
      },
      {
        ts: "Apr 26 · 11:02 AM",
        author: "Avery Chen",
        text: "Spoke with Joycelyn at Optum — file is complete and routed to credentialing committee. Next committee meeting May 7. Reference: OPT-2026-04-CR-92831.",
      },
    ],
    artifacts: [
      { name: "optum-call-notes-2026-04-26.pdf", ts: "Apr 26 · 11:02 AM", bytes: 64_120 },
    ],
  },
  {
    id: "01HZX7U3HJ7BVKR2MP4FN9DTXCA",
    jobId: "job_01HZX7U2QF6XZ4Y8WNV3RDBTAH",
    providerName: "Jordan Williams",
    providerSlug: "jordan-williams",
    customerOrg: "Mindscape Behavioral Health",
    providerContext: "FL · LMFT-A",
    taskTemplate: "reference_check_outreach",
    taskTitle: "Reference outreach × 2 — J. Williams (final-cycle)",
    status: "assigned",
    priority: 2,
    pool: "cvo_partner",
    slaDue: "in 6 days · May 04",
    slaTone: "green",
    assignedTo: "Marco Reyes (CVO)",
    createdAt: "Apr 27 · 02:38 PM",
    attempts: 0,
    subTasks: [
      { label: "Email reference 1 (Dr. Sarah Reyes — supervisor)", done: false, ts: null },
      { label: "Email reference 2 (Dr. Eduardo Hernandez — clinical director)", done: false, ts: null },
      { label: "Capture responses in structured form", done: false, ts: null },
      { label: "Mark complete or escalate", done: false, ts: null },
    ],
    notes: [],
    artifacts: [],
  },
];

export function findOpsTicket(id: string): OpsTicket | undefined {
  return OPS_TICKETS.find((t) => t.id === id);
}

export const OPS_FILTERS = {
  status: [
    { id: "all", label: "All" },
    { id: "unassigned", label: "Unassigned" },
    { id: "assigned", label: "Assigned" },
    { id: "in_progress", label: "In progress" },
    { id: "awaiting_response", label: "Awaiting response" },
    { id: "blocked", label: "Blocked" },
    { id: "complete", label: "Complete" },
  ],
  pool: [
    { id: "all", label: "All pools" },
    { id: "cvo_partner", label: "CVO partner" },
    { id: "internal_ops", label: "Internal ops" },
  ],
};
