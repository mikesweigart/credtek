"use client";

// Interactive ROI calculator embedded on the landing page between the
// Cost-of-Inaction section and the 45-day Guarantee. Inputs: provider
// count, new providers per quarter, current time-to-active, and lost
// revenue per idle provider per day. Outputs: annual CredTek cost,
// "do nothing" cost, projected savings, and ROI multiple.
//
// Math intentionally identical to what the static cost-of-inaction
// section uses, just parameterized — partners modeling their group
// don't have to trust our numbers; the formula is in the markup.

import { useState } from "react";

export function PricingCalculator() {
  const [providers, setProviders] = useState(200);
  const [newPerQuarter, setNewPerQuarter] = useState(10);
  const [currentDelayDays, setCurrentDelayDays] = useState(75);
  const [lostPerDay, setLostPerDay] = useState(2000);

  // CredTek pricing constants (mirror the landing page's pricing section).
  const PER_PROVIDER_MONTH = 35;
  const PER_ENROLLMENT = 300;
  const TARGET_DELAY_DAYS = 45;

  const annualEnrollments = newPerQuarter * 4;
  const credtekSubscription = providers * PER_PROVIDER_MONTH * 12;
  const credtekEnrollments = annualEnrollments * PER_ENROLLMENT;
  const credtekTotal = credtekSubscription + credtekEnrollments;

  const lostBaseline = currentDelayDays * lostPerDay * annualEnrollments;
  const lostWithCredtek = TARGET_DELAY_DAYS * lostPerDay * annualEnrollments;
  const savingsBeforeCost = lostBaseline - lostWithCredtek;
  const netSavings = Math.max(0, savingsBeforeCost - credtekTotal);
  const roi = credtekTotal > 0 ? netSavings / credtekTotal : 0;

  return (
    <section className="calc-section">
      <div className="container">
        <span className="section-eyebrow">Run your numbers</span>
        <h2>
          The same math, <em>your inputs.</em>
        </h2>
        <p className="section-lead">
          Drag the sliders to match your group. The numbers update live —
          no email volley required.
        </p>

        <div className="calc-grid">
          <div className="calc-inputs">
            <CalcInput
              label="Active providers"
              value={providers}
              setValue={setProviders}
              min={20}
              max={500}
              step={10}
              format={(v) => v.toLocaleString("en-US")}
            />
            <CalcInput
              label="New providers per quarter"
              value={newPerQuarter}
              setValue={setNewPerQuarter}
              min={1}
              max={40}
              step={1}
              format={(v) => v.toLocaleString("en-US")}
            />
            <CalcInput
              label="Current avg time-to-active (days)"
              value={currentDelayDays}
              setValue={setCurrentDelayDays}
              min={45}
              max={180}
              step={5}
              format={(v) => `${v} days`}
            />
            <CalcInput
              label="Lost revenue per idle provider, per day"
              value={lostPerDay}
              setValue={setLostPerDay}
              min={500}
              max={5000}
              step={100}
              format={(v) => fmtMoney(v)}
            />
          </div>

          <div className="calc-outputs">
            <div className="calc-out-card calc-out-baseline">
              <div className="calc-out-label">
                Cost of doing nothing · per year
              </div>
              <div className="calc-out-num">{fmtMoneyBig(lostBaseline)}</div>
              <div className="calc-out-meta">
                {currentDelayDays} days × {fmtMoney(lostPerDay)}/day ×{" "}
                {annualEnrollments} enrollments
              </div>
            </div>

            <div className="calc-out-card calc-out-credtek">
              <div className="calc-out-label">
                CredTek · per year
              </div>
              <div className="calc-out-num">{fmtMoneyBig(credtekTotal)}</div>
              <div className="calc-out-meta">
                {fmtMoney(credtekSubscription)} subscription +{" "}
                {fmtMoney(credtekEnrollments)} enrollment actions
              </div>
            </div>

            <div className="calc-out-card calc-out-savings">
              <div className="calc-out-label">
                Net annual savings (assumes 45-day time-to-active)
              </div>
              <div className="calc-out-num">{fmtMoneyBig(netSavings)}</div>
              <div className="calc-out-meta">
                Year-one ROI: <strong>{roi.toFixed(1)}×</strong> on your
                CredTek subscription
              </div>
            </div>

            <a
              className="calc-cta"
              href="https://cal.com/mikesweigart"
              target="_blank"
              rel="noopener"
            >
              Book a 20-min demo with these numbers →
            </a>
            <div className="calc-disclaimer">
              ✦ Conservative model. Real customers typically see lower
              time-to-active than 45 days after month 3. Numbers above
              do <em>not</em> include coordinator team savings or outsourced
              CVO costs you stop paying.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CalcInput({
  label,
  value,
  setValue,
  min,
  max,
  step,
  format,
}: {
  label: string;
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
        <label className="calc-input-label">{label}</label>
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
      />
      <div className="calc-input-range">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

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
