// CredTek landing page.
//
// The body is rendered verbatim from the original artifact HTML so we keep
// pixel-parity with the version the team has already reviewed. When we add
// real interactivity (demo-booking form, analytics, A/B variants) we'll
// extract the relevant section into a real React component instead of
// converting the whole page to JSX.

const LANDING_BODY = `
<!-- ============== TOP NAV ============== -->
<nav class="topnav">
  <div class="topnav-inner">
    <div class="logo">
      <div class="logo-mark">C</div>
      <span>CredTek</span>
    </div>
    <div class="topnav-links">
      <a href="#how">How it works</a>
      <a href="#pricing">Pricing</a>
      <a href="#guarantee">Guarantee</a>
      <a href="#faq">FAQ</a>
      <a href="/dashboard" class="topnav-link-demo">Live demo →</a>
    </div>
    <a class="topnav-cta" href="#cta">Book a demo →</a>
  </div>
</nav>

<!-- ============== HERO ============== -->
<section class="hero">
  <div class="container">
    <div class="hero-inner">
      <div>
        <div class="hero-eyebrow">→ For behavioral health groups · 50–500 providers</div>
        <h1>Get your behavioral health providers <em>in-network in 45 days.</em><br/><span class="strike">Not 120.</span></h1>
        <p class="hero-sub">CredTek is the AI-agent-native credentialing platform purpose-built for behavioral health groups. Cut time-to-revenue by 67%, eliminate the spreadsheets, and pass your next NCQA audit in an afternoon — <strong>without adding a single coordinator.</strong></p>
        <div class="hero-cta">
          <a class="btn-primary" href="#cta">Book a 20-min demo <span class="arrow">→</span></a>
          <a class="btn-secondary" href="#how">See how it works</a>
        </div>
        <div class="hero-trust">
          <span class="dot">●</span> <strong>HIPAA compliant</strong> &nbsp;·&nbsp; <span class="dot">●</span> <strong>NCQA-aligned</strong> &nbsp;·&nbsp; <span class="dot">●</span> <strong>BAA on day one</strong>
        </div>

        <div class="hero-metrics">
          <div class="hero-metric">
            <div class="num"><em>45</em></div>
            <div class="lbl">Avg days to first revenue</div>
          </div>
          <div class="hero-metric">
            <div class="num"><em>67%</em></div>
            <div class="lbl">Coordinator time saved</div>
          </div>
          <div class="hero-metric">
            <div class="num"><em>50</em></div>
            <div class="lbl">State BH boards covered</div>
          </div>
        </div>
      </div>

      <!-- ============== HERO SCREENSHOT: MAIN DASHBOARD ============== -->
      <div class="screenshot">
        <div class="screenshot-chrome">
          <div class="ss-dot"></div><div class="ss-dot"></div><div class="ss-dot"></div>
          <div class="ss-url">app.credtek.com / dashboard</div>
        </div>
        <div class="app-dash">
          <div class="sidebar">
            <div class="sb-logo">
              <div class="sb-logo-mark">C</div>
              <div class="sb-logo-text">CredTek</div>
            </div>
            <div class="sb-section">Workspace</div>
            <div class="sb-item active">▣ Dashboard</div>
            <div class="sb-item">◯ Providers <span class="badge">214</span></div>
            <div class="sb-item">◇ Pipeline <span class="badge">31</span></div>
            <div class="sb-item">▤ Payors</div>
            <div class="sb-item">⚐ Licenses</div>
            <div class="sb-section">Agents</div>
            <div class="sb-item">⚙ PSV Agent</div>
            <div class="sb-item">⚙ Enrollment</div>
            <div class="sb-item">⚙ Supervision</div>
            <div class="sb-section">Compliance</div>
            <div class="sb-item">▤ NCQA Binder</div>
            <div class="sb-item">▤ Reports</div>
          </div>
          <div class="main">
            <div class="topbar">
              <div class="search">⌕ Search providers, payors…</div>
              <div class="topbar-actions">
                <span style="font-size:11px;color:var(--muted);">⌘K</span>
                <div class="av">MD</div>
              </div>
            </div>
            <div class="content">
              <div class="greet">
                <h2>Good morning, Marisol.</h2>
                <p>3 items need approval · 2 expirations in 14 days</p>
              </div>
              <div class="stats">
                <div class="stat"><div class="lbl">Active</div><div class="val"><em>214</em></div><div class="delta up">↑ 12</div></div>
                <div class="stat"><div class="lbl">Pipeline</div><div class="val">31</div><div class="delta up">↑ 8</div></div>
                <div class="stat"><div class="lbl">Avg Days</div><div class="val"><em>42</em></div><div class="delta up">↓ 47</div></div>
                <div class="stat"><div class="lbl">Expiring</div><div class="val">7</div><div class="delta flag">⚐</div></div>
              </div>
              <div class="grid">
                <div class="panel">
                  <div class="panel-head"><h3>Pipeline</h3><span class="filt">31 →</span></div>
                  <div class="prow">
                    <div class="pav">SR</div>
                    <div class="pinfo"><div class="pname">Dr. Sarah Reyes, PsyD</div><div class="pmeta">PSYPACT · Psychologist</div></div>
                    <div class="pstates">TX·FL·GA</div>
                    <div class="pstat s-active">Active</div>
                  </div>
                  <div class="prow">
                    <div class="pav">JM</div>
                    <div class="pinfo"><div class="pname">James Mitchell, LCSW</div><div class="pmeta">Optum · Day 12</div></div>
                    <div class="pstates">CA·OR</div>
                    <div class="pstat s-pending">Enrolling</div>
                  </div>
                  <div class="prow">
                    <div class="pav">AP</div>
                    <div class="pinfo"><div class="pname">Aisha Patel, LPC-A</div><div class="pmeta">1,840 / 3,000 hrs</div></div>
                    <div class="pstates">TX</div>
                    <div class="pstat s-pending">Supervision</div>
                  </div>
                  <div class="prow">
                    <div class="pav">DK</div>
                    <div class="pinfo"><div class="pname">Dr. Daniel Kim, MD</div><div class="pmeta">CA license expiring</div></div>
                    <div class="pstates">CA·NV</div>
                    <div class="pstat s-flag">21 days</div>
                  </div>
                </div>
                <div class="panel">
                  <div class="panel-head"><h3>Agents</h3><span class="filt">Live</span></div>
                  <div class="feed">
                    <div class="ev"><div class="ev-dot gold"></div><div><div class="ev-text"><strong>Approval needed</strong> — Optum submission for J. Mitchell</div><div class="ev-time">2 MIN AGO</div></div></div>
                    <div class="ev"><div class="ev-dot"></div><div><div class="ev-text"><strong>PSV</strong> verified TX LPC license · 99.4%</div><div class="ev-time">14 MIN AGO</div></div></div>
                    <div class="ev"><div class="ev-dot danger"></div><div><div class="ev-text"><strong>Expiring</strong> D. Kim CA license · 21 days</div><div class="ev-time">1 HR AGO</div></div></div>
                    <div class="ev"><div class="ev-dot"></div><div><div class="ev-text"><strong>Supervision</strong> 24 hrs logged · A. Patel</div><div class="ev-time">3 HR AGO</div></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============== PAIN SECTION ============== -->
<section class="section" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">If you run BH credentialing, this is your week</span>
    <h2>You already know <em>exactly</em> what this is.</h2>
    <p class="section-lead">Direct quotes (paraphrased, with permission) from VPs of Network Operations and Directors of Credentialing at 50–500 provider behavioral health groups in the last 90 days.</p>

    <div class="pain-grid">
      <div class="pain"><div class="q">"</div><div><div class="body">We added 80 providers last quarter and our credentialing team of 6 is drowning in CAQH attestations and license renewals. We're losing providers to competitors who onboard faster.</div><div class="speaker">— VP, NETWORK OPS · 200-PROVIDER ROLLUP</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">We just expanded into three new states and we don't even know what we don't know about each state's BH license requirements. Every state board has its own quirks.</div><div class="speaker">— COO · TELEHEALTH BH STARTUP</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">Our pre-licensed clinicians' supervision hours are in a Google Sheet that the supervisor's assistant maintains. We're one audit away from a serious problem.</div><div class="speaker">— DIRECTOR OF CLINICAL OPS</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">Optum demanded delegated credentialing documentation for our network and we're not NCQA compliant. We're rebuilding files from scratch and it's costing us six figures.</div><div class="speaker">— DIRECTOR OF CREDENTIALING</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">Time-to-revenue per new provider is 90–120 days. Our CFO wants 45. Every day a credentialed provider sits idle is $2,000 of lost revenue.</div><div class="speaker">— CFO · PE-BACKED BH GROUP</div></div></div>
      <div class="pain"><div class="q">"</div><div><div class="body">Carelon's portal changed last month and our coordinator now spends two days a week just on Carelon submissions. Modio doesn't help us with this at all.</div><div class="speaker">— CREDENTIALING MANAGER</div></div></div>
    </div>

    <div class="pain-conclusion">
      Every day this stays broken, you're losing <strong>$1,500–$3,000 per provider per day</strong> in revenue your providers <em>could</em> be earning if they were in-network.
      <br/><br/>For a 200-provider group, with 10 new hires per quarter, that's <strong>$1.1M–$2.25M evaporating every year.</strong>
    </div>
  </div>
</section>

<!-- ============== WHY NOTHING HAS WORKED ============== -->
<section class="section" id="how" style="background: var(--paper);">
  <div class="container">
    <span class="section-eyebrow">Why nothing has worked</span>
    <h2>Modio. Spreadsheets. Symplr. <br/>Here's why <em>none of them</em> fix this.</h2>
    <p class="section-lead">Every credentialing tool on the market was built for one of two scenarios: tiny solo practices, or enterprise hospital systems. <strong>Mid-market behavioral health groups have been ignored for a decade.</strong> Here's what that looks like in practice.</p>

    <div class="why-grid">
      <div class="why-card">
        <div class="x">✕</div>
        <h4>Modio is a glorified spreadsheet</h4>
        <p>It tracks credentials. It doesn't <em>do</em> credentialing. Reviewers consistently complain it doesn't sync with state boards, lacks real PSV depth, and has no NCQA accreditation. Their "automated payor enrollment" is a checklist with email reminders.</p>
      </div>
      <div class="why-card">
        <div class="x">✕</div>
        <h4>Symplr & CredentialStream are enterprise tools</h4>
        <p>9-month implementations. $200K+ contracts. Built for 5,000-provider hospital systems, not 200-provider BH groups. They'll happily sell to you. Then you'll spend a year configuring it and still need an outside CVO.</p>
      </div>
      <div class="why-card">
        <div class="x">✕</div>
        <h4>Medallion ignores behavioral health</h4>
        <p>Designed around the MD use case. Doesn't handle pre-licensed supervision tracking. Doesn't have specialized agents for Optum/UBH, Carelon, or Magellan. Their pricing is steep and their roadmap won't reach you.</p>
      </div>
      <div class="why-card">
        <div class="x">✕</div>
        <h4>Spreadsheets break at 50 providers</h4>
        <p>The supervisor's assistant who maintains your supervision tracker is going to leave. Your CAQH renewal calendar is in someone's Outlook. Your audit trail is screenshots in a SharePoint folder. You know this isn't sustainable.</p>
      </div>
      <div class="why-card">
        <div class="x">✕</div>
        <h4>Outsourced CVOs charge per provider</h4>
        <p>$300–$800 per file, plus retainer. They're a black box — you can't see what's happening until it's done. They don't help with multi-state licensure, supervision, or payor enrollment. And you still need internal coordinators.</p>
      </div>
      <div class="why-card">
        <div class="x">✕</div>
        <h4>None of them are AI-native</h4>
        <p>"AI" features in incumbents are chatbots bolted onto CRUD apps. CredTek is the inverse: agents at the core, with a human approval UI on top. The 2026 architecture <strong>cannot</strong> be retrofitted into a 2014 product.</p>
      </div>
    </div>
  </div>
</section>

<!-- ============== FEATURE 1: MULTI-STATE LICENSE GRID ============== -->
<section class="feature-section" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <div class="feature-row">
      <div class="feature-content">
        <span class="section-eyebrow">Feature 01 · Multi-state command</span>
        <h3>See <em>every license</em>, in every state, for every provider — on one screen.</h3>
        <p>If you operate in 10+ states, you're tracking thousands of licenses. PSYPACT, Counseling Compact, Social Work Compact eligibility. State-specific renewal cycles. Expirations creeping up across 50 jurisdictions.</p>
        <p><strong>CredTek's License Grid</strong> shows you everything in a single view. Filter by provider, state, license type, expiration window, or compact eligibility. One click to launch a renewal. One click to forecast which states a provider qualifies in via compact vs. needs a standalone license.</p>
        <ul>
          <li>50 state BH boards with maintained scrapers (psychology, social work, counseling, MFT, psychiatry, BCBA)</li>
          <li>PSYPACT · Counseling Compact · SW Compact eligibility tracker</li>
          <li>180-day expiration forecast with auto-drafted renewal applications</li>
          <li>State-specific quirks built in (CA BBS, NY, FL, TX, every state we cover)</li>
        </ul>
      </div>

      <!-- ============== SCREENSHOT: LICENSE GRID ============== -->
      <div class="ss-wrap">
        <div class="screenshot">
          <div class="screenshot-chrome">
            <div class="ss-dot"></div><div class="ss-dot"></div><div class="ss-dot"></div>
            <div class="ss-url">app.credtek.com / licenses / matrix</div>
          </div>
          <div class="license-grid-app">
            <div class="lga-head">
              <div>
                <div class="lga-title">License Matrix · 214 providers</div>
                <div class="lga-meta" style="margin-top:4px;">UPDATED 2 MIN AGO</div>
              </div>
              <div class="pstat s-active" style="font-size:10px;padding:4px 10px;">All current</div>
            </div>
            <div class="lga-legend">
              <span><span class="swatch" style="background:var(--ink);"></span> Licensed</span>
              <span><span class="swatch" style="background:rgba(123,158,137,0.3);border:1px solid rgba(123,158,137,0.5);"></span> Compact eligible</span>
              <span><span class="swatch" style="background:rgba(201,146,61,0.2);border:1px solid rgba(201,146,61,0.5);"></span> In progress</span>
              <span><span class="swatch" style="background:rgba(184,85,63,0.15);border:1px solid rgba(184,85,63,0.5);"></span> Expiring &lt;30d</span>
            </div>
            <div class="state-grid">
              <div class="state-cell licensed">CA</div>
              <div class="state-cell licensed">TX</div>
              <div class="state-cell licensed">FL</div>
              <div class="state-cell expiring">NY</div>
              <div class="state-cell licensed">PA</div>
              <div class="state-cell licensed">IL</div>
              <div class="state-cell compact">OH</div>
              <div class="state-cell compact">GA</div>
              <div class="state-cell compact">NC</div>
              <div class="state-cell licensed">MI</div>
              <div class="state-cell pending">NJ</div>
              <div class="state-cell licensed">VA</div>
              <div class="state-cell compact">WA</div>
              <div class="state-cell compact">AZ</div>
              <div class="state-cell licensed">MA</div>
              <div class="state-cell compact">TN</div>
              <div class="state-cell compact">IN</div>
              <div class="state-cell licensed">MO</div>
              <div class="state-cell pending">MD</div>
              <div class="state-cell compact">WI</div>
              <div class="state-cell compact">CO</div>
              <div class="state-cell compact">MN</div>
              <div class="state-cell compact">SC</div>
              <div class="state-cell licensed">AL</div>
              <div class="state-cell compact">LA</div>
              <div class="state-cell compact">KY</div>
              <div class="state-cell compact">OR</div>
              <div class="state-cell compact">OK</div>
              <div class="state-cell pending">CT</div>
              <div class="state-cell compact">UT</div>
              <div class="state-cell compact">IA</div>
              <div class="state-cell compact">NV</div>
              <div class="state-cell compact">AR</div>
              <div class="state-cell compact">MS</div>
              <div class="state-cell compact">KS</div>
              <div class="state-cell expiring">NM</div>
              <div class="state-cell compact">NE</div>
              <div class="state-cell compact">WV</div>
              <div class="state-cell compact">ID</div>
              <div class="state-cell eligible">HI</div>
              <div class="state-cell compact">NH</div>
              <div class="state-cell compact">ME</div>
              <div class="state-cell compact">MT</div>
              <div class="state-cell compact">RI</div>
              <div class="state-cell compact">DE</div>
              <div class="state-cell compact">SD</div>
              <div class="state-cell compact">ND</div>
              <div class="state-cell eligible">AK</div>
              <div class="state-cell compact">VT</div>
              <div class="state-cell compact">WY</div>
            </div>
            <div class="lga-summary">
              <div class="lga-stat"><div class="v"><em>187</em></div><div class="l">Active licenses</div></div>
              <div class="lga-stat"><div class="v">31</div><div class="l">Compact eligible</div></div>
              <div class="lga-stat"><div class="v">7</div><div class="l">In progress</div></div>
              <div class="lga-stat"><div class="v" style="color:var(--danger);">3</div><div class="l">Expiring &lt;30d</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============== FEATURE 2: PAYOR PIPELINE ============== -->
<section class="feature-section" style="background: var(--paper); border-top: 1px solid var(--line);">
  <div class="container">
    <div class="feature-row flip">
      <!-- ============== SCREENSHOT: PAYOR KANBAN ============== -->
      <div class="ss-wrap">
        <div class="screenshot">
          <div class="screenshot-chrome">
            <div class="ss-dot"></div><div class="ss-dot"></div><div class="ss-dot"></div>
            <div class="ss-url">app.credtek.com / payors / pipeline</div>
          </div>
          <div class="kanban-app">
            <div class="kb-head">
              <div>
                <div class="kb-title">Payor Pipeline</div>
                <div style="font-size:11px;color:var(--muted);font-family:'JetBrains Mono',monospace;margin-top:4px;">31 active enrollments · 4 stages</div>
              </div>
              <div class="pstat s-active" style="font-size:10px;padding:4px 10px;">3 approvals waiting</div>
            </div>
            <div class="kb-cols">
              <div class="kb-col">
                <div class="kb-col-head"><span class="kb-col-title">Drafted</span><span class="kb-col-count">8</span></div>
                <div class="kb-card">
                  <div class="name">Mitchell, J. — Optum</div>
                  <div class="meta">CA · LCSW</div>
                  <div class="day">READY · APPROVE</div>
                </div>
                <div class="kb-card">
                  <div class="name">Patel, A. — Carelon</div>
                  <div class="meta">TX · LPC-A</div>
                  <div class="day">READY · APPROVE</div>
                </div>
                <div class="kb-card">
                  <div class="name">Bennett, R. — Magellan</div>
                  <div class="meta">CO · LMFT</div>
                  <div class="day">READY · APPROVE</div>
                </div>
              </div>
              <div class="kb-col">
                <div class="kb-col-head"><span class="kb-col-title">Submitted</span><span class="kb-col-count">14</span></div>
                <div class="kb-card">
                  <div class="name">Reyes, S. — Evernorth</div>
                  <div class="meta">PSYPACT · PsyD</div>
                  <div class="day">DAY 6</div>
                </div>
                <div class="kb-card">
                  <div class="name">Mitchell, J. — Carelon</div>
                  <div class="meta">CA · LCSW</div>
                  <div class="day">DAY 12</div>
                </div>
                <div class="kb-card">
                  <div class="name">Ortega, T. — Optum</div>
                  <div class="meta">FL · LPC</div>
                  <div class="day">DAY 18</div>
                </div>
                <div class="kb-card danger">
                  <div class="name">Singh, M. — Anthem BH</div>
                  <div class="meta">GA · LCSW</div>
                  <div class="day">DAY 47 · ESCALATE</div>
                </div>
              </div>
              <div class="kb-col">
                <div class="kb-col-head"><span class="kb-col-title">Info Needed</span><span class="kb-col-count">5</span></div>
                <div class="kb-card">
                  <div class="name">Kim, D. — TX Medicaid</div>
                  <div class="meta">Superior · MD</div>
                  <div class="day">DEA UPDATE · SMS SENT</div>
                </div>
                <div class="kb-card">
                  <div class="name">Park, L. — Optum</div>
                  <div class="meta">NY · LMHC</div>
                  <div class="day">CAQH ATTEST · DUE</div>
                </div>
              </div>
              <div class="kb-col">
                <div class="kb-col-head"><span class="kb-col-title">In-Network</span><span class="kb-col-count">4</span></div>
                <div class="kb-card success">
                  <div class="name">Reyes, S. — Optum</div>
                  <div class="meta">PSYPACT · PsyD</div>
                  <div class="day">ACTIVE · 38 DAYS</div>
                </div>
                <div class="kb-card success">
                  <div class="name">Patel, A. — Optum</div>
                  <div class="meta">TX · LPC-A</div>
                  <div class="day">ACTIVE · 42 DAYS</div>
                </div>
                <div class="kb-card success">
                  <div class="name">Singh, M. — Carelon</div>
                  <div class="meta">GA · LCSW</div>
                  <div class="day">ACTIVE · 31 DAYS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="feature-content">
        <span class="section-eyebrow">Feature 02 · Payor enrollment, automated</span>
        <h3>Stop filling out the same forms <em>thirty different times.</em></h3>
        <p>Every payor portal is different. Every one wants the same data, formatted differently. Your coordinator types the same provider info into Optum, Carelon, Magellan, Evernorth, Anthem BH, and three Medicaid MCOs — over and over.</p>
        <p><strong>CredTek's Payor Agents do the typing.</strong> Specialized agents for the payors that matter in BH. The agent fills the forms, attaches the documents, submits. You approve before anything goes out — every submission, every time.</p>
        <ul>
          <li>Specialized agents for Optum/UBH, Carelon, Magellan, Evernorth BH, Anthem BH</li>
          <li>State Medicaid MCO agents in your design partner's states</li>
          <li>CAQH attestation auto-completion with provider SMS approval</li>
          <li>Real-time status tracking · auto-escalation when payors stall</li>
          <li><strong>Human-in-the-loop approval gate on every submission</strong> — no hallucinated data ever reaches a payor</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- ============== FEATURE 3: SUPERVISION TRACKING ============== -->
<section class="feature-section" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <div class="feature-row">
      <div class="feature-content">
        <span class="section-eyebrow">Feature 03 · The thing nobody else does</span>
        <h3>Pre-licensed supervision tracking <em>that passes audits.</em></h3>
        <p>Master's-level clinicians work under supervision for 2–4 years before independent licensure. LMSW → LCSW. LPC-Associate → LPC. Hours, supervisor credentials, signed attestations, state-specific rules. Today this lives in spreadsheets that break.</p>
        <p><strong>CredTek tracks it natively.</strong> Hours by week. Modality (individual vs. group). Cosigning workflow. State-specific rule engines (3,000 hours for CA LCSW, different for TX, different for NY). When the supervisee is ready for independent licensure, we auto-generate the documentation packet. <strong>This feature alone is the reason design partners switch.</strong></p>
        <ul>
          <li>State-specific supervision rule engines for all 50 states</li>
          <li>Weekly hours logging with supervisor cosignature workflow</li>
          <li>Auto-generated licensure documentation packet at completion</li>
          <li>Audit-ready trail for state boards and NCQA reviews</li>
          <li>SMS reminders to supervisors for missing cosignatures</li>
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

<!-- ============== STACK THE VALUE ============== -->
<section class="section" style="background: var(--paper); border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">Here's everything you get</span>
    <h2>Inside CredTek. <em>The full stack.</em></h2>
    <p class="section-lead">No tiered pricing. No "contact sales for that feature." Every BH group on CredTek gets every capability — because verticalization, not feature-gating, is how we win this market.</p>

    <div class="stack-block">
      <h3>What's <em>actually included</em> at $35/provider/month</h3>
      <ul class="stack-list">
        <li><span class="check">✓</span><span class="item-text"><strong>Intake & Profile Agent</strong> — SMS/email provider invite, document OCR + LLM extraction, golden profile auto-population</span><span class="item-val">VALUE: $200/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>50-state BH board PSV</strong> — Direct verification against psychology, social work, counseling, MFT boards in every state</span><span class="item-val">VALUE: $400/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>Pre-licensed Supervision Tracker</strong> — Hours, cosigning, state rules, auto-generated licensure packets</span><span class="item-val">VALUE: $300/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>Multi-state Licensure Agent</strong> — PSYPACT, Counseling Compact, SW Compact eligibility + standalone license tracking</span><span class="item-val">VALUE: $250/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>BH Payor Enrollment Agents</strong> — Specialized agents for Optum/UBH, Carelon, Magellan, Evernorth BH, Anthem BH</span><span class="item-val">VALUE: $500/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>CAQH Attestation Automation</strong> — Every-120-day attestation handled with provider SMS approval</span><span class="item-val">VALUE: $150/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>NCQA Audit Binder</strong> — One-click audit-ready evidence packet for delegated credentialing</span><span class="item-val">VALUE: $400/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>Expirations & Re-credentialing Engine</strong> — 180-day forecast, auto-drafted renewals, SMS reminders</span><span class="item-val">VALUE: $200/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>OIG · SAM · NPDB · DEA monitoring</strong> — Continuous sanctions and exclusions screening</span><span class="item-val">VALUE: $150/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>Unlimited users</strong> — Whole credentialing team, billing, ops, leadership</span><span class="item-val">VALUE: $200/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>HIPAA-compliant document storage</strong> — Encrypted, audit-logged, BAA-covered</span><span class="item-val">VALUE: $100/mo</span></li>
        <li><span class="check">✓</span><span class="item-text"><strong>White-glove onboarding & dedicated CSM</strong> — Live in 14 days, weekly check-ins for 90 days</span><span class="item-val">VALUE: $500/mo</span></li>
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
<section class="section" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">The math you don't want to do</span>
    <h2>What slow credentialing <em>actually costs you.</em></h2>
    <p class="section-lead">Every month you stay on spreadsheets, Modio, or your current outsourced CVO, you're paying a tax. Here's the actual math for a 200-provider behavioral health group.</p>

    <div class="coi-block">
      <h3>The cost of <em>doing nothing</em>.</h3>
      <p style="font-size: 16px; color: var(--ink-soft); margin-bottom: 8px;">Assume a 200-provider BH group, 10 new hires per quarter, 75-day average enrollment delay, $2,000/day in lost revenue per idle provider:</p>

      <div class="coi-math">
        <div class="calc">10 new providers × 4 quarters = <strong style="color:var(--ink);">40 enrollments / year</strong></div>
        <div class="calc">75 days idle × $2,000/day = <strong style="color:var(--ink);">$150,000 lost per provider</strong></div>
        <div class="calc">40 × $150,000 = <strong style="color:var(--ink);">$6,000,000 in lost annual revenue</strong></div>
        <div class="calc">+ Coordinator team of 6 × $75K loaded = <strong style="color:var(--ink);">$450,000 in ops cost</strong></div>
        <div class="calc">+ Outsourced CVO at $500/file × 40 = <strong style="color:var(--ink);">$20,000</strong></div>
        <span class="total">→ True annual cost of slow credentialing: $6,470,000</span>
        <span class="vs">→ CredTek annual cost (200 providers, 40 enrollments): $96,000</span>
      </div>

      <div class="coi-roi">If CredTek cuts your time-to-revenue from 75 days to 40 — even just <strong>conservatively</strong> — you recover <strong>$2.8M+ in revenue in year one.</strong><br/><br/>That's a <strong>29× return</strong> on your CredTek subscription.</div>
    </div>
  </div>
</section>

<!-- ============== GUARANTEE ============== -->
<section class="section" id="guarantee" style="background: var(--paper); border-top: 1px solid var(--line);">
  <div class="container container-narrow">
    <span class="section-eyebrow">The risk reversal</span>
    <h2>If we don't perform, <em>you don't pay.</em></h2>
    <p class="section-lead">We're confident enough in CredTek to put real money on the line. Here's our guarantee — in writing, in your contract.</p>

    <div class="guarantee">
      <div class="guarantee-seal">G</div>
      <div>
        <h3>The CredTek <em>45-Day Guarantee.</em></h3>
        <p>Run CredTek alongside your current process for 45 days. If your average time-to-active for the providers you onboard during that window isn't <strong>under 60 days</strong>, we refund your full subscription <strong>and</strong> process your next 25 enrollments at no charge — until we hit the number we promised.</p>
        <p style="margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--line); font-size: 14px;">No fine print. No "as long as you also bought…" clauses. Just: <strong>we hit the number, or we make it right.</strong></p>
      </div>
    </div>
  </div>
</section>

<!-- ============== PRICING ============== -->
<section class="section" id="pricing" style="background: white; border-top: 1px solid var(--line);">
  <div class="container">
    <span class="section-eyebrow">Pricing · No "contact us" games</span>
    <h2>Two lines. <em>Posted publicly.</em></h2>
    <p class="section-lead">Every credentialing competitor hides pricing behind a "Schedule a demo" form. That's a 2018 mistake. CredTek publishes simple, transparent pricing any COO can model on a napkin in 30 seconds.</p>

    <div class="price-grid">
      <div class="price-card">
        <h3>Subscription</h3>
        <div class="price-desc">Per active provider, per month. Everything's included.</div>
        <div class="price-amount"><em>$35</em></div>
        <div class="price-unit">per provider · per month</div>
        <ul>
          <li>All 7 AI agents</li>
          <li>50-state BH board PSV</li>
          <li>Pre-licensed supervision tracking</li>
          <li>Multi-state license dashboard</li>
          <li>CAQH automation</li>
          <li>Expirations management</li>
          <li>NCQA audit binder</li>
          <li>Unlimited users</li>
          <li>White-glove onboarding</li>
        </ul>
      </div>
      <div class="price-card featured">
        <h3>Enrollment Actions</h3>
        <div class="price-desc">Per submitted enrollment. Pay only when work happens.</div>
        <div class="price-amount"><em>$300</em></div>
        <div class="price-unit">per enrollment action</div>
        <ul>
          <li>Commercial payor enrollment (Optum, Carelon, Magellan, etc.)</li>
          <li>State Medicaid MCO enrollment</li>
          <li>State license application</li>
          <li>License renewal</li>
          <li>Re-credentialing cycle</li>
          <li>Hospital privileging request</li>
          <li>Includes all follow-up + escalation</li>
        </ul>
      </div>
    </div>

    <div style="margin-top: 28px; padding: 20px 24px; background: var(--cream); border: 1px solid var(--line); border-radius: 14px;">
      <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:16px;">
        <div>
          <div class="serif" style="font-size:22px;font-style:italic;">Modeling a 200-provider BH group</div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px;">Multi-state, mix of master's and doctoral, ~40 enrollments/year</div>
        </div>
        <div style="text-align:right;">
          <div class="serif" style="font-size:36px;letter-spacing:-0.01em;">~$96K<span style="color:var(--muted);font-size:18px;"> / year</span></div>
          <div style="font-size:12px;color:var(--gold-deep);font-family:'JetBrains Mono',monospace;letter-spacing:0.06em;font-weight:600;">VS. ~$6.4M IN LOST REVENUE + INTERNAL OPS</div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ============== FAQ ============== -->
<section class="section" id="faq" style="background: var(--paper); border-top: 1px solid var(--line);">
  <div class="container container-narrow">
    <span class="section-eyebrow">Everything else you're wondering</span>
    <h2>Honest answers to <em>actual questions</em>.</h2>

    <div class="faq">
      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What about HIPAA, SOC 2, NCQA?</div>
        <div class="faq-a"><strong>HIPAA + signed BAA on day one.</strong> SOC 2 Type II audit is in flight (12-month process, started at company founding). For NCQA: in year one we partner with an NCQA-certified CVO and white-label their verifications under our platform — you get NCQA-compliant files immediately. We're pursuing our own NCQA CVO certification in year two as a strategic asset.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> How fast can we go live?</div>
        <div class="faq-a"><strong>14 days from contract signing.</strong> White-glove onboarding includes data migration from your current tool (Modio, spreadsheets, anywhere), provider import, payor portal credential setup, and a live training session for your credentialing team. Your CSM is on weekly check-ins for the first 90 days.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What happens to our existing data in Modio or our spreadsheets?</div>
        <div class="faq-a">We migrate it. CredTek's intake agent ingests Modio exports, CAQH data, and even messy spreadsheet data. Your golden profile gets populated automatically with confidence scoring — your coordinator approves anomalies. <strong>You don't redo months of work.</strong></div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What if a payor portal blocks automation?</div>
        <div class="faq-a">Some payors restrict automated form submission in their TOS. CredTek's enrollment agents are built with <strong>human-in-the-loop approval gates</strong> — every submission is reviewed by your coordinator before it leaves the platform. We're not "scraping" payors against their will. We're accelerating your team's manual work to seconds. For payors with direct enrollment APIs, we integrate natively.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> Does this work for non-BH credentialing too?</div>
        <div class="faq-a">In year one — no. We're deliberately verticalized on behavioral health because that's where the pain is greatest and where we can build defensible depth. If you have a small percentage of medical providers in your group (e.g., a few psychiatrists or NPs), we cover them too. But CredTek is built for BH and we won't dilute it.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What about delegated credentialing with payors?</div>
        <div class="faq-a">Our NCQA Audit Binder is built specifically to support delegated credentialing arrangements with payors like Optum and Carelon. Once you're delegated with a payor, you skip their credentialing process entirely — you credential providers yourself and they accept it. <strong>This is the highest-leverage move a BH group can make</strong>, and CredTek gets you ready for it.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What if AI hallucinates and submits bad data?</div>
        <div class="faq-a">Three guardrails. <strong>One:</strong> every agent output has a confidence score — anything below threshold flags for human review. <strong>Two:</strong> mandatory human approval gate before any submission to a payor or state board. <strong>Three:</strong> full audit logging on every agent action. We're not betting the company on AI being perfect. We're using AI to make your team 10× faster, with humans in the loop where it matters.</div>
      </div>

      <div class="faq-item">
        <div class="faq-q"><span class="q-mark">Q.</span> What if we're not ready to switch our entire system?</div>
        <div class="faq-a">You don't have to. Run CredTek alongside your current process for 45 days. Onboard a subset of providers. See the numbers for yourself. If we don't hit the guarantee, you walk away with no contract and a refund. <strong>The risk is on us.</strong></div>
      </div>
    </div>
  </div>
</section>

<!-- ============== FINAL CTA ============== -->
<section class="final-cta" id="cta">
  <div class="final-cta-inner">
    <h2>See your own credentialing pipeline <em>running in CredTek.</em></h2>
    <p>20 minutes. We pull a sample of your providers, run them through the platform live, and show you exactly what's possible. No slides. No fluff.</p>
    <div class="final-cta-btns">
      <a class="btn-primary" href="mailto:hello@credtek.com">Book a 20-min demo →</a>
      <a class="btn-secondary" href="#how">See how it works first</a>
    </div>
    <div class="final-meta">→ NO CONTRACT REQUIRED · 45-DAY GUARANTEE · LIVE IN 14 DAYS</div>
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
      Credentialing built for behavioral health · 2026
    </div>
  </div>
</footer>
`;

export default function Page() {
  return <div dangerouslySetInnerHTML={{ __html: LANDING_BODY }} />;
}
