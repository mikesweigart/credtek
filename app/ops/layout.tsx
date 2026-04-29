// /ops/* layout. Internal-tool aesthetic — dense, functional, distinct
// from the customer-facing (app) shell. The audience is credentialing
// specialists (CVO partner staff in year 1, internal ops in year 2).

import Link from "next/link";
import type { ReactNode } from "react";

export default function OpsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ops-shell">
      <header className="ops-topbar">
        <Link href="/ops/queue" className="ops-logo">
          <div className="ops-logo-mark">C</div>
          <div className="ops-logo-text">
            CredTek <span className="ops-logo-suffix">/ Ops</span>
          </div>
        </Link>

        <nav className="ops-topnav">
          <Link href="/ops/queue" className="ops-topnav-link active">
            Queue
          </Link>
          <span className="ops-topnav-link disabled">Templates</span>
          <span className="ops-topnav-link disabled">Audit log</span>
          <span className="ops-topnav-link disabled">Margin</span>
        </nav>

        <div className="ops-topbar-right">
          <span className="ops-pill">CVO partner · Andros Health</span>
          <span className="ops-pill">Internal ops · 2 specialists</span>
          <Link href="/dashboard" className="ops-switch">
            ← Back to customer view
          </Link>
        </div>
      </header>
      <main className="ops-main">{children}</main>
    </div>
  );
}
