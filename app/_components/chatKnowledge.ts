// chatKnowledge.ts — the grounded brain behind the site-wide ChatWidget.
//
// WHY DETERMINISTIC, NOT A LIVE LLM:
// This assistant talks to credentialing/compliance buyers and runs
// unattended during live presentations. Every answer here is grounded
// verbatim in the landing-page copy (pricing, SLAs, payor list, security
// posture), so it can NEVER hallucinate a compliance claim, a price, or a
// guarantee we don't make. That reliability matters more than open-ended
// chat for this audience. The matcher is a transparent keyword router with
// a graceful, always-helpful fallback.
//
// MESSAGING (StoryBrand): the buyer is the hero; CredTek is the guide with
// decades of real credentialing experience. We describe what is TRUE — a
// trained team that plugs in within 48 hours and does the work on a
// platform the client watches — NOT autonomous AI agents. Keep it honest;
// this brain runs unattended in front of buyers who will diligence us.
//
// AI-UPGRADE PATH (when ready):
// Point ChatWidget's respond() at a future POST /api/chat (RAG over this
// same KB). On any error/timeout, fall back to matchTopic() below — so the
// widget degrades to this trustworthy brain instead of failing. Nothing in
// the UI has to change.

export const CAL_LINK = "https://calendly.com/mike-fusion-advisory/30min";

// ---- Content model -------------------------------------------------------

export type ChatAction =
  | { kind: "calendly"; label: string }
  | { kind: "tour"; label: string }
  | { kind: "link"; label: string; href: string }
  | { kind: "topic"; label: string; topicId: string };

// A message body is a small list of blocks. "p" and "ul" support **bold**
// (rendered by splitting on the ** delimiter). "actions" renders buttons.
export type ChatBlock =
  | { t: "p"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "actions"; items: ChatAction[] };

export type Topic = {
  id: string;
  /** Short label shown as a suggested chip (welcome screen / follow-ups). */
  chip?: string;
  /** Match terms. Longer phrases score higher (more specific = more weight). */
  keywords: string[];
  answer: ChatBlock[];
  /** Topic ids surfaced as follow-up chips after this answer. */
  followups?: string[];
};

// Chips shown in the empty/welcome state of the panel.
export const STARTER_CHIPS: { label: string; topicId: string }[] = [
  { label: "How fast can you start?", topicId: "speed" },
  { label: "Pricing", topicId: "pricing" },
  { label: "Onboard my providers", topicId: "onboarding" },
  { label: "Security & compliance", topicId: "security" },
  { label: "How it works", topicId: "agents" },
  { label: "See a demo", topicId: "demo" },
];

// ---- The knowledge base --------------------------------------------------
// Ordered roughly most-asked first. Every fact mirrors app/page.tsx.

export const KNOWLEDGE: Topic[] = [
  {
    id: "what",
    keywords: [
      "what is credtek",
      "what is this",
      "what's credtek",
      "what does credtek",
      "what do you do",
      "tell me about credtek",
      "tell me about",
      "about credtek",
      "overview",
      "explain credtek",
      "what is it",
      "credtek",
    ],
    answer: [
      {
        t: "p",
        text: "**CredTek is your credentialing team — plugged in.** We get your providers credentialed and **billing 40–60% faster** by putting a trained credentialing team, backed by our platform, to work on your roster.",
      },
      {
        t: "p",
        text: "Instead of your coordinators living in payor portals and spreadsheets, **our team does the work** — primary-source verification, CAQH, licensing, and payer enrollment — on a platform you watch in real time. Nothing is submitted without your coordinator's approval.",
      },
      {
        t: "p",
        text: "We've run credentialing inside the largest US health systems — **decades of it, across 700+ facilities** — and we can be working your roster within **48 hours** of our first call. Where would you like to start?",
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "How fast can you start?", topicId: "speed" },
          { kind: "topic", label: "How it works", topicId: "agents" },
          { kind: "tour", label: "See the demo →" },
        ],
      },
    ],
    followups: ["pricing", "security", "who"],
  },
  {
    id: "speed",
    chip: "How fast?",
    keywords: [
      "how fast",
      "faster",
      "how long does it take",
      "how long",
      "speed",
      "turnaround",
      "timeline",
      "time to bill",
      "speed to billable",
      "how quick",
      "quick",
      "days to credential",
      "go live",
      "live in",
      "when can",
      "start",
      "get started fast",
      "48 hours",
      "how soon",
    ],
    answer: [
      {
        t: "p",
        text: "**Two kinds of fast.** We plug our team into your operation within **48 hours of our first conversation** — and we get providers **billing 40–60% faster** than the 90–120-day industry average.",
      },
      {
        t: "ul",
        items: [
          "**Working your roster in 48 hours** — no 9-month implementation, no rollout project. A trained team just starts.",
          "**40–60% faster to billable** — because our team runs the steps in parallel, not one coordinator at a time.",
          "Every idle, credentialed-but-not-billing provider costs roughly **$2,000/day** in revenue you can't bill yet. Speed is the whole point.",
        ],
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "What's the ROI?", topicId: "roi" },
          { kind: "tour", label: "See it in action →" },
        ],
      },
    ],
    followups: ["pricing", "agents", "onboarding"],
  },
  {
    id: "pricing",
    chip: "Pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "how much",
      "fee",
      "fees",
      "expensive",
      "afford",
      "budget",
      "per provider",
      "per month",
      "monthly",
      "plan",
      "plans",
      "tier",
      "tiers",
      "quote",
    ],
    answer: [
      {
        t: "p",
        text: "Pricing is simple and transparent — **from $35 per provider / month + from $199 per credentialing action.** No per-feature gating; every capability is included, and your final number scales with your roster's complexity and volume.",
      },
      {
        t: "ul",
        items: [
          "**Starter** — 1–99 providers.",
          "**Growth** — 100–499 providers, with volume discounts at scale.",
          "**Enterprise** — 500+ providers: custom pricing, EHR integrations, custom SLAs.",
          "**Month-to-month**, with a **30-day out clause in the first 90 days** — no long lock-in.",
        ],
      },
      {
        t: "p",
        text: "For context: a 200-provider group on Growth runs **~$96K/year** — against the $2–6M/year most groups tie up in slow credentialing.",
      },
      {
        t: "actions",
        items: [
          { kind: "link", label: "Run the ROI calculator →", href: "/#calc" },
          { kind: "calendly", label: "Get a custom quote" },
        ],
      },
    ],
    followups: ["roi", "guarantee", "included"],
  },
  {
    id: "agents",
    chip: "How it works",
    keywords: [
      "agent",
      "agents",
      "how it works",
      "how does it work",
      "how does credtek work",
      "automation",
      "automate",
      "automatic",
      "what can it do",
      "what do you do for me",
      "done for you",
      "plug and play",
      "team",
    ],
    answer: [
      {
        t: "p",
        text: "CredTek is a **trained credentialing team plus a platform that runs it** — plugged into your group within 48 hours. Here's what we take off your plate, all included from day one:",
      },
      {
        t: "ul",
        items: [
          "**Intake & profile** — we build a clean golden profile for every provider, with confidence scoring.",
          "**50-state primary-source verification** — every specialty, plus the licensure compacts.",
          "**Specialty workflows** — BH supervision, locum tenens, hospital privileging, M&A NPI changes.",
          "**Payer enrollment** — we prepare and manage enrollment across the major payers, end to end.",
          "**CAQH + expirations** — re-attestation every 120 days and a 180-day expiration forecast, so nothing lapses.",
          "**NCQA-aligned audit binder + tamper-evident log** of every action.",
          "**A dedicated team** — with your coordinator approving before anything is submitted.",
        ],
      },
      {
        t: "p",
        text: "You get a **live platform to watch every provider move to billable** — and **nothing reaches a payer without your coordinator's sign-off.**",
      },
      {
        t: "actions",
        items: [{ kind: "tour", label: "See the platform →" }],
      },
    ],
    followups: ["psv", "payers", "security"],
  },
  {
    id: "included",
    keywords: [
      "included",
      "what's included",
      "whats included",
      "include",
      "feature gating",
      "feature gate",
      "gated",
      "add on",
      "add-on",
      "addon",
      "extra cost",
      "everything included",
      "all features",
    ],
    answer: [
      {
        t: "p",
        text: "**Everything is included from day one** — we don't gate features by tier or nickel-and-dime add-ons.",
      },
      {
        t: "p",
        text: "Every customer gets the full team and platform: 50-state PSV, CAQH management, payer enrollment, the specialty workflow library, the NCQA audit binder, and a dedicated onboarding team. Tiers differ only by provider count; Enterprise adds EHR integrations and custom SLAs.",
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "How it works", topicId: "agents" },
          { kind: "topic", label: "Pricing", topicId: "pricing" },
        ],
      },
    ],
    followups: ["pricing", "ehr"],
  },
  {
    id: "payers",
    chip: "Payors",
    keywords: [
      "payor",
      "payors",
      "payer",
      "payers",
      "insurance",
      "carrier",
      "carriers",
      "aetna",
      "cigna",
      "uhc",
      "united",
      "humana",
      "anthem",
      "bcbs",
      "blue cross",
      "optum",
      "tricare",
      "carelon",
      "magellan",
      "evernorth",
      "medicaid",
      "which payors",
      "enrollment",
    ],
    answer: [
      {
        t: "p",
        text: "We prepare and manage enrollment across the major commercial and government payors, including:",
      },
      {
        t: "ul",
        items: [
          "Aetna, Anthem, Cigna, UnitedHealthcare, Humana, BCBS, Optum",
          "Tricare, Carelon, Magellan, Evernorth",
          "State Medicaid MCOs",
        ],
      },
      {
        t: "p",
        text: "Our team completes each payer's enrollment, tracks it to active on the platform, and **routes it to your coordinator for approval before submission.**",
      },
      {
        t: "actions",
        items: [{ kind: "topic", label: "How it works", topicId: "agents" }],
      },
    ],
    followups: ["states", "psv"],
  },
  {
    id: "states",
    keywords: [
      "state",
      "states",
      "50 state",
      "fifty state",
      "nationwide",
      "national",
      "multi state",
      "multistate",
      "compact",
      "compacts",
      "imlc",
      "nlc",
      "psypact",
      "license states",
      "which states",
      "all states",
    ],
    answer: [
      {
        t: "p",
        text: "**All 50 states**, every specialty. We run state-board verification nationwide and track the licensure compacts:",
      },
      {
        t: "ul",
        items: [
          "**IMLC** (physicians), **NLC** (nursing), **PSYPACT** (psychology)",
          "Counseling (**CC**) and Social Work (**SWC**) compacts",
          "Per-state board primary-source verification for every license type",
        ],
      },
      {
        t: "actions",
        items: [{ kind: "topic", label: "What PSV covers", topicId: "psv" }],
      },
    ],
    followups: ["psv", "specialties"],
  },
  {
    id: "psv",
    keywords: [
      "psv",
      "primary source",
      "primary-source",
      "verification",
      "verify",
      "verifications",
      "nppes",
      "oig",
      "leie",
      "sam gov",
      "sam.gov",
      "npdb",
      "dea",
      "sanctions",
      "exclusions",
      "exclusion",
      "monitoring",
      "background",
      "background check",
      "screening",
    ],
    answer: [
      {
        t: "p",
        text: "**Primary-source verification across every required source** — verified and re-checked on a schedule, so a clean provider stays clean:",
      },
      {
        t: "ul",
        items: [
          "**NPPES** (NPI registry)",
          "**OIG LEIE** + **SAM.gov** (exclusions / debarment)",
          "**NPDB** (practitioner data bank)",
          "**DEA** registration",
          "**50-state license-board PSV** for every specialty",
        ],
      },
      {
        t: "p",
        text: "Every screen is recorded with its result and date in a tamper-evident log, so your NCQA audit binder is always one click away.",
      },
      {
        t: "actions",
        items: [{ kind: "topic", label: "Security & audit", topicId: "security" }],
      },
    ],
    followups: ["security", "caqh", "states"],
  },
  {
    id: "caqh",
    keywords: [
      "caqh",
      "attestation",
      "attest",
      "re-attest",
      "reattest",
      "expiration",
      "expirations",
      "expiring",
      "expiry",
      "renewal",
      "renewals",
      "renew",
      "recredential",
      "re-credential",
      "recredentialing",
      "license renewal",
    ],
    answer: [
      {
        t: "p",
        text: "We keep every profile current so nothing lapses:",
      },
      {
        t: "ul",
        items: [
          "**CAQH re-attestation every 120 days**, with a one-tap SMS approval for your coordinator.",
          "**180-day expiration forecast** for licenses, DEA, board certs, and malpractice — so renewals start early, never late.",
          "Recredentialing cycles are tracked and started on time.",
        ],
      },
      {
        t: "actions",
        items: [{ kind: "tour", label: "See the dashboard →" }],
      },
    ],
    followups: ["psv", "agents"],
  },
  {
    id: "security",
    chip: "Security",
    keywords: [
      "security",
      "secure",
      "hipaa",
      "soc 2",
      "soc2",
      "baa",
      "ncqa",
      "audit",
      "audits",
      "compliance",
      "compliant",
      "data security",
      "tamper",
      "encryption",
      "encrypted",
      "is it safe",
      "privacy",
      "phi",
    ],
    answer: [
      {
        t: "p",
        text: "Security and compliance are first-class, not bolt-ons:",
      },
      {
        t: "ul",
        items: [
          "**HIPAA-aligned** document handling, with a **BAA signed on day one**.",
          "**NCQA-aligned** workflows + a one-click audit binder.",
          "**Tamper-evident, hash-chained audit log** of every action.",
          "**Coordinator approval gate** — nothing reaches a payer without a human sign-off.",
          "**SOC 2 Type II underway** for Enterprise engagements.",
        ],
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "What PSV covers", topicId: "psv" },
          { kind: "calendly", label: "Talk to a veteran" },
        ],
      },
    ],
    followups: ["psv", "ehr", "guarantee"],
  },
  {
    id: "specialties",
    keywords: [
      "specialty",
      "specialties",
      "provider type",
      "provider types",
      "physician",
      "psychiatry",
      "psychology",
      "lcsw",
      "lpc",
      "lmft",
      "bcba",
      "dental",
      "dentist",
      "dmd",
      "optometry",
      "anesthesia",
      "crna",
      "pharmacy",
      "behavioral health",
      "mental health",
      "nurse practitioner",
      "physician assistant",
    ],
    answer: [
      {
        t: "p",
        text: "**Every US specialty and provider type** is supported — MD, DO, NP, PA, RN/LPN; Psychiatry, Psychology, LCSW/LPC/LMFT, BCBA; Pharmacy, Dental/DMD, Optometry, Anesthesia/CRNA, and PT/OT/SLP.",
      },
      {
        t: "p",
        text: "Behavioral health is a particular strength — including supervision and supervisee workflows that most platforms don't handle.",
      },
      {
        t: "actions",
        items: [{ kind: "topic", label: "Supervision workflows", topicId: "supervision" }],
      },
    ],
    followups: ["supervision", "states"],
  },
  {
    id: "supervision",
    keywords: [
      "supervision",
      "supervisor",
      "supervisee",
      "supervised",
      "behavioral health workflow",
      "locum",
      "locum tenens",
      "privileging",
      "hospital privileging",
      "privileges",
      "delegated",
    ],
    answer: [
      {
        t: "p",
        text: "We handle the **specialty workflows generic platforms skip:**",
      },
      {
        t: "ul",
        items: [
          "**Behavioral-health supervision** — supervisor/supervisee relationships and hour tracking.",
          "**Locum tenens** staffing workflows.",
          "**Hospital privileging.**",
          "**M&A NPI** consolidation for acquisitions and rollups.",
        ],
      },
      {
        t: "actions",
        items: [{ kind: "calendly", label: "Discuss your workflows" }],
      },
    ],
    followups: ["specialties", "who"],
  },
  {
    id: "onboarding",
    chip: "Onboarding",
    keywords: [
      "onboarding",
      "onboard",
      "intake",
      "intake form",
      "form",
      "upload roster",
      "roster",
      "add providers",
      "add provider",
      "fill out",
      "data entry",
      "implementation",
      "implement",
      "migrate",
      "migration",
      "modio",
      "spreadsheet",
      "spreadsheets",
      "excel",
      "switch",
      "switching",
      "set up",
      "setup",
      "get started",
      "getting started",
      "csm",
      "data migration",
    ],
    answer: [
      {
        t: "p",
        text: "Getting your roster in takes minutes, and our team is working within 48 hours. **Two ways to onboard:**",
      },
      {
        t: "ul",
        items: [
          "**Self-serve intake** — a guided form with live NPI validation. Add each provider, pick the **states** you need licensed and the **payors** you want enrolled with, and submit.",
          "**Concierge — we do it for you** — too many to type? Upload your roster (Excel or doc); we review it, validate every NPI, and email you a **flat quote** to prepare the credentialing and payer-enrollment forms for you. **Nothing is charged until you approve** — typically $99 per 25 providers, waived on annual plans.",
        ],
      },
      {
        t: "p",
        text: "Either way, we scope it, sign a **BAA**, and our team is verifying and enrolling within **48 hours** — with a dedicated CSM through your first 90 days.",
      },
      {
        t: "actions",
        items: [
          { kind: "link", label: "Start onboarding →", href: "/get-started" },
          { kind: "calendly", label: "Plan your onboarding" },
        ],
      },
    ],
    followups: ["speed", "ehr", "guarantee"],
  },
  {
    id: "ehr",
    keywords: [
      "ehr",
      "emr",
      "epic",
      "athena",
      "athenahealth",
      "cerner",
      "eclinicalworks",
      "nextgen",
      "advancedmd",
      "kareo",
      "tebra",
      "drchrono",
      "practice fusion",
      "integration",
      "integrations",
      "integrate",
      "api",
      "sync",
    ],
    answer: [
      {
        t: "p",
        text: "EHR integrations are available on **Enterprise**, including Epic, athenahealth, Cerner, eClinicalWorks, NextGen, AdvancedMD, Kareo/Tebra, DrChrono, and Practice Fusion.",
      },
      {
        t: "p",
        text: "That keeps provider rosters and enrollment status in sync with your system of record. On Starter and Growth, we work from your roster directly — no integration required to start.",
      },
      {
        t: "actions",
        items: [
          { kind: "link", label: "See all integrations →", href: "/integrations" },
          { kind: "calendly", label: "Ask about your EHR" },
        ],
      },
    ],
    followups: ["pricing", "security"],
  },
  {
    id: "who",
    keywords: [
      "who is it for",
      "who's it for",
      "who is this for",
      "good fit",
      "right for",
      "right for me",
      "is it for",
      "mso",
      "msos",
      "health system",
      "health systems",
      "ipa",
      "ipas",
      "rollup",
      "roll up",
      "private equity",
      "pe rollup",
      "medical group",
      "for hospitals",
    ],
    answer: [
      {
        t: "p",
        text: "CredTek is built for **US medical groups, MSOs, and health systems credentialing providers at scale** — typically **100–400 providers**, multi-state, with real new-hire volume.",
      },
      {
        t: "p",
        text: "It shines wherever provider volume, multi-state licensure, or M&A activity makes manual credentialing the bottleneck to revenue. We also credential **facilities** — hospitals, ASCs, clinics, and labs — as their own line.",
      },
      {
        t: "actions",
        items: [
          { kind: "link", label: "Compare to alternatives →", href: "/compare" },
          { kind: "tour", label: "See the demo →" },
        ],
      },
    ],
    followups: ["compare", "specialties", "founders"],
  },
  {
    id: "founders",
    keywords: [
      "founder",
      "founders",
      "team",
      "who built",
      "who made",
      "who is behind",
      "behind credtek",
      "experience",
      "background",
      "hca",
      "uhs",
      "encompass",
      "ascension",
      "select medical",
      "credibility",
      "who are you guys",
      "decades",
    ],
    answer: [
      {
        t: "p",
        text: "CredTek is built and run by operators, not outsiders. The founding team brings **decades of enterprise credentialing experience** — inside health systems like **HCA, UHS, Encompass Health, Select Medical, and Ascension** — spanning **700+ facilities and 80,000+ beds**.",
      },
      {
        t: "p",
        text: "That's why we can plug in and add value in **48 hours**: we've run credentialing at scale, we know exactly how it breaks, and we do the work ourselves.",
      },
      {
        t: "actions",
        items: [{ kind: "calendly", label: "Meet a founder" }],
      },
    ],
    followups: ["who", "compare"],
  },
  {
    id: "roi",
    keywords: [
      "roi",
      "return on investment",
      "return",
      "worth it",
      "save money",
      "savings",
      "save",
      "value",
      "lost revenue",
      "cost of inaction",
      "cost of waiting",
      "idle provider",
      "payback",
      "justify",
      "business case",
    ],
    answer: [
      {
        t: "p",
        text: "The math is the pitch — and we keep it conservative. Getting a provider billable ~40 days sooner pulls their collections forward; we count only half of that as captured value.",
      },
      {
        t: "ul",
        items: [
          "A 200-provider group (~40 new/yr, ~$18K/mo collected each) accelerates **~$947K** of billing.",
          "Captured conservatively at 50%: **~$473K** this year.",
          "Minus CredTek (~$92K/yr) = a **~$381K net first-year gain — about 4× your investment.**",
        ],
      },
      {
        t: "actions",
        items: [
          { kind: "link", label: "Run your own numbers →", href: "/#calc" },
          { kind: "calendly", label: "Build the business case" },
        ],
      },
    ],
    followups: ["pricing", "speed", "guarantee"],
  },
  {
    id: "compare",
    keywords: [
      "compare",
      "comparison",
      "versus",
      "vs",
      "competitor",
      "competitors",
      "alternative",
      "alternatives",
      "modio",
      "symplr",
      "medallion",
      "verifiable",
      "certifyos",
      "better than",
      "different from",
      "why not",
      "why credtek",
    ],
    answer: [
      {
        t: "p",
        text: "Most platforms are **databases with reminders** — they organize the work, but your team still does every step. CredTek is different: **we're the trained team that does the work for you**, on a platform you can watch.",
      },
      {
        t: "p",
        text: "Enterprise tools take 9 months to implement and price out the mid-market. We plug in within **48 hours**, get you **40–60% faster**, and migrate you off Modio, CAQH, or spreadsheets without redoing months of work.",
      },
      {
        t: "actions",
        items: [{ kind: "link", label: "See the full comparison →", href: "/compare" }],
      },
    ],
    followups: ["agents", "speed", "guarantee"],
  },
  {
    id: "guarantee",
    keywords: [
      "guarantee",
      "guaranteed",
      "contract",
      "commitment",
      "lock in",
      "lock-in",
      "locked in",
      "cancel",
      "cancellation",
      "out clause",
      "month to month",
      "month-to-month",
      "risk",
      "risky",
      "refund",
      "trial",
      "what if it doesn't work",
    ],
    answer: [
      {
        t: "p",
        text: "We keep the risk on us, not you:",
      },
      {
        t: "ul",
        items: [
          "**Month-to-month** — no annual lock-in.",
          "**30-day out clause in your first 90 days** — if it isn't working, you leave.",
          "Pricing is **transparent and usage-based** (from $35/provider/mo + from $199/action) — no surprise fees.",
        ],
      },
      {
        t: "actions",
        items: [{ kind: "calendly", label: "Talk through the terms" }],
      },
    ],
    followups: ["pricing", "onboarding"],
  },
  {
    id: "demo",
    chip: "See a demo",
    keywords: [
      "demo",
      "see it",
      "show me",
      "walkthrough",
      "walk through",
      "tour",
      "guided tour",
      "try it",
      "try",
      "test it",
      "sandbox",
      "book a demo",
      "book a call",
      "schedule",
      "talk to sales",
      "talk to someone",
      "contact",
      "get in touch",
      "meeting",
    ],
    answer: [
      {
        t: "p",
        text: "Two easy ways to see it — pick whichever fits:",
      },
      {
        t: "ul",
        items: [
          "**Interactive demo (no call):** we spin up CredTek with sample providers sized to your group, and a guided walkthrough shows you the dashboard.",
          "**Live demo with a credentialing veteran:** a 30-minute call to map it to your exact workflows — and start in 48 hours.",
        ],
      },
      {
        t: "actions",
        items: [
          { kind: "tour", label: "Start the interactive demo →" },
          { kind: "calendly", label: "Book a live demo" },
        ],
      },
    ],
    followups: ["speed", "pricing", "onboarding"],
  },
  {
    id: "hi",
    keywords: [
      "hi",
      "hey",
      "hello",
      "yo",
      "sup",
      "good morning",
      "good afternoon",
      "good evening",
      "howdy",
      "hiya",
      "greetings",
    ],
    answer: [
      {
        t: "p",
        text: "Hi! I'm the **CredTek assistant** — happy to help. I can explain how our team gets providers billing 40–60% faster, walk through pricing or security, or set you up with a demo.",
      },
      {
        t: "p",
        text: "What brought you in today?",
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "How fast can you start?", topicId: "speed" },
          { kind: "topic", label: "Pricing", topicId: "pricing" },
          { kind: "tour", label: "See the demo →" },
        ],
      },
    ],
    followups: ["what", "agents", "security"],
  },
  {
    id: "thanks",
    keywords: [
      "thanks",
      "thank you",
      "thx",
      "ty",
      "appreciate it",
      "appreciate",
      "bye",
      "goodbye",
      "great",
      "awesome",
      "perfect",
      "cool",
      "got it",
      "makes sense",
      "sounds good",
    ],
    answer: [
      {
        t: "p",
        text: "Anytime! If you'd like to see CredTek running with providers sized to your group, the interactive demo takes about two minutes — or grab time with a credentialing veteran whenever it's useful.",
      },
      {
        t: "actions",
        items: [
          { kind: "tour", label: "See the demo →" },
          { kind: "calendly", label: "Book a live demo" },
        ],
      },
    ],
  },
];

// ---- Matcher -------------------------------------------------------------
// Transparent keyword router. Normalizes to space-padded tokens so matches
// are whole-word/phrase (" psv " won't match "psvxyz"). Score weights longer
// phrases higher (more specific intent), with a small floor for exact-input
// matches so terse messages like "hi" or "roi" still land.

function normalize(s: string): string {
  return ` ${s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()} `;
}

export function matchTopic(input: string, kb: Topic[] = KNOWLEDGE): Topic | null {
  const hay = normalize(input);
  if (hay.trim().length === 0) return null;

  let best: Topic | null = null;
  let bestScore = 0;

  for (const topic of kb) {
    let score = 0;
    for (const kw of topic.keywords) {
      const needle = normalize(kw);
      if (needle.trim().length === 0) continue;
      if (hay.includes(needle)) {
        const len = needle.trim().length;
        // Exact whole-input match gets a floor of 3 so short greetings/acronyms
        // clear the threshold; otherwise weight by phrase length (capped).
        score += hay === needle ? Math.max(len, 3) : Math.min(len, 18);
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = topic;
    }
  }

  return bestScore >= 3 ? best : null;
}

export function topicById(id: string): Topic | null {
  return KNOWLEDGE.find((t) => t.id === id) ?? null;
}

// Friendly fallback when nothing matches — never a dead end. Routes the user
// toward the highest-intent next steps and the most-asked topics.
export const FALLBACK: ChatBlock[] = [
  {
    t: "p",
    text: "Good question — let me point you to the right place. I'm best at the essentials: **how fast we start, pricing, how we work, payors, security, and getting a demo set up.**",
  },
  {
    t: "p",
    text: "Try one of these, or ask me anything about how CredTek works:",
  },
  {
    t: "actions",
    items: [
      { kind: "topic", label: "How fast can you start?", topicId: "speed" },
      { kind: "topic", label: "Pricing", topicId: "pricing" },
      { kind: "topic", label: "Security", topicId: "security" },
      { kind: "calendly", label: "Talk to a human" },
    ],
  },
];
