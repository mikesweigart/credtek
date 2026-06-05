// Save-and-finish-later for the /get-started onboarding wizard.
//
// POST  { token?, draft, stepIndex, email }  → upserts the in-progress draft
//        and emails the contact an opaque resume link, returns { ok, token }.
// GET   ?token=<uuid>                         → returns { ok, draft, stepIndex }
//        to rehydrate the wizard on another device.
//
// The token is an unguessable uuid and the ONLY thing in the resume URL — no
// PII in query strings. Drafts persist in intake_drafts (service-role only,
// RLS-locked). If Supabase isn't configured the save no-ops gracefully and the
// client keeps its on-device autosave.

import { NextResponse } from "next/server";
import { sendCredEmail, emailShell } from "../../../_lib/email/send";
import { supabaseAdmin } from "../../../_lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_DRAFT_BYTES = 256 * 1024;
const TTL_DAYS = 30;

// Per-IP token bucket.
const BUCKET_MAX = 20;
const BUCKET_WINDOW_MS = 10 * 60 * 1000;
const buckets = new Map<string, number[]>();

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "anon";
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

function baseUrl(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  return host ? `${proto}://${host}` : "https://cred-tek.com";
}

function str(v: unknown, max = 200): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = ((await req.json()) ?? {}) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }

  const email = str(body.email, 320);
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
  }
  const draft = body.draft;
  if (!draft || typeof draft !== "object") {
    return NextResponse.json({ ok: false, error: "no-draft" }, { status: 400 });
  }
  const serialized = JSON.stringify(draft);
  if (serialized.length > MAX_DRAFT_BYTES) {
    return NextResponse.json({ ok: false, error: "too-large" }, { status: 413 });
  }
  const stepIndex =
    typeof body.stepIndex === "number" && Number.isFinite(body.stepIndex)
      ? Math.max(0, Math.min(20, Math.trunc(body.stepIndex)))
      : 0;
  const d = draft as Record<string, unknown>;
  const path = d.path === "concierge" ? "concierge" : "self";
  const orgName = str(d.orgName, 200);
  const inToken = typeof body.token === "string" && UUID_RE.test(body.token) ? body.token : null;

  const admin = supabaseAdmin();
  if (!admin) {
    // No DB configured — can't mint a durable link. Client falls back to
    // its on-device autosave; tell it the link couldn't be sent.
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  const ua = req.headers.get("user-agent") ?? "—";
  const nowIso = new Date().toISOString();
  const expiresIso = new Date(Date.now() + TTL_DAYS * 86400000).toISOString();
  const row = {
    draft,
    step_index: stepIndex,
    path,
    org_name: orgName || null,
    contact_email: email,
    user_agent: ua,
    updated_at: nowIso,
    expires_at: expiresIso,
  };

  let token = inToken;
  try {
    if (token) {
      const { data, error } = await admin
        .from("intake_drafts")
        .update(row)
        .eq("token", token)
        .select("token")
        .maybeSingle();
      if (error || !data) token = null; // not found / expired → fall through to insert
    }
    if (!token) {
      const { data, error } = await admin
        .from("intake_drafts")
        .insert(row)
        .select("token")
        .single();
      if (error || !data) {
        return NextResponse.json({ ok: false, error: "save-failed" }, { status: 500 });
      }
      token = data.token as string;
    }
  } catch {
    // Table may not exist yet (migration 0008 not applied).
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }

  // ---- Email the resume link ----
  const link = `${baseUrl(req)}/get-started?resume=${token}`;
  const html = emailShell({
    preheader: "Pick up your CredTek onboarding right where you left off.",
    heading: "Finish your onboarding",
    body: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;">
        Your onboarding${orgName ? ` for <strong>${escapeHtml(orgName)}</strong>` : ""} is saved. Click below to
        pick up right where you left off — on any device. You can forward this email to a colleague if they're
        finishing it for you.
      </p>
      <p style="margin:0;font-size:13px;color:#67645c;">This link expires in ${TTL_DAYS} days.</p>`,
    ctaLabel: "Resume onboarding",
    ctaHref: link,
    footer: "You requested this link from cred-tek.com/get-started. If you didn't, you can ignore this email.",
  });

  const res = await sendCredEmail({
    to: email,
    subject: "Finish your CredTek onboarding",
    html,
    text: `Pick up your CredTek onboarding where you left off:\n${link}\n\nThis link expires in ${TTL_DAYS} days.`,
  });

  if (!res.ok) {
    // Saved fine, but the email failed — surface so the client can advise.
    return NextResponse.json({ ok: true, token, emailed: false }, { status: 200 });
  }
  return NextResponse.json({ ok: true, token, emailed: true });
}

export async function GET(req: Request) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }
  const token = new URL(req.url).searchParams.get("token") || "";
  if (!UUID_RE.test(token)) {
    return NextResponse.json({ ok: false, error: "bad-token" }, { status: 400 });
  }
  const admin = supabaseAdmin();
  if (!admin) {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
  try {
    const { data, error } = await admin
      .from("intake_drafts")
      .select("draft, step_index, expires_at")
      .eq("token", token)
      .maybeSingle();
    if (error || !data) {
      return NextResponse.json({ ok: false, error: "not-found" }, { status: 404 });
    }
    if (data.expires_at && new Date(data.expires_at as string).getTime() < Date.now()) {
      return NextResponse.json({ ok: false, error: "expired" }, { status: 410 });
    }
    return NextResponse.json({ ok: true, draft: data.draft, stepIndex: data.step_index ?? 0 });
  } catch {
    return NextResponse.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
