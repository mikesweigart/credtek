"use server";

// Server action — send a single follow-up email. Editor-only. Falls
// back to log-mode if RESEND_API_KEY isn't set yet so the UI still
// demos a "sent" state in dev.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionContext, canEdit } from "../../_lib/data/workspace";
import { listFollowUps } from "../../_lib/data/followups";
import { sendCredEmail, emailShell } from "../../_lib/email/send";

export async function sendFollowUp(formData: FormData) {
  const ctx = await getSessionContext();
  if (!ctx.userId) redirect("/sign-in");
  if (!canEdit(ctx.role)) redirect("/app/followups?error=role");

  const id = String(formData.get("id") ?? "");
  const overrideTo = String(formData.get("to") ?? "").trim();
  if (!id) redirect("/app/followups?error=missing");

  const items = await listFollowUps();
  const item = items.find((i) => i.id === id);
  if (!item) redirect("/app/followups?error=notfound");

  const to = overrideTo || item.providerEmail || ctx.email;
  if (!to) redirect("/app/followups?error=noemail");

  const html = emailShell({
    preheader: item.subject,
    heading: item.subject,
    body: item.bodyHtml,
    ctaLabel: "Open your file",
    ctaHref: "https://cred-tek.com/sign-in",
    footer: `Sent by ${ctx.fullName ?? ctx.email ?? "CredTek"} from ${
      ctx.tenantName ?? "CredTek"
    }. Reply to reach your coordinator.`,
  });

  const res = await sendCredEmail({
    to,
    subject: item.subject,
    html,
    text: item.bodyText,
    replyTo: ctx.email ?? undefined,
  });

  revalidatePath("/app/followups");
  const flag = res.ok ? (res.mode === "live" ? "sent" : "logged") : "fail";
  redirect(`/app/followups?status=${flag}&who=${encodeURIComponent(item.providerName)}`);
}
