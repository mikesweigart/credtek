# CredTek Outbound Playbook — Day-1 Edition

The goal of this playbook: **send 15 personalized emails before lunch tomorrow.**

It uses one trick most B2B founders miss — the CredTek calculator is **already URL-driven**. Every input is a query parameter. That means you can send a prospect a link to *their own* modeled ROI before they've even agreed to a demo. Most cold emails ask the prospect to do work. This one shows them their own numbers and asks them to react.

---

## Part 1 — The personalization URL recipe

The calculator accepts four query parameters. Anything you don't set defaults to the 200-provider model.

| Param | Meaning | Range |
|---|---|---|
| `p` | Active provider count | 20–500 |
| `n` | New providers per quarter | 1–40 |
| `d` | Current avg days to in-network | 45–180 |
| `l` | Lost revenue per idle provider per day | 500–5000 |

Anchor: append `#calc` so the page scrolls to the calculator on open.

### How to estimate the values for a prospect

You don't need their exact numbers — your *guess* is more interesting than no guess. The prospect will correct you if you're off, and you'll learn the real numbers in the process. That correction is itself a conversation.

**Active providers (`p`)** — LinkedIn says "201–500 employees." Multiply by ~0.6 for the clinician share. Or pull from their "About" page if they brag about the number.

**New per quarter (`n`)** — Use 5% of headcount quarterly as a reasonable growth rate. PE-backed groups: 10–15%. Mature groups: 2–3%.

**Current TTA (`d`)** — Use 90 unless you have a specific signal. Default industry assumption.

**Lost per day (`l`)** — Use $2,000 unless they're high-RVU (surgery, anesthesia, radiology), then $3,000–4,000. BH groups with 60-min sessions: $1,500.

### Examples

```
A 200-provider multi-specialty group, growing ~10/quarter, typical pain:
https://cred-tek.com/?p=200&n=10&d=90&l=2000#calc

A 350-provider PE-backed BH rollup, aggressive growth:
https://cred-tek.com/?p=350&n=20&d=100&l=1500#calc

A 90-provider radiology group:
https://cred-tek.com/?p=90&n=6&d=85&l=3500#calc

A 450-provider multi-state surgical MSO:
https://cred-tek.com/?p=450&n=15&d=95&l=4000#calc
```

Open one of those to confirm it loads with the right numbers.

---

## Part 2 — Where to find prospects

The CredTek ICP is **50–500 provider US medical groups**, growing 10%+/year, multi-state or planning to be. Some discovery angles, ranked by signal-to-noise:

### Highest signal

1. **Your partners' direct network.** The two co-founders have 40+ years between them in enterprise medical credentialing. They know dozens of operators. **One warm intro is worth twenty cold emails.** Make a list of every former colleague, vendor, and customer they can think of. Aim for 20 names this week.

2. **PE portfolio pages.** PE firms list their healthcare investments publicly. Search "[PE Firm Name] healthcare portfolio". A few worth scanning:
   - General Atlantic · Bain Capital · TPG · KKR · Blackstone · Welsh Carson · Audax · Leonard Green · Lindsay Goldberg
   - Healthcare-focused: Health Evolution, NMC Health Capital, BlueMountain, Welltower, Quad-C, NMS Capital
   - PE-backed BH-specific rollups historically: Refresh Mental Health (Geode), Mindpath, Headlight, Path Mental Health, Charlie Health, Pelago, BasePoint, Octave

3. **Modern Healthcare's annual lists.** "Top 25 Largest Medical Groups," "Top BH Groups," "Top Telehealth Companies." Filter to the 50–500 range. Free to read.

4. **Recent funding announcements.** Crunchbase or PitchBook filter: "Healthcare provider" + "Series A/B/C" + "$10M+". Companies that just raised need to deploy capital into growth — credentialing speed is one of the few things directly attributable to provider revenue.

### Medium signal

5. **LinkedIn Sales Navigator filters:**
   - Job title: "VP Network Operations" OR "Director of Credentialing" OR "Director of Network Operations" OR "Chief Credentialing Officer"
   - Industry: Hospital & Health Care OR Medical Practice OR Mental Health Care
   - Company size: 51–200 employees OR 201–500
   - Geography: US only
   - **Filter to "Posted in last 30 days"** for content signals (someone publicly venting about credentialing = perfect cold-email target)

6. **Industry publications.** *Behavioral Health Business*, *FierceHealthcare*, *Becker's Hospital Review*. Search for "credentialing" or "provider enrollment" mentions; the people quoted are buying-team adjacent.

7. **Healthcare conference attendee lists** (if you can get them): NATCON (BH), HIMSS, HLTH, JPMHC, MGMA Annual Conference, AAPL.

### Lower signal but useful at scale

8. **Apollo.io or ZoomInfo** filtered by ICP. Cold-outbound at scale, lower personalization quality.

---

## Part 3 — 15 target archetypes for tomorrow morning

I won't fabricate specific contact names (you should verify on LinkedIn). Use this as a starter set — find the matching person at each archetype, write a one-line opener using the signal column, and send the personalized calculator URL.

| # | Archetype | Search angle | Modeled prospect URL | One-line opener idea |
|---|---|---|---|---|
| 1 | 200-provider PE-backed BH rollup (Geode, Mindpath, Headlight tier) | LinkedIn: VP Network Ops at "Geode Health" / "Mindpath Health" / "Headlight Health" | `?p=350&n=20&d=100&l=1500` | "You're hiring fast — credentialing is usually the bottleneck nobody talks about" |
| 2 | 100-provider regional BH MSO (Charlie Health, BasePoint tier) | Director of Credentialing at smaller rollups | `?p=120&n=8&d=90&l=1800` | "Multi-state expansion means a new state board every quarter — we built for exactly this" |
| 3 | 80-provider multi-specialty primary care group (Aledade affiliate, Privia affiliate) | COO at value-based primary care groups | `?p=80&n=4&d=80&l=2200` | "Time-to-revenue per new PCP hire affects your value-based contracts more than people think" |
| 4 | 250-provider PE-backed surgical specialty (US Anesthesia Partners, US Acute Care Solutions tier) | VP Network Ops at PE-backed surgical specialty rollups | `?p=250&n=15&d=95&l=4000` | "High-RVU specialties lose more per idle day than anyone else — your CFO already knows this" |
| 5 | 180-provider multi-state telehealth (Cerebral, Done Health, Brightside tier) | Head of Operations | `?p=180&n=12&d=85&l=1800` | "30+ state license stacks are unmanageable in spreadsheets — and Modio doesn't solve it" |
| 6 | 120-provider radiology / cardiology group | Director of Credentialing | `?p=120&n=6&d=85&l=3500` | "Subspecialty privileging slows your already-slow credentialing — we handle both" |
| 7 | 300-provider IPA in growth state (TX, FL, NC, AZ) | VP Network Development | `?p=300&n=18&d=100&l=2500` | "If you're growing in [state], state-board PSV alone will be 30% of your coordinator's time" |
| 8 | 75-provider locum-tenens / staffing firm | Credentialing Manager | `?p=75&n=20&d=60&l=2000` | "Locum credentialing windows are the worst — we built specialty workflow templates for exactly this" |
| 9 | 200-provider ABA / autism services group | Director of Credentialing | `?p=200&n=15&d=110&l=1200` | "BCBA credentialing across state Medicaid MCOs is the worst-of-both-worlds — we know" |
| 10 | 150-provider womens' health / OB-GYN group | VP Operations | `?p=150&n=8&d=80&l=2800` | "Add a second state and your time-to-active doubles — until you've automated it" |
| 11 | 100-provider concierge / DTC primary care (Forward, Carbon, Crossover tier) | Head of Network | `?p=100&n=10&d=70&l=2500` | "Your growth depends on speed-to-active; credentialing is the silent gate" |
| 12 | 400-provider MSO managing multiple specialty groups | Chief Operating Officer | `?p=400&n=25&d=95&l=2200` | "MSO consolidation is brutal on credentialing — every specialty has different state-board rules" |
| 13 | 60-provider eating-disorder or SUD treatment program | Director of Credentialing | `?p=60&n=4&d=110&l=1500` | "Tier-of-care payor enrollment + supervision tracking — both broken in every tool we've seen" |
| 14 | 220-provider FQHC network | VP Operations | `?p=220&n=10&d=100&l=1800` | "Federal + state + payor credentialing layered = 4-month TTA. We compress it." |
| 15 | 90-provider rural / community mental health center | Executive Director / COO | `?p=90&n=5&d=120&l=1400` | "Single-state, multi-payor, limited budget — credentialing automation needs to fit YOU" |

---

## Part 4 — The 5-line email template

This is the email you actually send. Same skeleton for all 15 — only line 2 changes.

```
Subject: Credentialing modeled for [Company Name]

Hi [First Name],

[CUSTOM ONE-LINE OPENER from the archetype table]. Built a credentialing
platform that closes that exact gap — modeled the math against what I
estimated for your group: [PERSONALIZED URL].

40+ years of enterprise medical credentialing built into modern AI agents.
Old-school care from the founders, new-school technology where it actually
saves time.

Worth 20 minutes? https://calendly.com/mike-fusion-advisory/30min

— Mike
```

### Why this works

- **Subject line names them** — opens at 60%+ vs. generic subjects at ~22%
- **Opener is specific to their company archetype** — proves you didn't blast it
- **The URL has their modeled numbers already filled in** — they click, they see ~$2M in projected savings, they get curious
- **Soft positioning, not hard guarantee** — matches the new "faster than anyone" without committing to a number
- **Single CTA** — Calendly. No second ask.

### Don't do

- Don't send a long pitch. Five lines max.
- Don't attach a PDF in the first email. The personalized URL replaces the attachment.
- Don't promise specific timelines. "Faster than anyone" is the lane.
- Don't say "AI" in the subject line. Hospitals + medical groups are AI-fatigued.

---

## Part 5 — Cadence

| Day | Action |
|---|---|
| Day 0 | Send 15 personalized emails using the table above |
| Day 0 | LinkedIn connection request to each recipient with a one-line note ("Sent you an email earlier — would love to connect") |
| Day 3 | If no response: LinkedIn DM with the calculator URL only ("Hey [first name], modeled your group at [SAVINGS] — worth a quick look?") |
| Day 5 | Email follow-up: "Circling back — if credentialing isn't a priority right now, no worries; happy to disappear. Otherwise this is a real 20-min conversation, no slides." |
| Day 8 | Final touch — share a relevant insight ("Saw [company X] just expanded into TX — our state-board PSV agent for TX is the one most customers say earns the contract on its own.") |
| Day 14 | Stop. Add to 90-day re-engagement list. |

**Stop after day 14 if no response.** Re-add 90 days later with new context.

---

## Part 6 — Tracking

Use a Google Sheet for now. Columns:

| Date | Company | Contact | Title | Email | LinkedIn | URL sent | Response | Demo booked? | Notes |
|---|---|---|---|---|---|---|---|---|---|

When you hit 25 sent emails and >3 demos booked, the data tells you which archetypes convert. Double down on those. Drop the cold ones.

---

## What's NOT in this playbook (yet)

- Account-based marketing (LinkedIn ads to retarget the 15 prospects) — skip until 50+ outbound contacts
- Outbound calling — skip; cold calls in healthcare are sub-1% conversion
- Conferences and events — separate playbook; start with NATCON if BH-leaning
- Paid SEO — months 3-6
- Content marketing (blog, podcast) — months 6+

**This playbook only optimizes for the first 30 days of cold outbound. By week 4 we should have data and a real GTM motion to plan around.**
