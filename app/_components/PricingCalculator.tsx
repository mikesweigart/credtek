"use client";

// CredTek instant quote tool. Users adjust four inputs, see a live ROI
// quote, then save it (print or email themselves) or schedule a call to
// discuss. URL-shareable so the same quote can be sent peer-to-peer
// without copy-paste.
//
// Math is intentionally identical to the static cost-of-inaction section
// so partners can verify rather than trust. CredTek pricing constants
// mirror the landing page's pricing section.

import { useEffect, useRef, useState } from "react";

function readInitial(name: string, fallback: number): number {
  if (typeof window === "undefined") return fallback;
  const params = new URLSearchParams(window.location.search);
  const v = Number.parseInt(params.get(name) ?? "", 10);
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

const CAL_LINK = "https://cal.com/mikesweigart";

export function PricingCalculator() {
  const [providers, setProviders] = useState(200);
  const [newPerQuarter, setNewPerQuarter] = useState(10);
  const [currentDelayDays, setCurrentDelayDays] = useState(75);
  const [lostPerDay, setLostPerDay] = useState(2000);
  const [copied, setCopied] = useState(false);
  const [emailOpen, setEmailOpen] = useState(false);
  const [emailValue, setEmailValue] = useState("");
  const emailDialogRef = useRef<HTMLDivElement>(null);

  // CredTek pricing constants
  const PER_PROVIDER_MONTH = 35;
  const PER_ENROLLMENT = 300;
  const TARGET_DELAY_DAYS = 45;

  // Hydrate from URL on mount (client-only — server render uses defaults
  // so the static markup is still cacheable).
  useEffect(() => {
    setProviders(readInitial("p", 200));
    setNewPerQuarter(readInitial("n", 10));
    setCurrentDelayDays(readInitial("d", 75));
    setLostPerDay(readInitial("l", 2000));
  }, []);

  // Sync URL as inputs change (replaceState — no history entry per drag).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("p", String(providers));
    params.set("n", String(newPerQuarter));
    params.set("d", String(currentDelayDays));
    params.set("l", String(lostPerDay));
    const next = `${window.location.pathname}?${params.toString()}#calc`;
    window.history.replaceState({}, "", next);
  }, [providers, newPerQuarter, currentDelayDays, lostPerDay]);

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

  // Math (identical to the static cost-of-inaction section)
  const annualEnrollments = newPerQuarter * 4;
  const credtekSubscription = providers * PER_PROVIDER_MONTH * 12;
  const credtekEnrollments = annualEnrollments * PER_ENROLLMENT;
  const credtekTotal = credtekSubscription + credtekEnrollments;
  const lostBaseline = currentDelayDays * lostPerDay * annualEnrollments;
  const lostWithCredtek = TARGET_DELAY_DAYS * lostPerDay * annualEnrollments;
  const savingsBeforeCost = lostBaseline - lostWithCredtek;
  const netSavings = Math.max(0, savingsBeforeCost - credtekTotal);
  const roi = credtekTotal > 0 ? netSavings / credtekTotal : 0;

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
      `My CredTek quote — ${fmtMoneyBig(netSavings)} projected savings`,
    );
    const body = encodeURIComponent(
      [
        "My CredTek instant quote",
        "",
        "INPUTS",
        `· Active providers: ${providers.toLocaleString("en-US")}`,
        `· New providers per quarter: ${newPerQuarter}`,
        `· Current avg time-to-active: ${currentDelayDays} days`,
        `· Lost revenue per idle provider per day: ${fmtMoney(lostPerDay)}`,
        "",
        "QUOTE",
        `· Cost of doing nothing (per year): ${fmtMoneyBig(lostBaseline)}`,
        `· CredTek (per year): ${fmtMoneyBig(credtekTotal)}`,
        `   - ${fmtMoney(credtekSubscription)} subscription`,
        `   - ${fmtMoney(credtekEnrollments)} enrollment actions`,
        `· Net annual savings (assumes 45-day time-to-active): ${fmtMoneyBig(netSavings)}`,
        `· Year-one ROI: ${roi.toFixed(1)}× on subscription`,
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
      {/* Print-only block — hidden on screen, formatted as a clean PDF when
          the user hits "Print Your Quote" or Cmd/Ctrl+P. */}
      <PrintQuote
        providers={providers}
        newPerQuarter={newPerQuarter}
        currentDelayDays={currentDelayDays}
        lostPerDay={lostPerDay}
        annualEnrollments={annualEnrollments}
        credtekSubscription={credtekSubscription}
        credtekEnrollments={credtekEnrollments}
        credtekTotal={credtekTotal}
        lostBaseline={lostBaseline}
        netSavings={netSavings}
        roi={roi}
      />

      <div className="container calc-screen">
        <span className="section-eyebrow">Instant quote</span>
        <h2>
          Get a custom quote <em>in seconds.</em>
        </h2>
        <p className="section-lead">
          Use our quick, easy tool to generate your quote. Print it or email
          it to yourself for later — no hassle.{" "}
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
              tooltip="Total clinicians on your roster today across all states."
              value={providers}
              setValue={setProviders}
              min={20}
              max={500}
              step={10}
              format={(v) => v.toLocaleString("en-US")}
            />
            <CalcInput
              label="New providers per quarter"
              tooltip="How many new clinicians you onboard each quarter on average."
              value={newPerQuarter}
              setValue={setNewPerQuarter}
              min={1}
              max={40}
              step={1}
              format={(v) => v.toLocaleString("en-US")}
            />
            <CalcInput
              label="Current avg time-to-active (days)"
              tooltip="How long it takes today, on average, from a new provider's hire date to in-network with their first major payor."
              value={currentDelayDays}
              setValue={setCurrentDelayDays}
              min={45}
              max={180}
              step={5}
              format={(v) => `${v} days`}
            />
            <CalcInput
              label="Lost revenue per idle provider, per day"
              tooltip="Conservative estimate of revenue your provider could be earning if they were in-network instead of waiting on credentialing. BH groups commonly use $1,500–$3,000."
              value={lostPerDay}
              setValue={setLostPerDay}
              min={500}
              max={5000}
              step={100}
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
                  Net annual savings
                </span>
                <div className="calc-quote-card-headline-num">
                  {fmtMoneyBig(netSavings)}
                </div>
                <span className="calc-quote-card-headline-sub">
                  Year-one ROI: <strong>{roi.toFixed(1)}×</strong> on your CredTek subscription
                </span>
              </div>
              <div className="calc-quote-card-rows">
                <div className="calc-quote-card-row">
                  <span>Cost of doing nothing</span>
                  <strong className="calc-amount-danger">
                    {fmtMoneyBig(lostBaseline)}
                  </strong>
                </div>
                <div className="calc-quote-card-row">
                  <span>CredTek (per year)</span>
                  <strong>{fmtMoneyBig(credtekTotal)}</strong>
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
                <span className="calc-action-icon">🖨</span>
                Print your quote
              </button>
              <button
                type="button"
                className="calc-action-btn"
                onClick={() => setEmailOpen(true)}
              >
                <span className="calc-action-icon">✉</span>
                Email your quote
              </button>
              <a
                className="calc-action-btn schedule"
                href={CAL_LINK}
                target="_blank"
                rel="noopener"
              >
                <span className="calc-action-icon">📅</span>
                Schedule a call
              </a>
            </div>

            <div className="calc-disclaimer">
              ✦ Conservative model — real customers typically beat 45-day
              time-to-active after month 3. Numbers don&apos;t include
              coordinator team savings or outsourced CVO costs you stop
              paying.
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
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="calc-slider"
        aria-label={label}
      />
      <div className="calc-input-range">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
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
  lostPerDay: number;
  annualEnrollments: number;
  credtekSubscription: number;
  credtekEnrollments: number;
  credtekTotal: number;
  lostBaseline: number;
  netSavings: number;
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
        Modeled against the inputs you provided. Conservative assumption:
        CredTek brings average time-to-active down to 45 days.
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
              <td>Current avg time-to-active</td>
              <td>{props.currentDelayDays} days</td>
            </tr>
            <tr>
              <td>Lost revenue per idle provider, per day</td>
              <td>{fmtMoney(props.lostPerDay)}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="calc-print-section">
        <h2>Quote</h2>
        <table className="calc-print-table">
          <tbody>
            <tr>
              <td>Cost of doing nothing (per year)</td>
              <td className="calc-print-danger">
                {fmtMoneyBig(props.lostBaseline)}
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
                <strong>Net annual savings</strong>
              </td>
              <td>
                <strong className="calc-print-savings">
                  {fmtMoneyBig(props.netSavings)}
                </strong>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Year-one ROI</strong>
              </td>
              <td>
                <strong>{props.roi.toFixed(1)}×</strong> on subscription
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
        CredTek · cred-tek.com · the credentialing platform built for
        behavioral health groups
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
