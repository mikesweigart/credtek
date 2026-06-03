"use client";

// PostHog product analytics — captures page views + custom events.
// No-ops gracefully when NEXT_PUBLIC_POSTHOG_KEY isn't set.
//
// To go live:
//   1. Create a PostHog project at posthog.com (Web Analytics product)
//   2. Set NEXT_PUBLIC_POSTHOG_KEY=phc_...
//   3. (Optional) NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
//   4. Redeploy
//
// Captured automatically: pageviews, click events on anything with a
// data-ph-event attribute, and session recordings (sampled).

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

let initialized = false;
function ensureInit() {
  if (initialized) return;
  if (!PH_KEY) return;
  if (typeof window === "undefined") return;
  posthog.init(PH_KEY, {
    api_host: PH_HOST,
    capture_pageview: false, // we drive pageviews manually below
    capture_pageleave: true,
    session_recording: { recordCrossOriginIframes: false },
    autocapture: { dom_event_allowlist: ["click", "submit"] },
  });
  initialized = true;
}

export function Analytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    if (!PH_KEY) return;
    ensureInit();
    const url = pathname + (search?.toString() ? `?${search.toString()}` : "");
    posthog.capture("$pageview", { $current_url: url });
  }, [pathname, search]);

  return null;
}

/** Manual event capture — call from anywhere in client code. */
export function track(event: string, properties?: Record<string, unknown>) {
  if (!PH_KEY) return;
  if (!initialized) ensureInit();
  if (initialized) posthog.capture(event, properties);
}
