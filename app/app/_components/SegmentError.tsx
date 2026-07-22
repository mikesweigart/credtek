"use client";

// Shared error-boundary body for /app route segments.
//
// Two jobs. First, never show a customer a Next.js stack-trace shell.
// Second — and this is the part that was missing — actually REPORT the
// error. The previous boundary only console.error'd, which means every
// production render failure died in a browser console we'll never read.
// A crash nobody hears about gets fixed the day a customer complains,
// which is the most expensive possible moment.
//
// Scoped per segment so a failure in, say, the coverage matrix leaves the
// nav and the rest of the workspace usable, and "Try again" retries only
// that segment instead of reloading everything.

import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export function SegmentError({
  error,
  reset,
  area,
  title,
  body,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  /** Stable slug for grouping in Sentry, e.g. "coverage". */
  area: string;
  title: string;
  body: string;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(`[credtek-app:error:${area}]`, error);
    Sentry.captureException(error, {
      tags: { area: `app/${area}` },
      extra: { digest: error?.digest },
    });
  }, [error, area]);

  return (
    <div className="portal-error">
      <div className="portal-error-card">
        <div className="portal-error-icon">⚠</div>
        <h1 className="portal-error-title">{title}</h1>
        <p className="portal-error-body">{body}</p>
        {error?.digest && (
          <p className="portal-error-digest">
            Reference: <code>{error.digest}</code>
          </p>
        )}
        <div className="portal-error-actions">
          <button type="button" onClick={reset} className="acct-btn-primary">
            Try again
          </button>
          <Link href="/app" className="acct-btn-secondary">
            Dashboard
          </Link>
          <a href="mailto:support@cred-tek.com" className="acct-btn-secondary">
            Email support
          </a>
        </div>
      </div>
    </div>
  );
}
