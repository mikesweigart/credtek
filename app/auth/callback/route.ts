// GET /auth/callback — exchanges the magic-link / email-confirmation
// code for a session cookie, then redirects into the app. This is the
// URL Supabase sends users back to from the email link, so it must be
// added to the project's Auth → URL Configuration → Redirect URLs.

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../_lib/supabase/serverClient";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/app";

  if (code) {
    const supabase = await createSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // No code, or exchange failed → back to sign-in with an error flag.
  return NextResponse.redirect(`${origin}/sign-in?error=link`);
}
