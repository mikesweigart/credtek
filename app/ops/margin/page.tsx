// Margin reporting (IAL §8). What each integration type costs us to
// fulfill vs. what we charge the customer. Drives pricing decisions
// and CVO partner renegotiations.
//
// Mocked snapshot for one customer (Mindscape) over the last 30 days.

import Link from "next/link";

export const metadata = {
  title: "Margin · Ops",
};

type MarginRow = {
  type: string;
  tier: 1 | 2 | 3 | 4;
  count: number;
  costCents: number;
  priceCents: number;
};

const ROWS: MarginRow[] = [
  // Tier 1 — direct APIs (essentially free)
  { type: "nppes_lookup", tier: 1, count: 142, costCents: 0, priceCents: 0 },
  { type: "oig_screen_monthly", tier: 1, count: 1, costCents: 0, priceCents: 0 },
  { type: "sam_gov_screen_monthly", tier: 1, count: 1, costCents: 0, priceCents: 0 },
  { type: "checkr_background", tier: 1, count: 8, costCents: 4500 * 8, priceCents: 6000 * 8 },
  { type: "twilio_sms", tier: 1, count: 487, costCents: 75 * 487, priceCents: 0 },
  { type: "resend_email", tier: 1, count: 1_142, costCents: 4 * 1_142, priceCents: 0 },

  // Tier 2 — gated APIs via CVO partner
  { type: "caqh_proview_attest", tier: 2, count: 18, costCents: 1500 * 18, priceCents: 0 },
  { type: "npdb_query", tier: 2, count: 7, costCents: 400 * 7, priceCents: 0 },

  // Tier 3 — browser agents (compute + LLM tokens)
  { type: "optum_enrollment", tier: 3, count: 9, costCents: 50 * 9, priceCents: 30000 * 9 },
  { type: "carelon_enrollment", tier: 3, count: 6, costCents: 60 * 6, priceCents: 30000 * 6 },
  { type: "magellan_enrollment", tier: 3, count: 3, costCents: 55 * 3, priceCents: 30000 * 3 },
  { type: "evernorth_enrollment", tier: 3, count: 4, costCents: 50 * 4, priceCents: 30000 * 4 },
  { type: "anthem_bh_enrollment", tier: 3, count: 5, costCents: 65 * 5, priceCents: 30000 * 5 },

  // Tier 4 — human tasks (loaded $50/hr)
  { type: "state_board_email_verification", tier: 4, count: 12, costCents: 2500 * 12, priceCents: 30000 * 12 },
  { type: "payer_escalation_call", tier: 4, count: 4, costCents: 2500 * 4, priceCents: 30000 * 4 },
  { type: "state_medicaid_mco_enrollment", tier: 4, count: 2, costCents: 20000 * 2, priceCents: 60000 * 2 },
  { type: "notarized_document_coordination", tier: 4, count: 3, costCents: 5000 * 3, priceCents: 25000 * 3 },
  { type: "reference_check_outreach", tier: 4, count: 2, costCents: 7500 * 2, priceCents: 30000 * 2 },
];

const TIER_LABEL: Record<1 | 2 | 3 | 4, string> = {
  1: "Tier 1 · Direct API",
  2: "Tier 2 · CVO partner",
  3: "Tier 3 · Browser agent",
  4: "Tier 4 · Human task",
};

export default function MarginPage() {
  const fmt = (cents: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(cents / 100);

  const totalCost = ROWS.reduce((s, r) => s + r.costCents, 0);
  const totalPrice = ROWS.reduce((s, r) => s + r.priceCents, 0);
  const totalMargin = totalPrice - totalCost;
  const marginPct = totalPrice > 0 ? (totalMargin / totalPrice) * 100 : 0;

  // Subscription revenue (separate from per-action billing)
  const PROVIDERS = 214;
  const SUBSCRIPTION_PER_PROVIDER_MONTH = 3500;
  const monthlySubscription = PROVIDERS * SUBSCRIPTION_PER_PROVIDER_MONTH;

  // Margin by tier
  const byTier = (tier: 1 | 2 | 3 | 4) => {
    const tierRows = ROWS.filter((r) => r.tier === tier);
    const cost = tierRows.reduce((s, r) => s + r.costCents, 0);
    const price = tierRows.reduce((s, r) => s + r.priceCents, 0);
    return { cost, price, margin: price - cost };
  };

  return (
    <>
      <div className="ops-back">
        <Link href="/ops/queue">← Queue</Link>
      </div>

      <header className="ops-greet">
        <span className="ops-eyebrow">IAL §8 · Cost vs. customer price</span>
        <h1>Margin</h1>
        <p>
          What each integration type costs us to fulfill vs. what we
          charge the customer. Used to drive pricing decisions, CVO partner
          renegotiations, and engineering investment in browser-agent
          coverage. Snapshot: <strong>Mindscape Behavioral Health</strong>{" "}
          · last 30 days.
        </p>
      </header>

      <div className="ops-kpis" style={{ marginBottom: 16 }}>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Subscription rev (mo)</div>
          <div className="ops-kpi-val">{fmt(monthlySubscription)}</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Per-action rev</div>
          <div className="ops-kpi-val">{fmt(totalPrice)}</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Per-action cost</div>
          <div className="ops-kpi-val">{fmt(totalCost)}</div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Per-action margin</div>
          <div
            className={
              totalMargin >= 0 ? "ops-kpi-val" : "ops-kpi-val danger"
            }
            style={{ color: totalMargin >= 0 ? "#4F6B58" : undefined }}
          >
            {fmt(totalMargin)}
          </div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Per-action margin %</div>
          <div
            className={marginPct >= 50 ? "ops-kpi-val" : "ops-kpi-val warn"}
            style={{ color: marginPct >= 50 ? "#4F6B58" : undefined }}
          >
            {marginPct.toFixed(0)}%
          </div>
        </div>
        <div className="ops-kpi">
          <div className="ops-kpi-label">Outliers (cost &gt; 2× est.)</div>
          <div className="ops-kpi-val">1</div>
        </div>
      </div>

      <div className="margin-tier-grid">
        {([1, 2, 3, 4] as const).map((tier) => {
          const { cost, price, margin } = byTier(tier);
          const pct = price > 0 ? (margin / price) * 100 : 0;
          return (
            <div key={tier} className="margin-tier-card">
              <div className="margin-tier-label">{TIER_LABEL[tier]}</div>
              <div className="margin-tier-row">
                <span>Volume</span>
                <strong>
                  {ROWS.filter((r) => r.tier === tier).reduce(
                    (s, r) => s + r.count,
                    0,
                  )}
                </strong>
              </div>
              <div className="margin-tier-row">
                <span>Cost</span>
                <strong>{fmt(cost)}</strong>
              </div>
              <div className="margin-tier-row">
                <span>Price</span>
                <strong>{fmt(price)}</strong>
              </div>
              <div className="margin-tier-row highlight">
                <span>Margin</span>
                <strong style={{ color: margin >= 0 ? "#4F6B58" : "var(--danger)" }}>
                  {fmt(margin)} ({pct.toFixed(0)}%)
                </strong>
              </div>
            </div>
          );
        })}
      </div>

      <div className="ops-table-wrap" style={{ marginTop: 16 }}>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Integration type</th>
              <th>Tier</th>
              <th>Volume</th>
              <th>Cost</th>
              <th>Price</th>
              <th>Margin</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const margin = r.priceCents - r.costCents;
              const pct = r.priceCents > 0 ? (margin / r.priceCents) * 100 : 0;
              const marginToneClass =
                r.priceCents === 0
                  ? "margin-amount neutral"
                  : margin < 0
                    ? "margin-amount danger"
                    : margin / r.priceCents < 0.3
                      ? "margin-amount warn"
                      : "margin-amount good";
              return (
                <tr key={r.type} className="ops-row">
                  <td>
                    <code className="margin-type">{r.type}</code>
                  </td>
                  <td>
                    <span className={`tier-badge tier-${r.tier}`}>
                      T{r.tier}
                    </span>
                  </td>
                  <td className="audit-ts">{r.count}</td>
                  <td className="audit-ts">{fmt(r.costCents)}</td>
                  <td className="audit-ts">
                    {r.priceCents > 0 ? fmt(r.priceCents) : <span className="muted">included</span>}
                  </td>
                  <td>
                    <span className={marginToneClass}>
                      {r.priceCents === 0 ? "—" : fmt(margin)}
                    </span>
                  </td>
                  <td>
                    <span className={marginToneClass}>
                      {r.priceCents === 0 ? "—" : `${pct.toFixed(0)}%`}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="ops-foot">
        <strong>Outliers to investigate:</strong> Tier 4 actions where
        actual specialist hours exceeded 2× estimate. Currently 1 ticket
        in this window — the NY OP license-format reconciliation for T.
        Brooks (3 attempts). Worth a process retro to figure out whether
        provider follow-up flow needs to start sooner.
      </div>

      <div className="ops-foot" style={{ marginTop: 8 }}>
        <strong>Public pricing posture:</strong> $35/provider/month +
        &ldquo;starting at $300/enrollment&rdquo;. Backend tracks the actual
        cost and we eat margin on Tier 4-heavy customers during the design
        partner phase. Tiered public pricing is a year-2 conversation
        once we have data on the cost distribution.
      </div>
    </>
  );
}
