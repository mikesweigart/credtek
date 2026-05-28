// GET /api/health/db — backend connectivity proof-of-life.
//
// Returns one of:
//   { configured: false }                      → env vars not set yet
//   { configured: true, connected: true, payers: N }  → DB reachable
//   { configured: true, connected: false, error }      → wired but failing
//
// Hit this right after setting the Supabase env vars to confirm the
// app can reach the database. `payers` is the seeded reference table,
// so a healthy response returns 10.

import { NextResponse } from "next/server";
import { supabaseAdmin } from "../../../_lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = supabaseAdmin();

  if (!db) {
    return NextResponse.json({
      configured: false,
      connected: false,
      message:
        "Supabase env vars not set. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  try {
    const { count, error } = await db
      .from("payers")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json(
        { configured: true, connected: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      configured: true,
      connected: true,
      payers: count ?? 0,
    });
  } catch (e) {
    return NextResponse.json(
      { configured: true, connected: false, error: String(e) },
      { status: 500 }
    );
  }
}
