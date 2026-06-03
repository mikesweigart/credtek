// Feedback channel — Chris (or any signed-in user) posts a note from
// inside Cred and we email it to Mike. Falls back to console logging if
// RESEND_API_KEY isn't set yet, so the UI flow still works in dev.

import { NextResponse } from "next/server";
import { getSessionContext } from "../../_lib/data/workspace";
import { sendCredEmail, emailShell } from "../../_lib/email/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEEDBACK_TO = process.env.CREDTEK_FEEDBACK_TO || "mikesweigart@yahoo.com";

// Simple in-memory token bucket per IP — good enough until we add
// Upstash Redis. Each IP gets BUCKET_MAX hits per BUCKET_WINDOW_MS.
// Note: on Vercel serverless, this map is per-function-instance, so
// the effective ceiling across replicas is higher than the constant
// suggests. That's fine for a feedback endpoint — production-grade
// rate limiting would move to Upstash + a shared counter.
const BUCKET_MAX = 5;
const BUCKET_WINDOW_MS = 5 * 60 * 1000;
const buckets = new Map<string, number[]>();

function clientIp(req: Request): string {
  // Trust Vercel's forwarding headers.
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "anon";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = (buckets.get(ip) ?? []).filter(
    (t) => now - t < BUCKET_WINDOW_MS
  );
  if (bucket.length >= BUCKET_MAX) {
    buckets.set(ip, bucket);
    return true;
  }
  bucket.push(now);
  buckets.set(ip, bucket);
  return false;
}

export async function POST(req: Request) {
  // Rate limit FIRST — before parsing the body, before any DB call.
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate-limited" },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  let body: { message?: string; page?: string; mood?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }
  const message = (body.message ?? "").trim();
  const page = (body.page ?? "").trim();
  const mood = (body.mood ?? "").trim();

  if (!message) {
    return NextResponse.json({ ok: false, error: "empty" }, { status: 400 });
  }
  if (message.length > 4000) {
    return NextResponse.json({ ok: false, error: "too-long" }, { status: 400 });
  }

  const ctx = await getSessionContext();
  const who = ctx.fullName || ctx.email || "anonymous";
  const subject = `CredTek feedback from ${who}${mood ? ` (${mood})` : ""}`;

  const safeMsg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const html = emailShell({
    preheader: subject,
    heading: `Feedback from ${who}`,
    body: `
      <p style="margin:0 0 12px;color:#67645c;font-size:12.5px;">
        <strong>From:</strong> ${who} (${ctx.email ?? "no email"})<br />
        <strong>Workspace:</strong> ${ctx.tenantName ?? "—"} · ${ctx.role ?? "—"}<br />
        <strong>Page:</strong> ${page || "—"}<br />
        ${mood ? `<strong>Mood:</strong> ${mood}<br />` : ""}
      </p>
      <p style="white-space:pre-wrap;font-size:15px;line-height:1.6;margin:0;">${safeMsg}</p>
    `,
    footer: "Sent from the in-app Cred guide.",
  });

  const res = await sendCredEmail({
    to: FEEDBACK_TO,
    subject,
    html,
    text: `From: ${who} (${ctx.email ?? "no email"})\nWorkspace: ${
      ctx.tenantName ?? "—"
    } · ${ctx.role ?? "—"}\nPage: ${page || "—"}\nMood: ${mood || "—"}\n\n${message}`,
    replyTo: ctx.email ?? undefined,
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, mode: res.mode });
}
