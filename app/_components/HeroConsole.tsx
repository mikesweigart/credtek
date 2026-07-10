// HeroConsole — the floating "credentialing console" product mock under the
// hero. Static markup (no interactivity); it shows the real product shape —
// KPI tiles + a provider pipeline with progress + status — which is the most
// modern, most honest hero element we can lead with. Namespaced .hcon-* so it
// can't collide with the rest of the landing CSS.

const SHIELD = (
  <svg width="16" height="15" viewBox="0 0 30 28" fill="none" aria-hidden="true">
    <path d="M15 2.2 4.5 6.1v7.4c0 6.5 4.4 10.4 10.5 12.3 6.1-1.9 10.5-5.8 10.5-12.3V6.1L15 2.2Z" stroke="#2E7BFF" strokeWidth="2.4" strokeLinejoin="round" />
    <path d="m10.4 14.2 3.3 3.3 6.1-6.6" stroke="#0467DE" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

type Row = {
  initials: string;
  grad: string;
  name: string;
  meta: string;
  pct: number;
  stage: string;
  pill: string;
  pillClass: string;
};

const ROWS: Row[] = [
  { initials: "AR", grad: "linear-gradient(135deg,#2E7BFF,#0467DE)", name: "Dr. Aisha Reyes, MD", meta: "Emergency Medicine · WA, OR", pct: 88, stage: "Payer enrollment · 88%", pill: "Active", pillClass: "hcon-p-active" },
  { initials: "JM", grad: "linear-gradient(135deg,#0F9D6C,#0B7E56)", name: "James Mitchell, NP", meta: "Behavioral Health · CA", pct: 62, stage: "Primary-source verification · 62%", pill: "Enrolling", pillClass: "hcon-p-enr" },
  { initials: "KP", grad: "linear-gradient(135deg,#7C5CFF,#5B3FD6)", name: "Kevin Park, PA-C", meta: "Orthopedics · TX, NM", pct: 34, stage: "Intake & profile · 34%", pill: "Needs docs", pillClass: "hcon-p-flag" },
  { initials: "LS", grad: "linear-gradient(135deg,#0467DE,#0B4E9E)", name: "Dr. Lena Soto, DO", meta: "Family Medicine · FL", pct: 100, stage: "Approved · ready to bill", pill: "Active", pillClass: "hcon-p-active" },
];

export function HeroConsole() {
  return (
    <div className="hcon-wrap" aria-hidden="true">
      <div className="hcon">
        <div className="hcon-bar">
          <span className="hcon-traf"><i style={{ background: "#F0645A" }} /><i style={{ background: "#F5BE4F" }} /><i style={{ background: "#5BC46A" }} /></span>
          <span className="hcon-tenant">{SHIELD} Eastside Hospital · Credentialing</span>
          <span className="hcon-search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#95A9BE" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" /></svg>
            Search 214 providers…
          </span>
        </div>
        <div className="hcon-body">
          <div className="hcon-kpis">
            <div className="hcon-kpi"><div className="hcon-k-lbl">Providers</div><div className="hcon-k-val">214</div></div>
            <div className="hcon-kpi"><div className="hcon-k-lbl">Ready to bill</div><div className="hcon-k-val">38 <span className="hcon-k-chip hcon-k-up">▲ 9</span></div></div>
            <div className="hcon-kpi"><div className="hcon-k-lbl">Avg days to billable</div><div className="hcon-k-val">51</div></div>
            <div className="hcon-kpi"><div className="hcon-k-lbl">Needs attention</div><div className="hcon-k-val">3 <span className="hcon-k-chip hcon-k-warn">SLA</span></div></div>
          </div>
          <div className="hcon-pipe">
            <div className="hcon-pipe-head"><span>Provider</span><span>Credentialing stage</span><span>Status</span></div>
            {ROWS.map((r) => (
              <div className="hcon-row" key={r.initials}>
                <div className="hcon-who">
                  <span className="hcon-av" style={{ background: r.grad }}>{r.initials}</span>
                  <span><span className="hcon-nm">{r.name}</span><br /><span className="hcon-cr">{r.meta}</span></span>
                </div>
                <div>
                  <div className="hcon-track"><i style={{ width: `${r.pct}%` }} /></div>
                  <div className="hcon-stg">{r.stage}</div>
                </div>
                <span className={`hcon-pill ${r.pillClass}`}>{r.pill}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
