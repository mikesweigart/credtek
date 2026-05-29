// Email send helper for CredTek. Uses Resend when RESEND_API_KEY is set,
// otherwise logs to the server console so the UI can still demo the flow
// in environments without a live key.
//
// To go live:
//   1. RESEND_API_KEY=<your key> in Vercel/Local env
//   2. CREDTEK_MAIL_FROM=Credentialing <noreply@cred-tek.com>  (verified Resend domain)
//   3. Verify cred-tek.com in Resend → add the SPF/DKIM DNS records they show.

import { Resend } from "resend";

export type CredEmail = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export type SendResult =
  | { ok: true; id: string; mode: "live" | "log" }
  | { ok: false; mode: "live" | "log"; error: string };

const FROM_DEFAULT = "CredTek <onboarding@resend.dev>";

function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

export function emailFrom(): string {
  return process.env.CREDTEK_MAIL_FROM || FROM_DEFAULT;
}

/** Render a CredTek-branded HTML wrapper around inner body markup. */
export function emailShell(opts: {
  preheader?: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  footer?: string;
}): string {
  const { preheader = "", heading, body, ctaLabel, ctaHref, footer } = opts;
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(
    heading
  )}</title></head><body style="margin:0;background:#f5f4ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1d1c19;">
<div style="display:none;font-size:1px;color:#f5f4ef;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(
    preheader
  )}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f4ef;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e6e3da;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:24px 28px;border-bottom:1px solid #efece4;">
        <div style="font-weight:700;font-size:14px;letter-spacing:0.18em;color:#0f6d5f;text-transform:uppercase;">CredTek</div>
        <div style="font-size:12px;color:#67645c;margin-top:2px;">Credentialing &amp; payer enrollment</div>
      </td></tr>
      <tr><td style="padding:28px;">
        <h1 style="margin:0 0 14px 0;font-size:22px;line-height:1.25;color:#0f1f1c;font-weight:700;">${escapeHtml(
          heading
        )}</h1>
        <div style="font-size:15px;line-height:1.55;color:#2b2a26;">${body}</div>
        ${
          ctaLabel && ctaHref
            ? `<div style="margin-top:24px;"><a href="${escapeAttr(
                ctaHref
              )}" style="background:#0f6d5f;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:10px;display:inline-block;font-size:15px;">${escapeHtml(
                ctaLabel
              )}</a></div>`
            : ""
        }
      </td></tr>
      <tr><td style="padding:18px 28px;background:#fafaf6;border-top:1px solid #efece4;font-size:12px;color:#67645c;">
        ${
          footer ??
          "You're receiving this because CredTek is managing credentialing for your group. Reply to this email to reach your coordinator."
        }
      </td></tr>
    </table>
    <div style="font-size:11px;color:#8f8c83;margin-top:14px;">CredTek · cred-tek.com</div>
  </td></tr>
</table>
</body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
function escapeAttr(s: string): string {
  return escapeHtml(s).replace(/`/g, "&#96;");
}

/** Send an email. Falls back to console-log mode in dev. */
export async function sendCredEmail(msg: CredEmail): Promise<SendResult> {
  const client = getClient();
  if (!client) {
    // eslint-disable-next-line no-console
    console.log("[credtek-mail:log]", {
      to: msg.to,
      from: emailFrom(),
      subject: msg.subject,
      preview: msg.text?.slice(0, 140) ?? msg.html.replace(/<[^>]+>/g, "").slice(0, 140),
    });
    return { ok: true, id: "log-" + Date.now().toString(36), mode: "log" };
  }
  try {
    const res = await client.emails.send({
      from: emailFrom(),
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
      replyTo: msg.replyTo,
    });
    if (res.error) return { ok: false, mode: "live", error: res.error.message };
    return { ok: true, id: res.data?.id ?? "sent", mode: "live" };
  } catch (e) {
    return {
      ok: false,
      mode: "live",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/** Are we configured to send live? Useful for showing "demo mode" banners. */
export function emailIsLive(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}
