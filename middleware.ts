// Middleware does two jobs, in order:
//   1. Subdomain rewrite — maps prospect-branded sub-portals to their
//      route group (avelecare.cred-tek.com → /avelecare/*).
//   2. Supabase session refresh — keeps the auth cookie fresh so SSR
//      and the browser stay in sync (@supabase/ssr requirement).
//
// The session refresh attaches refreshed cookies to whichever response
// the subdomain logic produces (rewrite OR next), so the two concerns
// compose cleanly without one clobbering the other.

import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

const SUBDOMAIN_MAP: Record<string, string> = {
  avelecare: "/avelecare",
};

function routingResponse(req: NextRequest): NextResponse {
  const host = req.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();
  const parts = hostname.split(".");

  // apex / www / localhost → no rewrite
  if (parts.length < 3) return NextResponse.next();
  const sub = parts[0];
  if (sub === "www" || sub === "cred-tek") return NextResponse.next();

  const target = SUBDOMAIN_MAP[sub];
  if (!target) return NextResponse.next();

  const url = req.nextUrl.clone();
  if (url.pathname.startsWith(target)) return NextResponse.next();
  url.pathname = `${target}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export async function middleware(req: NextRequest) {
  // 1. Decide the routing response (rewrite or pass-through).
  const response = routingResponse(req);

  // 2. Refresh the Supabase session, attaching any updated auth cookies
  //    to that same response. No-op if env vars aren't set.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });
    // Touching getUser() triggers the cookie refresh when needed.
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  // Skip API routes, Next internals, and static files.
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
