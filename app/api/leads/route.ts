// Lead capture — the self-serve demo path's missing half.
//
// The landing page's EmailDemoModal collects a work email + facility +
// size, then launches the guided interactive demo. Until now that lead
// lived ONLY in the visitor's localStorage and was never transmitted, so
// the business never learned who started a demo. This endpoint closes
// that gap: it emails the lead to the team the instant it's captured
// (and best-effort persists it), reusing the same Resend infra as
// /api/feedback. Falls back to server-console logging when RESEND_API_KEY
// isn't set yet, so the flow works in every environment.

import { NextResponse } from "next/server";
import { sendCredEmail, emailShell } from "../../_lib/email/send";
import { supabaseAdmin } from "../../_lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Leads route to the same inbox as feedback unless a dedicated address is
// set. CREDTEK_LEADS_TO overrides; CREDTEK_FEEDBACK_TO is the shared
// fallback already used in production.
const LEADS_TO =
  process.env.CREDTEK_LEADS_TO ||
  process.env.CREDTEK_FEEDBACK_TO ||
  "mikesweigart@yahoo.com";

// In-memory token bucket per IP — same pattern as /api/feedback. Good
// enough to blunt abuse of an unauthenticated endpoint; a shared store
// (Upstash) is the production upgrade. Slightly more generous than
// feedback since a visitor might legitimately resubmit.
const BUCKET_MAX = 8;
const BUCKET_WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anon";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = (buckets.get(ip) ?? []).filter((t) => now - t < BUCKET_WINDOW_MS);
  if (bucket.length >= BUCKET_MAX) {
    buckets.set(ip, bucket);
    return true;
  }
  bucket.push(now);
  buckets.set(ip, bucket);
  return false;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const BUCKET_LABEL: Record<string, string> = {
  solo: "Solo",
  "2-49": "2–49 providers",
  "50-99": "50–99 providers",
  "100-499": "100–499 providers",
  "500+": "500+ providers",
};

export async function POST(req: Request) {
  // Rate limit FIRST — before parsing the body.
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate-limited" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: {
    email?: string;
    facility?: string;
    bucket?: string;
    source?: string;
  } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const email = (body.email ?? "").trim();
  const facility = (body.facility ?? "").trim();
  const bucket = (body.bucket ?? "").trim();
  const source = (body.source ?? "landing-demo-modal").trim();

  // Minimal but real email validation (mirrors the modal, slightly stricter).
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 320) {
    return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
  }
  if (facility.length > 200 || bucket.length > 40 || source.length > 60) {
    return NextResponse.json({ ok: false, error: "too-long" }, { status: 400 });
  }

  const sizeLabel = BUCKET_LABEL[bucket] ?? (bucket || "—");
  const ua = req.headers.get("user-agent") ?? "—";
  const referer = req.headers.get("referer") ?? "—";

  // ---- Best-effort persistence (never blocks the response) ----
  // Inserts into a `leads` table if it exists; silently no-ops if the
  // table or backend isn't configured yet, so this works before any
  // migration runs. The email below is the reliable delivery channel.
  try {
    const admin = supabaseAdmin();
    if (admin) {
      await admin.from("leads").insert({
        email,
        facility: facility || null,
        size_bucket: bucket || null,
        source,
        user_agent: ua,
        referer,
      });
    }
  } catch {
    // Table may not exist yet — ignore. Email still goes out below.
  }

  // ---- Email the team (primary, reliable channel) ----
  const subject = `New CredTek demo lead — ${email}${sizeLabel !== "—" ? ` (${sizeLabel})` : ""}`;
  const html = emailShell({
    preheader: subject,
    heading: "New interactive-demo lead",
    body: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;">
        Someone just started the self-serve interactive demo from the landing page.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;color:#2b2a26;">
        <tr><td style="padding:6px 0;color:#67645c;width:130px;">Work email</td><td style="padding:6px 0;"><strong>${esc(email)}</strong></td></tr>
        <tr><td style="padding:6px 0;color:#67645c;">Facility / group</td><td style="padding:6px 0;">${esc(facility) || "—"}</td></tr>
        <tr><td style="padding:6px 0;color:#67645c;">Roster size</td><td style="padding:6px 0;">${esc(sizeLabel)}</td></tr>
        <tr><td style="padding:6px 0;color:#67645c;">Source</td><td style="padding:6px 0;">${esc(source)}</td></tr>
        <tr><td style="padding:6px 0;color:#67645c;">Referer</td><td style="padding:6px 0;font-size:12px;">${esc(referer)}</td></tr>
      </table>`,
    ctaLabel: "Email this lead",
    ctaHref: `mailto:${email}`,
    footer: "Sent automatically when a visitor starts the interactive demo on cred-tek.com.",
  });

  const res = await sendCredEmail({
    to: LEADS_TO,
    subject,
    html,
    text: `New CredTek demo lead\n\nWork email: ${email}\nFacility: ${facility || "—"}\nRoster size: ${sizeLabel}\nSource: ${source}\nReferer: ${referer}\nUA: ${ua}`,
    replyTo: email,
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, mode: res.mode });
}
