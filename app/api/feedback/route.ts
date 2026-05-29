// Feedback channel — Chris (or any signed-in user) posts a note from
// inside Cred and we email it to Mike. Falls back to console logging if
// RESEND_API_KEY isn't set yet, so the UI flow still works in dev.

import { NextResponse } from "next/server";
import { getSessionContext } from "../../_lib/data/workspace";
import { sendCredEmail, emailShell } from "../../_lib/email/send";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FEEDBACK_TO = process.env.CREDTEK_FEEDBACK_TO || "mikesweigart@yahoo.com";

export async function POST(req: Request) {
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
