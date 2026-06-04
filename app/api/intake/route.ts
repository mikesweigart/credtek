// Group onboarding / intake submissions.
//
// Receives a structured onboarding payload from the /get-started wizard
// (self-serve provider list OR a concierge roster summary), emails the team
// a formatted brief, and best-effort persists it. Mirrors /api/leads:
// Resend for delivery (falls back to server-console logging when
// RESEND_API_KEY isn't set), in-memory per-IP rate limiting, and a
// try/catch Supabase insert that no-ops until the table exists.
//
// NOTE: no PHI files are uploaded here. For the concierge path the browser
// sends only the filename + a row count; a coordinator follows up with a
// secure link to receive the actual roster file.

import { NextResponse } from "next/server";
import { sendCredEmail, emailShell } from "../../_lib/email/send";
import { supabaseAdmin } from "../../_lib/supabase/server";
import {
  STATE_NAME_BY_CODE,
  PAYOR_NAME_BY_ID,
  SIZE_BUCKETS,
  ENGAGEMENT_LABEL_BY_ID,
  isValidNpi,
  type ProviderDraft,
} from "../../_components/intakeData";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const INTAKE_TO =
  process.env.CREDTEK_INTAKE_TO ||
  process.env.CREDTEK_LEADS_TO ||
  process.env.CREDTEK_FEEDBACK_TO ||
  "mikesweigart@yahoo.com";

// Per-IP token bucket — onboarding is heavier than a lead, so keep it tight.
const BUCKET_MAX = 6;
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

function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIZE_LABEL: Record<string, string> = Object.fromEntries(
  SIZE_BUCKETS.map((b) => [b.id, b.label]),
);

// Defensive cleaners — everything off the wire is untrusted.
function str(v: unknown, max = 300): string {
  return typeof v === "string" ? v.slice(0, max) : "";
}
function strArr(v: unknown, max = 80): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string").slice(0, max) as string[];
}
function cleanProviders(v: unknown, max = 600): ProviderDraft[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, max).map((p) => {
    const o = (p ?? {}) as Record<string, unknown>;
    return {
      id: str(o.id, 60),
      firstName: str(o.firstName, 80),
      lastName: str(o.lastName, 80),
      credential: str(o.credential, 40),
      npi: str(o.npi, 20),
      caqhId: str(o.caqhId, 30),
      dea: str(o.dea, 20),
      primaryState: str(o.primaryState, 4),
      specialty: str(o.specialty, 80),
      email: str(o.email, 200),
    };
  });
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate-limited" },
      { status: 429, headers: { "Retry-After": "60" } },
    );
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-json" }, { status: 400 });
  }
  const body = (raw ?? {}) as Record<string, unknown>;

  const path = body.path === "concierge" ? "concierge" : "self";
  const orgName = str(body.orgName, 200);
  const groupNpi = str(body.groupNpi, 20);
  const engagementType = str(body.engagementType, 40);
  const contactName = str(body.contactName, 160);
  const contactEmail = str(body.contactEmail, 320);
  const contactPhone = str(body.contactPhone, 60);
  const sizeBucket = str(body.sizeBucket, 40);
  const states = strArr(body.states);
  const payors = strArr(body.payors);
  const providers = cleanProviders(body.providers);
  const rosterFileName = str(body.rosterFileName, 260);
  const rosterRowCount =
    typeof body.rosterRowCount === "number" && Number.isFinite(body.rosterRowCount)
      ? Math.max(0, Math.min(100000, Math.trunc(body.rosterRowCount)))
      : null;
  const notes = str(body.notes, 4000);
  const authPsv = body.authPsv === true;
  const authBaa = body.authBaa === true;

  // Minimal validation — a real org name + a deliverable contact email.
  if (orgName.trim().length < 2) {
    return NextResponse.json({ ok: false, error: "missing-org" }, { status: 400 });
  }
  if (!EMAIL_RE.test(contactEmail)) {
    return NextResponse.json({ ok: false, error: "invalid-email" }, { status: 400 });
  }

  const ua = req.headers.get("user-agent") ?? "—";
  const referer = req.headers.get("referer") ?? "—";
  const sizeLabel = SIZE_LABEL[sizeBucket] ?? (sizeBucket || "—");
  const engagementLabel = ENGAGEMENT_LABEL_BY_ID[engagementType] ?? (engagementType || "—");
  const stateNames = states.map((c) => STATE_NAME_BY_CODE[c] ?? c);
  const payorNames = payors.map((id) => PAYOR_NAME_BY_ID[id] ?? id);
  const invalidNpis = providers.filter(
    (p) => p.npi.replace(/\D/g, "").length > 0 && !isValidNpi(p.npi),
  ).length;

  // ---- Best-effort persistence (never blocks the response) ----
  try {
    const admin = supabaseAdmin();
    if (admin) {
      await admin.from("intake_submissions").insert({
        path,
        org_name: orgName,
        group_npi: groupNpi || null,
        engagement_type: engagementType || null,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        size_bucket: sizeBucket || null,
        states,
        payors,
        providers,
        roster_file_name: rosterFileName || null,
        roster_row_count: rosterRowCount,
        notes: notes || null,
        auth_psv: authPsv,
        auth_baa: authBaa,
        user_agent: ua,
        referer,
        source: "get-started",
      });
    }
  } catch {
    // Table may not exist yet — the email below is the reliable channel.
  }

  // ---- Build the team email ----
  const providerCountLabel =
    path === "concierge"
      ? rosterRowCount != null
        ? `${rosterRowCount} (roster)`
        : "roster upload"
      : `${providers.length}`;

  const subject = `New CredTek onboarding — ${orgName} (${path}, ${providerCountLabel} providers, ${states.length} states)`;

  const providerRows = providers
    .slice(0, 120)
    .map((p, i) => {
      const npiClean = p.npi.replace(/\D/g, "");
      const npiOk = npiClean.length === 0 || isValidNpi(p.npi);
      const npiCell = npiClean
        ? `<span style="color:${npiOk ? "#2b2a26" : "#B8553F"};">${esc(p.npi)}${npiOk ? "" : " ⚠ invalid"}</span>`
        : "—";
      return `<tr>
        <td style="padding:5px 8px;color:#67645c;border-top:1px solid #efece4;">${i + 1}</td>
        <td style="padding:5px 8px;border-top:1px solid #efece4;"><strong>${esc(`${p.firstName} ${p.lastName}`.trim()) || "—"}</strong></td>
        <td style="padding:5px 8px;border-top:1px solid #efece4;">${esc(p.credential) || "—"}</td>
        <td style="padding:5px 8px;border-top:1px solid #efece4;">${npiCell}</td>
        <td style="padding:5px 8px;border-top:1px solid #efece4;">${esc(p.caqhId) || "—"}</td>
        <td style="padding:5px 8px;border-top:1px solid #efece4;">${esc(p.primaryState) || "—"}</td>
        <td style="padding:5px 8px;border-top:1px solid #efece4;">${esc(p.specialty) || "—"}</td>
        <td style="padding:5px 8px;border-top:1px solid #efece4;font-size:12px;">${esc(p.email) || "—"}</td>
      </tr>`;
    })
    .join("");

  const providersBlock =
    path === "self" && providers.length
      ? `<h2 style="font-size:14px;margin:22px 0 8px;color:#0f1f1c;">Providers (${providers.length}${invalidNpis ? ` · ${invalidNpis} NPI need a look` : ""})</h2>
         <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;font-size:13px;color:#2b2a26;">
           <tr style="text-align:left;color:#67645c;font-size:11px;text-transform:uppercase;letter-spacing:0.04em;">
             <th style="padding:0 8px 4px;">#</th><th style="padding:0 8px 4px;">Name</th><th style="padding:0 8px 4px;">Cred</th><th style="padding:0 8px 4px;">NPI</th><th style="padding:0 8px 4px;">CAQH</th><th style="padding:0 8px 4px;">State</th><th style="padding:0 8px 4px;">Specialty</th><th style="padding:0 8px 4px;">Email</th>
           </tr>
           ${providerRows}
         </table>${providers.length > 120 ? `<p style="font-size:12px;color:#67645c;margin:6px 0 0;">+ ${providers.length - 120} more not shown.</p>` : ""}`
      : "";

  const rosterBlock =
    path === "concierge"
      ? `<h2 style="font-size:14px;margin:22px 0 8px;color:#0f1f1c;">Roster (concierge data entry)</h2>
         <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;color:#2b2a26;">
           <tr><td style="padding:5px 0;color:#67645c;width:150px;">File</td><td style="padding:5px 0;"><strong>${esc(rosterFileName) || "—"}</strong></td></tr>
           <tr><td style="padding:5px 0;color:#67645c;">Detected rows</td><td style="padding:5px 0;">${rosterRowCount != null ? rosterRowCount : "to confirm"}</td></tr>
         </table>
         <p style="font-size:13px;color:#B8553F;margin:8px 0 0;"><strong>Action:</strong> send ${esc(contactName) || "the contact"} a secure upload link to receive the file.</p>`
      : "";

  const html = emailShell({
    preheader: subject,
    heading: `New onboarding · ${orgName}`,
    body: `
      <p style="margin:0 0 14px;font-size:15px;line-height:1.55;">
        A ${path === "concierge" ? "<strong>concierge (we enter the roster)</strong>" : "<strong>self-serve</strong>"} onboarding just came in from /get-started.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width:100%;font-size:14px;color:#2b2a26;">
        <tr><td style="padding:5px 0;color:#67645c;width:150px;">Group</td><td style="padding:5px 0;"><strong>${esc(orgName)}</strong></td></tr>
        <tr><td style="padding:5px 0;color:#67645c;">Needs</td><td style="padding:5px 0;">${esc(engagementLabel)}</td></tr>
        <tr><td style="padding:5px 0;color:#67645c;">Contact</td><td style="padding:5px 0;">${esc(contactName) || "—"}</td></tr>
        <tr><td style="padding:5px 0;color:#67645c;">Email</td><td style="padding:5px 0;"><strong>${esc(contactEmail)}</strong></td></tr>
        <tr><td style="padding:5px 0;color:#67645c;">Phone</td><td style="padding:5px 0;">${esc(contactPhone) || "—"}</td></tr>
        <tr><td style="padding:5px 0;color:#67645c;">Group size</td><td style="padding:5px 0;">${esc(sizeLabel)}</td></tr>
        <tr><td style="padding:5px 0;color:#67645c;">Group NPI (Type 2)</td><td style="padding:5px 0;">${esc(groupNpi) || "—"}</td></tr>
        <tr><td style="padding:5px 0;color:#67645c;vertical-align:top;">States (${stateNames.length})</td><td style="padding:5px 0;">${esc(stateNames.join(", ")) || "—"}</td></tr>
        <tr><td style="padding:5px 0;color:#67645c;vertical-align:top;">Payors (${payorNames.length})</td><td style="padding:5px 0;">${esc(payorNames.join(", ")) || "—"}</td></tr>
        <tr><td style="padding:5px 0;color:#67645c;">Authorizations</td><td style="padding:5px 0;">PSV ${authPsv ? "✓" : "✗"} · BAA ${authBaa ? "✓" : "✗"}</td></tr>
      </table>
      ${providersBlock}
      ${rosterBlock}
      ${notes ? `<h2 style="font-size:14px;margin:22px 0 8px;color:#0f1f1c;">Notes</h2><p style="font-size:14px;line-height:1.55;color:#2b2a26;white-space:pre-wrap;">${esc(notes)}</p>` : ""}`,
    ctaLabel: "Reply to this group",
    ctaHref: `mailto:${contactEmail}`,
    footer: "Sent automatically when a group submits onboarding at cred-tek.com/get-started.",
  });

  const textProviders =
    path === "self"
      ? providers
          .map(
            (p, i) =>
              `  ${i + 1}. ${`${p.firstName} ${p.lastName}`.trim()} — ${p.credential || "?"} — NPI ${p.npi || "—"}${p.caqhId ? ` — CAQH ${p.caqhId}` : ""}${p.dea ? ` — DEA ${p.dea}` : ""} — ${p.primaryState || "—"}`,
          )
          .join("\n")
      : `  Roster: ${rosterFileName || "—"} (${rosterRowCount != null ? rosterRowCount : "rows TBD"})`;

  const text = `New CredTek onboarding (${path})

Group: ${orgName}
Needs: ${engagementLabel}
Contact: ${contactName} <${contactEmail}>${contactPhone ? ` · ${contactPhone}` : ""}
Group size: ${sizeLabel}${groupNpi ? `\nGroup NPI (Type 2): ${groupNpi}` : ""}
States (${stateNames.length}): ${stateNames.join(", ") || "—"}
Payors (${payorNames.length}): ${payorNames.join(", ") || "—"}
Authorizations: PSV ${authPsv ? "yes" : "no"} · BAA ${authBaa ? "yes" : "no"}

Providers:
${textProviders}
${notes ? `\nNotes:\n${notes}\n` : ""}
Referer: ${referer}
UA: ${ua}`;

  const res = await sendCredEmail({
    to: INTAKE_TO,
    subject,
    html,
    text,
    replyTo: contactEmail,
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, error: res.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, mode: res.mode });
}
