// CredTek landing page.
//
// The body is rendered verbatim from the original artifact HTML so we keep
// pixel-parity with the version the team has already reviewed. The interactive
// pricing calculator is rendered as a real React component between the
// cost-of-inaction math and the 45-day guarantee — that's the section split
// you see below.

import { PricingCalculator } from "./_components/PricingCalculator";
import { TopNav } from "./_components/TopNav";
import { Hero } from "./_components/Hero";
import { StickyCTABar } from "./_components/StickyCTABar";

// FAQ structured data — Google rewards real FAQ schema with rich-result
// eligibility, and credentialing buyers literally Google these questions.
// Mirror the FAQ content in LANDING_BODY_POST_CALC so the visible answers
// and the structured data never drift apart.
const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How fast can we go live with CredTek?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "14 days from contract signing. White-glove onboarding migrates your existing data (Modio, CAQH, spreadsheets), imports your provider roster, sets up payor-portal credentials, and runs a live training session for your team. Your CSM is on weekly check-ins for the first 90 days.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to our existing credentialing data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We migrate it. CredTek's intake agent ingests Modio exports, CAQH data, and messy spreadsheets. Your golden profile populates automatically with confidence scoring — your coordinator approves anomalies.",
      },
    },
    {
      "@type": "Question",
      name: "Which medical specialties does CredTek support?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every US medical specialty. MD, DO, NP, PA, RN, pharmacy, psychology, social work, counseling, MFT, BCBA, dental — full state-board coverage. Specialty workflow library covers BH supervision, locum-tenens, hospital privileging, and M&A reorganizations.",
      },
    },
    {
      "@type": "Question",
      name: "Does CredTek integrate with our EHR?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, on the Enterprise tier. Native integrations with Epic, athenahealth, Cerner, eClinicalWorks, NextGen, AdvancedMD, Kareo/Tebra, DrChrono, and Practice Fusion. Two-way provider data sync.",
      },
    },
    {
      "@type": "Question",
      name: "How much does CredTek cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Three tiers. Starter and Growth are $35/provider/month + $300/enrollment action (volume discounts at 200+ providers). Enterprise (500+ providers) is custom. Month-to-month with a 30-day out clause for the first 90 days.",
      },
    },
  ],
};

const LANDING_BODY_PRE_CALC = `

<!-- ============== SOCIAL PROOF STRIP ============== -->
<section class="social-proof reveal" aria-label="Trust signal">
  <div class="container">
    <div class="social-proof-eyebrow">
      Built by operators who ran credentialing inside the largest US health systems
    </div>
    <div class="social-proof-row">
      <span class="sp-logo">HCA Healthcare</span>
      <span class="sp-dot" aria-hidden="true">·</span>
      <span class="sp-logo">Universal Health Services</span>
      <span class="sp-dot" aria-hidden="true">·</span>
      <span class="sp-logo">Encompass Health</span>
      <span class="sp-dot" aria-hidden="true">·</span>
      <span class="sp-logo">Select Medical</span>
      <span class="sp-dot" aria-hidden="true">·</span>
      <span class="sp-logo">Ascension</span>
    </div>
    <div class="social-proof-foot">
      Founders bring 40+ years of credentialing operations experience spanning
      <strong>700+ facilities</strong> and <strong>80,000+ beds</strong> nationwide.
    </div>
  </div>
</section>

<!-- ============== THE PLAN (3 STEPS) ============== -->
<section class="plan-section reveal" id="how">
  <div class="container">
    <span class="section-eyebrow">How it works</span>
    <h2>Three steps from <em>signed contract</em> to <em>providers billing.</em></h2>

    <ol class="plan-grid">
      <li class="plan-step">
        <div class="plan-step-num">1</div>
        <h3>See your numbers — today</h3>
        <p>Use the 60-second ROI calculator below. You&apos;ll know your projected savings before our first call.</p>
      </li>
      <li class="plan-step">
        <div class="plan-step-num">2</div>
        <h3>Talk to a credentialing veteran — this week</h3>
        <p>20 minutes, no slides. Bring your actual pain — we&apos;ve seen every failure mode firsthand.</p>
      </li>
      <li class="plan-step">
        <div class="plan-step-num">3</div>
        <h3>Onboard your roster — within 14 days</h3>
        <p>Your CSM gets your providers moving while you stay focused on running your practice.</p>
      </li>
    </ol>
  </div>
</section>

<!-- ============== PAIN SECTION ============== -->
<section class="section reveal" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">The problem</span>
    <h2>You already know <em>exactly</em> what this is.</h2>
    <p class="section-lead">Real quotes (paraphrased, with permission) from VPs of Network Operations and Directors of Credentialing in the last 90 days.</p>

    <div class="pain-grid">
      <div class="pain"><div class="q">"</div><div><div class="body">We added 80 providers last quarter and our team of 6 is drowning in CAQH attestations and renewals. We&apos;re losing clinicians to competitors who onboard faster.</div><div class="speaker">— VP, NETWORK OPS · 200-PROVIDER MULTI-SPECIALTY GROUP</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">Time-to-revenue per new provider is 90–120 days. Our CFO wants 45. Every day a credentialed provider sits idle is $2,000 of lost revenue.</div><div class="speaker">— CFO · PE-BACKED MEDICAL GROUP</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">Optum demanded delegated-credentialing documentation and we&apos;re not NCQA compliant. We&apos;re rebuilding files from scratch and it&apos;s costing us six figures.</div><div class="speaker">— DIRECTOR OF CREDENTIALING · MSO</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">Aetna&apos;s portal changed last month and our coordinator now spends two days a week just on resubmissions. Modio doesn&apos;t help us with this at all.</div><div class="speaker">— CREDENTIALING MANAGER · HEALTH SYSTEM</div></div></div>
    </div>

    <div class="pain-conclusion">
      For a 200-provider group with 10 new hires per quarter, slow credentialing costs <strong>$1.1M–$2.25M every year</strong> in revenue your providers <em>could</em> be earning if they were in-network.
    </div>
  </div>
</section>

<!-- ============== FROM THE FOUNDER — moved up to immediately answer "who built this?" after we've named the pain ============== -->
<section class="founder-section reveal">
  <div class="container">
    <div class="founder-grid">
      <div class="founder-content">
        <span class="section-eyebrow">From the founders</span>
        <h2>Why <em>we</em> built this.</h2>
        <p class="founder-p">
          We got tired of watching credentialing teams burn nights and
          weekends on spreadsheets, broken portals, and 30-payor data
          re-entry — only to lose providers anyway because the process
          still took three months.
        </p>
        <p class="founder-p">
          I&apos;m building CredTek with two co-founders who&apos;ve each
          spent <strong>20+ years inside enterprise medical credentialing
          programs</strong> at health systems like HCA, UHS, Encompass,
          Select Medical, and Ascension. They&apos;ve seen every failure
          mode of every competing tool firsthand, run credentialing
          through multi-billion-dollar M&amp;A reorganizations, and stood
          up delegated programs for major payors. They&apos;re staying
          unnamed until our public launch — you&apos;ll meet them on the
          demo.
        </p>
        <p class="founder-p">
          Together we built the platform we&apos;d want our own teams to
          use. If you run credentialing for a US medical practice, MSO, or
          health system, you&apos;ll recognize every pain point this
          product fights.
        </p>
        <div class="founder-sig">
          <div class="founder-sig-name">Mike Sweigart · founder</div>
          <div class="founder-sig-title">+ two co-founders · 40+ years combined enterprise medical credentialing</div>
        </div>
      </div>
      <div class="founder-photo">
        <img src="/mike-headshot.jpg" alt="Mike Sweigart, Founder of CredTek" />
        <div class="founder-photo-tag">
          <span class="founder-photo-dot">●</span>
          Built by operators
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============== CAPABILITIES GRID (compact, replaces old features 1+2) ============== -->
<section class="caps-section reveal">
  <div class="container">
    <span class="section-eyebrow">What you get on day one</span>
    <h2>The full credentialing stack — <em>not just tracking.</em></h2>
    <p class="section-lead">Every CredTek customer gets every capability below from day one. No feature gating, no &quot;contact sales for that module.&quot; The deep-dive on the next section shows the one thing other tools force you to spreadsheet.</p>

    <div class="caps-grid spotlight-group">
      <div class="caps-card spotlight-card">
        <div class="caps-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg></div>
        <h3>Multi-state license matrix</h3>
        <p>50 state boards across every specialty. Interstate compacts tracked (IMLC, NLC, PSYPACT, CC, SWC). 180-day expiration forecast with auto-drafted renewals.</p>
      </div>
      <div class="caps-card spotlight-card">
        <div class="caps-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1"></rect><path d="m9 14 2 2 4-4"></path></svg></div>
        <h3>Payor enrollment agents</h3>
        <p>Aetna · Anthem · Cigna · UHC · Humana · BCBS · Optum · Tricare + specialty networks + state Medicaid MCOs. Every submission goes through a coordinator&apos;s approval gate.</p>
      </div>
      <div class="caps-card spotlight-card">
        <div class="caps-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></div>
        <h3>CAQH auto-attestation</h3>
        <p>Every 120 days, automated against the provider&apos;s golden profile. Single-tap SMS approval from the provider. Never miss a window.</p>
      </div>
      <div class="caps-card spotlight-card">
        <div class="caps-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
        <h3>Primary-source verification</h3>
        <p>NPPES, OIG LEIE, SAM.gov, NPDB, DEA — continuous monitoring. State board PSV across all 50 states + every specialty board.</p>
      </div>
      <div class="caps-card spotlight-card">
        <div class="caps-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg></div>
        <h3>NCQA audit binder</h3>
        <p>One-click audit-ready evidence packet. Designed for delegated-credentialing arrangements with major payors (Optum, Aetna, Cigna).</p>
      </div>
      <div class="caps-card spotlight-card">
        <div class="caps-icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg></div>
        <h3>Tamper-evident audit log</h3>
        <p>Every PHI access, state transition, and external call hash-chained with SHA-256. Tampering breaks the chain — your auditors will love it.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============== DEEP-DIVE: SUPERVISION TRACKING (the differentiator) ============== -->
<section class="feature-section reveal" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <div class="feature-row">
      <div class="feature-content">
        <span class="section-eyebrow">Feature 03 · Specialty depth others skip</span>
        <h3>The workflows other tools <em>force you to spreadsheet.</em></h3>
        <p>Generic credentialing software handles the easy specialties. The hard ones — pre-licensed BH supervision, locum-tenens credentialing windows, hospital-privilege re-applications, NPI corrections during M&amp;A — all end up in spreadsheets. Then they break.</p>
        <p><strong>CredTek tracks them natively.</strong> Pictured: pre-licensed supervision for an LPC-Associate in Texas. State-specific rule engines per board, weekly hours logging with supervisor cosignature, auto-generated documentation at completion. <strong>One example of dozens — every specialty's hardest credentialing workflow has a real surface in CredTek.</strong></p>
        <ul>
          <li>BH supervision: state-specific rule engines for all 50 boards</li>
          <li>Locum-tenens: short-window credentialing with auto-expiry tracking</li>
          <li>Hospital privileging: privilege re-applications + DEA + COI tracking</li>
          <li>M&amp;A: NPI changes, group reassignments, payor revalidations</li>
          <li>NCQA delegated credentialing: one-click audit binders</li>
        </ul>
      </div>

      <!-- ============== SCREENSHOT: PROVIDER PROFILE WITH SUPERVISION ============== -->
      <div class="ss-wrap">
        <div class="screenshot">
          <div class="screenshot-chrome">
            <div class="ss-dot"></div><div class="ss-dot"></div><div class="ss-dot"></div>
            <div class="ss-url">app.credtek.com / providers / aisha-patel</div>
          </div>
          <div class="pp-app">
            <div class="pp-head">
              <div class="pp-av">AP</div>
              <div>
                <div class="pp-name">Aisha Patel, LPC-A</div>
                <div class="pp-meta">PRE-LICENSED · TX · NPI 1234567890</div>
              </div>
              <div class="pp-actions">
                <button class="pp-btn">Message</button>
                <button class="pp-btn primary">Run PSV ↻</button>
              </div>
            </div>
            <div class="pp-tabs">
              <div class="pp-tab">Overview</div>
              <div class="pp-tab">Licenses</div>
              <div class="pp-tab">Payors</div>
              <div class="pp-tab active">Supervision</div>
              <div class="pp-tab">Documents</div>
            </div>
            <div class="pp-body">
              <div class="pp-card" style="grid-column: span 2;">
                <h4>Supervision toward LPC · Texas</h4>
                <div style="font-size: 13px; color: var(--ink-soft); margin-bottom: 6px;">Tracking against TX state board requirements (3,000 hours, 1,500 direct client contact)</div>
                <div class="sup-bar"><div class="sup-fill" style="width: 61%;"></div></div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--muted); font-family: 'JetBrains Mono', monospace; margin-bottom: 14px;">
                  <span>1,840 / 3,000 HRS</span><span>61% COMPLETE</span>
                </div>
                <div class="sup-row"><span class="l">Supervisor</span><span class="v">Dr. Sarah Reyes, PsyD</span></div>
                <div class="sup-row"><span class="l">This week</span><span class="v">24 hrs · cosigned ✓</span></div>
                <div class="sup-row"><span class="l">Direct client contact</span><span class="v">962 / 1,500 hrs</span></div>
                <div class="sup-row"><span class="l">Group hours</span><span class="v">120 / 200 hrs</span></div>
                <div class="sup-row"><span class="l">Projected independent licensure</span><span class="v accent">September 2026</span></div>
              </div>
              <div class="pp-card">
                <h4>Recent activity</h4>
                <div style="font-size: 12px;">
                  <div style="padding: 6px 0; border-bottom: 1px dashed var(--line-soft);">
                    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);">APR 26 · 11:42 AM</div>
                    <div style="margin-top:2px;">24 hrs logged · Dr. Reyes cosigned</div>
                  </div>
                  <div style="padding: 6px 0; border-bottom: 1px dashed var(--line-soft);">
                    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);">APR 19 · 04:08 PM</div>
                    <div style="margin-top:2px;">Quarterly evaluation completed</div>
                  </div>
                  <div style="padding: 6px 0;">
                    <div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);">APR 12 · 02:30 PM</div>
                    <div style="margin-top:2px;">22 hrs logged · cosigned ✓</div>
                  </div>
                </div>
              </div>
              <div class="pp-card">
                <h4>Compliance check</h4>
                <div style="font-size: 12.5px;">
                  <div class="sup-row"><span class="l">TX board rules</span><span class="v" style="color:#4F6B58;">✓ On track</span></div>
                  <div class="sup-row"><span class="l">Cosignature current</span><span class="v" style="color:#4F6B58;">✓ Verified</span></div>
                  <div class="sup-row"><span class="l">Supervisor active</span><span class="v" style="color:#4F6B58;">✓ Licensed</span></div>
                  <div class="sup-row"><span class="l">Audit ready</span><span class="v" style="color:#4F6B58;">✓ Yes</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============== SPECIALTY PROOF STRIP — band of pills, slow marquee ============== -->
<section class="specialty-strip reveal">
  <div class="container">
    <div class="specialty-strip-inner">
      <span class="specialty-strip-lbl">Built for every US clinical specialty</span>
      <div class="specialty-pills-wrap">
        <div class="specialty-pills" aria-hidden="true">
          <span>MD &amp; DO</span>
          <span>NP &amp; PA</span>
          <span>RN · LPN</span>
          <span>Psychiatry</span>
          <span>Psychology</span>
          <span>LCSW · LPC · LMFT</span>
          <span>BCBA</span>
          <span>Pharmacy</span>
          <span>Dental &amp; DMD</span>
          <span>Optometry</span>
          <span>Anesthesia · CRNA</span>
          <span>PT · OT · SLP</span>
          <!-- duplicate set keeps the marquee seamless -->
          <span>MD &amp; DO</span>
          <span>NP &amp; PA</span>
          <span>RN · LPN</span>
          <span>Psychiatry</span>
          <span>Psychology</span>
          <span>LCSW · LPC · LMFT</span>
          <span>BCBA</span>
          <span>Pharmacy</span>
          <span>Dental &amp; DMD</span>
          <span>Optometry</span>
          <span>Anesthesia · CRNA</span>
          <span>PT · OT · SLP</span>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============== STACK THE VALUE ============== -->
<section class="section reveal" style="background: var(--paper); border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">Here's everything you get</span>
    <h2>Inside CredTek. <em>The full stack.</em></h2>
    <p class="section-lead">No feature-gating. Every customer on CredTek gets every capability — because depth, not artificial tiering, is how we win this market.</p>

    <div class="stack-block">
      <h3>What's <em>actually included</em> at $35/provider/month</h3>
      <p class="stack-block-sub">Seven capability bundles. Every one of them turned on for every customer from day one — no &quot;contact sales for that module&quot; games. Continuous monitoring (OIG · SAM · NPDB · DEA), unlimited users, and HIPAA-compliant document storage are table stakes and built in.</p>
      <ul class="stack-list">
        <li><span class="check">✓</span><span class="item-text"><strong>Intake &amp; Profile Agent</strong> — SMS/email provider invite, document OCR + LLM extraction, golden profile with confidence scoring and coordinator approval gate</span><span class="item-val">VALUE: $300/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>50-state PSV · every specialty</strong> — Medical, osteopathic, nursing, pharmacy, psychology, social work, counseling, MFT, BCBA, dental — plus compact eligibility (IMLC · NLC · PSYPACT · CC · SWC)</span><span class="item-val">VALUE: $500/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>Specialty workflow library</strong> — BH supervision tracking, locum-tenens windows, hospital privileging, M&amp;A NPI changes — the spreadsheet-killers</span><span class="item-val">VALUE: $400/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>Commercial &amp; specialty Payor Agents</strong> — Aetna · Anthem · Cigna · UHC · Humana · BCBS · Optum · Tricare · Carelon · Magellan · Evernorth · state Medicaid MCOs</span><span class="item-val">VALUE: $700/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>CAQH attestation + expirations engine</strong> — Every-120-day CAQH attestation with provider SMS approval, plus 180-day expiration forecast with auto-drafted renewals</span><span class="item-val">VALUE: $200/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>NCQA audit binder + tamper-evident log</strong> — One-click audit-ready evidence packet for delegated-credentialing. SHA-256 hash chain so tampering breaks the chain</span><span class="item-val">VALUE: $500/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>White-glove onboarding + dedicated CSM</strong> — Live in 14 days, weekly check-ins for 90 days, direct Slack channel to the founders</span><span class="item-val">VALUE: $750/mo</span></li>
      </ul>
      <div class="stack-total">
        <div class="lbl">Total comparable value:</div>
        <div class="val">$3,350 / month</div>
      </div>
      <div class="stack-total" style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 14px; margin-top: 4px;">
        <div class="lbl" style="color:white;font-weight:500;">Your price on CredTek:</div>
        <div class="val" style="font-size: clamp(36px, 5vw, 56px);">$35 / provider / month</div>
      </div>
    </div>
  </div>
</section>

<!-- ============== COST OF INACTION ============== -->
<section class="section reveal" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">The math you don't want to do</span>
    <h2>What slow credentialing <em>actually costs you.</em></h2>
    <p class="section-lead">Every month you stay on spreadsheets, Modio, or your current outsourced CVO, you're paying a tax. Here's the actual math for a 200-provider medical group.</p>

    <div class="coi-block">
      <h3>The cost of <em>doing nothing</em>.</h3>
      <p style="font-size: 16px; color: var(--ink-soft); margin-bottom: 8px;">Assume a 200-provider medical group, 10 new hires per quarter, 75-day average enrollment delay, $2,000/day in lost revenue per idle provider:</p>

      <div class="coi-math">
        <div class="calc">10 new providers × 4 quarters = <strong style="color:var(--ink);">40 enrollments / year</strong></div>
        <div class="calc">75 days idle × $2,000/day = <strong style="color:var(--ink);">$150,000 lost per provider</strong></div>
        <div class="calc">40 × $150,000 = <strong style="color:var(--ink);">$6,000,000 in lost annual revenue</strong></div>
        <div class="calc">+ Coordinator team of 6 × $75K loaded = <strong style="color:var(--ink);">$450,000 in ops cost</strong></div>
        <div class="calc">+ Outsourced CVO at $500/file × 40 = <strong style="color:var(--ink);">$20,000</strong></div>
        <span class="total">→ True annual cost of slow credentialing: $6,470,000</span>
        <span class="vs">→ CredTek annual cost (200 providers, 40 enrollments): $96,000</span>
      </div>

      <div class="coi-roi">CredTek customers typically cut time-to-revenue by <strong>40-60%</strong>. Even on the conservative end of that range, a 200-provider group recovers <strong>$2M+ in revenue in year one</strong> — a <strong>20×+ return</strong> on the CredTek subscription. Bigger gains when the inputs are clean.</div>
    </div>
  </div>
</section>
`;

const LANDING_BODY_POST_CALC = `
<!-- ============== WHY NO ONE DOES IT BETTER ============== -->
<section class="section reveal" id="why-us" style="background: var(--paper); border-top: 1px solid var(--line);">
  <div class="container container-narrow">
    <span class="section-eyebrow">Why no one does it better</span>
    <h2>Old-school care. <em>New-school technology.</em></h2>
    <p class="section-lead">Most credentialing software is built by software people who&apos;ve never filed a CAQH attestation. Most services firms are run by ops people who&apos;ve never built a system. CredTek is the rare combination.</p>

    <div class="why-us-grid">
      <div class="why-us-card">
        <div class="why-us-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg></div>
        <h3>Agents that actually do the work</h3>
        <p>Real Playwright-driven agents fill Aetna, Anthem, Optum, and Cigna forms end-to-end. <strong>Every submission gets a coordinator&apos;s approval before it leaves CredTek</strong> — no AI-hallucinated data ever reaches a payor.</p>
      </div>
      <div class="why-us-card">
        <div class="why-us-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
        <h3>A team that calls you back</h3>
        <p>Named CSM, weekly check-ins for 90 days, direct Slack access to the founders. When inputs are messy — and they always are — we work the problem <em>with</em> you, not around you.</p>
      </div>
      <div class="why-us-card">
        <div class="why-us-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>
        <h3>40–60% faster</h3>
        <p>Industry average is 90–120 days from hire date to first in-network payor. CredTek customers typically beat that by half. We don&apos;t need perfect inputs to do it.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============== STAKES — what changes when you fix this ============== -->
<section class="stakes-section reveal">
  <div class="container container-narrow">
    <span class="section-eyebrow">What changes</span>
    <h2>Two paths.<br/><em>One of them ends in your providers billing.</em></h2>

    <div class="stakes-grid">
      <div class="stakes-card stakes-failure">
        <div class="stakes-tag">Without CredTek</div>
        <ul>
          <li>$2–6M in lost revenue every year</li>
          <li>New hires sitting idle for 90–120 days</li>
          <li>Coordinators quitting from burnout</li>
          <li>Providers leaving for groups that onboard faster</li>
          <li>One bad NCQA audit away from a real problem</li>
          <li>Your CFO can&apos;t model when the next 20 hires start billing</li>
        </ul>
      </div>
      <div class="stakes-card stakes-success">
        <div class="stakes-tag">With CredTek</div>
        <ul>
          <li>Providers billing 40–60% faster</li>
          <li>Coordinators on strategy, not data entry</li>
          <li>Predictable time-to-revenue your CFO models accurately</li>
          <li>Audit-ready every day, not just at audit time</li>
          <li>Delegated-credentialing relationships with major payors</li>
          <li>Your team focuses on patients — not portals</li>
        </ul>
      </div>
    </div>

    <div class="stakes-transform">
      Your credentialing team stops being <strong>firefighters</strong> and
      becomes <strong>strategists</strong>. That's the real transformation —
      the same people, freed from the portal grind, finally doing the work
      only they can do.
    </div>
  </div>
</section>

<!-- ============== PRICING ============== -->
<section class="section reveal" id="pricing" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">Pricing · No "contact us" games (until you need to)</span>
    <h2>Three tiers. <em>Two posted publicly.</em></h2>
    <p class="section-lead">Most competitors hide pricing behind a "schedule a demo" form. We don't — Starter and Growth are public, so any COO can model the math on a napkin in 30 seconds. Enterprise is custom because at 500+ providers your needs are too specific for a posted number.</p>

    <div class="price-grid-3">
      <div class="price-card">
        <div class="price-tag">Starter</div>
        <div class="price-desc">1–99 active providers · solo practices, small groups, single-state</div>
        <div class="price-amount"><em>$35</em></div>
        <div class="price-unit">per provider · per month<br/>+ $300 per enrollment action</div>
        <ul>
          <li>All 7 AI agents</li>
          <li>50-state board PSV · every specialty</li>
          <li>Multi-state license dashboard</li>
          <li>CAQH automation</li>
          <li>Expirations management</li>
          <li>NCQA audit binder</li>
          <li>Unlimited users</li>
          <li>Email support</li>
          <li>White-glove onboarding · 14 days</li>
        </ul>
        <a class="price-cta" href="https://calendly.com/mike-fusion-advisory/30min" target="_blank" rel="noopener">Book a demo →</a>
      </div>
      <div class="price-card featured">
        <div class="price-ribbon">Most popular</div>
        <div class="price-tag">Growth · most common</div>
        <div class="price-desc">100–499 active providers · multi-state groups, MSOs, PE rollups</div>
        <div class="price-amount"><em>$35</em></div>
        <div class="price-unit">per provider · per month<br/>+ $300 per enrollment action · volume discounts at 200+</div>
        <ul>
          <li>Everything in Starter, plus:</li>
          <li>Specialty workflow library (BH supervision, locum, M&amp;A)</li>
          <li>Delegated-credentialing support &amp; audit prep</li>
          <li>Priority Slack-channel support</li>
          <li>Dedicated CSM</li>
          <li>Quarterly business reviews</li>
          <li>Custom payor agent requests (1/quarter)</li>
          <li>Volume discount: 10% off enrollments at 200+ providers</li>
        </ul>
        <a class="price-cta" href="https://calendly.com/mike-fusion-advisory/30min" target="_blank" rel="noopener">Book a demo →</a>
      </div>
      <div class="price-card enterprise">
        <div class="price-tag">Enterprise</div>
        <div class="price-desc">500+ active providers · health systems, IPAs, payors</div>
        <div class="price-amount"><em>Custom</em></div>
        <div class="price-unit">tailored to your roster, integrations, and SLAs</div>
        <ul>
          <li>Everything in Growth, plus:</li>
          <li>EHR / PMS integrations (Epic, Athena, Cerner, eClinical, etc.)</li>
          <li>Delegated implementation team</li>
          <li>Named CSM + named technical owner</li>
          <li>SOC 2 attestation + custom BAA addenda</li>
          <li>Custom SLAs &amp; financial guarantees</li>
          <li>Unlimited custom payor agents</li>
          <li>Multi-tenant / multi-entity hierarchy</li>
          <li>Dedicated onboarding sprint</li>
        </ul>
        <a class="price-cta" href="https://calendly.com/mike-fusion-advisory/30min" target="_blank" rel="noopener">Book a demo →</a>
      </div>
    </div>

    <div style="margin-top: 28px; padding: 20px 24px; background: var(--cream); border: 1px solid var(--line); border-radius: 14px;">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="serif" style="font-size:22px;font-style:italic;">Modeling a 200-provider medical group on Growth</div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px;">Multi-state, mix of specialties, ~40 enrollments/year</div>
        </div>
        <div style="text-align:right;">
          <div class="serif" style="font-size:36px;letter-spacing:-0.01em;">~$96K<span style="color:var(--muted);font-size:18px;"> / year</span></div>
          <div style="font-size:12px;color:var(--gold-deep);font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;font-weight:600;">VS. ~$6.4M IN LOST REVENUE + INTERNAL OPS</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============== ONBOARDING SHOWCASE ============== -->
<section class="section reveal" id="onboarding" style="border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">Onboarding, the easy way</span>
    <h2>Get your whole roster in — <em>in minutes, not weeks.</em></h2>
    <p class="onb-sub">Two ways to start. Fill out a guided intake yourself, or hand us a spreadsheet and we&apos;ll enter every provider for you. Either way you&apos;re scoped within one business day.</p>

    <div class="onb-grid">
      <div class="onb-card">
        <div class="onb-badge">Most popular</div>
        <div class="onb-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"/></svg>
        </div>
        <h3 class="onb-card-title">Fill out the guided form</h3>
        <p class="onb-card-desc">Add each provider with live NPI validation, pick the states you need to bill in, and select the payors to enroll with. Save and resume anytime.</p>
        <ul class="onb-list">
          <li>Live NPI check as you type</li>
          <li>All 50 states &amp; territories</li>
          <li>Every major payor, grouped</li>
        </ul>
        <a class="onb-cta" href="/get-started">Start the form <span class="arrow">→</span></a>
      </div>

      <div class="onb-card">
        <div class="onb-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 16V4M7 9l5-5 5 5M5 20h14"/></svg>
        </div>
        <h3 class="onb-card-title">Upload a roster — we&apos;ll enter it</h3>
        <p class="onb-card-desc">Already have a spreadsheet? Send Excel, CSV, Google Sheet, or PDF and our credentialing team keys in every provider and validates each NPI — for a nominal concierge fee.</p>
        <ul class="onb-list">
          <li>$99 per 25 providers · waived on annual plans</li>
          <li>We validate every NPI &amp; flag duplicates</li>
          <li>Your data lands straight in CredTek</li>
        </ul>
        <a class="onb-cta" href="/get-started">Upload a roster <span class="arrow">→</span></a>
      </div>
    </div>

    <div class="onb-flow">
      <div class="onb-step"><span class="onb-step-n">1</span><div class="onb-step-body"><strong>You submit</strong><span>Guided form or roster — about 3 minutes.</span></div></div>
      <div class="onb-step"><span class="onb-step-n">2</span><div class="onb-step-body"><strong>We scope &amp; sign a BAA</strong><span>A coordinator confirms within one business day.</span></div></div>
      <div class="onb-step"><span class="onb-step-n">3</span><div class="onb-step-body"><strong>Verification &amp; enrollment begin</strong><span>State boards, NPDB, OIG, SAM, DEA, payors.</span></div></div>
      <div class="onb-step"><span class="onb-step-n">4</span><div class="onb-step-body"><strong>You watch it move</strong><span>Every stage to billable, in real time.</span></div></div>
    </div>
  </div>
</section>

<!-- ============== FAQ ============== -->
<section class="section reveal" id="faq" style="background: var(--paper); border-top: 1px solid var(--line);">
  <div class="container container-narrow">
    <span class="section-eyebrow">Everything else you're wondering</span>
    <h2>Honest answers to <em>actual questions</em>.</h2>

    <div class="faq">
      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> How fast can we go live?</div>
        <div class="faq-a"><strong>14 days from contract signing.</strong> White-glove onboarding migrates your existing data (Modio, CAQH, spreadsheets), imports your provider roster, sets up payor-portal credentials, and runs a live training session for your team. Your CSM is on weekly check-ins for the first 90 days.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What happens to our existing data?</div>
        <div class="faq-a">We migrate it. CredTek&apos;s intake agent ingests Modio exports, CAQH data, and messy spreadsheets. Your golden profile populates automatically with confidence scoring — your coordinator approves anomalies. <strong>You don&apos;t redo months of work.</strong></div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> Which specialties does CredTek support?</div>
        <div class="faq-a"><strong>Every US medical specialty.</strong> MD, DO, NP, PA, RN, pharmacy, psychology, social work, counseling, MFT, BCBA, dental — full state-board coverage. Specialty workflow library goes deepest on the hard ones generic tools force you to spreadsheet (BH supervision, locum-tenens, hospital privileging, M&amp;A reorganizations).</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> Do you integrate with our EHR?</div>
        <div class="faq-a"><strong>Yes — on the Enterprise tier.</strong> Native integrations with Epic, athenahealth, Cerner, eClinicalWorks, NextGen, AdvancedMD, Kareo/Tebra, DrChrono, and Practice Fusion. Two-way provider data sync. Full list at <a href="/integrations" style="color: var(--blue); text-decoration: underline;">/integrations</a>.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What if we&apos;re not ready to switch our entire system?</div>
        <div class="faq-a">You don&apos;t have to. Run CredTek alongside your current process — onboard a subset of providers, see how fast we move them through, then expand. Month-to-month with a 30-day out clause for the first 90 days. The only risk is finding out we&apos;re right.</div>
      </div>
    </div>
  </div>
</section>

<!-- ============== FINAL CTA ============== -->
<section class="final-cta reveal" id="cta">
  <div class="final-cta-inner">
    <h2>Stop losing money on providers <em>who can&apos;t bill yet.</em></h2>
    <p>20 minutes with a credentialing veteran. We pull a sample of your providers, run them through CredTek live, and show you the ROI for your group specifically. No slides. No fluff.</p>
    <div class="final-cta-btns">
      <a class="btn-primary" href="https://calendly.com/mike-fusion-advisory/30min" target="_blank" rel="noopener">Talk to us <span class="arrow">→</span></a>
      <a class="btn-secondary" href="#calc">See your numbers first</a>
    </div>
    <div class="final-meta">→ MONTH-TO-MONTH · LIVE IN 14 DAYS · 40+ YEARS OF CREDENTIALING EXPERIENCE</div>
  </div>
</section>

<!-- ============== FOOTER ============== -->
<footer>
  <div class="footer-inner">
    <div class="logo">
      <div class="logo-mark">C</div>
      <span style="font-family:'Instrument Serif',serif;font-style:italic;font-size:22px;">CredTek</span>
    </div>
    <div class="footer-meta">
      US medical credentialing platform · 2026
    </div>
  </div>
</footer>
`;

export default function Page() {
  return (
    <>
      <TopNav />
      <Hero />
      <div dangerouslySetInnerHTML={{ __html: LANDING_BODY_PRE_CALC }} />
      <PricingCalculator />
      <div dangerouslySetInnerHTML={{ __html: LANDING_BODY_POST_CALC }} />
      <StickyCTABar />
      {/* FAQ structured data — picked up by Google for rich results. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
    </>
  );
}
