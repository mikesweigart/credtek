// Subdomain rewrite — maps prospect-branded sub-portals to their
// route group inside the main Next.js project.
//
//   avelecare.cred-tek.com  →  /avelecare/*
//   <next-prospect>.cred-tek.com  →  /<slug>/*  (add when needed)
//
// The visitor's URL stays on the subdomain — only the internal
// route is rewritten. DNS (CNAME the subdomain to the Vercel
// deployment + add it to the project's Domains tab) is handled
// separately in GoDaddy + Vercel UI.

import { NextRequest, NextResponse } from "next/server";

// Subdomain → route-group slug. Add new prospects here as we
// spin up more branded demos.
const SUBDOMAIN_MAP: Record<string, string> = {
  avelecare: "/avelecare",
};

export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";
  // Strip port, lowercase. "Avelecare.Cred-tek.com:3000" → "avelecare.cred-tek.com"
  const hostname = host.split(":")[0].toLowerCase();

  // Extract the left-most label. For "avelecare.cred-tek.com" → "avelecare".
  // Skip apex + www so the main marketing site is untouched.
  const parts = hostname.split(".");
  if (parts.length < 3) return NextResponse.next();
  const sub = parts[0];
  if (sub === "www" || sub === "cred-tek") return NextResponse.next();

  const target = SUBDOMAIN_MAP[sub];
  if (!target) return NextResponse.next();

  const url = req.nextUrl.clone();
  // Don't double-rewrite if the user already deep-linked into /avelecare.
  if (url.pathname.startsWith(target)) return NextResponse.next();
  // Rewrite "/" to "/avelecare", "/providers" to "/avelecare/providers", etc.
  url.pathname = `${target}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip API routes, Next internals, and static files.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
