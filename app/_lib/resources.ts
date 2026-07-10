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
  /** Optional hero photo (public path). Falls back to a branded, category-
   *  themed gradient banner when omitted. */
  image?: string;
  /** Plain HTML body. null = roadmap entry (coming soon, not yet published). */
  html: string | null;
};

const CTA = `
  <div class="rsc-cta">
    <h3>See your own numbers in 60 seconds</h3>
    <p>CredTek gets providers in-network 40–60% faster — built and run by
    operators with decades of enterprise credentialing experience, with a
    human approval gate on every submission.</p>
    <a class="rsc-cta-btn" href="/#calc">Run the ROI calculator →</a>
  </div>
`;

export const RESOURCES: Resource[] = [
  // ───────────────────────── FOUNDATIONS ─────────────────────────
  {
    slug: "credentialing-vs-payer-enrollment",
    category: "foundations",
    image: "/office-handshake.png",
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

  // ───────────────────────── ROI ─────────────────────────
  {
    slug: "true-cost-of-slow-credentialing",
    image: "/team-welcome-2.png",
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

  // ───────────────────────── GOVERNMENT ─────────────────────────

  // ───────────────────────── SPECIALTY ─────────────────────────
  {
    slug: "behavioral-health-supervision-tracking",
    image: "/team-welcome.png",
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

  // ───────────────────────── FUTURE ─────────────────────────
  {
    slug: "ai-in-credentialing-real-vs-hype",
    category: "future",
    title: "AI in Credentialing: What's Real, What's Hype, and Where Humans Still Win",
    excerpt:
      "An honest look at what credentialing work to automate — and what always belongs to a human.",
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
{
    slug: "how-long-does-credentialing-take",
    category: "foundations",
    title:
      "How Long Does Provider Credentialing Take? (2026 Timelines + How to Speed It Up)",
    excerpt:
      "Provider credentialing takes 90–120 days on average in 2026. Here's exactly where the time goes across PSV, committee review, and payer enrollment — and how to compress it without cutting corners.",
    readTime: "9 min read",
    html: `
      <p>How long does provider credentialing take? For most physicians and advanced-practice clinicians, the honest answer is <strong>90 to 120 days</strong> from a complete application to an approved, billable effective date &mdash; and it stretches past 150 days when a payer panel is backed up or a single document is missing. Credentialing is not one task but a chain of them, so your total time-to-bill is really the sum of the slowest link in that chain. Below is where the days actually go in 2026, what quietly adds weeks, and how experienced teams compress the timeline without skipping a single verification.</p>

      <h2>What are the stages of provider credentialing?</h2>
      <p>People say &quot;credentialing&quot; as if it were a single step, but three distinct processes run from offer letter to first paid claim. Understanding the difference between <a href="/resources/credentialing-vs-payer-enrollment">credentialing and payer enrollment</a> is the key to managing the calendar:</p>
      <ul>
        <li><strong>Application and data gathering</strong> &mdash; collecting the provider&apos;s licenses, DEA, education, work history, malpractice coverage, and a complete <a href="/resources/caqh-proview-attestation-cycle">CAQH ProView profile</a>.</li>
        <li><strong>Primary source verification (PSV)</strong> &mdash; confirming each credential directly with the issuing source, then presenting a clean file to a credentialing committee.</li>
        <li><strong>Payer enrollment and contracting</strong> &mdash; a separate application to <em>each</em> health plan (Medicare, Medicaid, and every commercial payer) so the provider is in-network and can bill.</li>
      </ul>
      <p>Credentialing proves a clinician is who they say they are and is qualified; payer enrollment gets them onto a specific insurer&apos;s panel. A provider can be fully credentialed and still be unable to bill a plan they haven&apos;t enrolled with, which is why these workstreams have to run side by side.</p>

      <h2>How long does each stage take?</h2>
      <p>Here is a realistic 2026 breakdown, assuming a responsive provider and no red flags:</p>
      <ul>
        <li><strong>Data gathering and CAQH: 1&ndash;3 weeks.</strong> The bottleneck is almost always how fast the provider returns documents and attests.</li>
        <li><strong>Primary source verification: 2&ndash;4 weeks.</strong> Verifying the <a href="/resources/primary-source-verification-7-sources">seven core primary sources</a> &mdash; license, DEA, education, board status, work history, malpractice history, and sanctions. NCQA requires most verifications to be current at the moment the credentialing decision is made, so stale files must be re-pulled.</li>
        <li><strong>Credentialing committee: up to 30 days.</strong> Many committees meet only monthly, so a file that misses this month&apos;s agenda simply waits for the next one.</li>
        <li><strong>Payer enrollment: 60&ndash;120 days.</strong> This is the longest and least controllable stage. See the full <a href="/resources/payer-enrollment-timelines-by-payer">payer-by-payer enrollment timelines</a> for detail.</li>
      </ul>
      <p>Government payers can actually move faster than commercial ones. According to <a href="https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/chain-ownership-system-pecos/enrollment-applications" target="_blank" rel="noopener">CMS</a>, an electronic <a href="/resources/medicare-enrollment-pecos">Medicare enrollment through PECOS</a> is typically processed faster than a paper CMS-855I. Commercial payers are the wild card: one practice leader told <a href="https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021" target="_blank" rel="noopener">MGMA</a> that payers were taking &quot;as much as 100 days to provide an effective date for a new provider.&quot; Multi-state behavioral-health and multi-specialty groups feel this most, because every additional state and plan adds another parallel clock.</p>

      <h2>How long does credentialing take by payer type?</h2>
      <p>Averages hide big differences between payers, and your slowest payer sets your real time-to-revenue. Here is how the major categories typically compare once a clean application is submitted:</p>
      <ul>
        <li><strong>Medicare: about 45&ndash;60 days.</strong> An electronic PECOS submission is usually the fastest government track, and Medicare uniquely lets you recover some revenue for the gap &mdash; more on that below.</li>
        <li><strong>Medicaid: 45&ndash;120+ days.</strong> Timelines and portals vary state by state, so multi-state and behavioral-health groups should plan for a range rather than a single number.</li>
        <li><strong>Commercial payers: 90&ndash;120 days.</strong> The largest and least predictable bucket, and the one where a closed panel can add an entire appeal cycle before the clock even starts.</li>
        <li><strong>Hospital privileges: 60&ndash;120 days.</strong> Facility privileging is more rigorous than payer credentialing and often runs on a slower committee calendar. Per <a href="https://www.jointcommission.org/standards/standard-faqs/hospital-and-hospital-clinics/medical-staff-ms/000002257/" target="_blank" rel="noopener">The Joint Commission</a>, temporary privileges for a new applicant may be granted for no more than 120 consecutive days while the complete file is finished.</li>
        <li><strong>Telehealth-only plans: 15&ndash;45 days.</strong> Often the quickest path, since there is no facility privileging step to clear.</li>
      </ul>
      <p>Because these tracks run at different speeds, the group that submits them all on day one finishes when its slowest payer finishes &mdash; while the group that works them one after another finishes when the <em>sum</em> of them finishes. Same work, radically different calendars.</p>

      <h2>Can a provider bill during credentialing?</h2>
      <p>Usually not &mdash; and that is where the revenue leak lives. Most commercial payers will not pay for services rendered before the effective date, so claims submitted early are simply denied. Medicare is the notable exception: under <a href="https://www.law.cornell.edu/cfr/text/42/424.521" target="_blank" rel="noopener">42 CFR 424.521</a>, physicians and non-physician practitioners may retrospectively bill for up to 30 days before their effective date. That single rule is why submitting the Medicare application early, and cleanly, protects real dollars &mdash; and why groups with hospital or facility work should read our <a href="/resources/facility-credentialing-guide">facility credentialing guide</a> before assuming privileging will keep pace with payer enrollment.</p>

      <h2>What causes credentialing delays?</h2>
      <p>Delays are rarely one big failure; they are a dozen small ones. The most common culprits:</p>
      <ul>
        <li>An incomplete or un-attested CAQH profile, or one that expired mid-process.</li>
        <li>Gaps in work history longer than six months with no written explanation.</li>
        <li>Missing malpractice certificates of insurance or an expiring state license.</li>
        <li>Name, NPI, or tax-ID mismatches across applications.</li>
        <li>Closed or capacity-limited commercial panels that require an appeal to join.</li>
        <li>Slow provider responses to a verifier&apos;s follow-up questions.</li>
      </ul>
      <p>Notice how many of these are self-inflicted. Roughly half are within the group&apos;s control &mdash; which is exactly why timelines vary so widely between a well-run credentialing operation and an under-resourced one doing the same work.</p>

      <h2>What does a slow credentialing timeline cost?</h2>
      <p>Every idle day is lost, unrecoverable revenue. The <a href="https://ir.amnhealthcare.com/news-releases/news-release-details/survey-physicians-generate-average-24-million-year-hospital" target="_blank" rel="noopener">Merritt Hawkins physician revenue survey</a> found the average physician generates $2,378,727 a year for their affiliated organization &mdash; which works out to roughly $6,500 for every business day they cannot bill. MGMA, citing the same survey, put the cost of a one-day onboarding delay at $10,122. And the problem is getting worse: in an <a href="https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021" target="_blank" rel="noopener">MGMA Stat poll</a>, 54% of medical groups said credentialing-related denials were rising. Each denied claim then has to be reworked and resubmitted, piling staff hours on top of the delayed payment. We break the math down further in <a href="/resources/true-cost-of-slow-credentialing">the true cost of slow credentialing</a> and <a href="/resources/time-to-revenue-new-hires">time-to-revenue for new hires</a>.</p>

      <h2>How can you speed up credentialing?</h2>
      <p>You cannot make a payer&apos;s committee meet more often, but you can control everything upstream of it. The biggest lever is <strong>parallel processing</strong>: instead of finishing PSV before touching payer applications, start CAQH, verification, and every payer enrollment at the same time. Sequential credentialing is how a 90-day job quietly becomes a 180-day one.</p>
      <p>Practical accelerators that consistently work:</p>
      <ul>
        <li>Start 120&ndash;150 days before the provider&apos;s first day &mdash; the moment the offer is signed, not the week they arrive.</li>
        <li>Keep every provider&apos;s CAQH profile attested and document-complete year-round.</li>
        <li>Submit payer applications in parallel and follow up on a fixed weekly cadence.</li>
        <li>Pre-clean data so names, NPIs, and tax IDs match on every form.</li>
      </ul>
      <p>This is also where a done-for-you credentialing team earns its keep. A seasoned team plugs into a group within 48 hours, runs all stages in parallel from day one, and chases every payer on schedule &mdash; typically getting providers billing 40&ndash;60% faster, with a human approving every submission before it goes out. The verifications don&apos;t get shortcut; the waiting and the dropped follow-ups do.</p>
      ${CTA}
    `,
  },
  {
    slug: "caqh-proview-attestation-cycle",
    category: "foundations",
    title: "CAQH ProView Explained: The 120-Day Attestation Cycle",
    excerpt:
      "CAQH ProView (the CAQH Provider Data Portal) requires re-attestation every 120 days. Here's how the cycle works, how payers use your data, and what happens when a profile silently expires.",
    readTime: "8 min read",
    html: `
      <p><strong>CAQH ProView</strong> &mdash; now formally called the CAQH Provider Data Portal &mdash; is the online database where a provider enters their professional information once and shares it with every health plan that credentials them, and it must be re-attested on a strict <strong>120-day cycle</strong> to stay usable. If you have ever wondered why a payer &quot;can&apos;t see&quot; a provider who is clearly in CAQH, the answer is almost always a lapsed attestation. This guide explains what the portal is, how the 120-day cycle works, how payers actually use your data, and how to keep a profile from silently expiring.</p>

      <h2>What is CAQH ProView?</h2>
      <p>CAQH ProView is a centralized, provider-maintained repository run by the nonprofit alliance CAQH. Instead of mailing the same license, DEA, and malpractice documents to a dozen insurers, a clinician completes one profile and authorizes plans to pull it. According to <a href="https://www.caqh.org/providers" target="_blank" rel="noopener">CAQH</a>, public and commercial payers across the country use that single data set for credentialing, recredentialing, provider directories, and network management. It is the connective tissue of payer enrollment: nearly every commercial credentialing workflow in the United States begins by reading a provider&apos;s CAQH profile.</p>
      <p>Note that CAQH is a data source, not a verifier. Payers and <a href="/resources/what-is-a-cvo">credentials verification organizations</a> still perform <a href="/resources/primary-source-verification-7-sources">primary source verification</a> against the originating boards and registries. CAQH simply supplies the self-reported starting point and the supporting documents that the verification is built on.</p>

      <h2>How do you register for CAQH ProView?</h2>
      <p>There are two ways in. A provider who has been flagged by a health plan for credentialing receives an invitation email from CAQH containing a CAQH Provider ID; everyone else can self-register at proview.caqh.org. Per the <a href="https://www.caqh.org/hubfs/43908627/drupal/solutions/proview/guide/provider-user-guide.pdf" target="_blank" rel="noopener">CAQH Provider Data Portal user guide</a>, initial registration asks for the provider&apos;s name, provider type, primary practice state, date of birth, email, and core identifiers &mdash; Social Security number, NPI, DEA number, and license state and number. CAQH then emails the CAQH Provider ID and a link to finish account setup.</p>
      <p>From there the real work begins: completing a detailed application that covers practice information, education, training, licensure, and malpractice history, then uploading supporting documents &mdash; diploma, license, DEA registration, and malpractice certificate of insurance. Only after the provider authorizes the relevant health plans and completes the first attestation does the profile become usable for credentialing. Budget a few hours for a first-time profile; it is the foundation every payer builds on.</p>

      <h2>What is the 120-day attestation cycle?</h2>
      <p>Attestation is the provider&apos;s formal certification that everything in the profile is current and accurate. CAQH requires a fresh attestation <strong>every 120 days</strong> &mdash; every 180 days for providers who practice in Illinois &mdash; even if nothing has changed. Per <a href="https://www.caqh.org/resources" target="_blank" rel="noopener">CAQH guidance</a>, you must log in, review each section, upload any newly expiring documents, and click &quot;Attest&quot; before the deadline for the profile to remain active.</p>
      <p>Three things trip providers up about the cycle:</p>
      <ul>
        <li><strong>There is no grace period.</strong> The 120-day clock only resets when you actually attest &mdash; not when you log in, and never automatically.</li>
        <li><strong>It runs regardless of changes.</strong> &quot;Nothing changed&quot; is not an exemption; you still have to re-attest.</li>
        <li><strong>The date is per-attestation, not per-calendar-quarter.</strong> Every attestation sets a brand-new 120-day deadline measured from that day.</li>
      </ul>

      <h2>Who is responsible for keeping CAQH current?</h2>
      <p>Technically the provider owns the profile and must personally attest &mdash; the legal certification is theirs. In practice, most groups do not leave a revenue-critical deadline to a busy clinician. A credentialing coordinator, practice administrator, or delegated credentialing team typically maintains the data and documents year-round and prompts the provider to attest before each 120-day deadline. Whoever owns it, the responsibility has to be explicit and calendared; &quot;we assumed the provider was handling it&quot; is one of the most common reasons a profile silently expires.</p>

      <h2>How do payers use your CAQH data?</h2>
      <p>When a provider authorizes a health plan, that plan gains ongoing access to the profile and its documents. Payers use it to build the initial credentialing file, to re-verify at recredentialing, to populate the public provider-directory search members rely on, and to keep network and referral data accurate. Because so many downstream systems read from it, a single wrong address or an expired malpractice certificate in CAQH can quietly propagate into directory errors and claim denials across multiple plans at once.</p>
      <p>The same profile is read again at every recredentialing cycle &mdash; typically every 36 months for NCQA-aligned plans &mdash; so a profile that is accurate today but neglected for three years becomes a liability at exactly the wrong moment. Treating CAQH as a living record rather than a one-time form is what keeps <a href="/resources/recredentialing-every-three-years">recredentialing every three years</a> uneventful.</p>

      <h2>What happens if you miss re-attestation?</h2>
      <p>Once 120 days pass without attesting, the profile status flips from attested to expired, and authorized payers can no longer pull current data. The consequences cascade quickly:</p>
      <ul>
        <li>In-flight credentialing and recredentialing stall because the payer&apos;s file is now incomplete.</li>
        <li>New payer enrollments can be delayed by weeks while the provider re-attests and each plan re-reads the profile.</li>
        <li>A provider mid-recredentialing can even risk falling out of network &mdash; a costly outcome we cover in <a href="/resources/hidden-cost-recredentialing-lapse">the hidden cost of a recredentialing lapse</a>.</li>
      </ul>
      <p>CAQH keeps the historical data; nothing is deleted. But the profile is effectively invisible to payers until the next attestation, and that invisible window is exactly where revenue leaks.</p>

      <h2>What are the most common CAQH failure modes?</h2>
      <p>Most CAQH problems are not exotic &mdash; they are the same handful of avoidable mistakes that quietly stall credentialing:</p>
      <ul>
        <li><strong>A missed attestation.</strong> The profile expires and payers lose access, freezing every in-flight application until it is re-attested.</li>
        <li><strong>Expired supporting documents.</strong> A lapsed license, DEA, or malpractice certificate sitting in the profile fails verification even when the underlying credential was renewed on time.</li>
        <li><strong>Un-authorized plans.</strong> A payer that was never granted access simply cannot see the provider, no matter how complete the profile is.</li>
        <li><strong>Data that disagrees with other systems.</strong> A name, address, NPI, or tax ID that does not match the group&apos;s W-9 or the provider&apos;s PECOS record triggers directory errors and claim edits.</li>
        <li><strong>Incomplete sections or unexplained work-history gaps.</strong> A verifier stops, sends the file back, and adds a full round-trip to the timeline.</li>
      </ul>
      <p>Every one of these is preventable with routine maintenance, which is why the durable fix is a calendar and a named owner, not last-minute heroics.</p>

      <h2>How do you keep a CAQH profile current?</h2>
      <p>Keeping ProView healthy is a maintenance discipline, not a one-time task. A reliable routine looks like this:</p>
      <ul>
        <li>Put the 120-day attestation date on a calendar with a reminder 2&ndash;3 weeks out &mdash; don&apos;t rely on CAQH&apos;s own email, which can land in spam.</li>
        <li>Re-upload documents <em>before</em> they expire: state license, DEA, malpractice certificate of insurance, and board certification.</li>
        <li>Authorize every plan the provider works with, and keep practice locations and NPIs exact.</li>
        <li>Fix errors at the source in CAQH, not just on individual payer forms, so the correction propagates everywhere.</li>
        <li>If a profile gets stuck, the CAQH Provider Data Portal help desk can be reached at 888-599-1771.</li>
      </ul>
      <p>A current CAQH profile is one of the biggest determinants of <a href="/resources/how-long-does-credentialing-take">how long credentialing takes</a>, and it belongs on any <a href="/resources/new-provider-credentialing-checklist">new-provider onboarding checklist</a>. This is exactly the kind of quiet, deadline-driven maintenance a done-for-you credentialing team monitors continuously &mdash; tracking every provider&apos;s 120-day clock so a forgotten attestation never becomes a stalled claim, with a real person confirming each update.</p>
      ${CTA}
    `,
  },
  {
    slug: "what-is-a-cvo",
    category: "foundations",
    title: "What Is a CVO? In-House vs. Outsourced Credentialing",
    excerpt:
      "A CVO (Credentials Verification Organization) handles primary source verification for you. Here's what NCQA certification actually means and how to decide between in-house and outsourced credentialing.",
    readTime: "8 min read",
    html: `
      <p><strong>What is a CVO?</strong> A CVO, or Credentials Verification Organization, is a specialized company that performs <a href="/resources/primary-source-verification-7-sources">primary source verification</a> and related credentialing work on behalf of medical groups, health plans, hospitals, and MSOs. Instead of your own staff calling every state board and residency program, the CVO does the verifying and hands back a clean, documented file. This guide explains what a CVO does, what an NCQA-certified CVO is, and how to weigh keeping credentialing in-house against outsourcing it &mdash; the decision most growing mid-market groups eventually face.</p>

      <h2>What does a CVO do?</h2>
      <p>A CVO&apos;s core job is verification: confirming that a provider&apos;s credentials are real, current, and unblemished by going directly to the issuing source rather than trusting a photocopy. In practice that means checking the same core elements NCQA expects on every file:</p>
      <ul>
        <li>State license to practice, plus any state licensing-board sanctions.</li>
        <li>DEA or CDS registration.</li>
        <li>Education and training, verified with the school or residency program.</li>
        <li>Board certification status.</li>
        <li>Work history and malpractice claims history.</li>
        <li>Medicare and Medicaid sanctions and exclusions.</li>
      </ul>
      <p>Many CVOs also manage the CAQH profile, run <a href="/resources/oig-sam-exclusion-monitoring">OIG and SAM exclusion monitoring</a>, and assemble the committee-ready packet. What a CVO generally does <em>not</em> do is make the credentialing decision itself &mdash; that authority stays with the organization&apos;s credentialing committee or medical director.</p>

      <h2>Is a CVO the same as credentialing software?</h2>
      <p>No &mdash; and conflating the three common models is how groups buy the wrong thing. A <strong>software platform</strong> gives your staff a system to track credentialing, but your own people still make the calls, chase the sources, and do the follow-up. A <strong>staffing agency</strong> gives you bodies, but not necessarily a verified process or accountability for the finished file. A <strong>CVO</strong> owns the verification work itself and hands back a documented, defensible result. The distinction matters because the labor, not the license, is where credentialing actually slows down. We put the first tradeoff side by side in <a href="/resources/credentialing-software-vs-team">credentialing software vs. a team</a>. The strongest arrangement for many mid-market groups blends them: a trained team doing the work <em>on</em> a shared platform, so you get both the visibility of software and the accountability of a verifier &mdash; without hiring, training, and covering for an in-house specialist yourself.</p>

      <h2>What is an NCQA-certified CVO?</h2>
      <p>Not every CVO is certified, and the distinction matters. The National Committee for Quality Assurance (NCQA) runs a voluntary certification that audits how a CVO actually operates. Per <a href="https://www.ncqa.org/programs/health-plans/credentials-verification-organization-cvo/faqs/" target="_blank" rel="noopener">NCQA</a>, the program evaluates performance across three areas &mdash; internal quality improvement, protecting credentialing information, and verifying credentials &mdash; and offers certification in <strong>11</strong> specific verification options, from license to practice through ongoing monitoring of sanctions. More than 90 organizations currently hold CVO Certification; you can review the full <a href="https://www.ncqa.org/programs/health-plans/credentials-verification-organization-cvo/benefits-support/standards/" target="_blank" rel="noopener">CVO certification standards</a> to see exactly what each option covers.</p>
      <p>Certification is not just a logo. To qualify, NCQA says a CVO must carry $1M&ndash;$2M in errors-and-omissions insurance and meet documentation standards a health plan can rely on. That reliability is what makes certified CVOs central to <a href="/resources/ncqa-delegated-credentialing">delegated credentialing</a> arrangements, where a payer contractually hands verification to a third party and needs proof the work meets the standard.</p>

      <h2>How do CVOs fit into delegated credentialing?</h2>
      <p>The biggest practical reason certification matters is delegation. In a <a href="/resources/ncqa-delegated-credentialing">delegated credentialing</a> arrangement, a health plan contractually hands verification to a group or CVO instead of doing it in-house, which can dramatically shorten enrollment for that group&apos;s providers. But NCQA still holds the delegating plan responsible for the work, so plans run pre-delegation assessments and annual audits and demand proof the process meets standard. According to NCQA&apos;s <a href="https://wpcdn.ncqa.org/www-prod/NCQA-Credentialing-eBook-2025.pdf" target="_blank" rel="noopener">credentialing program guidance</a>, a plan that delegates to an NCQA-Certified CVO is relieved of formal oversight review for the specific elements the CVO is certified in. In other words, certification is the currency that makes delegation work: it lets a payer trust a third party&apos;s files without re-checking every one. Delegated entities are also expected to continuously monitor OIG, SAM, state boards, and the NPDB between cycles &mdash; not just at onboarding.</p>

      <h2>In-house vs. outsourced credentialing: what is the tradeoff?</h2>
      <p>The real decision is rarely &quot;which is cheaper.&quot; It is which model gives you speed, coverage, and audit-readiness at your size. The tradeoffs break down along a few axes:</p>
      <ul>
        <li><strong>Cost:</strong> In-house means salaried staff, software licenses, and verification fees whether you onboard two providers or twenty this quarter. Outsourcing converts that into a variable cost that scales with volume.</li>
        <li><strong>Control:</strong> An in-house team sits down the hall and knows your providers &mdash; but it is also a single point of failure when your one credentialing specialist is on vacation or resigns.</li>
        <li><strong>Speed:</strong> A dedicated team runs verifications and payer applications in parallel every day; a stretched in-house generalist juggling credentialing alongside other duties often cannot.</li>
        <li><strong>Coverage and expertise:</strong> Multi-state and behavioral-health groups face a matrix of boards and rules that a specialized team sees daily and an internal hire may see once a year.</li>
        <li><strong>Audit-readiness:</strong> A certified CVO&apos;s files are built to survive a payer or NCQA audit &mdash; see what an <a href="/resources/audit-ready-credentialing-file">audit-ready credentialing file</a> actually requires.</li>
        <li><strong>Continuity:</strong> Outsourced verification does not take vacation, go on leave, or resign the week you onboard five providers &mdash; the process keeps running regardless of any one person.</li>
      </ul>
      <p>It is also worth separating the tool from the labor. Buying credentialing software still leaves your own staff doing the calling, chasing, and follow-up; we compare the two directly in <a href="/resources/credentialing-software-vs-team">credentialing software vs. a team</a>.</p>

      <h2>When should a mid-market group outsource credentialing?</h2>
      <p>For a group of roughly 25&ndash;400 providers, a handful of signals usually mean it is time to move verification out of the building:</p>
      <ul>
        <li>You are hiring faster than one internal specialist can credential, and start dates are slipping.</li>
        <li>You operate across multiple states or heavy behavioral-health lines with layered supervision and licensure rules.</li>
        <li>Credentialing-related denials or recredentialing lapses are showing up in your revenue cycle.</li>
        <li>Your entire credentialing function depends on one person &mdash; a genuine key-person risk.</li>
        <li>Slow credentialing is measurably delaying revenue; the arithmetic in <a href="/resources/how-long-does-credentialing-take">how long credentialing takes</a> and <a href="/resources/true-cost-of-slow-credentialing">the true cost of slow credentialing</a> makes the case quickly.</li>
      </ul>

      <h2>How do you choose a CVO?</h2>
      <p>If you decide to outsource, a short due-diligence checklist separates a real partner from a mailbox:</p>
      <ul>
        <li><strong>NCQA CVO Certification</strong> in the elements you actually need &mdash; verify it on the NCQA report card rather than taking it on faith.</li>
        <li><strong>Written turnaround-time commitments</strong>, not vague promises about being fast.</li>
        <li><strong>Multi-state and specialty coverage</strong> that matches your footprint, especially for behavioral health.</li>
        <li><strong>Real-time visibility</strong> into every provider&apos;s status, so you are never guessing where a file sits.</li>
        <li><strong>A human review gate</strong> on every submission &mdash; plus references from groups your size.</li>
      </ul>
      <p>The math behind the decision is not subtle. With the average physician generating <a href="https://ir.amnhealthcare.com/news-releases/news-release-details/survey-physicians-generate-average-24-million-year-hospital" target="_blank" rel="noopener">more than $2.3 million a year</a> in revenue, even a few weeks of avoidable delay per hire dwarfs the cost of outsourcing verification.</p>
      <p>The strongest model for most mid-market groups is neither pure in-house nor bare software: it is a trained credentialing team working on a shared platform, plugging in within 48 hours and getting providers billing 40&ndash;60% faster &mdash; with a human approving every submission before it reaches a payer. You keep visibility and the final decision; you shed the calling, chasing, and single-point-of-failure risk.</p>
      ${CTA}
    `,
  },
  {
    slug: "new-provider-credentialing-checklist",
    category: "foundations",
    title: "The Complete New-Provider Credentialing Checklist",
    excerpt:
      "A step-by-step new-provider credentialing checklist — from signed offer letter to first billable claim — covering documents, CAQH, primary source verification, NPDB, exclusion checks, and payer enrollment.",
    readTime: "9 min read",
    html: `
      <p>A complete <strong>new-provider credentialing checklist</strong> turns a chaotic onboarding into a predictable, parallel-tracked process &mdash; from the signed offer letter all the way to the first billable claim. The single most expensive mistake groups make is treating credentialing as something that starts when a provider shows up; by then you have already burned 90&ndash;120 days of billable time. Use the checklist below the moment an offer is signed, and run the steps in parallel rather than in sequence.</p>

      <h2>When should you start the checklist?</h2>
      <p>The day the offer letter is signed &mdash; ideally 120 to 150 days before the provider&apos;s first clinical day. Credentialing and <a href="/resources/credentialing-vs-payer-enrollment">payer enrollment</a> together average 90 to 120 days for a clean file, and that assumes nothing stalls. Starting at signature rather than at orientation is the difference between a provider who can bill on day one and one who sees patients for two months before a single claim goes out. Assign one owner for the file, stand up a shared tracker, and treat every step below as a parallel workstream rather than a sequential to-do list.</p>

      <h2>Step 1: Gather documents the day the offer is signed</h2>
      <p>Credentialing is document-driven, and every missing item is a delay. Collect a complete packet up front:</p>
      <ul>
        <li>Current CV with month/year dates and no unexplained gaps longer than six months.</li>
        <li>All active state medical licenses and DEA/CDS registrations.</li>
        <li>Board certification certificates and the medical or professional school diploma.</li>
        <li>Malpractice certificate of insurance and a 5&ndash;10 year claims history.</li>
        <li>NPI (Type 1), Social Security number, and a government photo ID.</li>
        <li>Residency, fellowship, and prior-employment details with contacts for peer references.</li>
        <li>Immunization and health records where a facility requires them, plus a signed W-9 for the group.</li>
        <li>For multi-state or behavioral-health groups, confirm the provider holds &mdash; or has applied for &mdash; a license in every state of practice; the <a href="/resources/interstate-medical-licensure-compact">Interstate Medical Licensure Compact</a> can speed additional physician licenses.</li>
      </ul>
      <p>A provider who returns this packet fully complete in week one is often the difference between a 90-day and a 130-day timeline.</p>

      <h2>Step 2: Build and attest the CAQH profile</h2>
      <p>Create or update the provider&apos;s CAQH Provider Data Portal profile, upload every supporting document, authorize all the health plans they will work with, and attest. Because attestation runs on a strict recurring cycle, put the next deadline on a calendar immediately &mdash; the full mechanics are in our guide to the <a href="/resources/caqh-proview-attestation-cycle">CAQH ProView 120-day attestation cycle</a>. Payers read this profile first, so an error here becomes an error everywhere downstream.</p>

      <h2>Step 3: Run primary source verification and background checks</h2>
      <p>With a complete file, verification begins &mdash; ideally in parallel with payer applications, not before them. This stage covers the <a href="/resources/primary-source-verification-7-sources">seven core primary sources</a> plus two federal checks that are easy to forget:</p>
      <ul>
        <li><strong>NPDB query.</strong> Query the National Practitioner Data Bank for malpractice payments and adverse actions. Per <a href="https://www.npdb.hrsa.gov/hcorg/aboutQuerying.jsp" target="_blank" rel="noopener">HRSA</a>, hospitals must query at appointment and conduct a mandatory review of privileges at least every two years &mdash; details in <a href="/resources/npdb-queries-explained">NPDB queries explained</a>.</li>
        <li><strong>Exclusion screening.</strong> Check the provider against the OIG&apos;s List of Excluded Individuals/Entities and SAM.gov. The <a href="https://oig.hhs.gov/exclusions/" target="_blank" rel="noopener">OIG</a> warns that anyone who hires an excluded individual may face civil monetary penalties, which is why leading groups screen monthly &mdash; see <a href="/resources/oig-sam-exclusion-monitoring">OIG and SAM exclusion monitoring</a>.</li>
      </ul>

      <h2>Step 4: Submit payer enrollment applications</h2>
      <p>Credentialing and enrollment are different jobs, and enrollment is usually the long pole. Submit to every payer at once:</p>
      <ul>
        <li><strong>Medicare.</strong> Enroll the individual via the CMS-855I in <a href="/resources/medicare-enrollment-pecos">PECOS</a>. Under <a href="https://www.law.cornell.edu/cfr/text/42/424.521" target="_blank" rel="noopener">42 CFR 424.521</a>, physicians and non-physician practitioners may retrospectively bill for up to 30 days before their effective date &mdash; so an early, clean submission directly protects revenue.</li>
        <li><strong>Medicaid.</strong> Enroll in each state&apos;s program; timelines and portals vary widely from state to state.</li>
        <li><strong>Commercial payers.</strong> Submit to each plan and link the provider to the group&apos;s contract and tax ID. Confirm the panel is open before you start.</li>
      </ul>
      <p>For why these are separate workstreams that must not be conflated, see <a href="/resources/credentialing-vs-payer-enrollment">credentialing vs. payer enrollment</a>.</p>

      <h2>Don&apos;t forget hospital and facility privileges</h2>
      <p>If the provider will admit, round, or perform procedures at a hospital or surgery center, facility privileging is a separate track that runs alongside payer enrollment &mdash; and it is usually stricter. It layers peer references, department-chair review, delineation of specific privileges, and governing-body approval on top of standard verification. Plan for 60&ndash;120 days, and note that under <a href="https://www.jointcommission.org/standards/standard-faqs/hospital-and-hospital-clinics/medical-staff-ms/000002257/" target="_blank" rel="noopener">Joint Commission</a> standards, temporary privileges for a new applicant may be granted for no more than 120 consecutive days while the full file is completed. Because the facility committee calendar rarely bends, start privileging the same day you start payer enrollment. Our <a href="/resources/facility-credentialing-guide">facility credentialing guide</a> walks through the extra steps in detail.</p>

      <h2>Step 5: Committee approval, effective date, and first claim</h2>
      <p>Once verification is complete, the credentialing committee or medical director reviews and approves the file, and each payer issues an effective date. Only then can the provider bill that plan &mdash; hold or carefully queue claims until effective dates are confirmed to avoid a wave of denials. Two final items close the loop:</p>
      <ul>
        <li>Record every payer effective date and reconcile it against the provider&apos;s start date to measure <a href="/resources/time-to-revenue-new-hires">time-to-revenue for the new hire</a>.</li>
        <li>Set the recredentialing date now &mdash; most payers and NCQA work on a fixed 36-month cycle, covered in <a href="/resources/recredentialing-every-three-years">recredentialing every three years</a>.</li>
      </ul>

      <h2>Common mistakes that cost weeks</h2>
      <p>Most delays trace back to the same avoidable errors. Guard against them explicitly:</p>
      <ul>
        <li><strong>Starting late.</strong> Waiting until the provider&apos;s start date instead of the offer-signature date is the single most expensive mistake.</li>
        <li><strong>Working steps sequentially.</strong> Finishing verification before opening payer applications can double the calendar.</li>
        <li><strong>An incomplete document packet.</strong> One missing malpractice certificate or an unexplained work-history gap sends the whole file back.</li>
        <li><strong>Letting CAQH lapse mid-process.</strong> An expired attestation blinds every authorized payer at once.</li>
        <li><strong>Billing before the effective date.</strong> Outside Medicare&apos;s 30-day retroactive window, early claims are just denials.</li>
        <li><strong>Forgetting to set the recredentialing date.</strong> A missed 36-month renewal can quietly drop a provider from the network.</li>
      </ul>

      <p>Run end to end, this checklist is entirely doable in-house &mdash; but it is unforgiving of a single dropped follow-up. A done-for-you credentialing team runs all five steps in parallel from the day the offer is signed, plugs into a group within 48 hours, and keeps every provider billing 40&ndash;60% faster, with a person approving each submission before it goes out.</p>
      ${CTA}
    `,
  },
{
    slug: "time-to-revenue-new-hires",
    category: "roi",
    title: "Time-to-Revenue: How to Get New Hires Billing Faster",
    excerpt:
      "Every day between a new hire's start date and their first billable claim burns full salary against zero collections. Here's how to size time-to-revenue like a CFO and compress it by running credentialing, licensure, and payer enrollment in parallel.",
    readTime: "8 min read",
    html: `
      <p><strong>Time-to-revenue</strong> is the number of days between a new provider&apos;s start date and the first claim your group can legally submit for their work, and getting new hires billing faster is one of the highest-leverage financial levers a growing medical group actually controls. Every day inside that gap is a day of full salary, benefits, and overhead carried against zero collections. Multiply it across even a handful of hires a year and the number lands squarely on the CFO&apos;s desk.</p>
      <p>The uncomfortable truth is that most of the gap is process-inflicted, not inevitable. Here is how to size it, what drives it, and the specific moves that compress it.</p>
      <h2>What does a day of credentialing delay actually cost?</h2>
      <p>Begin with the figure that makes leadership lean in. A widely cited Merritt Hawkins survey of hospital CFOs found that the average physician generates roughly <strong>$2.38 million in net revenue a year</strong> for their affiliated organization, and that a single day&apos;s delay in onboarding a physician costs a medical group an estimated <strong>$10,122</strong> in forgone revenue (<a href="https://www.prnewswire.com/news-releases/survey-physicians-generate-an-average-2-4-million-a-year-per-hospital-300799621.html" target="_blank" rel="noopener">Merritt Hawkins</a>; <a href="https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021" target="_blank" rel="noopener">MGMA</a>). Even a conservative internist or behavioral-health hire carries a five-figure daily opportunity cost once you account for the labs, imaging, and referrals they generate downstream.</p>
      <p>The figure scales sharply with specialty. In the same survey, cardiovascular surgeons generated an average of roughly $3.7 million a year for their affiliated hospital and orthopedic surgeons about $3.3 million, while family physicians generated around $2.1 million (<a href="https://www.prnewswire.com/news-releases/survey-physicians-generate-an-average-2-4-million-a-year-per-hospital-300799621.html" target="_blank" rel="noopener">Merritt Hawkins</a>). The higher the earning power of the hire, the more punishing the onboarding gap &mdash; which is exactly why proceduralists and surgeons should be first in line for an expedited, parallelized onboarding process.</p>
      <p>Now attach it to a realistic calendar. Industry benchmarks put initial credentialing and payer enrollment at <strong>90 to 120 days</strong>, and often longer for multi-state or hospital-based providers (<a href="https://verisys.com/blog/how-long-does-credentialing-take/" target="_blank" rel="noopener">Verisys</a>). A 100-day gap on one physician is not a scheduling nuisance; at the Merritt Hawkins figure it approaches seven figures of deferred revenue. That is the CFO framing: time-to-revenue is a cash-flow problem, not an HR formality. For the full model, see <a href="/resources/true-cost-of-slow-credentialing">the true cost of slow credentialing</a>.</p>
      <h2>What actually drives the gap between hire date and first claim?</h2>
      <p>Three distinct processes sit between offer and payment, and groups routinely run them in sequence when they could run them in parallel:</p>
      <ul>
        <li><strong>Licensure</strong> &mdash; the state medical or professional license, plus a DEA registration for prescribers. In a new state this is often the longest pole in the tent.</li>
        <li><strong>Credentialing</strong> &mdash; primary-source verification of education, training, licensure, work history, and sanctions. This is the &quot;are they who they say they are&quot; step.</li>
        <li><strong>Payer enrollment</strong> &mdash; loading the provider into each health plan&apos;s network so claims adjudicate as in-network and payable.</li>
      </ul>
      <p>Credentialing and payer enrollment are not the same thing, and conflating them is a common source of blown timelines &mdash; see <a href="/resources/credentialing-vs-payer-enrollment">credentialing vs. payer enrollment</a>. Verification can clear in 60 days while contracting and network loading add another 30 to 45. The single biggest predictor of the whole timeline is how clean the provider&apos;s data is on day one: a complete, attested CAQH ProView profile, no unexplained gaps in work history, and no stale license or malpractice entries.</p>
      <h2>How do you parallelize credentialing and enrollment?</h2>
      <p>The fastest groups treat onboarding as a parallel pipeline, not a relay race. Practically, that means:</p>
      <ul>
        <li><strong>Start at signature, not start date.</strong> Kick off license verification and CAQH the day the offer is signed &mdash; often 60 to 90 days before the provider actually begins. Waiting for day one forfeits the cheapest weeks you have.</li>
        <li><strong>Run licensure, credentialing, and enrollment concurrently.</strong> You do not need a completed credentialing file to begin assembling payer applications or to submit a Medicare enrollment through PECOS.</li>
        <li><strong>Attack the license bottleneck.</strong> For physicians moving across state lines, the <a href="/resources/interstate-medical-licensure-compact">Interstate Medical Licensure Compact</a> issues additional state licenses in an average of about 19 days, with more than half issued within a week (<a href="https://imlcc.com/" target="_blank" rel="noopener">IMLCC</a>) &mdash; versus the months a traditional application can take.</li>
        <li><strong>Sequence the payers by revenue.</strong> Enroll the plans that represent the biggest share of your book first, so billing can begin on your highest-volume contracts even while smaller payers finish.</li>
      </ul>
      <p>A disciplined intake checklist prevents the single most common cause of restarts &mdash; a missing document discovered in week six. Use a standard new-provider credentialing checklist &mdash; every license, DEA, diploma, board certificate, malpractice face sheet, and reference &mdash; so nothing surfaces late.</p>
      <p>Hospital-employed and facility-based providers carry an extra parallel track: medical-staff privileging at each facility, which runs on the hospital&apos;s credentialing-committee calendar and can gate the ability to admit patients or perform procedures even after payer enrollment clears. Start it alongside everything else, not after &mdash; a fully enrolled surgeon with no privileges still cannot generate a dime.</p>
      <h2>Do retroactive effective dates recover the lost days?</h2>
      <p>Sometimes &mdash; and this is where knowing the rules pays for itself. Medicare permits <strong>retrospective billing for up to 30 days</strong> before the effective date of an approved enrollment (up to 90 days in limited circumstances), which means a clean PECOS submission can claw back roughly a month of otherwise-dead revenue (<a href="https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/chain-ownership-system-pecos" target="_blank" rel="noopener">CMS</a>). Details on that flow live in <a href="/resources/medicare-enrollment-pecos">Medicare enrollment via PECOS</a>.</p>
      <p>Commercial payers are far less forgiving. MGMA members report some plans taking up to 100 days to assign an effective date <em>with no retroactive claim allowance at all</em> &mdash; every day before that date is simply unbillable (<a href="https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021" target="_blank" rel="noopener">MGMA</a>). Because effective-date rules vary so widely, you cannot assume you will recover the gap; you have to compress it up front. Expectations by plan are laid out in <a href="/resources/payer-enrollment-timelines-by-payer">payer enrollment timelines by payer</a>.</p>
      <h2>What is a realistic time-to-revenue target?</h2>
      <p>There is no universal number, but you can set a defensible internal target and hold every vendor and coordinator to it. For a clean, single-state hire with an attested CAQH profile, many well-run groups aim to have the top commercial payers and Medicare billable within <strong>90 to 120 days of the signature date</strong> &mdash; not the start date. Two anchors keep the target honest:</p>
      <ul>
        <li><strong>Measure from signature, not start.</strong> If you begin at signature and the provider starts 60 days later, much of the credentialing clock has already run before their first shift &mdash; and the visible &quot;delay&quot; shrinks dramatically.</li>
        <li><strong>Separate the controllable from the fixed.</strong> You cannot shorten a payer&apos;s committee cycle, but you can eliminate every self-inflicted delay: incomplete documents, a lapsed attestation, an application sitting in someone&apos;s inbox. That controllable slice is where most groups quietly lose four to eight weeks.</li>
      </ul>
      <h2>The CFO framing: make time-to-revenue a tracked KPI</h2>
      <p>What gets measured gets funded. Groups that consistently onboard fast treat <strong>days-to-first-billable-claim</strong> as a board-level metric, reported per hire and trended over time. Two supporting practices matter:</p>
      <ul>
        <li><strong>Model the carrying cost of every open credentialing file.</strong> If a delayed physician is worth five figures a day, a two-week slip is a capital decision, not a clerical one &mdash; and it justifies the staffing or partner spend to prevent it.</li>
        <li><strong>Fix the data layer once.</strong> Because clean day-one data is the top predictor of speed, the highest ROI is in a rigorous intake process and continuously maintained provider records, not in chasing payers on the back end.</li>
      </ul>
      <p>None of this requires magic &mdash; it requires starting early, running the tracks in parallel, and refusing to let a single missing document stall a six-figure asset. That is precisely the gap a done-for-you credentialing partner is built to close: plug in a trained team and platform, work every file the day it is ready, and keep a human approving each submission so speed never costs you accuracy.</p>
      ${CTA}
    `,
  },
  {
    slug: "hidden-cost-recredentialing-lapse",
    category: "roi",
    title: "The Hidden Cost of a Re-Credentialing Lapse",
    excerpt:
      "A re-credentialing, license, CAQH, or Medicare revalidation lapse rarely announces itself, until claims bounce and a payer demands its money back. Here's what breaks, what it costs, and how to make sure it never happens.",
    readTime: "8 min read",
    html: `
      <p>The <strong>hidden cost of a re-credentialing lapse</strong> is that it rarely announces itself &mdash; a provider keeps seeing patients, the schedule stays full, and nothing looks wrong until claims start bouncing weeks later and a payer sends a letter demanding its money back. By then the damage is retroactive, and it is expensive.</p>
      <p>Re-credentialing, license renewal, CAQH re-attestation, DEA registration, and Medicare revalidation are all recurring deadlines with hard cliffs and no meaningful grace period. Miss one and the provider does not get a warning shot; they get retroactively treated as un-credentialed. Here is exactly what breaks, how to quantify it, and how to make sure it never happens.</p>
      <h2>What happens when a re-credentialing deadline lapses?</h2>
      <p>Each expiring credential fails in its own way, and they compound:</p>
      <ul>
        <li><strong>Re-credentialing (every 36 months).</strong> NCQA requires health plans to re-credential every practitioner every three years; there is no informal grace period, and a lapsed file is scored down on audit (<a href="https://www.ncqa.org/blog/ncqas-credentialing-standards-ensure-safety-and-integrity-of-practitioner-networks/" target="_blank" rel="noopener">NCQA</a>). A provider who is not re-credentialed on schedule can be dropped from the network entirely.</li>
        <li><strong>CAQH re-attestation (every 120 days).</strong> CAQH requires providers to re-attest every 120 days; the day after the deadline the profile flips to <em>Expired</em>, and every payer that pulls from it can stall credentialing and directory updates (<a href="https://www.caqh.org/blog/re-attestation-critical-healthcare-organizations-return-normal" target="_blank" rel="noopener">CAQH</a>).</li>
        <li><strong>Medicare revalidation (every 5 years).</strong> CMS requires revalidation roughly every five years; miss it and billing privileges are <strong>deactivated</strong> &mdash; and Medicare will not reimburse for services furnished during the deactivated period (<a href="https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/revalidations" target="_blank" rel="noopener">CMS</a>).</li>
        <li><strong>State license or DEA expiration.</strong> A lapsed license or DEA registration invalidates the provider&apos;s ability to practice or prescribe at all &mdash; every claim during the gap is exposed.</li>
      </ul>
      <p>The through-line: a lapse does not pause billing cleanly. It creates a window of services already rendered that are now unbillable or recoupable.</p>
      <h2>The four ways a lapse drains cash</h2>
      <p><strong>1. Claim denials.</strong> Claims submitted while a provider is non-participating or deactivated are denied. Denials are already at record highs &mdash; the initial denial rate hit <strong>11.81%</strong> in 2024 across a dataset of more than 2,100 hospitals (<a href="https://www.beckerspayer.com/payer/claims-denial-rates-up-prior-auth-denials-down-in-2024-report/" target="_blank" rel="noopener">Becker&apos;s</a>) &mdash; and a credentialing lapse converts otherwise-clean claims into guaranteed denials. Reworking each one costs about <strong>$25</strong>, and by some estimates 50&ndash;65% of denials are never reworked at all, so the revenue is simply lost (<a href="https://www.mgma.com/mgma-stats/6-keys-to-addressing-denials-in-your-medical-practice-s-revenue-cycle" target="_blank" rel="noopener">MGMA</a>).</p>
      <p><strong>2. Network termination.</strong> A provider dropped for a lapsed re-credentialing cycle must be re-enrolled from scratch &mdash; effectively restarting the 90-to-120-day clock and stacking a second, forward-looking delay on top of the denials you already took.</p>
      <p><strong>3. Clawbacks and recoupment.</strong> This is the one that stings. When a payer discovers a provider billed during a credential gap, it can recoup payments already made &mdash; sometimes months later, netted silently against future remittances. Medicare is explicit that no payment is due for services in a deactivated period (<a href="https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/revalidations" target="_blank" rel="noopener">CMS</a>). Money you already collected and spent gets pulled back.</p>
      <p><strong>4. Patient reassignment and access loss.</strong> A terminated provider&apos;s patients may have to be reassigned or seen out-of-network, damaging continuity of care, patient satisfaction, and the downstream referral revenue that provider anchors.</p>
      <h2>How big is the number, really?</h2>
      <p>Model it conservatively. Take a physician whose services generate a few thousand dollars a day. A 30-day lapse is not a $25 rework problem; it is 30 days of denied or recoupable claims &mdash; tens of thousands of dollars &mdash; plus the rework labor, plus a re-enrollment delay if the payer terminates the contract. The <a href="/resources/true-cost-of-slow-credentialing">cost of slow credentialing</a> applies in reverse: the same daily revenue a slow start merely defers, a lapse actively claws back after you have already booked it. And unlike a slow start, a clawback hits a period you already paid salary and overhead on &mdash; so you lose twice.</p>
      <p>Now layer the compounding effects. If the lapse triggers a network termination, re-enrollment restarts a 90-to-120-day clock during which the provider may be out-of-network for that payer entirely, so the initial 30-day hit balloons into a multi-month revenue impairment. Add the clawback of payments already recognized, the staff hours spent reworking and appealing denied claims at roughly $25 each, and the patient-experience cost of reassigning a panel, and a single missed deadline routinely crosses into six figures for a busy specialist. The precise number is almost beside the point &mdash; it is always far larger than the cost of the tracking that would have prevented it.</p>
      <h2>Which deadlines get missed most often?</h2>
      <p>In practice, lapses cluster around a few predictable failure points:</p>
      <ul>
        <li><strong>The 120-day CAQH clock.</strong> It is short, silent, and recurs more than three times a year, so it is the easiest to let slip &mdash; and an expired profile can quietly freeze multiple payer processes at once.</li>
        <li><strong>DEA renewals for prescribers.</strong> These are often owned by the provider personally rather than the credentialing team, which is exactly how they fall through the cracks.</li>
        <li><strong>Board-certification expirations.</strong> Many payer contracts and hospital bylaws require current board status; a lapse can affect participation even when the state license is perfectly current.</li>
        <li><strong>Provider transitions.</strong> When a provider changes location, group, or tax ID, deadlines and effective dates can reset in ways an inherited tracking spreadsheet fails to capture.</li>
      </ul>
      <h2>Adjacent lapses that quietly create liability</h2>
      <p>Two monitoring gaps deserve their own mention because they carry compliance risk, not just revenue risk:</p>
      <ul>
        <li><strong>Exclusion monitoring.</strong> Providers must be screened against the OIG and SAM exclusion lists on an ongoing basis &mdash; billing federal programs for an excluded provider can trigger significant penalties. See <a href="/resources/oig-sam-exclusion-monitoring">OIG and SAM exclusion monitoring</a>.</li>
        <li><strong>Audit readiness.</strong> A lapse discovered during an NCQA or payer audit is worse than one you catch yourself. Keeping an <a href="/resources/audit-ready-credentialing-file">audit-ready credentialing file</a> turns a would-be finding into a non-event.</li>
      </ul>
      <h2>How do you make sure it never happens?</h2>
      <p>Every item above shares one root cause: a deadline that arrived without anyone watching. The fix is a system, not vigilance:</p>
      <ul>
        <li><strong>Track every expirable in one place.</strong> License, DEA, board certification, CAQH re-attestation, malpractice coverage, re-credentialing date, and Medicare revalidation &mdash; each with its own clock.</li>
        <li><strong>Work backward from the cliff.</strong> NCQA re-credentialing should be initiated 90&ndash;120 days ahead; CMS mails revalidation notices three to four months early. Start when the notice arrives, not when it is due.</li>
        <li><strong>Automate the reminders, keep a human on approval.</strong> Software should surface what is coming due; an experienced coordinator should own the file end-to-end so nothing is quietly &quot;in progress&quot; the day it expires.</li>
        <li><strong>Reconcile against the source.</strong> Confirm the payer and CAQH actually reflect the renewal &mdash; an internal note that a license was renewed is not the same as the payer showing the provider active.</li>
        <li><strong>Assign clear ownership.</strong> Every expirable should have a named owner and a backup. &quot;The team watches it&quot; is precisely how a deadline reaches its cliff with no one accountable.</li>
      </ul>
      <p>The pattern to internalize is that credentialing is never &quot;done.&quot; It is a maintenance function with a dozen overlapping clocks per provider, and at scale &mdash; dozens or hundreds of providers, each carrying license, DEA, CAQH, board, malpractice, and re-credentialing dates &mdash; manual tracking on a spreadsheet is not a question of <em>if</em> something slips but <em>when</em>.</p>
      <p>Re-credentialing on a strict 36-month cadence is covered in <a href="/resources/recredentialing-every-three-years">re-credentialing every three years</a>, and the CAQH clock in the <a href="/resources/caqh-proview-attestation-cycle">CAQH ProView attestation cycle</a>. The economics are simple: the cost of never letting a credential lapse is a small fraction of the cost of one clawback. A done-for-you team whose entire job is watching those clocks is cheap insurance against a five-figure surprise.</p>
      ${CTA}
    `,
  },
  {
    slug: "payer-enrollment-timelines-by-payer",
    category: "government",
    title: "Payer Enrollment Timelines: Aetna, UnitedHealthcare, Cigna, Humana &amp; More",
    excerpt:
      "Realistic enrollment turnaround for Aetna, UnitedHealthcare, Cigna, Humana, Medicare, and Medicaid, in planning ranges, not fake SLAs, plus the effective-date rules that decide what you actually collect.",
    readTime: "9 min read",
    html: `
      <p><strong>Payer enrollment timelines</strong> for Aetna, UnitedHealthcare, Cigna, Humana, and the government programs are the question every practice administrator asks before a new hire starts &mdash; and the honest answer is a range, not a promise. Most commercial enrollments land somewhere between <strong>60 and 120 days</strong>, government programs run on their own clocks, and the single biggest variable is not the payer at all &mdash; it is how clean your application is on the day you submit it.</p>
      <p>Below are realistic expectations by payer, what makes them move, and how effective-date rules decide whether the waiting period costs you money or not. Treat every number as a planning range: payers do not publish binding service-level guarantees, and actual turnaround shifts with application volume, state, specialty, and network status.</p>
      <h2>Why can&apos;t anyone give you an exact number?</h2>
      <p>Enrollment is not one step. Verification (primary-source credentialing) and contracting (network loading and effective-date assignment) are separate processes, and the gap between them is where timelines stretch &mdash; see <a href="/resources/credentialing-vs-payer-enrollment">credentialing vs. payer enrollment</a>. A verification file can clear in 60 days while contract execution adds another 30 to 45. Industry benchmarks therefore cluster around <strong>90 to 120 days</strong> for a full commercial enrollment (<a href="https://verisys.com/blog/how-long-does-credentialing-take/" target="_blank" rel="noopener">Verisys</a>), with meaningful spread on either side.</p>
      <p>Almost every major commercial payer &mdash; Aetna, UnitedHealthcare/Optum, Cigna, and Humana included &mdash; pulls its baseline application data from <strong>CAQH ProView</strong>. That is why a complete, attested CAQH profile is the highest-leverage thing you control; a stale profile stalls all of them at once. Keep it current per the <a href="/resources/caqh-proview-attestation-cycle">CAQH ProView attestation cycle</a>.</p>
      <p>There is also a step many timelines forget: for hospital-based providers, facility privileging runs on its own committee calendar in parallel with payer enrollment, and a provider can be fully enrolled with a plan yet still unable to admit or operate until privileges are granted. Map both tracks from day one, or the &quot;enrollment&quot; date will overstate how soon the provider can actually generate revenue.</p>
      <h2>Commercial payers: Aetna, UnitedHealthcare, Cigna, Humana</h2>
      <p>Using widely reported industry ranges &mdash; not guaranteed SLAs &mdash; a reasonable planning window for a clean commercial application is:</p>
      <ul>
        <li><strong>Aetna</strong> &mdash; roughly 45&ndash;90 days once a complete application and attested CAQH profile are in hand.</li>
        <li><strong>UnitedHealthcare / Optum</strong> &mdash; roughly 45&ndash;90 days, with wide state-by-state variation in how quickly the provider is loaded to the network.</li>
        <li><strong>Cigna</strong> &mdash; roughly 60&ndash;90 days; note that Cigna typically requires a signed provider agreement <em>before</em> credentialing begins, so contracting sequence matters.</li>
        <li><strong>Humana</strong> &mdash; often at the faster end, roughly 45&ndash;75 days for a clean file.</li>
      </ul>
      <p>These overlap heavily for a reason: the payer&apos;s internal committee cadence matters less than your data quality. The most common causes of a stalled commercial file are a lapsed CAQH attestation, an unexplained gap in work history, a missing malpractice face sheet, or a network that is simply closed to new providers in that geography. The pattern holds across all four: clean data beats brand every time.</p>
      <p>Two more you will almost certainly touch. <strong>Blue Cross Blue Shield</strong> plans are administered by independent, state-level licensees, so a single national BCBS timeline does not exist &mdash; expect anywhere from 60 to 120 days depending on the specific state plan and its clean-application rules. And <strong>Optum</strong> handles a large share of behavioral-health enrollment on behalf of UnitedHealthcare, which adds a routing step for therapists, psychologists, and psychiatric providers that a medical enrollment would not hit.</p>
      <h2>Government programs: Medicare and Medicaid</h2>
      <p><strong>Medicare</strong> enrollment through PECOS generally runs <strong>60 to 90 days</strong>. Its saving grace is the effective-date rule: CMS permits retrospective billing for up to 30 days before the approved effective date (up to 90 in limited disaster circumstances), so a clean submission can recover roughly a month of otherwise-lost billing (<a href="https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/chain-ownership-system-pecos" target="_blank" rel="noopener">CMS</a>). The mechanics are in <a href="/resources/medicare-enrollment-pecos">Medicare enrollment via PECOS</a>. Remember that Medicare is not one-and-done &mdash; providers must revalidate roughly every five years or risk deactivation (<a href="https://www.cms.gov/medicare/enrollment-renewal/providers-suppliers/revalidations" target="_blank" rel="noopener">CMS</a>).</p>
      <p><strong>Medicaid</strong> is the wild card because it is administered state by state. Fee-for-service Medicaid commonly runs <strong>45 to 90 days</strong>, but managed-Medicaid plans add their own enrollment layer on top, and some states are dramatically slower than others. Plan state by state rather than assuming a national number &mdash; see <a href="/resources/medicaid-enrollment-state-by-state">Medicaid enrollment state by state</a>.</p>
      <p>One more government nuance: if the provider will bill Medicare Advantage or managed-Medicaid plans, those commercial-style plans layer their own enrollment on top of the underlying government program. A provider active in traditional Medicare is not automatically loaded to every Medicare Advantage network, so budget a separate timeline for each plan rather than assuming the government enrollment covers them.</p>
      <h2>How do effective-date rules decide what you actually collect?</h2>
      <p>The turnaround number matters far less than the effective date attached to the approval &mdash; that date, not the day you started seeing patients, determines your first billable claim. Two very different worlds:</p>
      <ul>
        <li><strong>Government programs</strong> often allow limited retroactive billing (Medicare&apos;s 30-day rule), softening the wait.</li>
        <li><strong>Commercial payers</strong> frequently do not. MGMA members report some plans taking up to 100 days to assign an effective date <em>with no retroactive claims allowed</em> &mdash; meaning every visit before that date is permanently unbillable (<a href="https://www.mgma.com/mgma-stat/more-than-half-of-practices-report-credentialing-related-denials-on-the-rise-in-2021" target="_blank" rel="noopener">MGMA</a>).</li>
      </ul>
      <p>This is why two groups with identical 90-day timelines can post wildly different collections: one recovered the gap through retro-billing, the other ate it. The effective date, not the calendar, is the number to negotiate and track.</p>
      <h2>What makes one application faster than another?</h2>
      <p>Two providers submitted to the same payer on the same day can clear weeks apart. The variables that actually move the timeline:</p>
      <ul>
        <li><strong>Data completeness.</strong> The most-cited predictor of turnaround is whether the file is clean on day one &mdash; a single missing malpractice face sheet or unexplained work-history gap can send an application to the back of the queue.</li>
        <li><strong>Network status.</strong> If a payer&apos;s network is closed to a given specialty in a given county, no amount of paperwork speeds it up; you may need a network-exception request first.</li>
        <li><strong>Committee timing.</strong> Many credentialing committees meet on a fixed monthly or twice-monthly cadence, so a file that just missed a meeting waits for the next one &mdash; weeks that have nothing to do with your paperwork.</li>
        <li><strong>State rules.</strong> Some states impose their own commercial-credentialing timelines and clean-application standards, so the same national payer can move at very different speeds across state lines.</li>
      </ul>
      <h2>How do you actually accelerate enrollment?</h2>
      <ul>
        <li><strong>Submit clean, or don&apos;t submit.</strong> The fastest lever is a complete, attested CAQH profile and a document set with zero gaps. One missing item can reset the clock.</li>
        <li><strong>Start at signature.</strong> Kick off enrollment 60&ndash;90 days before start date so the timeline runs against the provider&apos;s notice period, not your payroll.</li>
        <li><strong>Sequence by revenue.</strong> Prioritize the payers that dominate your book, and get the contract executed early where the payer (like Cigna) requires it first.</li>
        <li><strong>Track effective dates, not just approvals.</strong> Know which payers allow retro-billing so you can model what is recoverable &mdash; the difference shows up directly in <a href="/resources/time-to-revenue-new-hires">time-to-revenue for new hires</a>.</li>
        <li><strong>Follow up on a schedule, in writing.</strong> Applications stall silently. A standing weekly status check, referencing a confirmation or ticket number, catches a stuck file weeks earlier than waiting for the payer to reach out &mdash; which they rarely do.</li>
      </ul>
      <p>No vendor can compress a payer&apos;s committee calendar, and anyone promising a guaranteed date is selling you fiction. What a disciplined, done-for-you enrollment process does remove is the delay you actually control &mdash; the incomplete files, the missed re-attestations, the applications that sit unsubmitted &mdash; which is where most of the lost weeks quietly hide.</p>
      ${CTA}
    `,
  },
  {
    slug: "credentialing-software-vs-team",
    image: "/founders-candid.png",
    category: "future",
    title: "Credentialing Software vs. a Credentialing Team: What Mid-Market Groups Actually Need",
    excerpt:
      "Software organizes credentialing; it doesn't do credentialing. An honest look at software-only vs. a CVO vs. done-for-you, and what a 100-to-400-provider group actually needs, total cost of ownership included.",
    readTime: "9 min read",
    html: `
      <p>The <strong>credentialing software vs. a credentialing team</strong> decision trips up almost every group that crosses 100 providers, because the honest answer is that they solve different problems &mdash; and a mid-market group juggling multiple states and dozens of payer relationships usually needs the work done, not just a nicer place to track it. Software organizes credentialing; it does not do credentialing. Knowing where each option breaks down is the difference between an on-time onboard and a six-figure revenue leak.</p>
      <p>Here is an honest comparison of the three models &mdash; software-only, a service or CVO, and fully done-for-you &mdash; and what a 100-to-400-provider organization actually needs.</p>
      <h2>The three models, plainly</h2>
      <ul>
        <li><strong>Software-only.</strong> A platform that stores provider records, tracks expirables, and flags deadlines. Your staff still gathers documents, completes payer applications, follows up, and resolves problems. You are buying visibility and reminders.</li>
        <li><strong>Service / CVO.</strong> A credentials verification organization performs primary-source verification &mdash; and, when NCQA-certified, lets a health plan delegate credentialing and skip much of its own oversight (<a href="https://www.ncqa.org/programs/health-plans/credentials-verification-organization-cvo/" target="_blank" rel="noopener">NCQA</a>). A CVO verifies; it does not necessarily own your end-to-end payer enrollment. Understand the scope &mdash; see <a href="/resources/what-is-a-cvo">what is a CVO</a>.</li>
        <li><strong>Done-for-you (team + platform).</strong> An external team operates the full workflow &mdash; intake, verification, payer enrollment, follow-up, re-credentialing, and expirable monitoring &mdash; on a platform, with a human owning every submission. You are buying the outcome: providers billing.</li>
      </ul>
      <h2>What does a 100-to-400-provider group actually need?</h2>
      <p>At this scale three realities collide. You are almost certainly <strong>multi-state</strong>, so you inherit a matrix of license rules and Medicaid programs (see the <a href="/resources/fifty-state-license-matrix">fifty-state license matrix</a>). You are running <strong>continuous churn</strong> &mdash; new hires, terminations, re-credentialing cycles, and 120-day CAQH re-attestations that never stop. And you carry <strong>real audit exposure</strong> under NCQA and payer requirements.</p>
      <p>That combination means the binding constraint is rarely &quot;we can&apos;t see our deadlines.&quot; It is &quot;we don&apos;t have enough trained hands to work the files before the deadlines hit.&quot; Software makes the gap visible; it does not close it. This is the moment software-only quietly fails: the dashboard turns red right on schedule, and no one has capacity to act on it.</p>
      <p>The reverse failure is just as common: a group buys a full-service vendor but gets no platform visibility, and leadership cannot answer a simple board question &mdash; how many providers are pending, with which payers, and when will each start billing? The right answer for a mid-market group is almost never one or the other. It is a team to do the work and a platform to see it, delivered together, so speed never comes at the price of transparency.</p>
      <h2>Total cost of ownership: the number most groups miss</h2>
      <p>The sticker price of software is the smallest line. Fully loaded, an in-house model carries real weight:</p>
      <ul>
        <li>A credentialing specialist&apos;s median base salary is about <strong>$46,000</strong>, before benefits, payroll taxes, and management overhead (<a href="https://www.salary.com/research/salary/benchmark/medical-staff-credentialing-specialist-salary" target="_blank" rel="noopener">Salary.com</a>). Fully loaded, industry estimates put a single credentialing FTE closer to <strong>$75,000&ndash;$100,000</strong> a year.</li>
        <li>A single specialist realistically supports only <strong>30&ndash;50 providers</strong>, so a 300-provider group needs a team of six-plus &mdash; plus the software on top.</li>
        <li>Then add the costs software never eliminates: <strong>turnover</strong> (institutional knowledge walks out the door), training ramp for each replacement, and the revenue lost every time an understaffed team misses a window.</li>
      </ul>
      <p>The trap is comparing a software subscription against a fully-staffed team as if they deliver the same thing. They do not. A $20K platform that still requires six FTEs to operate is not cheaper than a done-for-you engagement that bundles both the platform and the labor &mdash; you have to compare the total cost of the outcome, framed against the <a href="/resources/true-cost-of-slow-credentialing">true cost of slow credentialing</a>.</p>
      <p>Put concrete numbers on it. Industry estimates suggest processing a high volume of credentialing events manually &mdash; on the order of 10,000 a year &mdash; can require roughly four full-time specialists at a fully-loaded cost north of $200,000 annually. For comparison, outsourced credentialing is often priced per application (commonly a few hundred dollars) plus an ongoing per-provider maintenance fee, which converts a large fixed payroll line into a variable cost that scales with your actual hiring rather than sitting idle between growth spurts.</p>
      <h2>Where each model breaks down</h2>
      <ul>
        <li><strong>Software-only</strong> breaks when volume exceeds staff capacity &mdash; the alerts fire but the work does not get done. It is excellent at telling you what is late.</li>
        <li><strong>A CVO</strong> breaks when you assume verification equals enrollment. A clean verified file is necessary but not sufficient; someone still has to shepherd each payer contract to an active, billable effective date.</li>
        <li><strong>Done-for-you</strong> breaks when it is a black box &mdash; you lose visibility and, worse, submissions go out without a qualified human checking them. The right version keeps you in the platform with full transparency and a human approval gate on every submission.</li>
      </ul>
      <h2>A simple way to choose</h2>
      <p>Strip away the vendor pitches and the decision comes down to a few honest questions:</p>
      <ul>
        <li><strong>Do we have the trained capacity to work every file on time &mdash; today and after the next growth spurt?</strong> If not, more software will not help; you need hands.</li>
        <li><strong>Is our real problem verification, or end-to-end enrollment?</strong> A CVO solves the first; only a full-service model reliably solves the second.</li>
        <li><strong>What does a missed window actually cost us?</strong> If a delayed or lapsed provider is worth thousands of dollars a day, the price gap between tools and a full team is usually smaller than a single avoided delay.</li>
        <li><strong>Will we keep visibility and a human check on every submission?</strong> Whatever the model, never trade transparency for convenience.</li>
      </ul>
      <h2>What about AI doing the whole thing?</h2>
      <p>The industry genuinely wastes billions on manual administration &mdash; CAQH pegs the automation opportunity at roughly <strong>$20 billion</strong> (<a href="https://www.caqh.org/insights/caqh-index-report" target="_blank" rel="noopener">CAQH Index</a>), and physicians already lose an average of 13 hours a week to prior authorization and related paperwork (<a href="https://www.ama-assn.org/press-center/ama-press-releases/ama-survey-indicates-prior-authorization-wreaks-havoc-patient-care" target="_blank" rel="noopener">AMA</a>). Automation clearly has a role in the tracking, reminders, and data-hygiene layer. But credentialing is a compliance function with legal liability attached to every submission &mdash; a wrong effective date or an unverified sanction is not a rounding error. Payers change portal requirements constantly and without notice, and a misfiled application does not just fail cleanly &mdash; it can sit as &quot;pending&quot; for weeks while the revenue clock runs. The realistic model is <strong>automation that accelerates a trained team, with a human approving every payer submission</strong>, not an unattended bot filling portals. We separate the real from the overhyped in <a href="/resources/ai-in-credentialing-real-vs-hype">AI in credentialing: real vs. hype</a>.</p>
      <p>If done-for-you turns out to be the right fit, the quality bar matters more than the logo. Look for a partner that plugs into your existing systems in days rather than forcing a months-long migration, keeps you inside the platform with full visibility, staffs experienced operators instead of rotating juniors, and puts a named human on the approval of every payer submission. The goal is to buy the outcome &mdash; providers billing, on time, audit-ready &mdash; without surrendering control of it.</p>
      <h2>The bottom line for mid-market groups</h2>
      <p>If you are under roughly 30 providers and single-state, software plus a capable coordinator may be enough. Once you are multi-state with continuous churn and audit exposure &mdash; the 100-to-400-provider reality &mdash; you need the <em>work</em> done reliably and on time, with an audit-ready file behind every provider (see <a href="/resources/audit-ready-credentialing-file">the audit-ready credentialing file</a>). That is a team-plus-platform outcome. The most cost-effective version pairs decades of operator experience with software that makes the work fast and transparent &mdash; and keeps a human approval gate on every submission, so you get speed without gambling on accuracy.</p>
      ${CTA}
    `,
  },
{
    slug: "audit-ready-credentialing-file",
    category: "compliance",
    title: "Building an Audit-Ready Credentialing File (NCQA + Joint Commission)",
    excerpt:
      "What a complete, defensible provider file actually contains, how NCQA and The Joint Commission grade it, and the documentation gaps that turn a clean file into a citation.",
    readTime: "8 min read",
    html: `
      <p>An <strong>audit-ready credentialing file</strong> is a provider record complete enough, and documented consistently enough, that a surveyor from NCQA, The Joint Commission, or a delegating health plan could open it cold and find every required element verified, dated, and traceable to its original source. The difference between a passing file and a citation is rarely a missing physician &mdash; it is a verification with no date, a source no one can identify, or an approval signature that arrived after the provider started seeing patients. Building the file to survive an audit means capturing the right elements, verifying them the right way, and proving the timeline.</p>

      <h2>What does a complete, audit-ready credentialing file contain?</h2>
      <p>A defensible file assembles the practitioner&apos;s core qualifications and pairs each one with evidence that it was verified through the primary source or an approved equivalent. At minimum, expect to document:</p>
      <ul>
        <li><strong>Current state licensure</strong> for every state the provider practices in, verified with the issuing board.</li>
        <li><strong>DEA and state controlled-substance registration</strong>, where applicable.</li>
        <li><strong>Education and training</strong> &mdash; medical school, residency, fellowship &mdash; verified with the originating institution or an approved source.</li>
        <li><strong>Board certification</strong> status, verified with the certifying board.</li>
        <li><strong>Work history</strong>, typically a minimum five-year chronology with any gaps explained.</li>
        <li><strong>Malpractice claims history and current coverage</strong>.</li>
        <li><strong>A National Practitioner Data Bank query</strong> and any resulting reports (see <a href="/resources/npdb-queries-explained">NPDB queries</a>).</li>
        <li><strong>Sanctions and exclusion screening</strong> against the OIG and federal debarment lists.</li>
        <li><strong>The signed, dated application and attestation</strong> covering the provider&apos;s ability to perform the requested duties.</li>
      </ul>
      <p>Each of these is only half the record. The other half &mdash; the half auditors actually score &mdash; is the <em>proof of verification</em>: the method used, the source contacted, the date completed, and the identity of the staff member who reviewed it. NCQA&apos;s standards treat this documentation as inseparable from the credential itself; if the method, source, and date are not recorded, the verification effectively did not happen, per NCQA&apos;s <a href="https://www.ncqa.org/programs/health-plans/credentialing/benefits-support/standards/" target="_blank" rel="noopener">Credentialing standards</a>.</p>

      <h2>What do NCQA and The Joint Commission expect?</h2>
      <p>Both accreditors converge on the same principle &mdash; verify with the primary source &mdash; but they frame it differently. NCQA specifies which elements require primary-source verification (PSV) and imposes strict timeliness: verifications must be current when the credentialing committee makes its decision, and NCQA tightened its PSV window in 2025, reducing it to 120 days for Credentialing Accreditation. A license verified more than 120 days before the committee vote is stale and scoreable. NCQA&apos;s <a href="https://wpcdn.ncqa.org/www-prod/NCQA-Credentialing-eBook-2023-WEB.pdf" target="_blank" rel="noopener">credentialing guidance</a> details the approved sources for each element.</p>
      <p>The Joint Commission defines PSV as &ldquo;verification of an individual practitioner&apos;s reported qualifications by the original source or an approved agent of that source,&rdquo; and it explicitly accepts direct correspondence, documented telephone verification, secure electronic verification, or a report from a qualified credentials verification organization, according to its <a href="https://www.jointcommission.org/en-us/knowledge-library/support-center/standards-interpretation/standards-faqs/000001472" target="_blank" rel="noopener">standards FAQ</a>. Crucially, The Joint Commission holds the organization responsible for documenting the date the verification was conducted, who conducted it, what was verified, and the result. For a deeper breakdown of approved sources, see our guide to <a href="/resources/primary-source-verification-7-sources">the seven primary sources</a>.</p>
      <p>Neither accreditor stops at the initial verification. NCQA requires the organization to designate a credentialing committee that reviews and approves practitioners, and it permits a medical director to approve &ldquo;clean&rdquo; files that meet every criterion while routing any file with a flag &mdash; a malpractice history, a license limitation, an unexplained gap &mdash; to the full committee for discretionary review. Both accreditors also require <em>ongoing</em> monitoring between credentialing events: license sanctions, Medicare and Medicaid exclusions, and complaints must be tracked continuously, and the file should show the organization acted on anything it found. A file that is pristine at the moment of approval but silent for the next three years is not, by the standard&apos;s definition, complete.</p>
      <p>A well-built file satisfies both frameworks simultaneously. The safest approach is to hold each element to the stricter of the two requirements &mdash; the tightest timeliness window, the narrowest set of approved sources &mdash; so the same file passes regardless of which framework the auditor applies.</p>

      <h2>How is a delegated-credentialing audit different?</h2>
      <p>When a health plan delegates credentialing to a medical group, MSO, or CVO, it remains accountable for the work and audits the delegate to prove it. A <a href="/resources/ncqa-delegated-credentialing">delegated-credentialing</a> audit typically involves a pre-delegation evaluation, an executed delegation agreement spelling out which activities are delegated, and an annual file review in which the plan pulls a sample &mdash; often the &ldquo;8/30&rdquo; methodology, a minimum of eight files up to thirty depending on population size &mdash; and scores each against its own credentialing policy.</p>
      <p>Preparing for a delegated audit means your files cannot merely be complete; they must match the delegation agreement and your own written policies element for element. Auditors compare the sampled files back to the policy: if your policy says you verify work history covering five years, a file with only three will be cited even when it may satisfy the underlying standard. The oversight file itself &mdash; committee minutes, the credentialing policy, the current roster, and evidence of ongoing monitoring &mdash; is audited alongside the practitioner files. Plans also expect delegates to submit periodic roster and activity reports, and a delegate that cannot produce that evidence on request risks having the delegation revoked.</p>

      <h2>What are the most common credentialing file deficiencies?</h2>
      <p>Most citations are documentation failures, not missing credentials. The recurring offenders:</p>
      <ul>
        <li><strong>Undated or unsourced verifications.</strong> A printed license screenshot with no date, no source, and no reviewer initials proves nothing.</li>
        <li><strong>Stale verifications.</strong> A PSV completed outside the accreditor&apos;s window before the committee decision.</li>
        <li><strong>Approval-timeline gaps.</strong> The committee sign-off is dated after the provider&apos;s start date, or a designee signed without documented authority.</li>
        <li><strong>Missing ongoing monitoring.</strong> No evidence that license sanctions, Medicare and Medicaid exclusions, and complaints were tracked <em>between</em> credentialing events (see <a href="/resources/oig-sam-exclusion-monitoring">exclusion monitoring</a>).</li>
        <li><strong>Unexplained work-history gaps.</strong> A break in employment with no attestation or explanation.</li>
        <li><strong>Attestation drift.</strong> A signed attestation older than the accreditor&apos;s allowed window at the time of the decision.</li>
      </ul>
      <p>The NPDB query deserves special attention: hospitals must query at appointment and at least every two years at reappointment, and the query result must live in the file, per the NPDB&apos;s <a href="https://www.npdb.hrsa.gov/hcorg/aboutQuerying.jsp" target="_blank" rel="noopener">querying guidance</a>. Exclusion screening against the OIG&apos;s list is equally non-negotiable; the OIG advises organizations to routinely check that new hires and current staff are not excluded, per its <a href="https://oig.hhs.gov/exclusions/" target="_blank" rel="noopener">Exclusions Program</a>.</p>

      <h2>Building the file once, then keeping it audit-ready</h2>
      <p>An audit-ready file is not a one-time achievement; it decays. Licenses expire, board certifications lapse, new sanctions post, and the recredentialing clock resets every 36 months (see <a href="/resources/recredentialing-every-three-years">re-credentialing cycles</a>). The organizations that pass audits cleanly treat the file as a living record: they capture the method-source-date stamp at the moment of every verification, they run continuous exclusion and license monitoring rather than annual sweeps, and they maintain a tamper-evident trail so the timeline can never be questioned.</p>
      <p>Retention matters as much as capture. Credentialing records and committee decisions must be retained and reproducible for years &mdash; long enough to cover the look-back period of a payer audit or a malpractice discovery request &mdash; so a file that exists only in a departed coordinator&apos;s inbox is a liability even if every verification was performed correctly. Centralizing the file, time-stamping each action, and locking the record against silent edits is what makes the timeline defensible when someone asks, months or years later, to see the proof.</p>
      <p>That discipline is exactly what separates a file that survives a surprise pull from one that generates a corrective action plan. Whether accreditation runs through NCQA, The Joint Commission, or URAC, the underlying test is identical: can you prove &mdash; on paper, with dates and sources &mdash; that every credential was verified correctly and approved on time?</p>
      ${CTA}
    `,
  },
  {
    slug: "oig-sam-exclusion-monitoring",
    category: "compliance",
    title: "OIG &amp; SAM Exclusion Monitoring: The Compliance Risk You Can&apos;t Ignore",
    excerpt:
      "One missed exclusion check can turn a payroll expense into six-figure liability. Here is what to screen, how often, and how to document it for an audit.",
    readTime: "8 min read",
    html: `
      <p><strong>OIG &amp; SAM exclusion monitoring</strong> is the ongoing practice of screening every provider, employee, contractor, and vendor against the federal exclusion lists to confirm that no one your organization pays &mdash; or bills on behalf of &mdash; has been barred from federal health care programs. It is one of the few compliance obligations where a single missed check can convert an ordinary payroll expense into six-figure liability, because the government treats <em>every</em> claim tied to an excluded person as an overpayment plus a penalty. This is the risk you cannot ignore, and the good news is that it is almost entirely preventable with a disciplined monthly process.</p>

      <h2>What are the OIG LEIE and SAM.gov exclusion lists?</h2>
      <p>Two federal databases anchor exclusion screening. The first is the OIG&apos;s <strong>List of Excluded Individuals and Entities (LEIE)</strong>, maintained by the HHS Office of Inspector General. A person or entity on the LEIE has been excluded from participation in Medicare, Medicaid, and all other federal health care programs, and, in the OIG&apos;s words, &ldquo;can receive no payment from Federal health care programs for any items or services they furnish, order, or prescribe,&rdquo; per the <a href="https://oig.hhs.gov/exclusions/" target="_blank" rel="noopener">OIG Exclusions Program</a>. The LEIE is searchable online and downloadable as a full database with monthly supplements at <a href="https://exclusions.oig.hhs.gov/" target="_blank" rel="noopener">exclusions.oig.hhs.gov</a>.</p>
      <p>The second is <a href="https://sam.gov/" target="_blank" rel="noopener"><strong>SAM.gov</strong></a>, the federal System for Award Management, which consolidates government-wide debarments and exclusions across all federal programs &mdash; not just health care. Screening SAM.gov catches individuals and entities debarred by other agencies who may not appear on the LEIE. Because the two lists are populated differently, checking one is not a substitute for the other; a defensible program screens both, and many organizations also screen the applicable state Medicaid exclusion lists.</p>

      <h2>Why is employing an excluded person so costly?</h2>
      <p>The financial exposure is severe and specific. Under the OIG&apos;s <a href="https://oig.hhs.gov/exclusions/special-advisory-bulletin-and-other-guidance/the-effect-of-exclusion-from-participation-in-federal-health-care-programs/" target="_blank" rel="noopener">Special Advisory Bulletin on the Effect of Exclusion</a>, the OIG &ldquo;may impose CMPs of up to $10,000 for each item or service furnished by the excluded person for which Federal program payment is sought, as well as an assessment of up to three times the amount claimed.&rdquo; That $10,000 figure is a statutory baseline the OIG periodically adjusts upward for inflation, so current per-item penalties run considerably higher &mdash; and they accrue <em>per item or service</em>, not per person. A single excluded nurse contributing to hundreds of billed encounters can generate penalties that dwarf any salary.</p>
      <p>The prohibition is also broader than most managers assume. The bulletin makes clear that &ldquo;no Federal health care program payment may be made for any items or services furnished (1) by an excluded person or (2) at the medical direction or on the prescription of an excluded person,&rdquo; and it extends even to &ldquo;administrative and management services that are payable by the Federal health care programs,&rdquo; whether or not those services are separately billable. In other words, an excluded person working in scheduling, IT, or billing can taint claims they never personally touched.</p>

      <h2>How often must you screen against the exclusion lists?</h2>
      <p>The OIG&apos;s guidance is explicit on timing: &ldquo;OIG updates the LEIE monthly, so screening employees and contractors each month best minimizes potential overpayment and CMP liability.&rdquo; Monthly is the defensible cadence, and it aligns with what many state Medicaid agencies require under federal <a href="https://www.cms.gov/" target="_blank" rel="noopener">CMS</a> guidance. Screening annually &mdash; or only at hire &mdash; leaves an eleven-month window in which an employee could be excluded and continue generating tainted claims before you notice.</p>
      <p>Timing at the database level matters too: exclusions can take effect on any day of the month but may not appear in the LEIE until the next monthly update, so a rigorous program re-screens every individual each month rather than assuming a clean check stays clean.</p>
      <p>State Medicaid programs raise the stakes further. Federal guidance directs state Medicaid agencies to screen their providers monthly and to require enrolled providers to do the same for their own employees and contractors, and many states publish their own exclusion lists on top of the federal ones. An organization billing Medicaid in multiple states therefore has to screen each applicable state list &mdash; a matrix that grows quickly for multi-state groups and is easy to under-scope.</p>

      <h2>Who and what must you screen?</h2>
      <p>Scope is where programs quietly fail. A complete exclusion-monitoring program screens:</p>
      <ul>
        <li><strong>All credentialed providers</strong>, as a standing element of every credentialing and <a href="/resources/recredentialing-every-three-years">recredentialing</a> file.</li>
        <li><strong>All employees</strong>, clinical and non-clinical, including administrative, billing, and management staff.</li>
        <li><strong>Contractors, locum tenens, and temporary staff</strong>.</li>
        <li><strong>Vendors and suppliers</strong> whose products or services are payable by federal programs.</li>
        <li><strong>Ordering and referring practitioners</strong>, where applicable.</li>
      </ul>
      <p>Exclusion screening belongs in your onboarding workflow from day one &mdash; it is a core line item on any <a href="/resources/new-provider-credentialing-checklist">new-provider credentialing checklist</a> &mdash; and then repeats monthly for the life of the relationship. It also complements, but does not replace, other primary-source checks; a clean exclusion result says nothing about license status or malpractice history, which is why it sits alongside <a href="/resources/primary-source-verification-7-sources">primary-source verification</a> and <a href="/resources/npdb-queries-explained">NPDB queries</a> in a complete file.</p>

      <h2>Mandatory vs. permissive exclusions &mdash; and why reinstatement is not automatic</h2>
      <p>Not all exclusions are alike. The OIG imposes <strong>mandatory exclusions</strong> for the most serious conduct &mdash; convictions for program-related fraud, patient abuse or neglect, felony health care fraud, and felony controlled-substance offenses &mdash; each carrying a statutory minimum exclusion period. It also imposes <strong>permissive exclusions</strong> at its discretion for a wider range of conduct, such as misdemeanor fraud, license loss or surrender, or default on health-education loans. For screening purposes the distinction does not change your obligation: an excluded person is excluded regardless of the category, and the payment prohibition and CMP exposure are identical.</p>
      <p>Reinstatement is another trap. Removal from the LEIE is not automatic when an exclusion period ends &mdash; the excluded party must apply to the OIG and receive written notice of reinstatement. A provider whose exclusion &lsquo;expired&rsquo; on paper may therefore still be barred, and paying them still triggers liability, until the OIG formally reinstates them. Screening the live LEIE each month, rather than trusting a remembered end date, is the only way to catch this.</p>
      <h2>How do you document exclusion screening for an audit?</h2>
      <p>A screen you cannot prove is a screen you did not do. For each monthly check, retain a dated, name-matched record showing the individual or entity searched, the list or lists checked (LEIE and SAM.gov), the date, the result, and the identity of the person who performed and reviewed it. When a common name produces a potential match, document the verification steps &mdash; date of birth, SSN, license number &mdash; that ruled it in or out. This evidence is exactly what an OIG audit, a payer&apos;s delegated review, or a False Claims Act inquiry will demand, and it is a required component of an <a href="/resources/audit-ready-credentialing-file">audit-ready credentialing file</a>.</p>
      <p>Retention closes the loop. Keep exclusion-screening records for the full audit look-back period &mdash; commonly several years &mdash; so you can demonstrate an unbroken monthly history for any individual across the entire time they were affiliated with your organization. In a False Claims Act or overpayment inquiry, the government does not ask whether you screen today; it asks you to prove you screened every month going back, and a gap in the record is treated as a gap in the program.</p>
      <p>If a match is confirmed, the excluded person must be removed from any role connected to federally funded items or services immediately, and the organization should evaluate its self-disclosure obligations. The cost of catching an exclusion in month one is a personnel decision; the cost of catching it in an audit two years later is repayment, penalties, and treble damages. Monthly OIG and SAM screening &mdash; documented, name-matched, and never skipped &mdash; is the cheapest insurance in the entire compliance program.</p>
      ${CTA}
    `,
  },
  {
    slug: "npdb-queries-explained",
    category: "compliance",
    title: "NPDB Queries: What They Reveal and When They&apos;re Required",
    excerpt:
      "A plain-English guide to National Practitioner Data Bank queries: what a query reveals, how it differs from a report, One-Time vs. Continuous Query, and when the law requires one.",
    readTime: "8 min read",
    html: `
      <p><strong>NPDB queries</strong> are formal searches of the National Practitioner Data Bank that reveal a practitioner&apos;s history of malpractice payments and adverse actions &mdash; and for hospitals and many health care entities, they are not optional. A query returns every report the federal Data Bank holds on a practitioner that your organization is legally authorized to see, giving credentialing committees a nationwide view of licensure discipline, clinical-privileges actions, exclusions, and settlement history that no single state board or resume would surface. Understanding what an NPDB query reveals, and when the law requires one, is fundamental to a defensible credentialing program.</p>

      <h2>What is the National Practitioner Data Bank?</h2>
      <p>The National Practitioner Data Bank (NPDB) is a federal repository created by Congress under the Health Care Quality Improvement Act of 1986 and related statutes. As the NPDB explains, it &ldquo;collects information on medical malpractice payments and certain adverse actions&rdquo; and discloses that information only to entities legally eligible to query, per its <a href="https://www.npdb.hrsa.gov/hcorg/aboutQuerying.jsp" target="_blank" rel="noopener">querying overview</a>. It is administered by the Health Resources and Services Administration (HRSA), and its purpose is to prevent practitioners from crossing state lines to escape a disciplinary history. The NPDB is a flagging system, not a verification service &mdash; it points you to actions that warrant a closer look, which you then investigate through the reporting source.</p>

      <h2>What is the difference between an NPDB query and a report?</h2>
      <p>These two words describe opposite directions of information flow, and conflating them is a common source of confusion. A <strong>report</strong> is <em>submitted to</em> the NPDB by an eligible entity when a reportable event occurs &mdash; a malpractice payout, a license suspension, a clinical-privileges revocation. A <strong>query</strong> is a request <em>from</em> the NPDB: you ask, and the Data Bank returns any reports on file. Reporting is an obligation that falls on payers, boards, hospitals, and peer-review bodies; querying is the credentialing activity most organizations perform routinely. All reports must be submitted within 30 days of the action or payment, according to the NPDB&apos;s <a href="https://www.npdb.hrsa.gov/guidebook/EOverview.jsp" target="_blank" rel="noopener">Guidebook</a>.</p>

      <h2>What does an NPDB query reveal?</h2>
      <p>A query surfaces the reportable actions and payments the Data Bank collects. Under the governing statutes, these include:</p>
      <ul>
        <li><strong>Medical malpractice payments</strong> resulting from a written claim or judgment.</li>
        <li><strong>Adverse licensure actions</strong> related to professional competence or conduct taken by state boards.</li>
        <li><strong>Adverse clinical-privileges actions</strong> taken by hospitals and health care entities.</li>
        <li><strong>Adverse professional-society membership actions</strong> related to competence or conduct.</li>
        <li><strong>DEA controlled-substance registration actions</strong>.</li>
        <li><strong>Exclusions</strong> from Medicare, Medicaid, and other federal health care programs.</li>
        <li><strong>Negative actions or findings</strong> by peer-review and private accreditation organizations, plus health-care-related criminal convictions and civil judgments.</li>
      </ul>
      <p>That breadth is what makes the NPDB uniquely valuable: a single query consolidates federal, state, and private-sector actions that would otherwise require dozens of separate inquiries. It does not, however, replace direct verification of a license or board certification &mdash; the NPDB tells you whether an <em>action</em> exists, while <a href="/resources/primary-source-verification-7-sources">primary-source verification</a> confirms the credential itself is current and valid.</p>

      <h2>Who is eligible to query, and what a query does not show</h2>
      <p>Not everyone can query the NPDB. An organization must be registered and authorized under the governing statutes, and it receives only the reports it is legally entitled to see &mdash; the NPDB releases information strictly according to the querier&apos;s registration and eligibility. Hospitals, other health care entities that conduct formal peer review, state licensing boards, and health plans are typical eligible queriers, as detailed in the NPDB&apos;s <a href="https://www.npdb.hrsa.gov/guidebook/DSubmittingaQuery.jsp" target="_blank" rel="noopener">Guidebook chapter on queries</a>; a query can also be run by an authorized agent, such as a credentials verification organization acting on the entity&apos;s behalf. Individual practitioners may run a <strong>self-query</strong> on themselves, which is why applicants sometimes arrive with one in hand &mdash; useful context, but not a replacement for the organization&apos;s own query.</p>
      <p>It is just as important to understand what an NPDB query does <em>not</em> reveal. It is not a criminal background check, not a credit report, and not confirmation that a license is active today. It surfaces <em>reported</em> actions and payments &mdash; nothing more. A practitioner with a spotless query may still have an expired license or an unreported concern, which is precisely why the NPDB sits alongside, not in place of, direct primary-source verification and exclusion screening in a complete file.</p>
      <h2>One-Time Query vs. Continuous Query</h2>
      <p>The NPDB offers two query products, and the distinction matters for ongoing monitoring. A <strong>One-Time Query</strong> returns a snapshot: as the NPDB puts it, &ldquo;you will not be notified of any new reports submitted to the NPDB after the initial query date.&rdquo; A <strong>Continuous Query</strong> enrolls a practitioner for a year-long period and delivers both the initial response and &ldquo;all new or updated report notifications during the year-long enrollment,&rdquo; with email alerts issued within 24 hours of the NPDB receiving a new report, per the <a href="https://www.npdb.hrsa.gov/hcorg/pds.jsp" target="_blank" rel="noopener">Continuous Query</a> guidance.</p>
      <p>Continuous Query is the stronger compliance posture because it closes the gap between credentialing events: instead of learning about a license suspension at the next reappointment, you learn about it the day after it is reported. (Note that the NPDB is consolidating its One-Time and Continuous Query services into a single &ldquo;NPDB Query&rdquo; product in December 2026.) Pairing Continuous Query with monthly <a href="/resources/oig-sam-exclusion-monitoring">exclusion monitoring</a> gives an organization near-real-time awareness of the two event types most likely to create liability.</p>

      <h2>When is an NPDB query required?</h2>
      <p>Hospitals face the clearest mandate. Federal law requires a hospital to query the NPDB when a practitioner applies for medical staff appointment or clinical privileges, and again as part of the mandatory two-year review of privileges or medical staff membership &mdash; a cadence the NPDB describes directly in its <a href="https://www.npdb.hrsa.gov/hcorg/aboutQuerying.jsp" target="_blank" rel="noopener">querying guidance</a>. Enrolling practitioners in Continuous Query satisfies these mandatory querying obligations. Beyond hospitals, a range of eligible entities &mdash; health plans, medical groups, and others engaged in professional review &mdash; may and often do query as part of credentialing, and accreditors such as NCQA and The Joint Commission expect an NPDB query in the credentialing file.</p>

      <h2>How NPDB queries fit into credentialing</h2>
      <p>Within a credentialing workflow, the NPDB query is one input among several, and its output has to be handled correctly. A &ldquo;self-query&rdquo; result the applicant brings is not a substitute for the organization&apos;s own query. When a query returns a report, the credentialing committee must review it, document its analysis, and factor it into the appointment decision &mdash; a clean query and a query with reports are handled very differently, but both must be retained in the file. That documentation is a required component of an <a href="/resources/audit-ready-credentialing-file">audit-ready credentialing file</a>, and the query must be re-run at each <a href="/resources/recredentialing-every-three-years">recredentialing cycle</a> or continuously through enrollment.</p>
      <p>Practitioners also have rights in the system that credentialing teams should understand. A practitioner who believes a report about them is factually inaccurate may add a statement to the report and formally dispute it, and unresolved disputes can be elevated for review by the Secretary of HHS. When a disputed report appears in a query response, the committee should weigh the practitioner&apos;s statement as part of its review rather than treating the report as the final word.</p>
      <p>Treat the query response itself as a dated artifact. Archive the full response, record the date it was run and who reviewed it, and store it with the rest of the file so the query&apos;s currency can be proven at survey. A query run too far ahead of the credentialing decision can be challenged as stale, just like any other verification, so time it to the committee&apos;s calendar.</p>
      <p>Many groups route NPDB querying through a credentials verification organization; understanding <a href="/resources/what-is-a-cvo">what a CVO does</a> helps clarify which party holds the NPDB registration and performs the query. However the work is divided, the standard is the same: query at appointment, query at reappointment or continuously, review every report, and prove it in the file. Handled that way, NPDB queries move from a box-checking chore to what they were designed to be &mdash; an early-warning system that protects patients and the organization alike.</p>
      ${CTA}
    `,
  },
  {
    slug: "recredentialing-every-three-years",
    category: "compliance",
    title: "Re-Credentialing Every 3 Years: How to Never Miss a Cycle",
    excerpt:
      "NCQA gives you a 36-month clock with effectively no grace period. Here is what re-credentialing re-verifies, how to build a proactive calendar, and what a lapse actually costs.",
    readTime: "8 min read",
    html: `
      <p><strong>Re-credentialing every 3 years</strong> is the fixed cycle at the center of every accredited credentialing program: NCQA requires that each practitioner be re-credentialed at least once within a 36-month window, and missing that window is one of the most common &mdash; and most avoidable &mdash; audit findings in the industry. The cycle is unforgiving because it is calendar-driven, not event-driven; the clock starts on the date of the last credentialing decision and runs whether or not anyone is watching it. The organizations that never miss a cycle share one trait: they manage re-credentialing as a rolling, proactive calendar rather than a scramble at expiration.</p>

      <h2>Why does re-credentialing happen every 3 years?</h2>
      <p>The 36-month cycle comes from NCQA&apos;s credentialing standards, which require organizations to re-credential practitioners at least every three years to confirm that the qualifications verified at initial credentialing remain current and that nothing disqualifying has occurred since. NCQA measures the interval from the last credentialing decision to the next, and its guidance allows very little flexibility &mdash; there is effectively no grace period, and a file re-credentialed even a day past 36 months is scoreable during a survey. NCQA&apos;s <a href="https://www.ncqa.org/programs/health-plans/credentialing/benefits-support/standards/" target="_blank" rel="noopener">Credentialing standards</a> and its <a href="https://wpcdn.ncqa.org/www-prod/NCQA-Credentialing-eBook-2023-WEB.pdf" target="_blank" rel="noopener">credentialing guidance</a> lay out the requirement in detail.</p>
      <p>Hospitals accredited by The Joint Commission operate on a parallel but distinct schedule: reappointment to the medical staff and renewal of privileges occurs at least every two years, and federal law requires a matching two-year NPDB query at that reappointment, per the <a href="https://www.npdb.hrsa.gov/hcorg/aboutQuerying.jsp" target="_blank" rel="noopener">NPDB querying guidance</a>. Organizations that answer to both frameworks must satisfy the shorter interval &mdash; which is why many multi-accredited groups standardize on the tightest applicable cycle rather than tracking two competing clocks.</p>
      <p>The rationale is straightforward: credentials decay. A license current in year one can be suspended in year two; a clean malpractice history can gain a settlement; a board certification can lapse. Three years is the accreditors&apos; judgment about how long an organization can safely rely on a point-in-time verification before it must look again &mdash; which is also why they pair the three-year re-check with continuous monitoring in between.</p>

      <h2>What does re-credentialing re-verify?</h2>
      <p>Re-credentialing is not a rubber stamp; it repeats the core verifications from initial credentialing to confirm the provider is still qualified and unencumbered. A compliant re-credentialing file re-verifies, through the primary source and within the accreditor&apos;s timeliness window:</p>
      <ul>
        <li><strong>Current state licensure</strong> for every state of practice.</li>
        <li><strong>DEA and controlled-substance registration</strong>, where applicable.</li>
        <li><strong>Board certification</strong> status.</li>
        <li><strong>Malpractice claims history and current coverage</strong>.</li>
        <li><strong>A fresh NPDB query</strong> for new malpractice payments and adverse actions.</li>
        <li><strong>Sanctions and exclusion status</strong> against OIG and federal lists.</li>
        <li><strong>A current signed attestation</strong> covering the provider&apos;s continued ability to perform.</li>
      </ul>
      <p>Education and training &mdash; facts that do not change &mdash; generally are not re-verified, but everything with an expiration date or an ongoing-risk profile is. Each re-verification carries the same documentation burden as the initial file: method, source, date, and reviewer. For the full list of approved sources, see our guide to <a href="/resources/primary-source-verification-7-sources">primary-source verification</a>, and confirm the finished record meets the standard of an <a href="/resources/audit-ready-credentialing-file">audit-ready credentialing file</a>.</p>

      <h2>How do you build a proactive re-credentialing calendar?</h2>
      <p>The single biggest failure mode is starting late. Because primary-source verifications are valid only within a limited window before the committee decision, you cannot verify too early &mdash; but you must begin early enough to gather sources, resolve discrepancies, and secure committee approval before the 36-month date. Best practice is to launch the re-credentialing workflow 90 to 120 days before the anniversary. A durable calendar has a few moving parts:</p>
      <ul>
        <li><strong>A master roster</strong> keyed to each provider&apos;s last credentialing-decision date, not their hire date.</li>
        <li><strong>Automated ticklers</strong> at 120, 90, and 60 days before expiration.</li>
        <li><strong>A committee schedule</strong> with enough meeting slots that no file waits for a quorum.</li>
        <li><strong>Alignment with the CAQH attestation cycle</strong>, since providers must re-attest their <a href="/resources/caqh-proview-attestation-cycle">CAQH ProView</a> data roughly every 120 days for payers to pull it.</li>
      </ul>
      <p>Throughput is the quiet constraint. A group of 200 providers on a 36-month cycle must complete roughly 65 to 70 re-credentials a year &mdash; more than one a week &mdash; every week, on top of new hires. When re-credentialing is squeezed in around initial credentialing, the anniversaries that slip are almost always the quiet, long-tenured providers no one is actively onboarding. A calendar that surfaces those anniversaries automatically, months ahead, is what prevents the silent lapse.</p>
      <p>Delegated arrangements add a layer: when a group performs credentialing on a health plan&apos;s behalf, the plan audits the cycle timing directly, so a late re-credential is not just an internal miss but a delegation-agreement breach the plan can act on.</p>

      <h2>Special cases: multi-state, locum, and telehealth providers</h2>
      <p>The 36-month clock gets more complicated as provider arrangements diversify. A physician licensed in six states needs all six licenses re-verified within the window, and a lapse in any one can pull them from that state&apos;s payer networks even if the others are current &mdash; a multi-state matrix that rewards a single, centralized roster over per-state spreadsheets. Locum tenens and telehealth providers add their own wrinkles: they are subject to the same credentialing and re-credentialing standards as permanent staff, and a common shortcut &mdash; assuming a staffing agency &lsquo;handles it&rsquo; &mdash; leaves the billing organization holding the compliance risk if the file lapses.</p>
      <p>Providers who move between affiliated entities in a health system raise a related question. If a system credentials centrally, with one committee and one process, it may be able to align a practitioner&apos;s cycle across sites rather than running conflicting clocks &mdash; but that only works if the central roster is authoritative and every site trusts the same date.</p>
      <h2>What happens when a re-credentialing cycle lapses?</h2>
      <p>A lapse is expensive in more ways than one. During an NCQA survey, a file that blew the 36-month window is scored down and can jeopardize accreditation status. Operationally, a lapsed provider may be dropped from payer networks, which stops clean claims and can force the organization to eat the cost of care already delivered. And because re-credentialing is when fresh sanction and exclusion checks occur, a lapse can mean an excluded or disciplined provider keeps billing undetected &mdash; compounding the exposure covered in <a href="/resources/oig-sam-exclusion-monitoring">OIG and SAM exclusion monitoring</a>. The downstream revenue and compliance damage is detailed in our breakdown of the <a href="/resources/hidden-cost-recredentialing-lapse">hidden cost of a re-credentialing lapse</a>.</p>

      <h2>Ongoing monitoring between cycles</h2>
      <p>Three years is a long time to fly blind, and accreditors do not expect you to. Between re-credentialing events, NCQA requires ongoing monitoring of license actions, Medicare and Medicaid sanctions and exclusions, and member complaints, with prompt action when something surfaces &mdash; a standard reinforced by the OIG&apos;s recommendation to screen for exclusions <a href="https://oig.hhs.gov/exclusions/" target="_blank" rel="noopener">every month</a>. The most resilient programs run continuous license and exclusion monitoring and enroll practitioners in NPDB Continuous Query, so an adverse action triggers a review the week it happens rather than at the next anniversary.</p>
      <p>Ongoing monitoring is not a courtesy; it is a scored expectation. When NCQA surveys a file, it looks for evidence that the organization detected and acted on interim events &mdash; a license restriction, a new exclusion, a pattern of complaints &mdash; within a reasonable time, not that it simply waited for the next cycle. Programs that treat the 36-month re-credential as the only checkpoint fail this test even when every three-year file is immaculate.</p>
      <p>Handled proactively, re-credentialing every 3 years stops being a recurring fire drill and becomes a quiet, predictable rhythm: a rolling roster, early ticklers, continuous monitoring, and a committee that approves files with weeks to spare. That is how compliant organizations turn a hard deadline into a non-event &mdash; and never miss a cycle.</p>
      ${CTA}
    `,
  },
{
    slug: "psypact-explained",
    category: "multistate",
    title: "PSYPACT Explained: Telehealth Psychology Across State Lines",
    excerpt:
      "PSYPACT lets qualified psychologists deliver telehealth across state lines without a separate license in every state. Here is what it covers, who qualifies, and where it stops.",
    readTime: "8 min read",
    html: `
      <p>PSYPACT &mdash; the Psychology Interjurisdictional Compact &mdash; is the fastest legal route to practicing telehealth psychology across state lines, letting a qualified psychologist licensed in one participating state serve clients located in other participating states without holding a separate full license in each. For a group running multi-state telepsychology, PSYPACT is often the single biggest lever you have to get a clinician seeing patients in a new state in days instead of the months a fresh license application can take. This guide explains what PSYPACT actually is, which states participate, the two authorities it grants, who qualifies, and where its limits bite.</p>
      <h2>What is PSYPACT?</h2>
      <p>PSYPACT is an interstate agreement, administered by the Association of State and Provincial Psychology Boards (ASPPB), that creates a legal framework for the interjurisdictional practice of psychology. A psychologist licensed in a participating &quot;home&quot; state can provide services to clients located in other participating states under the compact&apos;s authorities, rather than obtaining and maintaining a full license in each. Enacting states pass identical model legislation and appoint a representative to the PSYPACT Commission, which governs the compact and issues the authorities that let clinicians practice. The governing rules live in the official <a href="https://psypact.gov/page/Practice_Related_FAQs" target="_blank" rel="noopener">PSYPACT practice FAQs</a>.</p>
      <h2>Which states participate in PSYPACT?</h2>
      <p>As of 2026, PSYPACT has been enacted in more than 40 states and jurisdictions, and the map keeps growing as additional legislatures pass the model act each session. Because a state can <em>enact</em> the compact months before it becomes operationally <em>effective</em>, the only reliable source of truth is the live map maintained on the <a href="https://psypact.gov/" target="_blank" rel="noopener">official PSYPACT site</a>. Shifting effective dates &mdash; and a handful of large states still outside the compact &mdash; mean you should verify both the psychologist&apos;s home state and the client&apos;s state before every new engagement, not once a year.</p>
      <h2>APIT vs. TAP: the two authorities PSYPACT grants</h2>
      <p>PSYPACT does not issue a license. It grants two distinct authorities, and confusing them is the most common compliance mistake we see:</p>
      <ul>
        <li><strong>APIT &mdash; Authority to Practice Interjurisdictional Telepsychology.</strong> This is the workhorse for telehealth. APIT authorizes a psychologist to provide services <em>via telecommunications</em> to a client physically located in a different participating state. The clinician must be physically present in their home state at the time of service.</li>
        <li><strong>TAP &mdash; Temporary Authorization to Practice.</strong> TAP covers <em>temporary, in-person</em>, face-to-face practice in another participating state &mdash; for example, a psychologist traveling to deliver services on-site. Under the compact, temporary in-person practice is limited to no more than 30 days per calendar year in a given receiving state, per the <a href="https://psypact.gov/page/Application_FAQs" target="_blank" rel="noopener">PSYPACT application FAQs</a>.</li>
      </ul>
      <h2>Who qualifies &mdash; E.Passport and IPC?</h2>
      <p>Each authority sits on top of an ASPPB credential, so qualifying is a two-step sequence: obtain the ASPPB credential first, then apply to the PSYPACT Commission for the matching authority.</p>
      <ul>
        <li>APIT requires an <strong>E.Passport</strong> from ASPPB. Eligibility generally means a doctoral degree in psychology from an APA-, CPA-, or jointly designated program; a current, active, and unrestricted license at the independent-practice level in a participating state; and no disqualifying disciplinary history. Renewal is annual and requires three hours of continuing education specific to the use of technology in psychology, per <a href="https://asppb.net/credentials-related-records/epassport/" target="_blank" rel="noopener">ASPPB&apos;s E.Passport requirements</a>. ASPPB lists the E.Passport application fee at $440 as of 2026.</li>
        <li>TAP requires an <strong>IPC &mdash; Interjurisdictional Practice Certificate</strong> from ASPPB, which verifies the psychologist&apos;s license and background for temporary in-person work.</li>
      </ul>
      <p>Both Commission authorities must then be renewed annually alongside the underlying ASPPB credential.</p>
      <h2>How PSYPACT speeds multi-state telehealth psychology</h2>
      <p>The value is speed and predictability. Instead of filing a full license application in each target state &mdash; waiting on transcripts, exam verifications, and board queues that can run eight to twenty weeks &mdash; a psychologist who already holds APIT can add a new participating state the moment that state is live, because the authority travels with them. For a telehealth group, that means new-state coverage in days, a faster path to the first billable visit, and one credential to renew instead of a stack of state licenses with staggered cycles. It also collapses the per-state tracking burden we describe in our guide to the <a href="/resources/fifty-state-license-matrix">50-state license matrix</a>. Physicians get a comparable &mdash; though structurally different &mdash; accelerant through the <a href="/resources/interstate-medical-licensure-compact">Interstate Medical Licensure Compact</a>.</p>
      <h2>The limits: where PSYPACT stops</h2>
      <p>PSYPACT is powerful but narrow. Know the edges before you rely on it:</p>
      <ul>
        <li><strong>Psychologists only.</strong> PSYPACT covers licensed psychologists. Counselors, social workers, and other behavioral health disciplines rely on their own compacts and their own supervision rules &mdash; see <a href="/resources/behavioral-health-supervision-tracking">behavioral health supervision tracking</a>.</li>
        <li><strong>Participating states only.</strong> Both the clinician&apos;s home state and the client&apos;s location must be in the compact. A client who travels to, or lives in, a non-participating state (or abroad) is outside PSYPACT.</li>
        <li><strong>Home-state presence.</strong> APIT assumes the psychologist is physically in their home state when delivering telepsychology; practicing from a third state can break the framework.</li>
        <li><strong>It is not payer enrollment.</strong> PSYPACT settles the <em>licensing</em> question; it does not enroll the psychologist with Medicare, Medicaid, or commercial payers in that state. Those are separate workstreams &mdash; see <a href="/resources/credentialing-vs-payer-enrollment">credentialing vs. payer enrollment</a>.</li>
        <li><strong>Client-state law still applies.</strong> The scope, consent, and mandated-reporting rules of the client&apos;s state continue to govern the encounter.</li>
      </ul>
      <h2>When you still need a full state license</h2>
      <p>PSYPACT is not a universal substitute for licensure. You will still pursue a full state license when the target state has not enacted or implemented the compact; when a psychologist wants to practice in person beyond the temporary-authority window; when the clinician does not meet E.Passport eligibility &mdash; for example, a degree that is not from an APA-, CPA-, or jointly designated program; or when a specific payer or health-system contract requires a resident-state license. Mapping which of your target states are reachable through APIT versus which still require a full application is the first planning step for any multi-state psychology expansion, and that map changes every time a new state comes online.</p>
      <h2>Documentation, consent, and where the client sits</h2>
      <p>APIT authority is only as clean as your records. Two habits keep a PSYPACT program audit-ready. First, confirm and document the client&apos;s physical location at the start of every telehealth session &mdash; the client&apos;s <em>location</em>, not their mailing address, determines whether the encounter is inside the compact. Second, follow the informed-consent and telehealth-disclosure rules of the client&apos;s state, which can differ from the psychologist&apos;s home state. If an established client travels to a non-participating state, the psychologist may not be authorized to treat them there under APIT, and the session should be rescheduled or handled under that state&apos;s own rules. Building these checks into intake and scheduling &mdash; rather than leaving them to the clinician in the moment &mdash; is what separates a compliant PSYPACT program from a risky one.</p>
      <h2>What this means operationally</h2>
      <p>For a growing telepsychology group, the operational job is straightforward but relentless: confirm each clinician&apos;s home-state license is clean and eligible, secure and renew the right ASPPB credential and Commission authority, re-check the live map before entering any new state, and still run payer enrollment behind it. That is exactly the work CredTek&apos;s done-for-you credentialing team and platform handle &mdash; with a human approval gate on every file &mdash; so clinicians reach their first billable telehealth visit 40&ndash;60% faster across all 50 states. PSYPACT removes the licensing bottleneck; disciplined operations keep it from quietly reappearing.</p>
      ${CTA}
    `,
  },
  {
    slug: "nurse-licensure-compact",
    category: "multistate",
    title: "The Nurse Licensure Compact (NLC): What It Actually Covers",
    excerpt:
      "One multistate license, dozens of states. Here is what the Nurse Licensure Compact really covers, what it leaves out, and where the APRN Compact stands.",
    readTime: "8 min read",
    html: `
      <p>The Nurse Licensure Compact (NLC) lets a registered nurse or licensed practical/vocational nurse hold one multistate license in their home state and practice &mdash; in person or by telehealth &mdash; in every other compact state without applying for a separate license in each. That one sentence covers a lot of ground and hides a lot of exceptions, so this guide breaks down what the Nurse Licensure Compact actually covers, which states participate, what it deliberately leaves out, where the APRN Compact stands, and what all of it means for staffing.</p>
      <h2>What does an NLC multistate license actually cover?</h2>
      <p>Under the NLC, a nurse whose primary state of residence is a compact state can obtain a <strong>multistate license</strong> that carries a &quot;privilege to practice&quot; in every other compact state. The license is issued by your <em>home state</em>; the states you travel or provide telehealth into are <em>remote states</em>. When you practice in a remote state, you must follow that state&apos;s nurse practice act and scope of practice &mdash; the multistate license grants mobility, not a uniform national scope. The compact is administered by the National Council of State Boards of Nursing (NCSBN); the primary reference is the official <a href="https://www.nursecompact.com/" target="_blank" rel="noopener">Nurse Licensure Compact site</a>.</p>
      <h2>Which states participate in the NLC?</h2>
      <p>The Nurse Licensure Compact site reports that 43 jurisdictions are currently part of the compact, and additional states continue to enact it. As with every compact, <em>enacted</em> is not the same as <em>implemented</em> &mdash; a state can pass the law and still be months from issuing multistate licenses. A few large states, most notably California, remain outside the NLC entirely, which is the single fact that most often breaks a &quot;we&apos;re fully compact&quot; staffing assumption. Confirm current status on the official <a href="https://www.ncsbn.org/compacts.page" target="_blank" rel="noopener">NCSBN licensure compacts page</a> before you rely on it.</p>
      <h2>Who qualifies &mdash; the Uniform Licensure Requirements</h2>
      <p>To be issued a multistate license, a nurse must meet the compact&apos;s Uniform Licensure Requirements (ULRs), a standardized set of eligibility criteria every party state applies. As summarized by state boards such as the <a href="https://nursing.wa.gov/msl" target="_blank" rel="noopener">Washington State Board of Nursing</a>, they include, among others:</p>
      <ul>
        <li>Graduation from a board-approved nursing education program;</li>
        <li>Passing the NCLEX-RN or NCLEX-PN examination (or a predecessor exam);</li>
        <li>A federal and state fingerprint-based criminal background check;</li>
        <li>No state or federal felony convictions, and no disqualifying misdemeanors;</li>
        <li>No current enrollment in an alternative-to-discipline program; and</li>
        <li>A valid United States Social Security number.</li>
      </ul>
      <p>Because the ULRs are uniform, a multistate license is only available to nurses whose primary residence is a compact state &mdash; you cannot &quot;shop&quot; for a compact home state while living elsewhere. And under the compact&apos;s <strong>60-day rule</strong>, a nurse who moves their primary residence to a different compact state must apply for licensure by endorsement in the new home state within 60 days.</p>
      <h2>What the NLC does not cover</h2>
      <ul>
        <li><strong>APRNs.</strong> The NLC covers RNs and LPNs/LVNs only. Nurse practitioners, CRNAs, certified nurse-midwives, and clinical nurse specialists are <em>not</em> covered &mdash; their multistate mobility depends on the separate APRN Compact (below).</li>
        <li><strong>Non-compact states.</strong> A multistate license does nothing in California, or any other state outside the compact; you still need a single-state license to practice there.</li>
        <li><strong>Scope harmonization.</strong> The remote state&apos;s practice act governs. The license travels; the rules do not.</li>
        <li><strong>Payer enrollment and facility privileging.</strong> Holding the license does not enroll the nurse with payers or grant privileges at a facility &mdash; those remain separate tracks. See <a href="/resources/credentialing-vs-payer-enrollment">credentialing vs. payer enrollment</a>.</li>
      </ul>
      <h2>Does the NLC cover telehealth?</h2>
      <p>Yes &mdash; with a nuance worth internalizing: under the compact, a nurse practices where the <em>patient</em> is located. A nurse physically sitting in one compact state who provides telehealth to a patient in another compact state is practicing in the patient&apos;s remote state and needs the privilege to practice there, which the multistate license provides. If the patient is in a non-compact state, the multistate license does not reach them, and a single-state license in the patient&apos;s state is required. For nurse-led virtual triage and telehealth lines, that patient-location rule is the whole ballgame, and it is the detail most often missed when a group assumes &quot;compact&quot; means &quot;anywhere.&quot;</p>
      <h2>Single-state vs. multistate: which license applies?</h2>
      <p>A nurse in a compact state can hold either a single-state license (valid only in that state) or a multistate license (valid there plus every remote compact state). Two facts trip teams up. First, residency drives eligibility: the multistate privilege attaches to the nurse&apos;s <em>primary state of residence</em>, so a nurse who lives in a non-compact state cannot obtain one even when licensed in a compact state &mdash; they hold a single-state license instead. Second, the multistate designation does not appear automatically; nurses who were licensed before their state joined the compact, or who have since moved, may still carry a single-state license and must request the upgrade. Auditing which of your nurses actually hold the multistate privilege &mdash; rather than assuming any compact-state license is multistate &mdash; is a routine source of surprise findings during an onboarding or payer audit.</p>
      <h2>Where does the APRN Compact stand?</h2>
      <p>The APRN Compact is a separate NCSBN agreement that would give advanced practice registered nurses &mdash; NPs, CRNAs, CNMs, and CNSs &mdash; a single multistate license across all four roles. It is <em>enacted but not yet operational</em>: the compact requires seven states to adopt it before it activates, and as of 2026 five states have done so (Delaware, North Dakota, South Dakota, Utah, and Wyoming), leaving it two states short. Until it goes live, APRNs practicing across state lines still need a full license in each state &mdash; a critical caveat for any telehealth group built around nurse practitioners. NCSBN maintains current status on its <a href="https://www.ncsbn.org/compacts.page" target="_blank" rel="noopener">licensure compacts page</a>.</p>
      <h2>What the NLC means for staffing</h2>
      <p>For nurse staffing, travel nursing, and nurse-led telehealth, the NLC is a genuine accelerant: one license, dozens of states, no stack of parallel applications to file and renew. It shortens time-to-deploy for float pools and telehealth triage lines, and it simplifies the renewal calendar dramatically for RN- and LPN-heavy rosters. But the exceptions are exactly where credentialing teams get burned &mdash; a California assignment, an APRN who assumed the compact covered them, a nurse who moved and blew the 60-day window, or a &quot;compact&quot; state that has enacted but not implemented. This is why even compact-heavy organizations still need a disciplined, verified <a href="/resources/fifty-state-license-matrix">license matrix</a> and, behind it, real <a href="/resources/primary-source-verification-7-sources">primary-source verification</a>.</p>
      <h2>Keeping an NLC roster clean</h2>
      <p>Because the compact&apos;s value is undone by its exceptions, disciplined groups run a short recurring checklist against every nurse: confirm the nurse&apos;s primary state of residence still matches the license-issuing state; confirm the license is genuinely multistate, not single-state; flag any assignment or telehealth patient in a non-compact state for a single-state license; and watch for residency changes that trigger the 60-day endorsement rule. Pair that with monitoring of the compact map itself &mdash; when a new state implements, you may be able to retire single-state licenses you were carrying, and when a nurse&apos;s status changes at their home board, every remote privilege moves with it. The multistate license is only ever as good as the home-state license underneath it.</p>
      <p>CredTek&apos;s done-for-you credentialing team plus platform tracks every multistate and single-state license, watches for compact status changes, and keeps a human approval gate on each file &mdash; so a compact win never quietly turns into a compliance gap and new hires start billing 40&ndash;60% faster. Nurse mobility under the NLC pairs naturally with physician mobility under the <a href="/resources/interstate-medical-licensure-compact">Interstate Medical Licensure Compact</a> and telehealth psychology under <a href="/resources/psypact-explained">PSYPACT</a>.</p>
      ${CTA}
    `,
  },
  {
    slug: "fifty-state-license-matrix",
    category: "multistate",
    title: "Managing a 50-State License Matrix Without Losing Your Mind",
    excerpt:
      "Tracking every provider&apos;s licenses, renewals, and CE across 50 states is where credentialing quietly breaks. Here is how compacts help and how to build a renewal system that runs on a calendar.",
    readTime: "9 min read",
    html: `
      <p>Managing a 50-state license matrix &mdash; tracking every provider&apos;s licenses, renewal dates, continuing-education requirements, and DEA registrations across every state you operate in &mdash; is one of the least glamorous and most consequential jobs in credentialing. Miss a single renewal and a provider can go dark: claims deny, privileges lapse, and revenue stops. This guide lays out why the matrix gets so painful, how interstate compacts shrink it (but never erase it), and how to build a renewal system that runs on a calendar instead of on adrenaline.</p>
      <h2>Why the 50-state license matrix becomes a nightmare</h2>
      <p>The core problem is combinatorial. Every provider, times every state, times every credential type is a separate object with its own rules:</p>
      <ul>
        <li><strong>Different renewal cycles.</strong> State licenses renew on one-, two-, or three-year cycles, and the clock can key off the issue date, the provider&apos;s birth month, or a fixed statewide date.</li>
        <li><strong>Different CE requirements.</strong> Each board sets its own continuing-education hours and mandatory topics &mdash; opioid prescribing, implicit bias, human trafficking, ethics &mdash; and they rarely align across states.</li>
        <li><strong>Parallel credentials.</strong> A prescriber needs a state license <em>and</em> a state-specific DEA registration <em>and</em>, in some states, a separate controlled-substance registration, each with its own expiration.</li>
        <li><strong>Provider-type sprawl.</strong> Physicians, NPs, PAs, RNs, psychologists, and therapists each answer to a different board with different portals and forms.</li>
      </ul>
      <p>A 60-provider group operating in a dozen states can easily be tracking well over a thousand discrete expiration dates. On a shared spreadsheet, that is a lapse waiting to happen &mdash; and the cost of a single lapse dwarfs the cost of tracking it properly.</p>
      <p>Consider a mid-size telehealth group with 80 clinicians across four disciplines, licensed in 15 states. The physicians renew on staggered two-year cycles keyed to birth month; the nurse practitioners each hold single-state licenses because the APRN Compact is not yet live; the psychologists run on PSYPACT but still owe technology CE; and every prescriber carries a state-specific DEA registration. No two providers share the same renewal calendar, and no single spreadsheet column can honestly answer &quot;is this person legal to bill in this state right now?&quot; That is the matrix problem in one paragraph.</p>
      <h2>How compacts shrink the matrix</h2>
      <p>Interstate compacts are the most effective way to collapse rows in your matrix &mdash; provided you understand what each one really does:</p>
      <ul>
        <li><strong>Interstate Medical Licensure Compact (IMLC)</strong> &mdash; an expedited pathway for physicians across more than 40 states, plus DC and Guam. Critically, it does <em>not</em> issue one national license; it speeds the issuance of separate full state licenses, which the <a href="https://imlcc.com/" target="_blank" rel="noopener">IMLC Commission</a> reports at an average of roughly 19 days. Details in our <a href="/resources/interstate-medical-licensure-compact">IMLC explainer</a>.</li>
        <li><strong>Nurse Licensure Compact (NLC)</strong> &mdash; a true single multistate license for RNs and LPNs/LVNs across 43 jurisdictions, per the <a href="https://www.nursecompact.com/" target="_blank" rel="noopener">NLC</a>. See the <a href="/resources/nurse-licensure-compact">NLC guide</a>.</li>
        <li><strong>PSYPACT</strong> &mdash; telehealth (and limited temporary in-person) authority for psychologists across more than 40 states, per <a href="https://psypact.gov/" target="_blank" rel="noopener">PSYPACT</a>. See <a href="/resources/psypact-explained">PSYPACT explained</a>.</li>
        <li><strong>Counseling Compact</strong> &mdash; a privilege to practice for licensed counselors, enacted in roughly 39 jurisdictions but <em>operational</em> in only a handful as of 2026, with early states such as Arizona, Georgia, Indiana, Louisiana, Minnesota, and Ohio issuing privileges, per the <a href="https://counselingcompact.gov/" target="_blank" rel="noopener">Counseling Compact</a>.</li>
        <li><strong>APRN Compact</strong> &mdash; enacted but not yet live (five of the required seven states as of 2026), tracked on the <a href="https://www.ncsbn.org/compacts.page" target="_blank" rel="noopener">NCSBN compacts page</a>.</li>
      </ul>
      <p>The catch: compacts reduce rows, they do not eliminate them. Non-compact states (California is the recurring example), provider types a compact does not cover, temporary authorities with day limits, and per-state DEA registrations all remain in the matrix. Compacts are a discount on the problem, not a solution to it.</p>
      <p>It is worth naming what no compact touches at all. Federal and state DEA registrations, state controlled-substance registrations, hospital and facility privileges, and payer enrollments sit outside every licensure compact and stay in your matrix regardless of how many compact states you operate in. A physician can hold IMLC-expedited licenses in ten states and still be unable to prescribe in any of them until the matching DEA registrations are in place. Compacts compress the licensing layer; they leave the layers above and below it fully intact, which is exactly why the matrix survives even a heavily compact roster.</p>
      <h2>What actually belongs in the matrix</h2>
      <p>A matrix that only records &quot;license expires 6/30&quot; is not enough. For every provider-state-credential combination, capture at minimum:</p>
      <ul>
        <li>License type, number, status, issue date, and expiration date;</li>
        <li>The renewal cycle length and what the clock keys off &mdash; issue date, birth month, or a fixed statewide date;</li>
        <li>CE hours required, mandatory topics, and hours earned to date, since the hours must exist before the state will let you renew;</li>
        <li>DEA and state controlled-substance registrations and their separate expirations;</li>
        <li>Compact coverage &mdash; is this state reached by the IMLC, NLC, or PSYPACT, or does it require a single-state license?;</li>
        <li>The board&apos;s verification source and the date status was last confirmed at primary source; and</li>
        <li>A named owner and a current renewal status, not just a date.</li>
      </ul>
      <p>Those fields are what let you answer the two questions leadership actually asks: &quot;Can this provider legally bill in this state today?&quot; and &quot;What is about to expire, and who is on it?&quot; A matrix that cannot answer both on demand is a list, not a control.</p>
      <h2>Building a renewal calendar that actually works</h2>
      <p>The organizations that never lapse treat renewals as a system, not a to-do list. The essentials:</p>
      <ul>
        <li><strong>One source of truth.</strong> Every license, DEA, controlled-substance registration, and CE requirement in one place &mdash; never scattered across inboxes and personal spreadsheets.</li>
        <li><strong>Lead-time tiers.</strong> Trigger alerts at 120, 90, 60, and 30 days out. CE-heavy states need the earliest warning, because the hours must be <em>earned</em> before you can renew.</li>
        <li><strong>Named ownership.</strong> Every renewal has an assigned owner and a live status, not just a date on a wall.</li>
        <li><strong>Primary-source verification.</strong> Confirm status directly with the issuing board, not a saved screenshot &mdash; the discipline behind <a href="/resources/primary-source-verification-7-sources">primary-source verification</a>.</li>
        <li><strong>Compact-status monitoring.</strong> Track not only your providers but the compacts themselves; effective dates shift and can add or remove states from your coverage plan overnight.</li>
      </ul>
      <h2>Do not forget recredentialing and revalidation</h2>
      <p>The license matrix is only half the recurring-deadline picture. Payers recredential most providers on a roughly three-year cycle, and Medicare requires enrollment revalidation on its own schedule. A mature matrix folds those dates in beside license renewals, because a lapsed payer recredentialing stops revenue just as effectively as a lapsed license &mdash; see the <a href="/resources/hidden-cost-recredentialing-lapse">hidden cost of a recredentialing lapse</a>. The goal is a single forward-looking calendar of every recurring deadline that can interrupt a provider&apos;s ability to see patients and get paid.</p>
      <h2>Spreadsheet, software, or a team?</h2>
      <p>For a handful of single-state providers, a well-maintained spreadsheet is survivable. Past roughly 20 to 30 providers or three to four states, the manual matrix becomes a liability &mdash; the question stops being <em>if</em> something slips and becomes <em>when</em>. That is the real decision behind <a href="/resources/credentialing-software-vs-team">credentialing software vs. a team</a>: software gives you a dashboard, but someone still has to work the queue, chase the CE, file the renewal, and verify the result. CredTek pairs a done-for-you credentialing team with a platform that owns the whole matrix &mdash; 50-state coverage, automated lead-time alerts, and a human approval gate on every renewal &mdash; so the calendar runs the work instead of the work running you, and providers keep billing 40&ndash;60% faster without a single avoidable lapse.</p>
      ${CTA}
    `,
  },
  {
    slug: "facility-credentialing-guide",
    category: "specialty",
    title: "Facility Credentialing: CLIA, CMS-855A &amp; Accreditation for Hospitals, ASCs &amp; Labs",
    excerpt:
      "Facility credentialing runs on completely different rails than provider credentialing. Here is how CLIA, the CMS-855A/855B, accreditation, and the Type-2 NPI fit together.",
    readTime: "9 min read",
    html: `
      <p>Facility credentialing &mdash; sometimes called organizational or entity credentialing &mdash; is the process of getting a hospital, ambulatory surgery center, clinic, or laboratory itself recognized, enrolled, and contracted to deliver and bill for care, as distinct from credentialing the individual clinicians who work inside it. It runs on a completely different set of rails than provider credentialing: CLIA certificates for labs, the CMS-855A (or 855B) for Medicare enrollment, accreditation from bodies like The Joint Commission, and a Type-2 organizational NPI. Here is how the pieces fit together.</p>
      <h2>How facility credentialing differs from provider credentialing</h2>
      <p>Provider credentialing verifies a person &mdash; their license, education, board status, work history, and malpractice record &mdash; largely through <a href="/resources/primary-source-verification-7-sources">primary-source verification</a>. Facility credentialing verifies an <em>organization</em>: its Medicare enrollment, accreditation or state survey, CLIA status (if it performs lab testing), liability coverage, ownership disclosures, and its Type-2 NPI. Payers contract with the entity separately from the clinicians, and a facility can be fully enrolled while its providers are still in process &mdash; or the reverse. Treating the two as one workstream is the most common facility-credentialing mistake, and it is why organizations often run entity work as its own line, sometimes through a <a href="/resources/what-is-a-cvo">CVO</a>.</p>
      <h2>CLIA: credentialing the laboratory</h2>
      <p>Any facility that tests human specimens for diagnosis or treatment &mdash; even a physician office running a single waived analyzer &mdash; must hold a CLIA certificate under the Clinical Laboratory Improvement Amendments. CMS recognizes five certificate types, tied to the complexity of the testing performed:</p>
      <ul>
        <li><strong>Certificate of Waiver (CoW)</strong> &mdash; for waived tests only, such as urine dipsticks, rapid strep, or blood glucose.</li>
        <li><strong>Certificate for Provider-Performed Microscopy (PPM)</strong> &mdash; adds a defined set of microscopy procedures a physician, midlevel, or dentist performs during a patient visit.</li>
        <li><strong>Certificate of Registration</strong> &mdash; an interim certificate that lets a lab perform moderate- and high-complexity testing while it awaits its compliance or accreditation survey.</li>
        <li><strong>Certificate of Compliance (CoC)</strong> &mdash; issued after a CMS or state survey confirms compliance for non-waived testing.</li>
        <li><strong>Certificate of Accreditation (CoA)</strong> &mdash; issued when a CMS-approved accreditor, such as CAP, COLA, or The Joint Commission, deems the lab compliant.</li>
      </ul>
      <p>CLIA certificates are generally effective for two years, and a CLIA number is issued per testing location. See CMS&apos;s <a href="https://www.cms.gov/regulations-and-guidance/legislation/clia/downloads/types_of_clia_certificates.pdf" target="_blank" rel="noopener">Types of CLIA Certificates</a> for the authoritative breakdown.</p>
      <h2>CMS-855A: enrolling the facility in Medicare</h2>
      <p>The <a href="https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms855a.pdf" target="_blank" rel="noopener">CMS-855A</a> is the Medicare enrollment application for <em>institutional providers</em> &mdash; hospitals, critical access hospitals, skilled nursing facilities, home health agencies, hospices, and ESRD facilities &mdash; that bill Part A on the UB-04 (CMS-1450) claim form. Approval ties the facility to a CMS Certification Number (CCN) and typically depends on a successful state survey or accredited deemed status. One nuance the article title invites: <strong>ambulatory surgery centers do not use the 855A.</strong> ASCs enroll as Part B <em>suppliers</em> on the <a href="https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms855b.pdf" target="_blank" rel="noopener">CMS-855B</a>, and independent labs and group practices enroll on the 855B as well. Matching the entity to the correct 855 form is the first fork in facility enrollment &mdash; get it wrong and the application is returned. More on the mechanics in our <a href="/resources/medicare-enrollment-pecos">Medicare enrollment and PECOS guide</a>.</p>
      <h2>Accreditation and deemed status: TJC, DNV, HFAP, AAAHC</h2>
      <p>Most facilities pursue accreditation from a CMS-approved accrediting organization (AO). Under <strong>deemed status</strong>, a successful AO survey substitutes for the routine CMS or state survey, because the AO&apos;s standards are recognized as meeting the Medicare Conditions of Participation (for hospitals) or Conditions for Coverage (for ASCs and labs). The major AOs:</p>
      <ul>
        <li><strong>The Joint Commission (TJC)</strong> &mdash; hospitals, ASCs, laboratories, behavioral health, home care, and more.</li>
        <li><strong>DNV Healthcare</strong> &mdash; hospitals; its standards integrate the ISO 9001 quality framework and map directly to the CMS Conditions of Participation.</li>
        <li><strong>HFAP</strong> (now operated under ACHC) &mdash; hospitals, ASCs, and other facility types.</li>
        <li><strong>AAAHC</strong> &mdash; a leading accreditor for ambulatory settings, including ASCs and office-based surgery.</li>
      </ul>
      <p>CMS publishes the authoritative list of approved AOs and the facility types each may deem &mdash; see the <a href="https://www.cms.gov/medicare/health-safety-standards/quality-safety-oversight-general-information/accrediting-organizations-aos" target="_blank" rel="noopener">CMS Accrediting Organizations page</a>, and, for ambulatory settings, <a href="https://www.aaahc.org/" target="_blank" rel="noopener">AAAHC</a> and <a href="https://www.jointcommission.org/en-us/accreditation/ambulatory-health-care/ambulatory-surgery-centers" target="_blank" rel="noopener">TJC ASC accreditation</a>.</p>
      <h2>Type-2 NPI and payer facility contracts</h2>
      <p>Every facility needs a <strong>Type-2 (organizational) NPI</strong>, distinct from the Type-1 (individual) NPIs its clinicians hold; large health systems often assign Type-2 NPIs to subparts as well. With the NPI, CLIA (where applicable), Medicare enrollment, and accreditation in hand, the facility then pursues <em>facility contracts</em> with commercial payers and Medicaid. Payers credential the entity on its own track &mdash; requesting the CMS enrollment, accreditation certificates or deemed status, CLIA certificate, W-9, liability face sheet, and ownership disclosures &mdash; and issue a facility participation agreement separate from any individual provider&apos;s in-network status. This is the entity-level parallel to <a href="/resources/credentialing-vs-payer-enrollment">credentialing vs. payer enrollment</a> on the provider side.</p>
      <h2>State facility licensure is a separate layer</h2>
      <p>Federal enrollment and accreditation do not replace state authorization. Most states require a hospital, ASC, or clinical laboratory to hold a state facility license or permit issued by the state health department, and a laboratory may need a state lab license on top of its CLIA certificate. For facilities that do not carry accredited deemed status, the state survey agency also performs the Medicare certification survey on CMS&apos;s behalf. The practical implication is that facility credentialing spans three parallel authorities &mdash; state licensure, federal Medicare enrollment, and accreditation or survey &mdash; and a facility can fully satisfy one while a gap in another quietly blocks billing. Sequencing them so none becomes the surprise bottleneck is much of the work.</p>
      <h2>Revalidation, ownership, and staying enrolled</h2>
      <p>Enrollment is not one-and-done. Medicare requires institutional providers to revalidate their enrollment on a recurring cycle (generally every five years), and any change of ownership, practice location, or authorized official must be reported on the 855 within strict timeframes &mdash; often within 30 days for ownership and control changes. The 855A also demands detailed ownership and managing-control disclosures, and a missed reporting deadline or a stale record is a common reason an otherwise-compliant facility gets flagged or deactivated. Facility credentialing, in other words, is a maintenance discipline as much as an onboarding one, and the entity file has to be kept current between surveys, not rebuilt at each one.</p>
      <h2>How long facility credentialing takes &mdash; and what stalls it</h2>
      <p>A greenfield facility file commonly runs several months, and the long poles are predictable: scheduling the accreditation or state survey, waiting on the CMS Certification Number after a successful survey, and then the payer facility-contracting queue, which can add its own 60 to 120 days. The fastest files parallel-path what can be parallel-pathed &mdash; the Type-2 NPI, the CLIA application, and the 855 submission early &mdash; while sequencing what genuinely depends on a prior step, such as payer contracts that require proof of Medicare enrollment or deemed status before they will load the facility. The slowest files are the ones that discover a missing ownership disclosure, or the wrong 855 form, only after submission and a rejection.</p>
      <h2>Putting the facility file together</h2>
      <p>A clean facility file sequences the dependencies rather than fighting them: the Type-2 NPI first, then CLIA and the correct 855 form, then accreditation or state survey and deemed status, then payer facility contracts &mdash; each step feeding the next. Because facility credentialing is a genuinely distinct discipline from provider work, CredTek runs it as a separate line: a done-for-you team plus platform that assembles the entity file end to end, with a human approval gate before anything is submitted, so a new hospital, ASC, or lab reaches enrolled-and-contracted status without the months of back-and-forth that stall the first claim.</p>
      ${CTA}
    `,
  },
{
    slug: "medicare-enrollment-pecos",
    category: "government",
    title: "Medicare Enrollment via PECOS: Step-by-Step + Revalidation",
    excerpt:
      "How to enroll a physician or group in Medicare through PECOS — the right CMS-855 form, reassignment of benefits, effective dates, and the five-year revalidation cycle that quietly deactivates providers who miss it.",
    readTime: "9 min read",
    html: `
      <p>Medicare enrollment via PECOS is how a physician or group earns the right to bill Original Medicare, and the cleanest, fastest path runs through the online Provider Enrollment, Chain &amp; Ownership System rather than a paper packet. This is the step-by-step version credentialing and enrollment managers actually need: which CMS-855 form applies, how reassignment of benefits works, why your effective date decides how much you can bill, and the five-year revalidation cycle that silently deactivates providers who let it lapse.</p>

      <h2>What is PECOS, and is it better than the paper CMS-855?</h2>
      <p>PECOS is CMS&apos;s web-based system for submitting and maintaining Medicare provider enrollment records, and every paper CMS-855 application has an electronic twin inside it. CMS steers providers to the online path for good reason: electronic submissions typically reach your Medicare Administrative Contractor (MAC) faster, support e-signature, and give you a live status trail instead of a mailed-packet black hole. CMS&apos;s Medicare Learning Network enrollment guidance walks the full workflow and the forms behind it (<a href="https://www.cms.gov/Outreach-and-Education/Medicare-Learning-Network-MLN/MLNProducts/EnrollmentResources/provider-resources/provider-enrolment/Med-Prov-Enroll-MLN9658742.html" target="_blank" rel="noopener">CMS Medicare Learning Network</a>). Paper still works, but it is slower, easier to fumble, and a returned packet resets your timeline. For a multi-provider group, PECOS is almost always the right call.</p>

      <h2>Which CMS-855 form do you actually need?</h2>
      <p>Choosing the wrong form is the most common self-inflicted delay in Medicare enrollment. The core forms are:</p>
      <ul>
        <li><strong>CMS-855I</strong> — an individual physician or non-physician practitioner enrolling to bill Medicare Part B (<a href="https://www.cms.gov/medicare/cms-forms/cms-forms/downloads/cms855i.pdf" target="_blank" rel="noopener">CMS-855I application</a>).</li>
        <li><strong>CMS-855R</strong> — reassignment of the right to bill, now folded into the CMS-855I as of the 05/2023 revision (<a href="https://www.cms.gov/files/document/consolidated-cms-8551-bulletin.pdf" target="_blank" rel="noopener">CMS consolidation bulletin</a>).</li>
        <li><strong>CMS-855B</strong> — a clinic, group practice, or supplier organization; this requires a Type 2 (organizational) NPI.</li>
        <li><strong>CMS-855A</strong> — institutional providers such as hospitals, home health agencies, and facilities.</li>
        <li><strong>CMS-855O</strong> — clinicians who only order, refer, or prescribe and never bill Medicare directly.</li>
      </ul>
      <p>Most physician onboarding in a group involves two moving parts at once: the individual&apos;s 855I and the reassignment that ties that individual to the group&apos;s billing entity. Payer enrollment and clinical credentialing are related but distinct workstreams, and it pays to keep them straight — see <a href="/resources/credentialing-vs-payer-enrollment">credentialing vs. payer enrollment</a>.</p>

      <h2>Reassignment of benefits: the step groups forget</h2>
      <p>Reassignment of benefits is how an enrolled individual assigns the right to receive Medicare payment to the group that employs or contracts them, so claims pay to the group&apos;s Tax ID and Type 2 NPI rather than to the physician personally. Two conditions must be true: both the individual and the organization must be enrolled (or enrolling concurrently) in Medicare, and the reassignment must be explicitly reported. Since 2023, CMS consolidated the standalone reassignment form into the 855I, so in PECOS you complete the individual enrollment and the reassignment in one connected flow. Skip it, and a fully credentialed physician still cannot generate a clean group claim — the payment has nowhere to land. For high-volume onboarding, the reassignment is exactly the box that gets missed under deadline pressure, so build it into the same checklist as the 855I rather than treating it as an afterthought.</p>

      <h2>Effective dates and retrospective billing: where the money is</h2>
      <p>Your effective date is the single most expensive detail in Medicare enrollment, because it sets the first date you can bill. Under federal rule, the effective date for physicians, non-physician practitioners, and their organizations is the later of the date you filed an application that was subsequently approved, or the date you first began furnishing services at the new location (<a href="https://www.law.cornell.edu/cfr/text/42/424.520" target="_blank" rel="noopener">42 CFR 424.520(d)</a>). Medicare then allows limited retrospective billing: up to <strong>30 days</strong> before the effective date when circumstances precluded enrolling in advance, extended to <strong>90 days</strong> only during a Presidentially declared disaster (<a href="https://www.law.cornell.edu/cfr/text/42/424.521" target="_blank" rel="noopener">42 CFR 424.521</a>). The practical lesson is blunt: file the moment you have a confirmed start date. Every day the application sits unfiled beyond that 30-day look-back is revenue you will never recover. Because the effective date is driven by the filing date, a group that batches applications and files them weeks after start dates is systematically donating revenue it could have kept. The compounding cost of that lag is why disciplined groups treat filing speed as a revenue lever — see <a href="/resources/time-to-revenue-new-hires">time-to-revenue for new hires</a>.</p>

      <h2>The five-year revalidation cycle</h2>
      <p>Enrollment is not set-and-forget. To keep billing privileges, most providers and suppliers must revalidate their entire enrollment record at least every five years; DMEPOS suppliers revalidate every three (<a href="https://www.law.cornell.edu/cfr/text/42/424.515" target="_blank" rel="noopener">42 CFR 424.515</a>). CMS assigns each enrolled provider a revalidation due date, publishes it in a lookup tool, and your MAC mails a notice; you then have 60 days to respond with a complete application (<a href="https://data.cms.gov/resources/additional-information-on-revalidation" target="_blank" rel="noopener">CMS revalidation resource</a>). Miss the deadline and the consequences are steep: CMS deactivates the enrollment, billing stops, and reactivation can carry a new effective date — meaning a gap of unbillable claims for services already rendered. Tracking revalidation due dates across a full roster is exactly the kind of quiet deadline that sinks otherwise-healthy groups, and it is far cheaper to monitor than to unwind. CMS also staggers due dates across the enrolled population, so within one group different providers carry different revalidation months — another reason a shared calendar beats individual memory.</p>

      <h2>What happens after you hit submit</h2>
      <p>Once an application reaches the MAC, it is screened, checked against NPPES and other databases, and often returned with a development letter requesting corrections or missing documents — to which you generally have 30 days to respond before rejection. Clean applications are frequently processed in roughly 30 to 45 days, while flawed ones can stretch past 90. On approval, the individual receives a Provider Transaction Access Number (PTAN) tied to that enrollment, and the reassignment links their billing to the group. One line item to budget for: institutional and supplier enrollments filed on the 855A or 855B carry an application fee, while an individual physician&apos;s 855I does not.</p>

      <h2>Common PECOS rejections — and how to avoid them</h2>
      <p>Most Medicare enrollment applications are delayed not by policy but by avoidable data errors. The rejections MACs return most often:</p>
      <ul>
        <li><strong>Name or TIN mismatch</strong> — the legal business name and Tax ID must match IRS records exactly; a doing-business-as name in the legal field bounces.</li>
        <li><strong>NPI and NPPES conflicts</strong> — the NPI, taxonomy, and address in the application must line up with what is on file in NPPES.</li>
        <li><strong>Missing or unsigned certification</strong> — an authorized or delegated official must sign; an unsigned or wrong-signer certification statement is a frequent return.</li>
        <li><strong>Practice-location problems</strong> — a P.O. box listed as a practice location, or an address that does not match other records, triggers development.</li>
        <li><strong>Missing EFT documentation</strong> — the CMS-588 electronic funds transfer form plus a voided check or bank letter are commonly omitted.</li>
        <li><strong>Unanswered development requests</strong> — when a MAC asks for more information, you generally have 30 days to respond before the application is rejected outright.</li>
      </ul>
      <p>None of these are hard individually; the failure mode is volume and follow-through across a roster. A tight submission — right form, matched data, complete attachments, and fast responses to development — is what separates a 30-day approval from a 120-day slog. If you are standing up a repeatable intake, our <a href="/resources/new-provider-credentialing-checklist">new-provider credentialing checklist</a> and <a href="/resources/payer-enrollment-timelines-by-payer">payer enrollment timelines by payer</a> pair naturally with this Medicare workflow, and <a href="/resources/medicaid-enrollment-state-by-state">state-by-state Medicaid enrollment</a> is the logical next program to master once Medicare is clean.</p>
      ${CTA}
    `,
  },
  {
    slug: "medicaid-enrollment-state-by-state",
    category: "government",
    title: "Medicaid Enrollment: Why It&apos;s Different in Every State",
    excerpt:
      "Medicaid enrollment is fifty-plus programs, not one — here is why state agencies and managed-care plans vary so wildly, how ORP rules work, and how to survive multi-plan enrollment without a billing gap.",
    readTime: "9 min read",
    html: `
      <p>Medicaid enrollment is different in every state because Medicaid is not one program — it is more than fifty of them, each administered by its own state agency under a shared federal floor. A physician who is fully enrolled in Georgia Medicaid is a stranger to Ohio Medicaid, on a different portal, with a different application, a different taxonomy crosswalk, and a different revalidation clock. For any group operating across state lines, that fragmentation is the central challenge. Here is what varies, what is federally uniform, and how to run multi-state Medicaid without opening a billing gap.</p>

      <h2>Why is Medicaid enrollment different in every state?</h2>
      <p>Medicaid is a joint federal-state program, so while CMS sets minimum standards, each state designs and operates its own enrollment system. That means separate provider portals (PRSS in Virginia, IMPACT in Illinois, and dozens of others), separate application forms, separate document requirements, separate processing timelines, and separate rules about what counts as an in-state versus out-of-state provider. Two states can screen the same physician at different risk levels, ask for different supporting documents, and take anywhere from a few weeks to several months to approve. The federal government publishes a Medicaid Provider Enrollment Compendium that documents the shared requirements, but states routinely layer their own conditions on top (<a href="https://www.medicaid.gov/medicaid/program-integrity/downloads/mpec.pdf" target="_blank" rel="noopener">Medicaid Provider Enrollment Compendium</a>).</p>

      <h2>What is actually the same in every state?</h2>
      <p>Beneath the variation, federal rules create a common spine. Every state Medicaid agency must screen enrolling providers against a categorical risk level of <strong>limited</strong>, <strong>moderate</strong>, or <strong>high</strong>, with escalating scrutiny — license and database checks for all, on-site visits added at moderate risk, and fingerprint-based background checks added at high risk (<a href="https://www.law.cornell.edu/cfr/text/42/455.450" target="_blank" rel="noopener">42 CFR 455.450</a>). States must also revalidate every enrolled provider at least every five years, regardless of provider type (<a href="https://www.law.cornell.edu/cfr/text/42/455.414" target="_blank" rel="noopener">42 CFR 455.414</a>). And institutional providers generally owe an application fee that mirrors the Medicare fee — set at 750 dollars for calendar year 2026. These federal requirements are the reason Medicaid enrollment feels bureaucratic even in the friendliest state: the screening, site-visit, and revalidation obligations are not optional add-ons, they are the baseline. In practice most physicians and physician groups fall into the limited-risk category, while provider types with higher fraud exposure — DME suppliers, home health agencies, and certain newly enrolling entities — land in moderate or high risk and draw site visits or fingerprinting. The application fee attaches to institutional and supplier enrollments, not to individual physicians, and it is charged again at revalidation.</p>

      <h2>ORP: the ordering, referring, and prescribing trap</h2>
      <p>One rule surprises groups more than any other. Under the 21st Century Cures Act, a provider who orders, refers, or prescribes for a Medicaid patient must themselves be enrolled with the state Medicaid agency — <em>even if that provider never submits a single Medicaid claim.</em> If the ordering, referring, or prescribing (ORP) provider is not enrolled, the rendering provider&apos;s claim can be denied, because the ORP provider&apos;s NPI must be on file and active. The rule reaches attending providers on institutional claims and prescribers on pharmacy claims too, so the exposure is broader than outpatient referrals alone. A hospitalist who refers a Medicaid patient to your imaging center, or a physician who prescribes to Medicaid members, needs an ORP enrollment on record. State agencies have built dedicated ORP enrollment pathways precisely because this catches so many clinicians off guard (<a href="https://www.scdhhs.gov/providers/ordering-referring-and-prescribing-orp-providers" target="_blank" rel="noopener">example state ORP program</a>). The Office of Inspector General has flagged states where unenrolled providers were still serving Medicaid beneficiaries, which is why enforcement of the ORP rule keeps tightening (<a href="https://oig.hhs.gov/reports/all/2020/twenty-three-states-reported-allowing-unenrolled-providers-to-serve-medicaid-beneficiaries/" target="_blank" rel="noopener">HHS OIG report</a>).</p>

      <h2>The managed-care multiplier</h2>
      <p>Here is where the workload explodes. As of July 2024, roughly 78 percent of Medicaid enrollees received their care through risk-based managed care organizations (MCOs) (<a href="https://www.kff.org/medicaid/10-things-to-know-about-medicaid-managed-care/" target="_blank" rel="noopener">KFF: 10 Things to Know About Medicaid Managed Care</a>). Enrolling with the state agency is only step one. To actually get paid, a provider usually has to contract and credential with each MCO the practice wants to serve — and a single state may have five, eight, or more plans. The Cures Act closed the old loophole by requiring that every provider in a Medicaid managed care network <em>also</em> be enrolled with the state Medicaid agency, so the MCO can screen them against the state database (<a href="https://www.medicaid.gov/medicaid/managed-care/enrollment-report" target="_blank" rel="noopener">Medicaid.gov managed care enrollment report</a>). The net effect: for one physician in one state, you may be managing a state enrollment plus a stack of separate MCO contracts, each with its own packet, portal, and turnaround. Each plan may also run its own credentialing-committee cycle and roster-load process, so even after the state clears a provider, the clock on every MCO starts fresh.</p>

      <h2>Out-of-state, border, and telehealth enrollment</h2>
      <p>Multi-state groups hit a second layer of variation: whether a state will enroll an out-of-state provider at all, and on what terms. Many state Medicaid programs require providers physically located elsewhere to enroll as out-of-state or border providers before they can be paid for treating that state&apos;s beneficiaries — a routine surprise for telehealth practices and for referral-heavy specialties near a state line. Some states limit out-of-state enrollment to defined circumstances or demand proof the service was medically necessary and unavailable in-state. Telehealth compounds it: the controlling state is generally the one where the patient sits, so a virtual practice serving five states may need five separate Medicaid enrollments regardless of where its clinicians are licensed or located.</p>

      <h2>Revalidation and the moving-target problem</h2>
      <p>Because every state and every MCO runs its own clock, revalidation becomes a rolling obligation rather than a single event. The state agency revalidates at least every five years; individual MCOs typically recredential on their own cycles, often around every three years, in line with accreditation standards. Notices arrive by different channels — portal message, letter, email — and a missed revalidation quietly deactivates the enrollment, which then bounces claims for care already delivered. Multiply that across states and plans and you have dozens of independent deadlines, none of which forgives a late response. This is why a central roster with owned due dates is not a nice-to-have for multi-state groups; it is the difference between steady cash flow and a surprise blackout. Some states also require interim reporting of changes — a new location, a new owner, an added service — between revalidations, and a missed change report can itself trigger deactivation.</p>

      <h2>How to run multi-state Medicaid without a gap</h2>
      <p>The groups that survive Medicaid&apos;s fragmentation treat it as a logistics problem, not a paperwork problem:</p>
      <ul>
        <li><strong>Maintain one source-of-truth roster</strong> with every provider&apos;s NPIs, licenses, and per-state enrollment status.</li>
        <li><strong>Build per-state playbooks</strong> that capture each portal, form, risk level, and document quirk so the work is repeatable, not rediscovered.</li>
        <li><strong>Track ORP separately</strong> for anyone who orders, refers, or prescribes but does not bill — it is invisible until a claim denies.</li>
        <li><strong>Map every MCO</strong> the practice serves and treat each contract as its own enrollment with its own timeline.</li>
        <li><strong>Own every revalidation date</strong> across states and plans, with reminders well ahead of the deadline.</li>
      </ul>
      <p>Medicaid rewards operators who systematize. Pair this with clean <a href="/resources/medicare-enrollment-pecos">Medicare enrollment via PECOS</a>, keep <a href="/resources/oig-sam-exclusion-monitoring">OIG and SAM exclusion monitoring</a> running in the background, understand the line between <a href="/resources/credentialing-vs-payer-enrollment">credentialing and payer enrollment</a>, and lean on a <a href="/resources/fifty-state-license-matrix">fifty-state license matrix</a> to keep the underlying licensure straight before enrollment ever begins.</p>
      ${CTA}
    `,
  },
  {
    slug: "locum-tenens-credentialing",
    category: "specialty",
    title: "Locum Tenens Credentialing: Winning the Short-Window Race",
    excerpt:
      "Locum tenens credentialing is a race against a start date. Here is how temporary privileges, expedited primary-source verification, and the Medicare Q6 rule let you cover a coverage gap without a compliance miss.",
    readTime: "8 min read",
    html: `
      <p>Locum tenens credentialing is fundamentally a race against a start date. A regular physician goes on leave, a service line loses coverage overnight, or a seasonal surge outstrips the schedule — and the locum who fills the gap is often needed in days or a couple of weeks, not the 90-to-120 days a full credentialing and enrollment cycle normally takes. Winning that short-window race means knowing exactly which shortcuts are legitimate and which are compliance traps. Here is how temporary privileges, expedited primary-source verification, and the Medicare substitute-billing rules fit together.</p>

      <h2>Why is locum tenens credentialing such a time crunch?</h2>
      <p>Standard credentialing is slow by design: primary-source verification, committee review, and payer enrollment routinely run three to four months. Locum coverage does not have that luxury, because the need is usually urgent and the engagement is short. That mismatch has a real price tag — industry analyses peg the revenue lost while a provider sits un-credentialed and unable to bill in the thousands of dollars per day, which is why a stalled locum start is not just an operational headache but a financial one (<a href="https://www.mgma.com/articles/navigating-the-credentialing-gauntlet-key-actions-for-revenue-cycle-management" target="_blank" rel="noopener">MGMA</a>). The whole discipline of locum credentialing is about compressing a multi-month process into the window a coverage gap allows, without cutting the corners that matter. Miss the window and the choice narrows to two bad options: leave the service line uncovered, or let an un-credentialed clinician see patients and expose the organization to denied claims and real liability.</p>

      <h2>Temporary privileges: the pressure valve</h2>
      <p>The mechanism that makes short-window coverage possible is temporary privileges. Under Joint Commission standards, an organization may grant temporary privileges in two situations: to meet an important patient-care need, or to a new applicant whose complete, clean application is awaiting committee action. Covering the patients of an absent physician — the classic locum scenario — is a recognized important patient-care need, and temporary privileges for a pending new applicant may be granted for no more than 120 consecutive days (<a href="https://www.jointcommission.org/standards/standard-faqs/critical-access-hospital/medical-staff-ms/000002257/" target="_blank" rel="noopener">Joint Commission temporary privileges FAQ</a>). Crucially, temporary privileges are not a shortcut around verification. Before they are granted, the organization must have verified current licensure, queried the National Practitioner Data Bank, confirmed there is no current basis for denial, and obtained approval from the medical staff president or designee. Temporary privileges compress the timeline; they do not erase the diligence.</p>
      <p>One framing worth internalizing: locum tenens describes a type of practitioner, not a special category of privilege. The locum is privileged to perform the same work as the physician they cover, granted through the temporary-privileges pathway — there is no separate &quot;locum privilege&quot; to hand out. That distinction keeps your medical staff bylaws clean and your audit trail defensible.</p>

      <h2>Expedited primary-source verification</h2>
      <p>Even under time pressure, the substance of primary-source verification does not shrink — license, DEA registration, board certification, education, work history, and NPDB all still have to be verified at the source. What changes is the choreography. Groups that win the race verify in parallel rather than in sequence, query the NPDB early, keep a pre-built document packet ready for each locum, and often lean on a credentials verification organization to run several checks simultaneously. Partnering with agencies that hold to a recognized code of ethics helps too: the National Association of Locum Tenens Organizations, founded in 2001, sets industry standards its member agencies commit to, which raises the floor on the documentation you receive (<a href="https://www.nalto.org/about/" target="_blank" rel="noopener">NALTO</a>). The goal is a verification file that is fast <em>and</em> audit-ready — see our guide to <a href="/resources/primary-source-verification-7-sources">primary-source verification and the seven core sources</a>.</p>

      <h2>What makes a locum file audit-ready</h2>
      <p>Speed is worthless if the file cannot survive a payer or accreditation audit months later. A defensible locum credentialing file generally contains, at minimum:</p>
      <ul>
        <li><strong>Verified state licensure</strong> for every state where the locum will see patients, checked at the source.</li>
        <li><strong>Current DEA registration</strong> plus any state controlled-substance registration required.</li>
        <li><strong>A dated NPDB query</strong> with the results reviewed and documented.</li>
        <li><strong>Board certification and education</strong> verified with the issuing primary source.</li>
        <li><strong>Work history, malpractice claims history, and current liability coverage</strong>, with any gaps explained.</li>
        <li><strong>OIG and SAM exclusion checks</strong> at onboarding and on an ongoing basis.</li>
        <li><strong>The signed temporary-privileges grant</strong>, documenting the important patient-care need and the approving authority.</li>
      </ul>
      <p>Build the file once and reuse it for a repeat locum, refreshing only the time-sensitive items rather than rebuilding from scratch each engagement. That discipline is what turns a frantic placement into a repeatable one.</p>

      <h2>The payer angle: Q6 and fee-for-time</h2>
      <p>Privileges get a locum into the building; billing is a separate question. Medicare addresses the short-window problem through what it now calls fee-for-time compensation arrangements — the rules long known as locum tenens billing. Under them, the regular physician can bill for a substitute&apos;s services under the regular physician&apos;s own NPI, appending the <strong>Q6</strong> modifier, for a continuous period of up to <strong>60 days</strong> (<a href="https://med.noridianmedicare.com/web/jeb/specialties/locum-tenens-and-reciprocal-billing" target="_blank" rel="noopener">Noridian: fee-for-time and reciprocal billing</a>). That buys real breathing room while the substitute&apos;s own enrollment catches up. But it comes with guardrails: the substitute must be paid on a per-diem or fee-for-time basis, a written agreement should document the arrangement, and claims billed with Q6 beyond the continuous 60-day limit are considered improperly billed and subject to recoupment (<a href="https://www.aapc.com/blog/27489-bill-locum-tenens-according-to-cms-guidelines/" target="_blank" rel="noopener">AAPC billing guidance</a>). Just as important, this is a Medicare mechanism — commercial payers set their own substitute-billing policies, and many do not honor Q6 at all, so a longer engagement still needs the locum enrolled and contracted in their own right.</p>
      <p>Do not confuse Q6 with its sibling. Reciprocal billing uses the <strong>Q5</strong> modifier when a substitute covers under a mutual cross-coverage agreement rather than a paid per-diem arrangement; the two look similar and are billed differently. The 21st Century Cures Act made these fee-for-time rules a permanent part of Medicare and extended them to physical therapists furnishing services in health professional shortage areas. Medicaid programs and commercial plans, however, each write their own substitute-billing rules — some mirror Medicare, many do not — so never assume the Q6 pathway travels beyond Original Medicare.</p>

      <h2>Telehealth locums add a layer</h2>
      <p>Telehealth locums stretch the same problem across state lines. A telehealth locum generally must be licensed in the state where the patient is located, which is where the Interstate Medical Licensure Compact earns its keep by shortening the multi-state licensing path. Payer rules on originating and distant sites still apply, and Medicare lets hospitals credential and privilege distant-site telemedicine practitioners &quot;by proxy,&quot; relying on the distant-site facility&apos;s privileging decisions rather than repeating the full process — a real accelerator when it is set up correctly with a written agreement. For the licensing half of the equation, see the <a href="/resources/interstate-medical-licensure-compact">Interstate Medical Licensure Compact</a>.</p>

      <h2>A short-window playbook</h2>
      <p>The organizations that place locums cleanly run a tight sequence: confirm the coverage need and dates, verify licensure and query the NPDB immediately, grant temporary privileges under the correct standard, decide whether Q6 substitute billing covers the gap or whether full payer enrollment is required, and start the locum&apos;s own enrollment in parallel for anything that will run long. Do that and the short window becomes a manageable sprint instead of a scramble. To pressure-test your own timeline, compare it against <a href="/resources/how-long-does-credentialing-take">how long credentialing really takes</a> and the downstream math of <a href="/resources/time-to-revenue-new-hires">time-to-revenue for new hires</a>.</p>
      ${CTA}
    `,
  },
  {
    slug: "credentialing-during-mergers-acquisitions",
    category: "specialty",
    title: "Credentialing During M&amp;A: NPI Changes, Reassignments, Revalidation",
    excerpt:
      "When a practice is acquired or changes its TIN, credentialing and enrollment can quietly break. Here is how Type 2 NPIs, CMS change-of-ownership, reassignments, and re-contracting decide whether you keep billing.",
    readTime: "9 min read",
    html: `
      <p>Credentialing during M&amp;A is where deals quietly leak money. The clinical work continues, the sign changes, and everyone assumes the billing follows — until claims start denying because a Tax ID changed, a reassignment never pointed to the new entity, or an enrollment reset the effective date. Whether an acquisition or a TIN change breaks your revenue cycle comes down to a handful of decisions about NPIs, CMS change-of-ownership rules, reassignments, and re-contracting. Get them right and billing never blinks; get them wrong and you invite a blackout on work already performed.</p>

      <h2>What actually changes: TIN, NPI, and the billing entity</h2>
      <p>Start with identifiers, because they drive everything downstream. A Type 1 (individual) NPI belongs to the physician for life and travels with them through any deal. A Type 2 (organizational) NPI is attached to a legal entity and its Tax Identification Number (<a href="https://www.cms.gov/files/document/npi-fact-sheet.pdf" target="_blank" rel="noopener">CMS NPI fact sheet</a>). The pivotal question in any transaction is therefore simple: <em>does the billing entity&apos;s TIN change?</em> If the deal keeps the existing legal entity intact, the Type 2 NPI and its enrollments can often stay put. If the deal creates a new entity with a new TIN, you are effectively standing up a new billing organization — which usually means a new Type 2 NPI, new enrollments, and reassignments that must all be rebuilt to point at the new entity.</p>

      <h2>CHOW vs. new enrollment: the fork that decides your risk</h2>
      <p>Medicare treats acquisitions very differently depending on what is being acquired. For a certified Part A facility — a hospital, home health agency, ASC, or SNF — a formal change of ownership (CHOW) applies. Under the CHOW rule, the existing Medicare provider agreement is automatically assigned to the new owner, who steps into the seller&apos;s shoes and inherits the agreement subject to all its terms and conditions (<a href="https://www.law.cornell.edu/cfr/text/42/489.18" target="_blank" rel="noopener">42 CFR 489.18</a>). Filed correctly and on time via the CMS-855A, a CHOW lets the facility keep billing continuously and avoids a blackout. But if the incoming owner does not file promptly and accept the assigned agreement, the MAC can hold or stop payments — so timing is everything (<a href="https://www.cms.gov/files/document/r11125pi.pdf" target="_blank" rel="noopener">CMS Pub. 100-08 change-of-ownership guidance</a>).</p>
      <p>Physician groups are the trap, because Part B suppliers do not have a provider agreement to assign. There is no CHOW mechanism to carry a physician practice&apos;s Medicare enrollment across a new TIN. When a group is acquired into a new legal entity, Medicare treats it as a <strong>new enrollment</strong> — which resets the effective date and limits retrospective billing to just 30 days (<a href="https://www.law.cornell.edu/cfr/text/42/424.520" target="_blank" rel="noopener">42 CFR 424.520</a>). That single distinction is the most common cause of an M&amp;A billing blackout, and it is why deal teams must classify the target correctly before close, not after. Your MAC publishes practical CHOW sequencing tips worth following to the letter (<a href="https://www.palmettogba.com/palmetto/jma.nsf/DIDC/8AZS4G0006~Provider%20Enrollment~Need%20to%20Make%20a%20Change" target="_blank" rel="noopener">MAC CHOW process tips</a>).</p>

      <h2>Reassignments must be rebuilt</h2>
      <p>Every physician in a group has a reassignment on file that directs their Medicare payments to a specific billing entity. When the entity or TIN changes, every one of those reassignments has to be re-established to the new Type 2 NPI. This is not a formality — a physician can be fully credentialed and privileged, yet if their reassignment still points at the old entity, or points nowhere, their claims will not pay under the new organization. In a deal that moves dozens of providers at once, rebuilding reassignments is the highest-volume, most error-prone task on the enrollment side, and the one most likely to be discovered only when the first post-close remittance comes back short. Watch NPPES as well — organizational NPI records carry addresses and authorized officials that must be updated to reflect the new ownership, and stale NPPES data can spawn its own claim edits.</p>

      <h2>Re-contracting with commercial payers</h2>
      <p>Government programs are only half the picture. Commercial payer contracts generally do not travel automatically with an acquisition. Each payer has to be notified, the new TIN loaded to its systems, fee schedules re-linked, and in many cases providers re-credentialed under the acquiring organization before claims will adjudicate correctly. Payers move on their own timelines, so a group that waits until after close to start re-contracting can face weeks or months of denials from its largest commercial books. The defense is a payer-by-payer matrix built during due diligence: every contract, its assignment or notification requirement, and its expected turnaround, sequenced so the highest-volume payers are handled first. Do not overlook delegated credentialing and CAQH: the acquiring organization&apos;s CAQH roster must reflect the moved providers, and any delegated agreements have to be reassigned or renegotiated before they can be relied on.</p>

      <h2>Mass revalidation and effective-date traps</h2>
      <p>Because any &quot;new&quot; enrollment created by the deal is subject to the standard effective-date and 30-day retrospective-billing limits (<a href="https://www.law.cornell.edu/cfr/text/42/424.521" target="_blank" rel="noopener">42 CFR 424.521</a>), a late-filed transaction converts directly into unbillable days. The larger the roster, the larger the exposure, because a single mis-sequenced tie-in can strand hundreds of claims. Coordinate the enrollment wave deliberately: file early, sequence the Medicare tie-in against the corporate close, and run Medicaid and every affected MCO in parallel, since state programs have their own change-of-ownership and re-enrollment rules that rarely align with Medicare&apos;s. In fact, some state Medicaid programs run their own change-of-ownership review that can take longer than Medicare&apos;s, so the state timeline — not the federal one — often becomes the binding constraint on go-live. The financial stakes make this worth over-resourcing — the same lost-revenue math that governs a single slow hire scales brutally across an entire acquired group (<a href="https://www.mgma.com/articles/navigating-the-credentialing-gauntlet-key-actions-for-revenue-cycle-management" target="_blank" rel="noopener">MGMA</a>).</p>

      <h2>Due diligence: what to demand before close</h2>
      <p>The enrollment side of M&amp;A diligence is its own checklist, and the time to run it is before the deal closes, not after. Ask the seller for a complete provider roster with every Type 1 and Type 2 NPI, active PTANs, and current Medicare and Medicaid enrollment status; every commercial payer contract and its assignment language; a schedule of upcoming revalidation due dates; and any open corrective action plans, sanctions, or exclusions. For acquired facilities, confirm whether an existing plan of correction will carry to the new owner under the assigned provider agreement. Run OIG and SAM exclusion checks on every acquired provider and entity, because inherited liabilities travel with the deal. Gaps found in diligence are cheap to fix; the same gaps found after close, while claims are denying, are expensive and public.</p>

      <h2>Avoiding the billing blackout: an M&amp;A runbook</h2>
      <p>The groups that transition cleanly start early and inventory everything:</p>
      <ul>
        <li><strong>Classify the target</strong> — Part A CHOW versus Part B new enrollment — before close, because it dictates the entire plan.</li>
        <li><strong>Inventory identifiers</strong> — every Type 1 and Type 2 NPI, TIN, PTAN, reassignment, and payer contract in scope.</li>
        <li><strong>Begin 90 to 120 days ahead</strong> so effective dates land on or before the close, not after it.</li>
        <li><strong>Keep the seller&apos;s enrollment in good standing</strong> until the tie-in is confirmed, so there is no coverage gap between old and new.</li>
        <li><strong>Sequence the wave</strong> — Medicare tie-in, reassignments, Medicaid, and MCO re-contracting — against the corporate timeline.</li>
      </ul>
      <p>M&amp;A magnifies every credentialing weakness a group already has, so the transaction is a forcing function to get the fundamentals right. Reinforce it with clean <a href="/resources/medicare-enrollment-pecos">Medicare enrollment via PECOS</a>, a firm grip on the <a href="/resources/credentialing-vs-payer-enrollment">credentialing versus payer-enrollment</a> split, vigilance against a <a href="/resources/hidden-cost-recredentialing-lapse">recredentialing lapse</a>, and — for any acquired facilities — a solid <a href="/resources/facility-credentialing-guide">facility credentialing playbook</a>.</p>
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
