// Client-side Sentry init. No-ops gracefully when NEXT_PUBLIC_SENTRY_DSN
// isn't set, so the build stays green in environments without keys.
//
// To go live:
//   1. Create a Sentry project at sentry.io (Next.js project type)
//   2. Set NEXT_PUBLIC_SENTRY_DSN=https://...@...ingest.sentry.io/...
//   3. (Optional) SENTRY_AUTH_TOKEN + SENTRY_ORG + SENTRY_PROJECT for source maps
//   4. Redeploy

import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  });
}
