// /ops/* layout. Internal-tool aesthetic — dense, functional, distinct
// from the customer-facing (app) shell. The audience is credentialing
// specialists (CVO partner staff in year 1, internal ops in year 2).

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const NAV = [
  { label: "Queue", href: "/ops/queue" },
  { label: "Audit log", href: "/ops/audit" },
  { label: "Margin", href: "/ops/margin" },
];

export default function OpsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname() ?? "/ops/queue";
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
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active ? "ops-topnav-link active" : "ops-topnav-link"
                }
              >
                {item.label}
              </Link>
            );
          })}
          <span className="ops-topnav-link disabled">Templates</span>
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
