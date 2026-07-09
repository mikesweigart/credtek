"use client";

// CredTek instant ROI quote. Users adjust four inputs, see a live,
// DEFENSIBLE quote, then save it (print or email) or book a call.
// URL-shareable so the same quote can be sent peer-to-peer.
//
// HONEST MODEL (rebuilt): the value of credentialing faster is the
// provider's billing pulled FORWARD — not gross revenue "lost." We ask
// for monthly collections a CFO already knows, convert to a per-day
// figure, multiply by the days we save, then count only HALF as captured
// (a conservative realization haircut — the rest is timing you'd recover).
// Net of the CredTek cost, that lands a believable single-digit ROI, and
// every number on the card is shown so a partner can verify, not trust.
// Math here is identical to the static cost-of-inaction section.

import { useEffect, useRef, useState } from "react";

function readInitial(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const params = new URLSearchParams(window.location.search);
  const v = Number.parseInt(params.get(name) ?? "", 10);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

const CAL_LINK = "https://calendly.com/mike-fusion-advisory/30min";

// CredTek constants. Pricing mirrors the landing page; the model constants
// are deliberately conservative so the quote under-promises.
const PER_PROVIDER_MONTH = 35;
const PER_ENROLLMENT = 199;
const CREDTEK_DAYS = 50; // time-to-billable we model CredTek reaching
const REALIZATION = 0.5; // count only half the accelerated billing as captured

export function PricingCalculator() {
  const [providers, setProviders] = useState(200);
  const [newPerQuarter, setNewPerQuarter] = useState(10);
  const [currentDelayDays, setCurrentDelayDays] = useState(90);
  const [monthlyCollections, setMonthlyCollections] = useState(18000);
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const emailDialogRef = useRef<HTMLDivElement>(null);

  // Hydrate from URL on mount (client-only — server render uses defaults).
  useEffect(() => {
    setProviders(readInitial("p", 200));
    setNewPerQuarter(readInitial("n", 10));
    setCurrentDelayDays(readInitial("d", 90));
    setMonthlyCollections(readInitial("m", 18000));
  }, []);

  // Sync URL as inputs change (replaceState — no history entry per drag).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("p", String(providers));
    params.set("n", String(newPerQuarter));
    params.set("d", String(currentDelayDays));
    params.set("m", String(monthlyCollections));
    const next = `${window.location.pathname}?${params.toString()}#calc`;
    window.history.replaceState({}, "", next);
  }, [providers, newPerQuarter, currentDelayDays, monthlyCollections]);

  // Outside-click closes the email dialog
  useEffect(() => {
    if (!emailOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        emailDialogRef.current &&
        !emailDialogRef.current.contains(e.target as Node)
      ) {
        setEmailOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEmailOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [emailOpen]);

  // ---- Math (identical to the static cost-of-inaction section) ----
  const annualEnrollments = newPerQuarter * 4;
  const perProviderPerDay = (monthlyCollections * 12) / 365;
  const daysSaved = Math.max(0, currentDelayDays - CREDTEK_DAYS);
  const acceleratedBilling = daysSaved * perProviderPerDay * annualEnrollments;
  const capturedValue = acceleratedBilling * REALIZATION;
  const credtekSubscription = providers * PER_PROVIDER_MONTH * 12;
  const credtekEnrollments = annualEnrollments * PER_ENROLLMENT;
  const credtekTotal = credtekSubscription + credtekEnrollments;
  const netGain = Math.max(0, capturedValue - credtekTotal);
  const roi = credtekTotal > 0 ? netGain / credtekTotal : 0;

  // ---- Print ----
  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  // ---- Copy share link ----
  const handleCopyShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      })
      .catch(() => {});
  };

  // ---- Email quote ----
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `My CredTek quote — ${fmtMoneyBig(netGain)} projected first-year gain`,
    );
    const body = encodeURIComponent(
      [
        "My CredTek instant quote",
        "",
        "INPUTS",
        `· Active providers: ${providers.toLocaleString("en-US")}`,
        `· New providers per quarter: ${newPerQuarter}`,
        `· Current avg time-to-billable: ${currentDelayDays} days`,
        `· Avg monthly collections per provider: ${fmtMoney(monthlyCollections)}`,
        "",
        "THE MATH (conservative)",
        `· Days-to-billable saved per provider: ${daysSaved} (we model ${CREDTEK_DAYS} days)`,
        `· Billing accelerated (gross): ${fmtMoneyBig(acceleratedBilling)}/yr`,
        `· Captured value (50% realization): ${fmtMoneyBig(capturedValue)}/yr`,
        `· CredTek investment: ${fmtMoneyBig(credtekTotal)}/yr`,
        `   - ${fmtMoney(credtekSubscription)} subscription`,
        `   - ${fmtMoney(credtekEnrollments)} enrollment actions`,
        `· Net first-year gain: ${fmtMoneyBig(netGain)}`,
        `· ROI: ${roi.toFixed(1)}× on your CredTek investment`,
        "",
        "NEXT STEP",
        "Book a 20-min call to refine these numbers against your actual",
        `roster: ${CAL_LINK}`,
        "",
        "Or open your custom quote URL anytime:",
        typeof window !== "undefined" ? window.location.href : "",
      ].join("\n"),
    );
    const target = emailValue.trim();
    const mailto = target
      ? `mailto:${encodeURIComponent(target)}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailto;
    setEmailOpen(false);
  };

  return (
    <section className="calc-section" id="calc">
      {/* Print-only block — hidden on screen, formatted as a clean PDF. */}
      <PrintQuote
        providers={providers}
        newPerQuarter={newPerQuarter}
        currentDelayDays={currentDelayDays}
        monthlyCollections={monthlyCollections}
        annualEnrollments={annualEnrollments}
        daysSaved={daysSaved}
        acceleratedBilling={acceleratedBilling}
        capturedValue={capturedValue}
        credtekSubscription={credtekSubscription}
        credtekEnrollments={credtekEnrollments}
        credtekTotal={credtekTotal}
        netGain={netGain}
        roi={roi}
      />

      <div className="container calc-screen">
        <span className="section-eyebrow">Instant quote</span>
        <h2>
          See your first-year gain <em>in seconds.</em>
        </h2>
        <p className="section-lead">
          Four inputs, a transparent quote — every number shown so you can
          check the math, not take it on faith. Print it or email it to
          yourself.{" "}
          <button
            type="button"
            onClick={handleCopyShare}
            className="calc-share-btn"
          >
            {copied ? "✓ Link copied" : "Copy share link →"}
          </button>
        </p>

        {/* ---- Progress strip ---- */}
        <ol className="calc-steps" aria-label="Quote process">
          <li className="calc-step active">
            <span className="calc-step-num">1</span>
            <span className="calc-step-label">Adjust your inputs</span>
          </li>
          <li className="calc-step active">
            <span className="calc-step-num">2</span>
            <span className="calc-step-label">See your quote</span>
          </li>
          <li className="calc-step active">
            <span className="calc-step-num">3</span>
            <span className="calc-step-label">Save it (print / email)</span>
          </li>
          <li className="calc-step">
            <span className="calc-step-num">4</span>
            <span className="calc-step-label">Schedule a call</span>
          </li>
        </ol>

        <div className="calc-grid">
          {/* ---- Inputs ---- */}
          <div className="calc-inputs">
            <CalcInput
              label="Active providers"
              tooltip="Total clinicians on your roster today across all states. CredTek's mid-market sweet spot is roughly 25–400."
              value={providers}
              setValue={setProviders}
              min={20}
              max={400}
              step={10}
              format={(v) => v.toLocaleString("en-US")}
            />
            <CalcInput
              label="New providers per quarter"
              tooltip="How many new clinicians you onboard each quarter on average. These are the ones the credentialing delay costs you on."
              value={newPerQuarter}
              setValue={setNewPerQuarter}
              min={1}
              max={30}
              step={1}
              format={(v) => v.toLocaleString("en-US")}
            />
            <CalcInput
              label="Current avg time-to-billable (days)"
              tooltip="How long it takes today, on average, from a new provider's hire date to in-network and billing with their first major payer. Industry average is 90–120."
              value={currentDelayDays}
              setValue={setCurrentDelayDays}
              min={CREDTEK_DAYS}
              max={180}
              step={5}
              format={(v) => `${v} days`}
            />
            <CalcInput
              label="Avg monthly collections per provider"
              tooltip="What one active provider collects in a typical month once in-network — net collections, not gross charges. A conservative blended figure is fine; refine it on a call."
              value={monthlyCollections}
              setValue={setMonthlyCollections}
              min={5000}
              max={120000}
              step={1000}
              format={(v) => fmtMoney(v)}
            />
          </div>

          {/* ---- Outputs ---- */}
          <div className="calc-outputs">
            {/* Quote summary card (the headline number) */}
            <article className="calc-quote-card">
              <header className="calc-quote-card-head">
                <span className="calc-quote-card-eyebrow">Your custom quote</span>
                <span className="calc-quote-card-date">
                  Generated {fmtDate()}
                </span>
              </header>
              <div className="calc-quote-card-headline">
                <span className="calc-quote-card-headline-label">
                  Net first-year gain
                </span>
                <div className="calc-quote-card-headline-num">
                  {fmtMoneyBig(netGain)}
                </div>
                <span className="calc-quote-card-headline-sub">
                  ≈ <strong>{roi.toFixed(1)}×</strong> ROI on your CredTek investment
                </span>
              </div>
              <div className="calc-quote-card-rows">
                <div className="calc-quote-card-row">
                  <span>Billing accelerated ({daysSaved} days × {annualEnrollments} providers)</span>
                  <strong>{fmtMoneyBig(acceleratedBilling)}</strong>
                </div>
                <div className="calc-quote-card-row sub">
                  <span>↳ captured at a conservative 50%</span>
                  <span className="calc-amount-good">{fmtMoneyBig(capturedValue)}</span>
                </div>
                <div className="calc-quote-card-row">
                  <span>Your CredTek investment</span>
                  <strong>−{fmtMoneyBig(credtekTotal)}</strong>
                </div>
                <div className="calc-quote-card-row sub">
                  <span>↳ subscription</span>
                  <span>{fmtMoney(credtekSubscription)}</span>
                </div>
                <div className="calc-quote-card-row sub">
                  <span>↳ enrollment actions</span>
                  <span>{fmtMoney(credtekEnrollments)}</span>
                </div>
              </div>
            </article>

            {/* Action buttons */}
            <div className="calc-actions">
              <button
                type="button"
                className="calc-action-btn primary"
                onClick={handlePrint}
              >
                <span className="calc-action-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg></span>
                Print your quote
              </button>
              <button
                type="button"
                className="calc-action-btn"
                onClick={() => setEmailOpen(true)}
              >
                <span className="calc-action-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22 6 12 13 2 6"></polyline></svg></span>
                Email your quote
              </button>
              <a
                className="calc-action-btn schedule"
                href={CAL_LINK}
                target="_blank"
                rel="noopener"
              >
                <span className="calc-action-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg></span>
                Schedule a call
              </a>
            </div>

            <div className="calc-disclaimer">
              ✦ Conservative by design: we model CredTek reaching billable in
              ~{CREDTEK_DAYS} days, then count only <strong>half</strong> of the
              accelerated billing as captured — the rest is timing you&apos;d
              eventually recover. It also excludes the coordinator hours and
              outsourced-CVO fees you stop paying. Book a call and we&apos;ll
              tighten it against your real roster.
            </div>
          </div>
        </div>
      </div>

      {/* ---- Email modal ---- */}
      {emailOpen ? (
        <div className="calc-modal-backdrop" role="dialog" aria-modal="true">
          <div className="calc-modal" ref={emailDialogRef}>
            <button
              className="calc-modal-close"
              type="button"
              onClick={() => setEmailOpen(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <span className="section-eyebrow">Email this quote</span>
            <h3 className="calc-modal-h3">
              Send to <em>your inbox</em>
            </h3>
            <p className="calc-modal-p">
              Pop the quote into an email so you can refer back, forward to a
              CFO, or use it on your next budget review. Opens your email
              client with the inputs and outputs prefilled.
            </p>
            <form onSubmit={handleEmailSubmit} className="calc-modal-form">
              <label htmlFor="calc-email">Email</label>
              <input
                id="calc-email"
                type="email"
                value={emailValue}
                onChange={(e) => setEmailValue(e.target.value)}
                placeholder="you@yourgroup.com"
                autoFocus
              />
              <div className="calc-modal-actions">
                <button
                  type="button"
                  className="calc-action-btn"
                  onClick={() => setEmailOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="calc-action-btn primary">
                  Open email →
                </button>
              </div>
              <div className="calc-modal-meta">
                Production sends via Resend with a branded HTML email; demo
                opens your default email client with the quote prefilled.
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}

// ---------------------------------------------------------------------
// Slider input
// ---------------------------------------------------------------------

function CalcInput({
  label,
  tooltip,
  value,
  setValue,
  min,
  max,
  step,
  format,
}: {
  label: string;
  tooltip: string;
  value: number;
  setValue: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  // Type a number — the live quote updates as you go. Clamping happens
  // in onBlur so you can backspace to empty and retype without the field
  // fighting you mid-keystroke.
  const handleChange = (raw: string) => {
    if (raw === "") return; // allow temporary empty while typing
    const n = Number(raw);
    if (!Number.isFinite(n)) return;
    setValue(n);
  };
  const handleBlur = (raw: string) => {
    const n = Number(raw);
    if (!Number.isFinite(n) || n < min) {
      setValue(min);
    } else if (n > max) {
      setValue(max);
    }
  };

  return (
    <div className="calc-input">
      <div className="calc-input-top">
        <label className="calc-input-label" title={tooltip}>
          {label}
          <span className="calc-input-hint" title={tooltip}>
            ⓘ
          </span>
        </label>
        <span className="calc-input-value">{format(value)}</span>
      </div>
      <div className="calc-number-wrap">
        <button
          type="button"
          className="calc-number-step"
          aria-label="decrease"
          onClick={() => setValue(Math.max(min, value - step))}
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={(e) => handleBlur(e.target.value)}
          className="calc-number"
          aria-label={label}
        />
        <button
          type="button"
          className="calc-number-step"
          aria-label="increase"
          onClick={() => setValue(Math.min(max, value + step))}
        >
          +
        </button>
      </div>
      <div className="calc-input-range">
        <span>min {format(min)}</span>
        <span>max {format(max)}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------
// Print-only quote document
// ---------------------------------------------------------------------

function PrintQuote(props: {
  providers: number;
  newPerQuarter: number;
  currentDelayDays: number;
  monthlyCollections: number;
  annualEnrollments: number;
  daysSaved: number;
  acceleratedBilling: number;
  capturedValue: number;
  credtekSubscription: number;
  credtekEnrollments: number;
  credtekTotal: number;
  netGain: number;
  roi: number;
}) {
  return (
    <div className="calc-print" aria-hidden="true">
      <header className="calc-print-head">
        <div className="calc-print-logo">
          <div className="calc-print-logo-mark">C</div>
          <div className="calc-print-logo-text">CredTek</div>
        </div>
        <div className="calc-print-meta">
          <div>Custom ROI Quote</div>
          <div>{fmtDate()}</div>
        </div>
      </header>

      <h1 className="calc-print-title">Your CredTek ROI quote</h1>
      <p className="calc-print-sub">
        Modeled against the inputs you provided. We assume CredTek reaches
        billable in ~{CREDTEK_DAYS} days and count only half of the
        accelerated billing as captured — a deliberately conservative view.
      </p>

      <section className="calc-print-section">
        <h2>Inputs</h2>
        <table className="calc-print-table">
          <tbody>
            <tr>
              <td>Active providers</td>
              <td>{props.providers.toLocaleString("en-US")}</td>
            </tr>
            <tr>
              <td>New providers per quarter</td>
              <td>{props.newPerQuarter.toLocaleString("en-US")}</td>
            </tr>
            <tr>
              <td>Annual enrollments</td>
              <td>{props.annualEnrollments.toLocaleString("en-US")}</td>
            </tr>
            <tr>
              <td>Current avg time-to-billable</td>
              <td>{props.currentDelayDays} days</td>
            </tr>
            <tr>
              <td>Avg monthly collections per provider</td>
              <td>{fmtMoney(props.monthlyCollections)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="calc-print-section">
        <h2>The math</h2>
        <table className="calc-print-table">
          <tbody>
            <tr>
              <td>Days-to-billable saved per provider</td>
              <td>{props.daysSaved} days</td>
            </tr>
            <tr>
              <td>Billing accelerated (gross, per year)</td>
              <td>{fmtMoneyBig(props.acceleratedBilling)}</td>
            </tr>
            <tr>
              <td>Captured value (50% realization)</td>
              <td className="calc-print-savings">
                {fmtMoneyBig(props.capturedValue)}
              </td>
            </tr>
            <tr>
              <td>CredTek subscription (per year)</td>
              <td>{fmtMoney(props.credtekSubscription)}</td>
            </tr>
            <tr>
              <td>CredTek enrollment actions (per year)</td>
              <td>{fmtMoney(props.credtekEnrollments)}</td>
            </tr>
            <tr>
              <td>
                <strong>CredTek total (per year)</strong>
              </td>
              <td>
                <strong>{fmtMoneyBig(props.credtekTotal)}</strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Net first-year gain</strong>
              </td>
              <td>
                <strong className="calc-print-savings">
                  {fmtMoneyBig(props.netGain)}
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>ROI</strong>
              </td>
              <td>
                <strong>{props.roi.toFixed(1)}×</strong> on your investment
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="calc-print-cta">
        <h2>Want to refine these numbers against your actual roster?</h2>
        <p>
          Book a 20-minute call. We pull a sample of your providers, run them
          through CredTek live, and tighten the model.
        </p>
        <p className="calc-print-cal">
          Schedule:{" "}
          <strong>{CAL_LINK.replace("https://", "")}</strong>
        </p>
      </section>

      <footer className="calc-print-foot">
        CredTek · cred-tek.com · credentialing, done for mid-market medical
        groups &amp; health systems
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------
// Formatters
// ---------------------------------------------------------------------

function fmtMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtMoneyBig(n: number): string {
  if (n >= 1_000_000) {
    return `$${(n / 1_000_000).toFixed(2)}M`;
  }
  if (n >= 1_000) {
    return `$${Math.round(n / 1_000).toLocaleString("en-US")}K`;
  }
  return fmtMoney(n);
}

function fmtDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
