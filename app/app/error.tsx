"use client";

// Friendly error boundary for the authenticated app. Replaces any
// uncaught render error with a calm explanation + Retry/Home actions
// so users never see a Next.js stack-trace shell.

import Link from "next/link";
import { useEffect } from "react";

export default function PortalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[credtek-app:error]", error);
  }, [error]);

  return (
    <div className="portal-error">
      <div className="portal-error-card">
        <div className="portal-error-icon">⚠</div>
        <h1 className="portal-error-title">Something went sideways.</h1>
        <p className="portal-error-body">
          The workspace hit an unexpected error rendering this page. Your data is safe — nothing was lost.
          Try again, or head back to the dashboard.
        </p>
        {error?.digest && (
          <p className="portal-error-digest">
            Reference: <code>{error.digest}</code>
          </p>
        )}
        <div className="portal-error-actions">
          <button type="button" onClick={reset} className="acct-btn-primary">Try again</button>
          <Link href="/app" className="acct-btn-secondary">Dashboard</Link>
          <a href="mailto:support@cred-tek.com" className="acct-btn-secondary">Email support</a>
        </div>
      </div>
    </div>
  );
}
