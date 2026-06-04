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
  { label: "How fast is it?", topicId: "speed" },
  { label: "Pricing", topicId: "pricing" },
  { label: "Security & compliance", topicId: "security" },
  { label: "What do the agents do?", topicId: "agents" },
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
        text: "**CredTek is the AI-agent-native medical credentialing platform** — built to get your providers credentialed and **billing 40–60% faster**.",
      },
      {
        t: "p",
        text: "Instead of coordinators living in payor portals and spreadsheets, CredTek's agents do the work end-to-end — primary-source verification, CAQH, and payor enrollment — and only stop at a human approval gate before anything is submitted.",
      },
      {
        t: "p",
        text: "It's built by operators with **40+ years of enterprise credentialing experience** across 700+ facilities. Where would you like to start?",
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "How fast?", topicId: "speed" },
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
    ],
    answer: [
      {
        t: "p",
        text: "**40–60% faster to billable.** The industry average is **90–120 days** from hire to first in-network payor. CredTek compresses that dramatically by running the work in parallel with agents instead of one coordinator at a time.",
      },
      {
        t: "ul",
        items: [
          "**Live in 14 days** — full onboarding, including migrating your existing data.",
          "Every idle, credentialed-but-not-billing provider costs roughly **$2,000/day** in lost revenue. Speed is the whole point.",
          "Agents work nights and weekends; nothing waits in an inbox.",
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
        text: "Pricing is simple and transparent — **$35 per provider / month + $300 per enrollment action**. No per-feature gating; every agent is included on day one.",
      },
      {
        t: "ul",
        items: [
          "**Starter** — 1–99 providers.",
          "**Growth** — 100–499 providers (**10% off enrollment actions at 200+**).",
          "**Enterprise** — 500+ providers, custom pricing with SOC 2 + EHR integrations.",
          "**Month-to-month**, with a **30-day out clause in the first 90 days** — no long lock-in.",
        ],
      },
      {
        t: "p",
        text: "For context: a 200-provider group on Growth runs **~$96K/year** — against $2–6M/year typically lost to slow credentialing.",
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
      "bots",
      "robots",
      "what can it do",
      "what does the ai do",
      "ai do",
    ],
    answer: [
      {
        t: "p",
        text: "CredTek ships **7 agent bundles** — all included from day one, no feature-gating:",
      },
      {
        t: "ul",
        items: [
          "**Intake & Profile Agent** — builds a golden provider profile with confidence scoring.",
          "**PSV Agent** — 50-state primary-source verification for every specialty (+ compacts).",
          "**Specialty Workflow Library** — BH supervision, locum tenens, hospital privileging, M&A NPI.",
          "**Payor Agents** — fill enrollment forms end-to-end across the major payors.",
          "**CAQH Agent** — re-attests every 120 days + a 180-day expiration forecast.",
          "**Audit Agent** — NCQA-aligned binder + SHA-256 tamper-evident log.",
          "**White-glove onboarding + a dedicated CSM.**",
        ],
      },
      {
        t: "p",
        text: "The agents are Playwright-driven (they actually drive the payor portals), and **nothing is submitted without a coordinator's approval** — so no AI-generated data ever reaches a payor unchecked.",
      },
      {
        t: "actions",
        items: [{ kind: "tour", label: "Watch the agents work →" }],
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
        text: "**Everything is included on day one** — we don't gate features by tier or nickel-and-dime add-ons.",
      },
      {
        t: "p",
        text: "All 7 agent bundles, 50-state PSV, CAQH automation, the NCQA audit binder, and white-glove onboarding with a dedicated CSM come standard. Tiers differ only by provider count and pricing; Enterprise adds SOC 2 and EHR integrations.",
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "See the agents", topicId: "agents" },
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
    ],
    answer: [
      {
        t: "p",
        text: "CredTek's payor agents handle enrollment across the major commercial and government payors, including:",
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
        text: "The agents fill each payor's enrollment forms end-to-end and route them to your coordinator for approval before submission.",
      },
      {
        t: "actions",
        items: [{ kind: "topic", label: "How the agents work", topicId: "agents" }],
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
        text: "**All 50 states**, every specialty. CredTek's PSV runs state-board verification nationwide and understands the licensure compacts:",
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
    ],
    answer: [
      {
        t: "p",
        text: "**Primary-source verification across every required source**, with continuous monitoring — not a one-time check:",
      },
      {
        t: "ul",
        items: [
          "**NPPES** (NPI registry)",
          "**OIG LEIE** + **SAM.gov** (exclusions / debarment)",
          "**NPDB** (practitioner data bank)",
          "**DEA** registration — continuously monitored",
          "**50-state license-board PSV** for every specialty",
        ],
      },
      {
        t: "p",
        text: "Every verification is recorded in a SHA-256 tamper-evident log, so your NCQA audit binder is always one click away.",
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
        text: "CredTek keeps every profile current automatically so nothing lapses:",
      },
      {
        t: "ul",
        items: [
          "**CAQH re-attestation every 120 days**, with a one-tap SMS approval for your coordinator.",
          "**180-day expiration forecast** for licenses, DEA, board certs, and malpractice — so renewals start early, never late.",
          "Recredentialing cycles are tracked and triggered automatically.",
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
          "**HIPAA-compliant** document storage, with a **BAA signed on day one**.",
          "**NCQA-aligned** workflows + a one-click audit binder.",
          "**SHA-256 hash-chained, tamper-evident audit log** of every action.",
          "**Coordinator approval gate** — no AI-generated data reaches a payor without a human sign-off.",
          "**SOC 2** for Enterprise.",
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
        text: "CredTek includes a **Specialty Workflow Library** for the cases generic platforms skip:",
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
    keywords: [
      "onboarding",
      "onboard",
      "implementation",
      "implement",
      "migrate",
      "migration",
      "modio",
      "spreadsheet",
      "spreadsheets",
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
        text: "**Live in 14 days** with white-glove onboarding — we do the heavy lifting:",
      },
      {
        t: "ul",
        items: [
          "We migrate your existing data from **Modio, CAQH, or spreadsheets**.",
          "We build a **golden profile** per provider with confidence scoring.",
          "A **dedicated CSM** runs weekly check-ins through your first 90 days.",
        ],
      },
      {
        t: "actions",
        items: [{ kind: "calendly", label: "Plan your onboarding" }],
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
        text: "That keeps provider rosters and enrollment status in sync with your system of record automatically.",
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
        text: "CredTek is built for **US medical groups, MSOs, health systems, IPAs, PE rollups, and payors** — anyone credentialing providers at scale.",
      },
      {
        t: "p",
        text: "It shines wherever provider volume, multi-state licensure, or M&A activity makes manual credentialing the bottleneck to revenue.",
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
    ],
    answer: [
      {
        t: "p",
        text: "CredTek is built by operators, not outsiders. The founding team brings **40+ years of combined enterprise credentialing experience** from **HCA Healthcare, UHS, Encompass Health, Select Medical, and Ascension** — spanning **700+ facilities and 80,000+ beds**.",
      },
      {
        t: "p",
        text: "Every workflow in the product reflects how credentialing actually breaks at scale — and how to fix it.",
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
        text: "The math is the pitch. Every credentialed-but-idle provider costs roughly **$2,000/day** in lost revenue.",
      },
      {
        t: "ul",
        items: [
          "A 200-provider group runs ~40 enrollments/year; slow credentialing costs them **$2–6M/year**.",
          "CredTek for that group is **~$96K/year** — a **20×+ return**.",
          "Most groups recover **$2M+ in year one** just by getting providers billing sooner.",
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
        text: "The difference is **agent-native**. Most platforms are databases with reminders — they organize the work but a human still does every step. CredTek's agents actually **do** the PSV, CAQH, and payor enrollment, then stop at a human approval gate.",
      },
      {
        t: "p",
        text: "That's why we can promise **40–60% faster** and **migrate you off Modio, CAQH, or spreadsheets in 14 days**.",
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
          "Pricing is **transparent and usage-based** ($35/provider/mo + $300/enrollment) — no surprise fees.",
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
          "**Interactive demo (no call):** we spin up CredTek with sample providers sized to your group, and a guided agent walks you through the dashboard.",
          "**Live demo with a credentialing veteran:** a 30-minute call to map it to your exact workflows.",
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
        text: "Hi! I'm the **CredTek assistant** — happy to help. I can explain how CredTek gets providers billing 40–60% faster, walk through pricing or security, or set you up with a demo.",
      },
      {
        t: "p",
        text: "What brought you in today?",
      },
      {
        t: "actions",
        items: [
          { kind: "topic", label: "How fast?", topicId: "speed" },
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
    text: "Good question — let me point you to the right place. I'm best at the essentials: **speed, pricing, the agents, payors, security, and getting a demo set up.**",
  },
  {
    t: "p",
    text: "Try one of these, or ask me anything about how CredTek works:",
  },
  {
    t: "actions",
    items: [
      { kind: "topic", label: "How fast?", topicId: "speed" },
      { kind: "topic", label: "Pricing", topicId: "pricing" },
      { kind: "topic", label: "Security", topicId: "security" },
      { kind: "calendly", label: "Talk to a human" },
    ],
  },
];
