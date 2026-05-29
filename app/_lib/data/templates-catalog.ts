// Prebuilt communications library — every email, letter, and form
// CredTek can send on behalf of an operator. Each one ties to a stage,
// an audience (provider / facility / payer / committee), and a trigger
// (event-driven or scheduled cadence).
//
// These are the actual templates that go out today. They're written so
// a credentialing operator can recognize the language, use them as-is,
// or fork them per tenant.

export type TemplateChannel = "email" | "letter" | "fax_letter" | "esign";

export type TemplateAudience = "provider" | "facility" | "payer" | "committee" | "coordinator";

export type TemplateCategory =
  | "intake"
  | "psv"
  | "privileging"
  | "committee"
  | "enrollment"
  | "recredentialing"
  | "expirables"
  | "billing";

export type CredTemplate = {
  id: string;
  name: string;
  category: TemplateCategory;
  channel: TemplateChannel;
  audience: TemplateAudience;
  trigger: string;             // when this fires
  subject?: string;            // for emails
  preview: string;             // first sentence — what the user sees in the library card
  body: string;                // full body, with {{handlebars}} placeholders
  variables: string[];         // available placeholders
  sentCountThisMonth: number;  // tracked when live
};

export const CATEGORY_LABEL: Record<TemplateCategory, string> = {
  intake:           "Intake",
  psv:              "Primary Source Verification",
  privileging:      "Privileging",
  committee:        "Committee review",
  enrollment:       "Payer enrollment",
  recredentialing:  "Re-credentialing",
  expirables:       "Expirables & renewals",
  billing:          "Billing handoff",
};

export const CATEGORY_BLURB: Record<TemplateCategory, string> = {
  intake:           "Bring the provider into your workspace — welcome, document request, reminder cadence.",
  psv:              "Status updates and escalations during primary-source verification.",
  privileging:      "Coordinate with the facility medical-staff office.",
  committee:        "Committee packet cover letters, approvals, and conditional approval letters.",
  enrollment:       "Cover sheets, status checks, denial appeals, and effective-date confirmations across payers.",
  recredentialing:  "Three-year and two-year cycle re-credentialing — never miss a renewal window.",
  expirables:       "License, DEA, COI, board-cert and CAQH attestation reminders on cadence.",
  billing:          "Hand-off to revenue cycle the moment the provider is approved and effective.",
};

export const AUDIENCE_LABEL: Record<TemplateAudience, string> = {
  provider:    "Provider",
  facility:    "Facility",
  payer:       "Payer",
  committee:   "Committee",
  coordinator: "Coordinator",
};

export const CHANNEL_LABEL: Record<TemplateChannel, string> = {
  email:      "Email",
  letter:     "Mailed letter",
  fax_letter: "Faxed letter",
  esign:      "DocuSign / e-sign",
};

const COMMON_VARS = ["{{provider.first_name}}", "{{provider.full_name}}", "{{provider.credential}}", "{{tenant.name}}", "{{coordinator.full_name}}", "{{coordinator.email}}"];

export const TEMPLATES: CredTemplate[] = [
  // -------- Intake --------
  {
    id: "intake-welcome",
    name: "Welcome to credentialing",
    category: "intake",
    channel: "email",
    audience: "provider",
    trigger: "Sent automatically when a provider is added.",
    subject: "Welcome to credentialing — your secure intake link",
    preview: "Personal welcome to the provider, secure document-upload link, and an estimated time-to-billable based on stage SLAs.",
    body:
`Hi {{provider.first_name}},

Welcome — {{tenant.name}} has started the credentialing process for you. To keep things moving quickly, please complete your intake here:

{{intake.secure_link}}

You'll need to upload (or confirm we have on file):
  • A current CV with no gaps over 30 days
  • Active state license(s) for every state you'll practice in
  • DEA registration (if applicable)
  • Malpractice (COI) declaration
  • CAQH attestation date (we'll pull the profile automatically)
  • Two professional references

Most providers complete intake in under 15 minutes. Reply here at any time if you hit a snag — your coordinator at {{tenant.name}} is {{coordinator.full_name}} ({{coordinator.email}}).

Estimated time to billable: {{provider.eta_days}} days.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{intake.secure_link}}", "{{provider.eta_days}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "intake-doc-request",
    name: "Document request — specific item",
    category: "intake",
    channel: "email",
    audience: "provider",
    trigger: "Sent when a specific required document is missing.",
    subject: "One quick item we still need — {{document.name}}",
    preview: "Surgical request for a single missing document with a one-click secure upload link.",
    body:
`Hi {{provider.first_name}},

We're almost there. The one remaining item we need to keep your file moving is:

  → {{document.name}}

Upload it here in 30 seconds: {{intake.secure_link}}

If you have any questions about what we're asking for, reply to this email and {{coordinator.full_name}} will help.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{document.name}}", "{{intake.secure_link}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "intake-reminder-2d",
    name: "Intake reminder — 2-day cadence",
    category: "intake",
    channel: "email",
    audience: "provider",
    trigger: "Every 2 days while intake is open and docs are missing.",
    subject: "Friendly reminder — your credentialing file is waiting",
    preview: "Calm 2-day cadence reminder. Names the missing items and provides a one-click resume link.",
    body:
`Hi {{provider.first_name}},

Just a quick nudge — your credentialing file is open and we're waiting on a few items:

{{intake.missing_items_list}}

You can pick up exactly where you left off here: {{intake.secure_link}}

Every day we wait pushes your billable date out by one day, so any of these you can knock out tonight makes a difference.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{intake.missing_items_list}}", "{{intake.secure_link}}"],
    sentCountThisMonth: 0,
  },

  // -------- PSV --------
  {
    id: "psv-status-update",
    name: "PSV status update",
    category: "psv",
    channel: "email",
    audience: "coordinator",
    trigger: "Sent to the coordinator when any PSV source returns a notable result.",
    subject: "PSV update for {{provider.full_name}} — {{psv.source}} {{psv.result_status}}",
    preview: "Coordinator-facing automated update the moment any of the seven sources returns a hit or completes verification.",
    body:
`Heads up — {{psv.source}} returned for {{provider.full_name}}, {{provider.credential}}.

Result: {{psv.result_status}}
Details: {{psv.result_detail}}
Pulled at: {{psv.checked_at}}

Open the provider's file: {{provider.workspace_link}}

— CredTek`,
    variables: [...COMMON_VARS, "{{psv.source}}", "{{psv.result_status}}", "{{psv.result_detail}}", "{{psv.checked_at}}", "{{provider.workspace_link}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "psv-escalation",
    name: "PSV escalation — silent source",
    category: "psv",
    channel: "email",
    audience: "coordinator",
    trigger: "Fires automatically after 5 silent days on any PSV source.",
    subject: "Action needed — {{psv.source}} silent for 5 days on {{provider.full_name}}",
    preview: "Auto-escalation when a primary source hasn't responded in 5 days. Includes suggested next-step.",
    body:
`{{psv.source}} has been silent on {{provider.full_name}} for 5 days — over our PSV escalation threshold.

Suggested next step: {{psv.next_step}}

This is the only stage step still pending in PSV. Resolving this unblocks the file.

Open the provider: {{provider.workspace_link}}

— CredTek`,
    variables: [...COMMON_VARS, "{{psv.source}}", "{{psv.next_step}}", "{{provider.workspace_link}}"],
    sentCountThisMonth: 0,
  },

  // -------- Privileging --------
  {
    id: "privileging-facility-request",
    name: "Privileging packet — facility cover letter",
    category: "privileging",
    channel: "letter",
    audience: "facility",
    trigger: "Generated when stage advances to Privileging.",
    subject: "Privileging request — {{provider.full_name}}, {{provider.credential}}",
    preview: "Formal cover letter to the facility medical-staff office. Includes attached packet inventory.",
    body:
`{{facility.medstaff_address_block}}

Re: Application for clinical privileges — {{provider.full_name}}, {{provider.credential}}

Dear {{facility.medstaff_director}},

On behalf of {{tenant.name}}, please find enclosed the complete privileging packet for {{provider.full_name}}, {{provider.credential}}, requesting clinical privileges in {{provider.specialty}} at {{facility.name}}.

The packet includes:
  • Completed application
  • Verified state license(s): {{provider.license_states}}
  • Active DEA registration
  • Board certification (verified directly with {{provider.board}})
  • Malpractice coverage declaration
  • Two professional references with delegated verification
  • NPDB query report
  • CAQH attestation (dated {{provider.caqh_attest_date}})

Please confirm receipt and provide an estimated committee review date at your earliest convenience.

Sincerely,
{{coordinator.full_name}}
{{tenant.name}}
{{coordinator.email}} · {{coordinator.phone}}`,
    variables: [...COMMON_VARS, "{{facility.medstaff_address_block}}", "{{facility.medstaff_director}}", "{{facility.name}}", "{{provider.specialty}}", "{{provider.license_states}}", "{{provider.board}}", "{{provider.caqh_attest_date}}", "{{coordinator.phone}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "privileging-facility-reminder",
    name: "Facility reminder — 7-day cadence",
    category: "privileging",
    channel: "email",
    audience: "facility",
    trigger: "Every 7 days while in Privileging.",
    subject: "Status check — privileging file for {{provider.full_name}}",
    preview: "Professional 7-day check-in to the facility. Includes ticket / file reference.",
    body:
`Hello,

Following up on the privileging packet for {{provider.full_name}}, {{provider.credential}}, submitted {{privileging.submitted_on}} (your reference: {{privileging.facility_ref}}).

Could you confirm:
  1. Receipt + completeness of the packet
  2. Anticipated medical-staff committee review date
  3. Any additional items needed from {{tenant.name}}

We'd like to be on the next available committee agenda. Happy to provide any clarification needed.

Thanks,
{{coordinator.full_name}}
{{tenant.name}}`,
    variables: [...COMMON_VARS, "{{privileging.submitted_on}}", "{{privileging.facility_ref}}"],
    sentCountThisMonth: 0,
  },

  // -------- Committee --------
  {
    id: "committee-agenda-submit",
    name: "Committee agenda — packet submission",
    category: "committee",
    channel: "email",
    audience: "committee",
    trigger: "Sent when the committee meeting date is confirmed.",
    subject: "{{provider.full_name}} — credentialing committee packet ({{committee.meeting_date}})",
    preview: "Formal packet submission to the committee chair with executive summary on top.",
    body:
`Committee Chair {{committee.chair_name}},

The credentialing file for {{provider.full_name}}, {{provider.credential}} is complete and ready for committee review on {{committee.meeting_date}}.

Executive summary:
  • PSV: clean across all 7 sources (verified {{psv.verified_on}})
  • Licensure: active in {{provider.license_states}}
  • NPDB: {{psv.npdb_summary}}
  • References: 2 of 2 verified positive
  • Malpractice: active, no open claims
  • Recommended action: approve

Full packet attached / linked: {{committee.packet_link}}

— {{coordinator.full_name}}, {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{committee.chair_name}}", "{{committee.meeting_date}}", "{{psv.verified_on}}", "{{provider.license_states}}", "{{psv.npdb_summary}}", "{{committee.packet_link}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "committee-conditional-approval",
    name: "Conditional approval notice",
    category: "committee",
    channel: "letter",
    audience: "provider",
    trigger: "Sent when committee approves with conditions.",
    subject: "Conditional approval — next steps to full credentialing",
    preview: "Formal notice with the conditions list and a deadline to clear them.",
    body:
`{{provider.full_name}}, {{provider.credential}}
{{provider.address_block}}

Dear Dr. {{provider.last_name}},

The {{tenant.name}} credentialing committee has reviewed your file and granted CONDITIONAL APPROVAL effective {{committee.decision_date}}.

The following conditions must be cleared by {{committee.condition_deadline}}:
{{committee.conditions_list}}

Once cleared, full approval is automatic and you will be effective for billing across all enrolled payers.

If you have any questions, contact {{coordinator.full_name}} at {{coordinator.email}}.

Sincerely,
{{committee.chair_name}}
Chair, Credentialing Committee
{{tenant.name}}`,
    variables: [...COMMON_VARS, "{{provider.address_block}}", "{{provider.last_name}}", "{{committee.decision_date}}", "{{committee.condition_deadline}}", "{{committee.conditions_list}}", "{{committee.chair_name}}"],
    sentCountThisMonth: 0,
  },

  // -------- Enrollment --------
  {
    id: "enroll-payer-cover",
    name: "Payer enrollment cover sheet",
    category: "enrollment",
    channel: "letter",
    audience: "payer",
    trigger: "Generated when an application is submitted to a payer.",
    subject: "Provider enrollment application — {{provider.full_name}}, NPI {{provider.npi}}",
    preview: "Standard cover sheet for a payer enrollment application with all referenced IDs front and center.",
    body:
`{{payer.address_block}}

Re: Enrollment application — {{provider.full_name}}, NPI {{provider.npi}}, Tax ID {{tenant.tin}}

Dear Provider Enrollment,

Please find enclosed the complete enrollment application for the above provider for participation in:

  • {{payer.network_name}}
  • State of service: {{enrollment.state}}
  • Effective date requested: {{enrollment.requested_effective_date}}

CAQH ID: {{provider.caqh_id}} (attestation current as of {{provider.caqh_attest_date}})
Group / Practice: {{tenant.legal_name}}, NPI {{tenant.npi}}, TIN {{tenant.tin}}

Please confirm receipt and assign a tracking number. Reach me at {{coordinator.email}} for any clarification.

Sincerely,
{{coordinator.full_name}}
{{tenant.name}}`,
    variables: [...COMMON_VARS, "{{payer.address_block}}", "{{payer.network_name}}", "{{provider.npi}}", "{{tenant.tin}}", "{{enrollment.state}}", "{{enrollment.requested_effective_date}}", "{{provider.caqh_id}}", "{{provider.caqh_attest_date}}", "{{tenant.legal_name}}", "{{tenant.npi}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "enroll-status-check",
    name: "Payer status check — 7-day cadence",
    category: "enrollment",
    channel: "email",
    audience: "payer",
    trigger: "Every 7 days while enrollment is pending.",
    subject: "Status request — {{provider.full_name}}, application {{enrollment.payer_ref}}",
    preview: "Polite 7-day status check to the payer. References the application ID and original submission date.",
    body:
`Hello Provider Enrollment,

Following up on the enrollment application for {{provider.full_name}}, {{provider.credential}}, NPI {{provider.npi}}:

  • Payer reference: {{enrollment.payer_ref}}
  • Submitted: {{enrollment.submitted_on}}
  • Days outstanding: {{enrollment.days_outstanding}}

Could you confirm current status and any items needed from us to keep the file moving?

Thanks,
{{coordinator.full_name}}
{{tenant.name}}`,
    variables: [...COMMON_VARS, "{{provider.npi}}", "{{enrollment.payer_ref}}", "{{enrollment.submitted_on}}", "{{enrollment.days_outstanding}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "enroll-denial-appeal",
    name: "Enrollment denial appeal",
    category: "enrollment",
    channel: "letter",
    audience: "payer",
    trigger: "Drafted when a payer issues a denial.",
    subject: "Appeal of denial — {{provider.full_name}}, application {{enrollment.payer_ref}}",
    preview: "Formal appeal letter referencing the denial reason and providing rebuttal documentation.",
    body:
`{{payer.address_block}}

Re: Appeal of enrollment denial — {{provider.full_name}}, NPI {{provider.npi}}, application {{enrollment.payer_ref}}

To Whom It May Concern,

On {{enrollment.denial_date}}, this provider was denied enrollment with reason cited as:

  "{{enrollment.denial_reason}}"

We respectfully appeal this determination. The following documentation directly addresses the cited reason:

{{enrollment.appeal_evidence_list}}

We ask the file be re-evaluated and the provider enrolled effective the originally requested date of {{enrollment.requested_effective_date}}.

Sincerely,
{{coordinator.full_name}}
{{tenant.name}}
{{coordinator.email}} · {{coordinator.phone}}`,
    variables: [...COMMON_VARS, "{{payer.address_block}}", "{{provider.npi}}", "{{enrollment.payer_ref}}", "{{enrollment.denial_date}}", "{{enrollment.denial_reason}}", "{{enrollment.appeal_evidence_list}}", "{{enrollment.requested_effective_date}}", "{{coordinator.phone}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "enroll-effective-confirm",
    name: "Effective-date confirmation",
    category: "enrollment",
    channel: "email",
    audience: "provider",
    trigger: "Sent when a payer issues an effective date.",
    subject: "🎉 You&apos;re effective with {{payer.name}} as of {{enrollment.effective_date}}",
    preview: "Celebratory but operational confirmation — provider is now billable with this payer. CCs revenue cycle.",
    body:
`Great news, {{provider.first_name}} —

{{payer.name}} confirmed your enrollment is effective {{enrollment.effective_date}}. You can now bill {{payer.network_name}} for any dates of service on or after that date.

Your CredTek file has been updated automatically; your billing team has been notified.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{payer.name}}", "{{payer.network_name}}", "{{enrollment.effective_date}}"],
    sentCountThisMonth: 0,
  },

  // -------- Re-credentialing --------
  {
    id: "recred-60d-notice",
    name: "60-day re-credentialing notice",
    category: "recredentialing",
    channel: "email",
    audience: "provider",
    trigger: "Fires 60 days before the re-credentialing cycle anniversary.",
    subject: "60-day notice — your re-credentialing window is opening",
    preview: "Calm 60-day heads-up. Lists items that may need refreshing.",
    body:
`Hi {{provider.first_name}},

Your re-credentialing window with {{tenant.name}} opens on {{recred.window_open}}. To make this painless on your end, we&apos;ve already started refreshing what we can automatically.

These items may need a quick update from you:
  • Current CV (any gaps over 30 days)
  • CAQH attestation (we&apos;ll prompt you if it&apos;s aging)
  • Any new state licenses or DEA registrations
  • Any change in malpractice coverage

We&apos;ll send you a one-click update link in {{recred.days_until_packet}} days. No action needed today — just a heads-up.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{recred.window_open}}", "{{recred.days_until_packet}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "recred-30d-action",
    name: "30-day re-credentialing — action needed",
    category: "recredentialing",
    channel: "email",
    audience: "provider",
    trigger: "Fires 30 days before the cycle anniversary; escalates daily after day 14.",
    subject: "Action needed — re-credentialing update in your CredTek file",
    preview: "30-day actionable reminder with a one-click resume-where-you-left-off link.",
    body:
`Hi {{provider.first_name}},

Your re-credentialing window closes in {{recred.days_remaining}} days. Knock these out in under 10 minutes here:

{{recred.secure_link}}

If we don&apos;t complete your file by {{recred.window_close}}, your participation with one or more payers may lapse — which would mean billing interruptions on your end.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{recred.days_remaining}}", "{{recred.secure_link}}", "{{recred.window_close}}"],
    sentCountThisMonth: 0,
  },

  // -------- Expirables --------
  {
    id: "exp-license-30d",
    name: "License expiration — 30-day reminder",
    category: "expirables",
    channel: "email",
    audience: "provider",
    trigger: "Fires 30 days before any license expires.",
    subject: "Your {{license.state}} license expires {{license.expires_on}} — let&apos;s renew",
    preview: "Per-state license expiration reminder with the renewal portal link pre-populated.",
    body:
`Hi {{provider.first_name}},

Your {{license.state}} {{license.kind}} (#{{license.number}}) expires on {{license.expires_on}} — 30 days from today.

Renewal portal: {{license.renewal_portal}}

Most {{license.state}} renewals take less than 20 minutes. If you complete it tonight, we&apos;ll catch the update on tomorrow&apos;s sync and update your CredTek file automatically — no notification needed from you.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{license.state}}", "{{license.kind}}", "{{license.number}}", "{{license.expires_on}}", "{{license.renewal_portal}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "exp-caqh-attestation",
    name: "CAQH re-attestation reminder",
    category: "expirables",
    channel: "email",
    audience: "provider",
    trigger: "Fires every 100 days; CAQH requires attestation every 120 days.",
    subject: "CAQH re-attestation due — 20 days remaining",
    preview: "CAQH 120-day attestation cycle — fires 20 days out so the provider has cushion.",
    body:
`Hi {{provider.first_name}},

CAQH requires re-attestation every 120 days. Your last attestation was {{provider.caqh_attest_date}} — that means we have 20 days before it expires.

Re-attest here (takes ~5 minutes): https://proview.caqh.org

Many payers refresh from CAQH on a 24-hour cycle, so if you re-attest tonight, your enrollments are protected by tomorrow.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{provider.caqh_attest_date}}"],
    sentCountThisMonth: 0,
  },
  {
    id: "exp-dea-90d",
    name: "DEA expiration — 90-day reminder",
    category: "expirables",
    channel: "email",
    audience: "provider",
    trigger: "Fires 90 days before DEA registration expires.",
    subject: "DEA renewal window opens — 90 days to {{credential.expires_on}}",
    preview: "DEA-specific reminder with the renewal link and a note on the 45-day no-renewal-grace cliff.",
    body:
`Hi {{provider.first_name}},

Your DEA registration ({{credential.identifier}}) expires {{credential.expires_on}}. DEA opens the renewal window 60 days out and there is NO grace period after expiration — if you miss it, you must apply for a new registration with a new number, which can break every linked prescription record.

Renew here: https://www.deadiversion.usdoj.gov/drugreg/

This is one of the few items in your file we can&apos;t pre-fill for you — DEA renewal is in your name only.

— CredTek on behalf of {{tenant.name}}`,
    variables: [...COMMON_VARS, "{{credential.identifier}}", "{{credential.expires_on}}"],
    sentCountThisMonth: 0,
  },

  // -------- Billing handoff --------
  {
    id: "billing-handoff",
    name: "Billable — revenue cycle handoff",
    category: "billing",
    channel: "email",
    audience: "coordinator",
    trigger: "Fires the moment a provider becomes billable with any payer.",
    subject: "{{provider.full_name}} is billable — {{enrollment.payer_list}}",
    preview: "Internal handoff to revenue cycle. Lists every payer + effective date + group/individual NPI on the loop.",
    body:
`Heads up, billing team —

{{provider.full_name}}, {{provider.credential}}, NPI {{provider.npi}} is now billable across the following:

{{enrollment.payer_table}}

The provider&apos;s NPI is loaded in our clearinghouses (Availity, Waystar) as of today. EDI handshake confirmation expected within 24 hours.

Open the file: {{provider.workspace_link}}

— CredTek`,
    variables: [...COMMON_VARS, "{{provider.npi}}", "{{enrollment.payer_list}}", "{{enrollment.payer_table}}", "{{provider.workspace_link}}"],
    sentCountThisMonth: 0,
  },
];

export function groupTemplates() {
  const order: TemplateCategory[] = [
    "intake", "psv", "privileging", "committee",
    "enrollment", "recredentialing", "expirables", "billing",
  ];
  return order.map((category) => ({
    category,
    items: TEMPLATES.filter((t) => t.category === category),
  }));
}
