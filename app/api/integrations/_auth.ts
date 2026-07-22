// Shared auth gate for /api/integrations/*.
//
// These endpoints shipped demo-only: no auth, and a caller-SUPPLIED
// tenant_id. That combination means anyone could enumerate or mutate any
// tenant's jobs just by passing someone else's id. The backing store is
// in-memory today, so nothing real leaks yet — but this is the exact
// contract the production endpoint inherits when it's wired to Supabase,
// and a hole is much cheaper to close now than after it has data behind
// it.
//
// The rule: authenticate, then derive the tenant from the SESSION and
// ignore whatever the caller claimed.

import { NextResponse } from "next/server";
import { getSessionContext } from "../../_lib/data/workspace";

export type ApiSession = { userId: string; tenantId: string };

type Result =
  | { ok: true; session: ApiSession }
  | { ok: false; response: NextResponse };

export async function requireApiSession(): Promise<Result> {
  const ctx = await getSessionContext();
  if (!ctx.userId || !ctx.tenantId) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: "unauthorized",
          message: "This endpoint requires an authenticated CredTek session.",
        },
        { status: 401 },
      ),
    };
  }
  return { ok: true, session: { userId: ctx.userId, tenantId: ctx.tenantId } };
}
