// Loading skeleton for the workspace. Renders during server-component
// data fetches so navigation always feels instant, not blank.

export default function PortalLoading() {
  return (
    <div aria-busy="true" aria-label="Loading workspace">
      <div className="portal-head">
        <div className="sk-line sk-line-h1" />
        <div className="sk-line sk-line-sub" />
      </div>
      <div className="portal-kpis">
        <div className="portal-kpi"><div className="sk-line sk-line-kpi-lbl" /><div className="sk-line sk-line-kpi-val" /></div>
        <div className="portal-kpi"><div className="sk-line sk-line-kpi-lbl" /><div className="sk-line sk-line-kpi-val" /></div>
        <div className="portal-kpi"><div className="sk-line sk-line-kpi-lbl" /><div className="sk-line sk-line-kpi-val" /></div>
        <div className="portal-kpi"><div className="sk-line sk-line-kpi-lbl" /><div className="sk-line sk-line-kpi-val" /></div>
      </div>
      <div className="portal-card">
        <div className="sk-line sk-line-card-head" />
        <div className="sk-line sk-line-row" />
        <div className="sk-line sk-line-row" />
        <div className="sk-line sk-line-row" />
      </div>
    </div>
  );
}
