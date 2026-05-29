// Real authenticated application shell (/app/*). Auth-gated. Reuses the
// CredTek .shell-* styling. Resolves the user's workspace (self-healing)
// and renders the live product behind the login.

import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionContext, ROLE_LABEL } from "../_lib/data/workspace";
import { SignOutButton } from "../account/SignOutButton";
import { PortalNav } from "./_components/PortalNav";

export const metadata = { title: "Workspace · CredTek" };
export const dynamic = "force-dynamic";

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const ctx = await getSessionContext();

  if (!ctx.configured) {
    return (
      <div className="acct-shell">
        <div className="acct-card">
          <h1 className="acct-h1">Backend not configured</h1>
          <p className="acct-p">
            Supabase environment variables aren&apos;t set in this environment yet.
          </p>
          <Link href="/" className="acct-link">← Back to site</Link>
        </div>
      </div>
    );
  }
  if (!ctx.userId) redirect("/sign-in");

  return (
    <div className="shell">
      <aside className="shell-sb">
        <div className="shell-sb-logo">
          <div className="shell-sb-logo-mark">C</div>
          <div className="shell-sb-logo-text">CredTek</div>
        </div>

        <div className="shell-sb-section">Workspace</div>
        <PortalNav />

        <div className="shell-sb-foot">
          <div className="shell-sb-foot-meta">
            {ctx.tenantName ?? "Your workspace"}
          </div>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="shell-search" style={{ pointerEvents: "none" }}>
            {ctx.tenantName ?? "Workspace"}
          </div>
          <div className="shell-topbar-actions">
            {ctx.role && (
              <span className={`portal-role-badge role-${ctx.role}`}>
                {ROLE_LABEL[ctx.role] ?? ctx.role}
              </span>
            )}
            <span className="shell-topbar-shortcut">{ctx.email}</span>
            <SignOutButton />
          </div>
        </header>
        <main className="shell-content">{children}</main>
      </div>
    </div>
  );
}
