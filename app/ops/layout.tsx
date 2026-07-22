// /ops/* auth gate. This is the INTERNAL console — it exposes the margin
// model, the specialist queue, and audit tooling. None of that should be
// reachable by a signed-in customer, let alone the public.
//
// Why an email allowlist rather than a role check: getSessionContext()
// coerces role to "admin" for any signed-in user within their own tenant,
// so role-gating here would admit every customer. Staff identity is the
// only thing that actually distinguishes us from them.
//
// Fails CLOSED in production: if CREDTEK_OPS_EMAILS isn't configured,
// nobody gets in. An internal console that defaults to open is how a
// margin table ends up on a customer's screen. Denials render 404 rather
// than a redirect, so the route's existence isn't advertised.

import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getSessionContext } from "../_lib/data/workspace";
import { OpsShell } from "./OpsShell";

export const dynamic = "force-dynamic";

function opsAllowlist(): string[] {
  return (process.env.CREDTEK_OPS_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export default async function OpsLayout({ children }: { children: ReactNode }) {
  // Local development stays open so the console is workable offline.
  // Vercel previews run with NODE_ENV=production, so they gate too.
  if (process.env.NODE_ENV !== "production") {
    return <OpsShell>{children}</OpsShell>;
  }

  const ctx = await getSessionContext();
  const allow = opsAllowlist();
  const email = (ctx.email ?? "").toLowerCase();

  if (!ctx.userId || allow.length === 0 || !allow.includes(email)) {
    notFound();
  }

  return <OpsShell>{children}</OpsShell>;
}
