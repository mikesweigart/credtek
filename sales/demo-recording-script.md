# CredTek 7-minute Demo Recording Script

For Mike (or a co-founder) to record once in Loom and link from `/demo-video`. The goal: a prospect can watch this on their commute and book a live walkthrough by the end of the day.

**Tools needed:** Loom (loom.com — free tier is fine). Webcam on, mic on. Don't over-rehearse — first-take energy converts better than polished.

**Pre-recording checklist** (60 seconds):

- [ ] Close Slack, email, and anything that could notify mid-record
- [ ] Open these tabs in this order, left to right:
  1. `https://cred-tek.com` (scrolled to top)
  2. `https://cred-tek.com/dashboard`
  3. `https://cred-tek.com/providers/aisha-patel?tab=supervision`
  4. `https://cred-tek.com/ops/queue`
  5. `https://cred-tek.com/ops/queue/01HZX7K3VNCP9TQA2X9MR4D5BV`
- [ ] In Loom, set: Camera "bubble" bottom-right, screen capture full-window, mic level test
- [ ] Drink water. Take one deep breath. Hit record.

**Loom chapters to set after recording** (use Loom's chapter feature):
- 0:00 Why we built CredTek
- 1:00 What your team sees Monday morning
- 2:20 The thing nobody else does
- 4:00 The back end your CVO partner uses
- 5:30 How we're different
- 6:30 Pricing and next steps

---

## SCENE 1 — Why we built it · 0:00–1:00

**On screen:** Tab 1, marketing site hero.

**Say (60 sec):**

> Hey, I'm Mike. I'm going to walk you through CredTek in about seven minutes. No slides — just the actual product, the way your team would use it Monday morning.
>
> Quick context on what we built and why. My co-founders have 40-plus years between them running enterprise medical credentialing — at health systems, at PE-backed rollups, designing delegated arrangements with major payors. They've watched every credentialing tool fail in the same predictable ways.
>
> The thing those tools have in common is that they were built by software people who've never filed a CAQH attestation. CredTek is the inverse: built by credentialing operators with twenty-plus years each, paired with AI agents that actually do the typing. Old-school care, new-school technology — and a coordinator approval gate on everything, so no AI hallucination ever reaches a payor.
>
> Let me show you what that looks like.

**Action:** Scroll slowly past the hero, pause briefly on the trust strip + founder section. Don't dwell.

---

## SCENE 2 — Monday morning · 1:00–2:20

**On screen:** Switch to Tab 2, `/dashboard`.

**Say (80 sec):**

> This is what your Director of Credentialing sees when they open CredTek on a Monday.
>
> Top-left, the morning summary: three items need approval, two licenses expiring in the next two weeks. The four KPIs are the ones your COO actually cares about — active providers, in-credentialing pipeline, average days to active, and what's expiring.
>
> Down here on the left, the provider pipeline — every clinician currently being credentialed, what stage they're in, what's blocking them.
>
> On the right, the live agent activity feed. This is what's running on your behalf in the background — primary-source verification, payor submissions, supervisor cosignature reminders, expiration tracking. Everything's logged, everything's auditable, and nothing leaves CredTek without somebody on your team clicking approve.

**Action:**
- Hover over one of the KPI tiles
- Hover over the first pipeline row
- Pause on the agent feed for a moment

> Let me click into one of these providers. The one I want to show you is the differentiator — the thing no other credentialing tool handles correctly.

**Action:** Click on **Aisha Patel** in the pipeline.

---

## SCENE 3 — The thing nobody else does · 2:20–4:00

**On screen:** Tab 3 should now be visible — `/providers/aisha-patel?tab=supervision`.

**Say (100 sec):**

> Aisha is an LPC-Associate in Texas — pre-licensed. She's working her supervised hours toward independent licensure. Texas requires 3,000 hours total, of which 1,500 have to be direct client contact, with cosignatures every session from a licensed supervisor, tracked against the specific TX board rules.
>
> Today, in most of your peers' groups, this is in a Google Sheet. The supervisor's assistant updates it on Fridays. It works until it doesn't — and then you're one audit away from a real problem.
>
> Here it is in CredTek. Real-time hours against the requirement. Direct client contact tracked separately from group hours. Supervisor cosignature status — this week, last week, every week. Quarterly evaluation tracking. Projected independent licensure date — your finance team can model FTE forward off this.
>
> And this is one specialty workflow. We've built equivalent depth for locum-tenens credentialing windows, hospital privileging re-applications, NPI changes during M&A reorganizations, NCQA delegated-credentialing audit binders. Every specialty's hardest credentialing workflow has a real surface in CredTek — not a spreadsheet you maintain on the side.

**Action:**
- Slowly scroll through the supervision tracker
- Pause on the progress bar, then the supervisor cosignature row, then the projected licensure date

---

## SCENE 4 — The back end · 4:00–5:30

**On screen:** Click the demo banner's "Switch to Ops view" link OR open Tab 4 (`/ops/queue`).

**Say (90 sec):**

> Now I want to show you the other half — what happens behind the customer experience. Most credentialing companies hide this. We show it on the demo because the integration architecture is part of why we're faster than anyone.
>
> This is the operations queue. Every Tier-4 work item — meaning the manual work that can't or shouldn't be automated. State board email verifications that take five business days. Payor escalation calls when a submission stalls. Notarized documents. Complex Medicaid MCO enrollments.
>
> Your CVO partner — or our internal ops team — works tickets here, against SLAs, with structured result capture that flows back to the customer-facing job.

**Action:** Click into one of the tickets.

> Each ticket has a sub-task checklist, a structured form for capturing results, an internal-notes thread, and audit logging on every action.

**Action:** Click the top-nav "Audit log."

> The audit log is hash-chained — every PHI access, every state transition, every external system call. SHA-256 of the previous row plus the canonical JSON of the current row. Tampering with any historical row breaks every subsequent hash, detectable in O(n).
>
> Nothing in this category is provided by anybody else.

**Action:** Click "Margin."

> And we track unit economics down to the per-integration level — what each action costs us to fulfill versus what the customer is charged. We don't expose this externally, but it means we make pricing decisions on data instead of vibes.

---

## SCENE 5 — Why we're different · 5:30–6:30

**On screen:** Click back to customer view (link in topbar). Navigate to `/compare`.

**Say (60 sec):**

> Quick framing on how we're different than what you've probably already evaluated.
>
> Modio is a tracker. It logs what's already credentialed; it doesn't actually do the credentialing.
>
> Symplr is built for five-thousand-provider hospital systems. The implementation is nine months, the contract starts at two hundred K, and you'd spend a year configuring it.
>
> Medallion is the closest competitor, but they were built around the simplest MD case and they're shallow on specialty depth — pre-licensed supervision, locum-tenens, M&A.
>
> CredTek is the modern, AI-native, specialty-deep platform built for the fifty-to-five-hundred provider mid-market. Old-school credentialing care from the founders, new-school technology where it actually saves time.

**Action:** Scroll through the comparison table for visual reinforcement, don't read it.

---

## SCENE 6 — Pricing + next step · 6:30–7:00

**On screen:** Scroll to `/#pricing` or screen-share the calculator section.

**Say (30 sec):**

> Pricing's three tiers — Starter for groups up to a hundred providers, Growth for the mid-market, and Enterprise for five-hundred plus, custom-quoted. Public pricing, posted on the site. Month-to-month with a thirty-day out clause for the first ninety days, so the only thing you're risking is finding out we're right.
>
> Take a real twenty minutes — I'll pull a sample of your providers, run them through CredTek live, and we'll talk through the ROI specifically for your group.
>
> Cred-tek dot com slash calc has a calculator that estimates your savings against your specific numbers. The link to book me is in the description of this video and at calendly dot com slash mike-fusion-advisory.
>
> Thanks for the seven minutes.

**Action:** End recording.

---

## Post-recording (5 min)

1. In Loom: set chapters at the timestamps above (Loom's chapter feature)
2. Set Loom thumbnail to the dashboard screenshot or the supervision tracker screenshot
3. Set Loom title: **"CredTek in 7 minutes — what your team sees Monday morning"**
4. Set Loom description (paste this):

```
A 7-minute walkthrough of CredTek — the credentialing platform built by
operators with 40+ years of enterprise medical credentialing experience.
For US medical groups, MSOs, and health systems running 50-500 providers.

Chapters:
0:00 Why we built CredTek
1:00 What your team sees Monday morning
2:20 The thing nobody else does (specialty workflow depth)
4:00 The back end your CVO partner uses
5:30 How we're different
6:30 Pricing and next steps

Book a live walkthrough: https://calendly.com/mike-fusion-advisory/30min
Explore the live demo yourself: https://cred-tek.com/dashboard
```

5. Copy the public Loom share URL.

6. **Open `app/demo-video/page.tsx`** in this repo. There's a single constant near the top: `const LOOM_URL = "REPLACE_ME"`. Paste your URL there, commit, push. Vercel redeploys in 90 seconds.

7. From this point on, drop the URL into every cold-outbound email, LinkedIn DM, and partner intro. It's your most leverageable sales asset.

---

## Tips for the recording itself

- **Don't read the script verbatim.** Read it twice out loud first, then improvise from the bullet points. First takes always sound more confident than rehearsed ones.
- **One full take, mistakes and all.** Edit only if you fumble for more than 3 seconds. Loom's trim tool handles small flubs fine.
- **Camera on.** Buyers want to see a person. Especially while talking about "old-school care."
- **Energy slightly higher than feels natural.** Recordings flatten your delivery — what feels animated in a Zoom looks subdued in a Loom.
- **Don't apologize for anything.** Don't say "sorry the mock data" or "ignore the demo banner." Treat the product like it's real because for the purpose of a walkthrough, it is.
- **Reshoot if it goes over 8 minutes.** Buyers click away after 8.

Good luck. Send the URL when it's up.
