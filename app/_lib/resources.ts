// Resources / blog content for /resources. Educational articles for
// the credentialing buyer — the "guide demonstrates competence" move
// in StoryBrand terms. Plain HTML bodies rendered with
// dangerouslySetInnerHTML, mirroring the helpArticles.ts pattern.
//
// Published articles have an `html` body and render at /resources/[slug].
// Roadmap entries (html === null) show on the index as "Coming soon"
// and are not clickable — an honest content roadmap, not broken links.

export type ResourceCategory =
  | "foundations"
  | "roi"
  | "compliance"
  | "multistate"
  | "government"
  | "specialty"
  | "future";

export const RESOURCE_CATEGORY_LABELS: Record<ResourceCategory, string> = {
  foundations: "Credentialing foundations",
  roi: "The cost of slow credentialing",
  compliance: "Compliance & standards",
  multistate: "Multi-state & compacts",
  government: "Government payers",
  specialty: "Specialty workflows",
  future: "The future of credentialing",
};

export type Resource = {
  slug: string;
  category: ResourceCategory;
  title: string;
  excerpt: string;
  readTime: string;
  /** Plain HTML body. null = roadmap entry (coming soon, not yet published). */
  html: string | null;
};

const CTA = `
  <div class="rsc-cta">
    <h3>See your own numbers in 60 seconds</h3>
    <p>CredTek gets providers in-network 40–60% faster — built by
    operators with 40+ years of enterprise credentialing experience, run
    by modern AI agents with a human approval gate on every submission.</p>
    <a class="rsc-cta-btn" href="/#calc">Run the ROI calculator →</a>
  </div>
`;

export const RESOURCES: Resource[] = [
  // ───────────────────────── FOUNDATIONS ─────────────────────────
  {
    slug: "credentialing-vs-payer-enrollment",
    category: "foundations",
    title: "Credentialing vs. Payer Enrollment: What's the Difference (and Why It Costs You)",
    excerpt:
      "They sound interchangeable. They aren't. Confusing the two is one of the most expensive mistakes a growing medical group makes — here's the clean mental model.",
    readTime: "6 min read",
    html: `
      <p>If you've ever heard someone say "the provider is credentialed but
      still can't bill," you've already met the most expensive misunderstanding
      in healthcare operations. <strong>Credentialing and payer enrollment are
      two different processes</strong>, they happen on two different timelines,
      and a provider needs <em>both</em> finished before a single dollar can be
      billed.</p>

      <h2>Credentialing: "Is this person who they say they are?"</h2>
      <p>Credentialing is the verification process — confirming a provider's
      identity, education, training, licensure, board certification, work
      history, malpractice history, and sanctions status against
      <strong>primary sources</strong>. It answers a safety question: is this
      clinician qualified and in good standing to deliver care?</p>
      <p>Credentialing is governed by accreditation standards (NCQA, URAC, The
      Joint Commission) and is the foundation for both hospital privileging and
      payer enrollment. It's typically valid for three years before
      re-credentialing is required.</p>

      <h2>Payer enrollment: "Will this insurer pay this provider?"</h2>
      <p>Payer enrollment (also called provider enrollment) is the process of
      getting a credentialed provider into a health plan's network so claims
      get paid. Each payer — Aetna, Cigna, UnitedHealthcare, Medicare, each
      state Medicaid program — has its own application, its own portal, its own
      timeline, and its own definition of an "effective date."</p>
      <p>Here's the trap: a provider can be fully credentialed and privileged at
      your facility and still be <strong>out-of-network with every payer</strong>.
      They can legally see patients — but you can't bill for the visit.</p>

      <h2>Why the distinction costs real money</h2>
      <p>The gap between "can work" and "can bill" is where revenue leaks. A
      provider who's credentialed in week 3 but not enrolled with their top
      payers until week 14 represents <strong>11 weeks of clinical work you may
      not be able to bill for</strong> — or that you bill at out-of-network
      rates, fight over, and frequently write off.</p>
      <p>For a provider generating $8,000–$12,000 per week in collections, that
      gap is $90,000–$130,000 in exposure per hire. Multiply by every new
      clinician and you understand why "ready to work" and "ready to bill" are
      tracked as two separate states in any serious credentialing system.</p>

      <h2>The clean mental model</h2>
      <ul>
        <li><strong>Credentialing</strong> = verifying the person. Done once,
        renewed every ~3 years.</li>
        <li><strong>Privileging</strong> = a specific facility granting them the
        right to practice there.</li>
        <li><strong>Payer enrollment</strong> = each insurer adding them to the
        network so claims pay. Done per payer, per state.</li>
      </ul>
      <p>You need all three. The fastest groups run them in parallel — starting
      payer enrollment the moment primary-source verification clears, rather than
      waiting for privileging to finish first.</p>
      ${CTA}
    `,
  },
  {
    slug: "primary-source-verification-7-sources",
    category: "foundations",
    title: "Primary Source Verification: The 7 Sources Every Payer Requires",
    excerpt:
      "PSV is the spine of credentialing. Here are the seven primary sources that have to be checked on every provider — and what each one is actually confirming.",
    readTime: "7 min read",
    html: `
      <p>Primary source verification (PSV) is the non-negotiable core of
      credentialing. "Primary source" means you verify a credential with the
      organization that <em>issued</em> it — not a copy the provider hands you,
      not a résumé line. NCQA, URAC, and The Joint Commission all require it,
      and payers won't enroll a provider whose file isn't built on it.</p>

      <p>Here are the seven sources that get checked on essentially every U.S.
      provider, and what each one confirms.</p>

      <h2>1. State licensing board</h2>
      <p>Confirms an active, unrestricted license to practice in each state where
      the provider will see patients. This is verified per state — a provider
      working telehealth across five states needs five verifications, each
      against that state's board.</p>

      <h2>2. NPPES (National Plan &amp; Provider Enumeration System)</h2>
      <p>Confirms the provider's NPI (National Provider Identifier) and that the
      demographic data on file matches. The NPI is the universal key that links a
      provider across every payer and claim.</p>

      <h2>3. DEA / CDS registration</h2>
      <p>For providers who prescribe controlled substances, confirms a valid DEA
      registration (and state Controlled Dangerous Substance registration where
      required). Verified against the DEA's records.</p>

      <h2>4. Board certification</h2>
      <p>Confirms specialty board status with the certifying board (ABMS member
      boards, AOA for osteopathic, or the relevant specialty board). Verifies the
      certification is current and not expired.</p>

      <h2>5. Education &amp; training</h2>
      <p>Confirms medical/professional school graduation and completion of
      residency/fellowship, verified with the institutions or an approved
      verification service (e.g., ECFMG for international medical graduates).</p>

      <h2>6. NPDB (National Practitioner Data Bank)</h2>
      <p>A federal query that surfaces malpractice payments, adverse licensure
      actions, clinical privilege restrictions, and certain sanctions. A
      continuous-query enrollment keeps it monitored rather than checked once.</p>

      <h2>7. OIG LEIE + SAM.gov exclusions</h2>
      <p>Confirms the provider is <strong>not excluded</strong> from federal
      healthcare programs (OIG List of Excluded Individuals/Entities) and not
      debarred from federal contracting (SAM.gov). Billing for an excluded
      provider is a serious compliance violation — this is checked at
      onboarding and re-swept monthly.</p>

      <h2>The operational reality</h2>
      <p>Each of these has a different source system, a different interface, and
      a different refresh cadence. Done by hand, building one provider's PSV file
      is hours of portal-hopping and PDF-wrangling. Done continuously — so a
      newly-surfaced sanction or an expiring license triggers an alert the day it
      changes — it's a system, not a task.</p>
      ${CTA}
    `,
  },
  {
    slug: "caqh-proview-attestation-cycle",
    category: "foundations",
    title: "CAQH ProView Explained: The 120-Day Attestation Cycle",
    excerpt:
      "CAQH is the shared application most payers pull from. Miss the 120-day re-attestation and enrollments silently stall. Here's how the cycle actually works.",
    readTime: "5 min read",
    html: null,
  },
  {
    slug: "what-is-a-cvo",
    category: "foundations",
    title: "What Is a CVO? In-House vs. Outsourced Credentialing",
    excerpt:
      "A Credentials Verification Organization can verify on your behalf. When does outsourcing make sense, and when does it just add a hand-off delay?",
    readTime: "6 min read",
    html: null,
  },
  {
    slug: "new-provider-credentialing-checklist",
    category: "foundations",
    title: "The Complete New-Provider Credentialing Checklist",
    excerpt:
      "Every document, every verification, every enrollment — in the order that gets a new hire billing fastest. A printable reference.",
    readTime: "8 min read",
    html: null,
  },

  // ───────────────────────── ROI ─────────────────────────
  {
    slug: "true-cost-of-slow-credentialing",
    category: "roi",
    title: "The True Cost of Slow Credentialing: $2,000–$3,000 per Provider per Day",
    excerpt:
      "Every day a credentialed-but-not-enrolled provider sits idle is lost revenue you'll never recover. Here's the actual math, and where the time goes.",
    readTime: "6 min read",
    html: `
      <p>Slow credentialing doesn't show up as a line item, which is exactly why
      it's so dangerous. It's an invisible tax — revenue that simply never gets
      generated because a qualified provider couldn't bill yet. Let's make it
      visible.</p>

      <h2>The per-provider, per-day number</h2>
      <p>A full-time physician typically generates <strong>$2,000–$3,000 per day
      in collectible revenue</strong> (specialty-dependent — a proceduralist is
      far higher, a primary-care NP somewhat lower). When that provider is hired,
      onboarded, and ready to see patients but <em>not yet enrolled with payers</em>,
      that revenue doesn't pause — it disappears.</p>
      <p>The industry-average gap from hire date to first in-network payer is
      <strong>90–120 days</strong>. Even crediting the provider with some
      out-of-network and self-pay volume during that window, the unrecoverable
      loss routinely runs <strong>$120,000–$180,000 per provider</strong>.</p>

      <h2>Where the 90–120 days actually goes</h2>
      <ul>
        <li><strong>Days 1–10:</strong> Gathering documents from the provider —
        often the single biggest source of delay, because it's blocked on a busy
        human emailing PDFs.</li>
        <li><strong>Days 10–25:</strong> Primary-source verification across 7+
        sources.</li>
        <li><strong>Days 25–45:</strong> Facility privileging, if applicable.</li>
        <li><strong>Days 30–110:</strong> Payer enrollment — the long pole.
        Each payer runs its own clock, and a single missing field can reset it.</li>
      </ul>

      <h2>The multiplier you're not counting</h2>
      <p>For a 200-provider group hiring 10 new clinicians a quarter, that's 40
      enrollments a year. At $150,000 of exposure each, slow credentialing is a
      <strong>$6M annual problem</strong> before you've counted the coordinator
      salaries spent chasing it or the providers who quit because onboarding felt
      chaotic.</p>

      <h2>What actually moves the number</h2>
      <p>Three levers compress the timeline more than anything else:</p>
      <ol>
        <li><strong>Front-load document collection</strong> — get everything from
        the provider on day one via a guided mobile intake, not a back-and-forth
        email thread.</li>
        <li><strong>Run enrollment in parallel</strong> with privileging instead
        of in sequence.</li>
        <li><strong>Never lose a queue position</strong> to a missing field —
        validate applications before submission, every time.</li>
      </ol>
      <p>Groups that do all three routinely beat the industry average by 40–60%.
      The revenue that recovers isn't theoretical — it's the difference between a
      provider billing in week 5 versus week 16.</p>
      ${CTA}
    `,
  },
  {
    slug: "time-to-revenue-new-hires",
    category: "roi",
    title: "Time-to-Revenue: How to Get New Hires Billing Faster",
    excerpt:
      "The metric your CFO actually cares about. A practical playbook for compressing the gap between a signed offer letter and a paid claim.",
    readTime: "7 min read",
    html: null,
  },
  {
    slug: "hidden-cost-recredentialing-lapse",
    category: "roi",
    title: "The Hidden Cost of a Re-Credentialing Lapse",
    excerpt:
      "Miss a re-credentialing deadline and a provider can be dropped from a network mid-cycle — retroactively. Claims claw back. Here's how lapses happen and how to prevent them.",
    readTime: "5 min read",
    html: null,
  },

  // ───────────────────────── COMPLIANCE ─────────────────────────
  {
    slug: "ncqa-delegated-credentialing",
    category: "compliance",
    title: "NCQA Delegated Credentialing: How to Qualify and What It Saves",
    excerpt:
      "Delegated credentialing lets a payer trust your credentialing instead of redoing it — collapsing enrollment timelines dramatically. Here's what it takes to earn and keep it.",
    readTime: "8 min read",
    html: `
      <p>Delegated credentialing is one of the highest-leverage arrangements a
      growing medical group can pursue, and one of the least understood. Done
      right, it can collapse payer enrollment from months to weeks. Done wrong —
      or audited badly — it can be revoked, and you're back to square one.</p>

      <h2>What "delegation" actually means</h2>
      <p>Normally, every payer independently credentials every one of your
      providers before adding them to the network. Under a
      <strong>delegated credentialing agreement</strong>, the payer delegates
      that work to you. They trust your credentialing process and your files, and
      in exchange they add your providers to the network based on a roster you
      submit — typically monthly — rather than re-verifying each one.</p>
      <p>The result: providers go in-network in a fraction of the usual time,
      because the slowest step (the payer's own credentialing queue) is removed.</p>

      <h2>What it takes to qualify</h2>
      <p>Payers don't delegate to just anyone. To earn delegation you generally
      need:</p>
      <ul>
        <li>A credentialing program that meets <strong>NCQA standards</strong>
        (or the payer's equivalent) — documented policies, a credentialing
        committee, defined timelines.</li>
        <li><strong>Primary-source verification</strong> on every provider,
        every time, with an auditable trail.</li>
        <li>A <strong>pre-delegation audit</strong> — the payer reviews a sample
        of your files before signing.</li>
        <li>Ongoing <strong>annual audits</strong> to keep the arrangement.</li>
        <li>Clean roster management — accurate monthly adds/terms/changes.</li>
      </ul>

      <h2>What it saves</h2>
      <p>For multi-state groups and MSOs adding providers continuously, delegation
      is transformational. Instead of each provider waiting in each payer's
      credentialing queue, they're added on the next roster cycle. Enrollment
      timelines compress, time-to-revenue shrinks, and your coordinators stop
      re-submitting the same data to the same payers over and over.</p>

      <h2>The audit is the whole game</h2>
      <p>Delegation lives or dies on the audit. When a payer pulls a sample of
      your files, every one needs to be <strong>complete, correctly verified, and
      audit-ready</strong> — PSV evidence for each credential, dates, the
      credentialing committee's decision, re-credentialing on schedule. A file
      that can't be reconstructed on demand is a finding, and enough findings
      revoke the delegation.</p>
      <p>This is why audit-readiness can't be a scramble before the audit. It has
      to be the default state of every file, every day — which is exactly what a
      tamper-evident, continuously-verified credentialing system produces as a
      byproduct of normal operation.</p>
      ${CTA}
    `,
  },
  {
    slug: "audit-ready-credentialing-file",
    category: "compliance",
    title: "Building an Audit-Ready Credentialing File (NCQA + Joint Commission)",
    excerpt:
      "What a surveyor actually looks for, file by file. How to make audit-readiness the default state instead of a fire drill.",
    readTime: "7 min read",
    html: null,
  },
  {
    slug: "oig-sam-exclusion-monitoring",
    category: "compliance",
    title: "OIG & SAM Exclusion Monitoring: The Compliance Risk You Can't Ignore",
    excerpt:
      "Billing for an excluded provider is a federal problem with per-claim penalties. Why a one-time check isn't enough, and what monthly monitoring looks like.",
    readTime: "5 min read",
    html: null,
  },
  {
    slug: "npdb-queries-explained",
    category: "compliance",
    title: "NPDB Queries: What They Reveal and When They're Required",
    excerpt:
      "The National Practitioner Data Bank surfaces what a résumé won't. A plain-English guide to one-time queries vs. continuous enrollment.",
    readTime: "5 min read",
    html: null,
  },
  {
    slug: "recredentialing-every-three-years",
    category: "compliance",
    title: "Re-Credentialing Every 3 Years: How to Never Miss a Cycle",
    excerpt:
      "Re-credentialing isn't optional and the clock never stops. How to turn a recurring scramble into an automated, forecasted workflow.",
    readTime: "6 min read",
    html: null,
  },

  // ───────────────────────── MULTI-STATE ─────────────────────────
  {
    slug: "interstate-medical-licensure-compact",
    category: "multistate",
    title: "The Interstate Medical Licensure Compact (IMLC): Faster Multi-State Licensing",
    excerpt:
      "The IMLC is the closest thing to a fast lane for physician licensure across states. Who's eligible, what it actually speeds up, and where it stops.",
    readTime: "6 min read",
    html: `
      <p>For any group practicing across state lines — and especially for
      telehealth — multi-state licensure is the bottleneck behind the bottleneck.
      The Interstate Medical Licensure Compact (IMLC) exists to ease it, but it's
      widely misunderstood. Here's what it does and doesn't do.</p>

      <h2>What the IMLC is</h2>
      <p>The IMLC is an agreement among participating states (40+ at last count,
      plus D.C. and Guam) that creates an <strong>expedited pathway</strong> for
      eligible physicians to obtain licenses in multiple member states. It does
      not create one national license — a physician still holds a separate
      license in each state, but the compact dramatically streamlines getting
      them.</p>

      <h2>Who's eligible</h2>
      <p>A physician qualifies if they hold a full, unrestricted license in a
      member state designated as their <strong>State of Principal License</strong>,
      and they meet criteria including: graduation from an accredited medical
      school, passing all licensing exams within the allowed attempts, board
      certification, no disciplinary actions, and no pending investigations.
      Roughly 80% of U.S. physicians meet the bar.</p>

      <h2>What it actually speeds up</h2>
      <p>Without the compact, each state license is a fresh, full application with
      its own primary-source verification. Through the IMLC, the physician's
      credentials are verified once by their principal-license state, and that
      verification is accepted by the other member states. The result is licensure
      in additional states in <strong>weeks rather than months</strong>.</p>

      <h2>Where it stops</h2>
      <ul>
        <li>It only covers <strong>physicians (MD/DO)</strong> — not NPs, PAs,
        nurses, or behavioral-health clinicians (they have their own compacts —
        the NLC, PSYPACT, the Counseling Compact, the Social Work Compact).</li>
        <li>It only covers <strong>member states</strong> — non-participating
        states still require a traditional application.</li>
        <li>It expedites the <em>license</em>, not payer enrollment. A newly
        licensed provider in a new state still has to be enrolled with that
        state's payers and Medicaid program.</li>
      </ul>

      <h2>The operational takeaway</h2>
      <p>The compacts are powerful, but each clinician type has a different one,
      with different member states and different rules. Tracking which provider is
      eligible for which compact in which state — and triggering the right pathway
      automatically — is exactly the kind of multi-state complexity that breaks
      spreadsheets and rewards a purpose-built system.</p>
      ${CTA}
    `,
  },
  {
    slug: "psypact-explained",
    category: "multistate",
    title: "PSYPACT Explained: Telehealth Psychology Across State Lines",
    excerpt:
      "PSYPACT lets qualified psychologists practice telehealth across member states. How it works, who qualifies, and how it interacts with payer enrollment.",
    readTime: "5 min read",
    html: null,
  },
  {
    slug: "nurse-licensure-compact",
    category: "multistate",
    title: "The Nurse Licensure Compact (NLC): What It Actually Covers",
    excerpt:
      "One multistate license, many states — for RNs and LPNs who qualify. The boundaries of the NLC and what it means for multi-state staffing.",
    readTime: "5 min read",
    html: null,
  },
  {
    slug: "fifty-state-license-matrix",
    category: "multistate",
    title: "Managing a 50-State License Matrix Without Losing Your Mind",
    excerpt:
      "When you have providers licensed across dozens of states, every renewal date is a landmine. How to forecast, track, and auto-renew at scale.",
    readTime: "6 min read",
    html: null,
  },

  // ───────────────────────── GOVERNMENT ─────────────────────────
  {
    slug: "medicare-enrollment-pecos",
    category: "government",
    title: "Medicare Enrollment via PECOS: Step-by-Step + Revalidation",
    excerpt:
      "PECOS is its own world with its own timelines and a 5-year revalidation clock. A walk-through that keeps your Medicare billing privileges intact.",
    readTime: "8 min read",
    html: null,
  },
  {
    slug: "medicaid-enrollment-state-by-state",
    category: "government",
    title: "Medicaid Enrollment: Why It's Different in Every State",
    excerpt:
      "Fifty states, fifty programs, fifty sets of rules — plus managed-care organizations on top. How to keep Medicaid enrollment from becoming chaos.",
    readTime: "7 min read",
    html: null,
  },

  // ───────────────────────── SPECIALTY ─────────────────────────
  {
    slug: "behavioral-health-supervision-tracking",
    category: "specialty",
    title: "Behavioral Health Supervision Tracking: Pre-Licensed Provider Hours",
    excerpt:
      "Pre-licensed LPCs, LMFTs, and LCSWs need supervised hours tracked against state-board rules. The workflow generic credentialing tools force into spreadsheets.",
    readTime: "7 min read",
    html: `
      <p>Behavioral health has a credentialing challenge almost no other specialty
      shares, and almost no credentialing tool handles natively: <strong>pre-licensed
      providers working toward independent licensure under supervision</strong>.
      If you employ associate-level clinicians — LPC-As, LMFT-As, LCSW-As — this is
      a workflow you're probably running in a spreadsheet today. Here's why it's so
      hard and what tracking it properly requires.</p>

      <h2>The problem in one sentence</h2>
      <p>A pre-licensed behavioral-health clinician can see and bill for patients
      (often under their supervisor's credentials), but only while accumulating
      supervised hours that must be tracked precisely against
      <strong>state-board rules that differ in every state</strong> — and if the
      tracking is wrong, the clinician's path to independent licensure is delayed
      or invalidated.</p>

      <h2>What actually has to be tracked</h2>
      <ul>
        <li><strong>Total supervised hours</strong> toward the state's requirement
        (e.g., 3,000 hours in Texas for an LPC).</li>
        <li><strong>Direct client-contact hours</strong> as a subset (e.g., a
        minimum of 1,500 of those 3,000 must be direct client contact).</li>
        <li><strong>Supervision hours</strong> — individual vs. group, each with
        its own minimums and ratios.</li>
        <li><strong>Supervisor eligibility</strong> — the supervisor must hold an
        active, qualifying license and approved supervisor status.</li>
        <li><strong>Weekly cosignature</strong> — the supervisor attesting to the
        hours logged.</li>
        <li><strong>Projected licensure date</strong> — so the practice can plan
        around when the clinician becomes independently billable.</li>
      </ul>

      <h2>Why generic tools fail at it</h2>
      <p>Standard credentialing software models a provider as a fixed set of static
      credentials. Supervision is the opposite — it's a <em>running tally</em> that
      changes weekly, governed by a different rule engine for each of the 50 states,
      with a cosignature workflow and a moving completion forecast. It doesn't fit
      the static-credential model, so it falls out into a spreadsheet. Then the
      spreadsheet breaks: a missed cosignature, a miscounted group-hour ratio, a
      supervisor whose own license lapsed — any of these can invalidate months of
      accrued hours.</p>

      <h2>What good looks like</h2>
      <p>Done right, supervision tracking is a first-class workflow: state-specific
      rule engines for all 50 boards, weekly hour logging with supervisor
      cosignature, automatic flagging when ratios drift out of compliance, and a
      live projected-licensure date the practice can staff around. It turns a
      compliance liability into a predictable pipeline — and for any group with
      associate-level BH staff, it's frequently the single most valuable workflow
      a credentialing platform can provide.</p>
      ${CTA}
    `,
  },
  {
    slug: "locum-tenens-credentialing",
    category: "specialty",
    title: "Locum Tenens Credentialing: Winning the Short-Window Race",
    excerpt:
      "Locum assignments are short and credentialing is slow — a structural mismatch. How to credential fast enough that the locum is actually billable before they leave.",
    readTime: "6 min read",
    html: null,
  },
  {
    slug: "credentialing-during-mergers-acquisitions",
    category: "specialty",
    title: "Credentialing During M&A: NPI Changes, Reassignments, Revalidation",
    excerpt:
      "When groups merge, every provider's enrollment can be disrupted — new TINs, reassigned NPIs, payer revalidations. How to keep revenue flowing through the transition.",
    readTime: "7 min read",
    html: null,
  },

  // ───────────────────────── FUTURE ─────────────────────────
  {
    slug: "ai-in-credentialing-real-vs-hype",
    category: "future",
    title: "AI in Credentialing: What's Real, What's Hype, and Where Humans Still Win",
    excerpt:
      "AI agents can fill payer portals and extract data from documents — but the approval gate still belongs to a human. An honest look at what to automate and what not to.",
    readTime: "7 min read",
    html: `
      <p>Every credentialing vendor now has "AI" on the homepage. Some of it is
      real and genuinely transformative; some of it is a wrapper around the same
      manual process. If you're evaluating tools, here's how to tell the
      difference — and where the technology genuinely helps versus where a human
      still has to own the decision.</p>

      <h2>What AI is genuinely good at in credentialing</h2>
      <ul>
        <li><strong>Document extraction.</strong> Vision models can read a
        license, DEA certificate, or COI and pull every field with confidence
        scoring — replacing hours of manual data entry. The provider takes a
        photo; the system structures it.</li>
        <li><strong>Form-filling across payer portals.</strong> Browser-driving
        agents can navigate Aetna's portal, UHC's portal, and dozens of others,
        filling enrollment applications end-to-end from a single golden provider
        profile.</li>
        <li><strong>Anomaly detection.</strong> Flagging the field that doesn't
        match, the date that's about to expire, the ratio that's drifting out of
        compliance — surfacing the exception so a human looks only where it
        matters.</li>
        <li><strong>Continuous monitoring.</strong> Re-sweeping sanctions lists
        and license statuses constantly, so a change is caught the day it
        happens rather than at the next manual review.</li>
      </ul>

      <h2>Where humans still have to win</h2>
      <p>Here's the line that separates responsible AI credentialing from
      reckless automation: <strong>nothing an AI generates should reach a payer
      without a human approving it first.</strong></p>
      <p>A hallucinated field on an enrollment application isn't a typo — it's
      potentially a misrepresentation to an insurer, with real consequences. The
      right architecture uses AI to do the heavy lifting (extraction, navigation,
      drafting) and then routes every submission through a
      <strong>coordinator approval gate</strong>. The human reviews, the human
      approves, the human owns the decision. The AI just made the work 10× faster
      to get to that point.</p>

      <h2>How to evaluate a vendor's "AI"</h2>
      <p>Ask three questions:</p>
      <ol>
        <li><strong>Does it actually fill payer portals, or just track status?</strong>
        Many tools that claim AI are really spreadsheets with reminders.</li>
        <li><strong>Is there a human approval gate before submission?</strong> If
        not, walk away — that's a compliance risk, not a feature.</li>
        <li><strong>Can it show its work?</strong> Confidence scores on extracted
        data, an audit trail of what the agent did, and the ability for a
        coordinator to correct it.</li>
      </ol>

      <h2>The honest bottom line</h2>
      <p>AI doesn't replace the credentialing coordinator — it removes the
      soul-crushing parts of the job (portal-hopping, data re-entry, manual
      monitoring) so the coordinator can do the part that actually requires
      judgment. The best systems pair decades of credentialing expertise with
      modern agents and keep a human firmly in the loop. That combination — not
      automation for its own sake — is what actually gets providers billing
      faster without creating new risk.</p>
      ${CTA}
    `,
  },
];

export function findResource(slug: string): Resource | undefined {
  return RESOURCES.find((r) => r.slug === slug);
}

export function publishedResources(): Resource[] {
  return RESOURCES.filter((r) => r.html !== null);
}
