// Knowledge-base content for /help. Coordinator-facing FAQs and
// how-to articles. Plain HTML strings for the content body so the
// article page can render with dangerouslySetInnerHTML — keeps the
// content easy to edit without touching JSX.

export type HelpCategory =
  | "getting_started"
  | "providers"
  | "payors"
  | "supervision"
  | "compliance"
  | "operations";

export type HelpArticle = {
  slug: string;
  category: HelpCategory;
  title: string;
  excerpt: string;
  readTime: string;
  /** Plain HTML — rendered with dangerouslySetInnerHTML. */
  html: string;
};

export const CATEGORY_LABELS: Record<HelpCategory, string> = {
  getting_started: "Getting started",
  providers: "Provider management",
  payors: "Payor enrollment",
  supervision: "Supervision",
  compliance: "Compliance & audit",
  operations: "Behind-the-scenes ops",
};

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "inviting-a-new-provider",
    category: "getting_started",
    title: "Inviting a new provider",
    excerpt:
      "Send a provider an SMS + email link to complete intake from their phone. The agent extracts everything, you review.",
    readTime: "3 min read",
    html: `
      <p>The fastest way to onboard a new clinician is the
      <strong>Invite</strong> flow at <code>/invite</code>. Most coordinators
      can complete a single invite in under 30 seconds; provider intake
      averages 11 minutes on their phone.</p>

      <h2>Steps</h2>
      <ol>
        <li>Go to <a href="/invite">/invite</a> in your CredTek workspace.</li>
        <li>Fill in the provider's first/last name, email, and phone.
        Pre-licensed? Set "Pre-licensed (under supervision)?" to Yes — the
        next page will assign their supervisor.</li>
        <li>Click <em>Send intake link</em>. Both an SMS and an email go
        out within 3 seconds.</li>
        <li>The provider taps the link, takes photos of their license,
        DEA, COI, and CV, and signs attestations. <strong>Average
        completion: 11 minutes.</strong></li>
        <li>You see the provider appear in your <a href="/dashboard">Dashboard</a>
        pipeline as soon as they submit. The PSV agent and payor
        enrollment agents start drafting immediately.</li>
      </ol>

      <h2>What if the provider doesn't respond?</h2>
      <p>CredTek auto-resends the invite every 48 hours, up to 3 times. If
      they still haven't completed after a week, the link goes to a
      "Stalled" status and we ping you for a manual follow-up.</p>

      <h2>Multi-state providers</h2>
      <p>If your provider holds licenses in multiple states, list the
      primary state on the invite — they'll add the others during intake.
      The PSV agent verifies all of them in parallel.</p>

      <h2>Bulk invite (Modio import)</h2>
      <p>To invite many providers at once, use the Modio import flow at
      <a href="/welcome">/welcome → step 4</a>. Drop your Modio CSV and
      our intake agent matches existing records, flags anomalies, and
      creates new invites for the rest.</p>
    `,
  },
  {
    slug: "tracking-pre-licensed-supervision",
    category: "supervision",
    title: "Tracking pre-licensed supervision",
    excerpt:
      "How CredTek tracks supervised hours, cosignatures, and state-board rules for LMSWs, LPC-Associates, and LMFT-Associates.",
    readTime: "4 min read",
    html: `
      <p>Pre-licensed clinicians (LMSW → LCSW, LPC-Associate → LPC,
      LMFT-A → LMFT, and equivalents) need supervised hours tracked
      against their state board's rules. CredTek does this natively —
      no spreadsheets.</p>

      <h2>What CredTek tracks</h2>
      <ul>
        <li><strong>Total hours</strong> against the state requirement (e.g.
        TX requires 3,000 for LPC; CA requires 3,200 for LCSW).</li>
        <li><strong>Direct client contact hours</strong> separately — most
        states require a percentage be direct client work.</li>
        <li><strong>Group hours cap</strong> — many states limit how many
        hours can be group vs. individual.</li>
        <li><strong>Supervisor cosignatures</strong> per session, with
        SMS reminders when overdue.</li>
        <li><strong>Quarterly evaluations</strong> as required by board.</li>
        <li><strong>Projected licensure date</strong> based on current
        logging pace — your finance team can model FTE forward off this.</li>
      </ul>

      <h2>The state-board rule engine</h2>
      <p>Every state has its own quirks (CA's BBS process, NY's OP, FL's
      ARM). When a state board updates its rules, we update the engine
      once for the whole network — no audit panic at your group.</p>
      <p>See the live coverage at <a href="/supervision">/supervision</a>.</p>

      <h2>Adding a supervisee</h2>
      <p>Set "Pre-licensed (under supervision)?" to Yes when you invite
      them at <a href="/invite">/invite</a>. They'll be prompted to assign
      their supervisor during intake. The supervisor must already exist as
      a CredTek provider with an active independent license.</p>

      <h2>What the supervisor does</h2>
      <p>Supervisors get an SMS or email each week to cosign their
      supervisee's logged hours. One tap from the link confirms — no
      login required for the cosign action itself. Audit-logged via the
      hash chain at <a href="/ops/audit">/ops/audit</a>.</p>
    `,
  },
  {
    slug: "approving-payor-drafts",
    category: "payors",
    title: "Approving payor enrollment drafts",
    excerpt:
      "Every Tier 3 payor submission gets a coordinator click before it leaves CredTek. Here's how the approval queue works.",
    readTime: "3 min read",
    html: `
      <p>CredTek's enrollment agents fill the Optum, Carelon, Magellan,
      Evernorth, and Anthem BH applications end-to-end — but
      <strong>nothing leaves CredTek without your click.</strong> The
      human-in-the-loop gate is on the architecture (per the IAL spec),
      not a feature flag.</p>

      <h2>The approval queue</h2>
      <p>Open <a href="/approvals">/approvals</a>. You see every drafted
      submission, license renewal, CAQH attestation, and PSV anomaly that
      needs your eyes — sorted by urgency.</p>

      <h2>Approve, edit, or reject</h2>
      <ul>
        <li><strong>Approve &amp; send</strong> — the most common action.
        The agent submits to the payor portal, transitions the
        IntegrationJob to <code>submitted</code>, and logs to the audit
        chain.</li>
        <li><strong>Edit</strong> — opens an inline editor. Most coordinators
        never need this; agent drafts have a 97% accept-as-is rate. But if
        the payor has a quirk we missed (a specific phrasing they require
        in a free-text field), this is where you fix it.</li>
        <li><strong>Reject</strong> — dismisses the draft and asks the agent
        for a new one (or stops the workflow, depending on action type).</li>
      </ul>

      <h2>How the agent draft is built</h2>
      <p>From the provider's golden profile (intake + PSV results + CAQH
      sync). The agent fills every field on the payor's portal, attaches
      the right documents, and stages the submission. You see exactly what
      will be sent.</p>

      <h2>Stalled submissions</h2>
      <p>When a Tier 3 submission stays in <code>submitted</code> status
      past 45 days, the SLA monitor auto-creates a Tier 4 escalation
      ticket — internal ops calls the payor's provider relations team to
      unblock. Visible to you on the customer-facing job; the ops surface
      lives at <a href="/ops/queue">/ops/queue</a>.</p>
    `,
  },
  {
    slug: "caqh-auto-attestation",
    category: "compliance",
    title: "Setting up CAQH auto-attestation",
    excerpt:
      "Most plans require providers to re-attest their CAQH profile every 120 days. CredTek handles it automatically — provider just taps SMS.",
    readTime: "2 min read",
    html: `
      <p>CAQH ProView re-attestation is the most-missed credentialing
      task — every 120 days, every provider, every plan that pulls from
      CAQH. Miss it and the provider falls out of network.</p>

      <h2>How it works in CredTek</h2>
      <ol>
        <li>The provider opts in during intake (Step 4 of the
        <a href="/intake/demo-aisha">/intake</a> flow). Default is on.</li>
        <li>20 days before the next attestation deadline, CredTek pre-fills
        the attestation from the provider's latest golden profile data.</li>
        <li>The provider gets an SMS: "Tap to confirm your CAQH profile
        is still accurate." Average response time: 11 seconds.</li>
        <li>On confirmation, CredTek submits to CAQH via our CVO partner's
        Participating Organization API. Result flows back to the provider's
        record + audit log.</li>
      </ol>

      <h2>What if the provider's data has changed?</h2>
      <p>The SMS shows the actual data we'd attest to (license, address,
      payors). If anything's wrong, the provider taps "Update first" and
      we route them through a quick correction flow before submitting.</p>

      <h2>What if the provider doesn't respond?</h2>
      <p>Two SMS reminders, one email reminder. Past day 90 with no
      response, we escalate to the coordinator with a single-click
      override option. Don't let it lapse — re-credentialing after a CAQH
      gap takes 6+ weeks.</p>
    `,
  },
  {
    slug: "ncqa-audit-binder",
    category: "compliance",
    title: "Generating an NCQA audit binder for delegated credentialing",
    excerpt:
      "Optum, Carelon, and other payors offer delegated credentialing if your group is NCQA-compliant. Here's how to assemble the binder.",
    readTime: "5 min read",
    html: `
      <p>Delegated credentialing is the highest-leverage move a
      mid-market BH group can make. Once a payor delegates, you skip
      their credentialing process entirely — you credential providers
      yourself and they accept it. Optum and Carelon both offer this if
      your group is NCQA-compliant.</p>

      <h2>What goes in the binder</h2>
      <p>NCQA's standards (specifically <em>CR 1–6</em>) require:</p>
      <ul>
        <li>Primary source verification of license, DEA, board cert,
        education, work history</li>
        <li>NPDB query within 180 days</li>
        <li>OIG and SAM.gov screening within 30 days</li>
        <li>Provider attestations (clinical privileges, signed within 365
        days)</li>
        <li>Sanctions and disciplinary action screening</li>
        <li>Re-credentialing within 36 months (24 months for some payors)</li>
      </ul>

      <h2>Generating the binder in CredTek</h2>
      <ol>
        <li>Open the provider's record at
        <code>/providers/[slug]?tab=documents</code>.</li>
        <li>Scroll to <strong>Generate audit binder</strong>.</li>
        <li>Click — CredTek assembles a 12-30 page PDF (length depends on
        tenure) with every required artifact in NCQA's expected order.</li>
        <li>Review and either download for your records or send directly
        to the payor's delegated credentialing reviewer.</li>
      </ol>

      <h2>For the whole roster (full audit)</h2>
      <p>When a payor (or NCQA itself) audits your delegated arrangement,
      you'll need binders for a sampled subset of your providers.
      <code>/ops/audit</code> shows the audit log; we'll add a roster-wide
      binder export in a future release. For now, the per-provider binder
      is the fast path.</p>

      <h2>Why this matters financially</h2>
      <p>Delegated credentialing typically takes 30-60 days off
      time-to-active per provider for that payor (you skip their
      credentialing committee). For a 200-provider group adding 40
      providers a year, that's roughly $300K in pulled-forward revenue.</p>
    `,
  },
  {
    slug: "audit-log-and-hash-chain",
    category: "operations",
    title: "Reading the audit log and verifying the hash chain",
    excerpt:
      "Every PHI access, state transition, and external call is hash-chained for tamper evidence. Here's how to read it and verify integrity.",
    readTime: "4 min read",
    html: `
      <p>HIPAA and SOC 2 both require non-repudiable audit logging on
      every PHI access. CredTek goes further — every audit row's
      <code>log_hash</code> is
      <code>SHA-256(prev_log_hash || canonical_json(this_row))</code>.
      This forms a tamper-evident chain: tampering with any historical
      row breaks every subsequent hash, detectable in O(n).</p>

      <h2>Where to find it</h2>
      <p><a href="/ops/audit">/ops/audit</a> in the Ops view. Filter by
      actor type (system / user / agent / specialist), action, or
      resource. Each row shows the previous hash and its own hash so you
      can eyeball the chain.</p>

      <h2>What gets logged</h2>
      <ul>
        <li>Every <code>IntegrationJob</code> state transition</li>
        <li>Every PHI read (provider profile view, document download)</li>
        <li>Every PHI write (provider edit, document upload, payload
        modification)</li>
        <li>Every authentication event (login, logout, MFA challenge,
        session refresh)</li>
        <li>Every authorization decision</li>
        <li>Every external system call (request and response, with PHI
        redacted)</li>
        <li>Every admin action (user create, role change, settings change)</li>
      </ul>

      <h2>Verifying the chain</h2>
      <p>Production: a nightly background job recomputes the chain from
      genesis and pages on-call if a break is detected. You can also
      verify a range manually — recompute
      <code>SHA-256(prev_log_hash || canonical_json(row))</code> for each
      row and compare against <code>log_hash</code>. Mismatches surface
      the exact row that was tampered with.</p>

      <h2>Demoing the chain to an auditor</h2>
      <p>The audit page UI shows enough context for an NCQA or HIPAA
      auditor walkthrough. If the auditor wants to verify the math, the
      <code>verifyChain()</code> helper at
      <code>app/_lib/ial/auditChain.ts</code> in the source repo is the
      reference implementation. SOC 2 Type II auditors love it.</p>
    `,
  },
];

export function findArticle(slug: string): HelpArticle | undefined {
  return HELP_ARTICLES.find((a) => a.slug === slug);
}

export function articlesByCategory(
  category: HelpCategory,
): HelpArticle[] {
  return HELP_ARTICLES.filter((a) => a.category === category);
}
