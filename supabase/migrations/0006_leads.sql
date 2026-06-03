-- ============================================================
-- CredTek — Phase 1 growth: public demo/marketing leads
-- ============================================================
-- Persists the leads captured by the landing page's interactive-demo
-- modal (POST /api/leads). The route ALSO emails each lead to the team
-- the instant it's captured, so this table is optional: without it, the
-- route's best-effort insert silently no-ops and you still get the email.
-- With it, you get a durable, queryable record of every demo started.
--
-- These are anonymous PUBLIC visitors (pre-auth, no tenant), so the table
-- is intentionally NOT tenant-scoped. Run after 0001-0005. Idempotent.
--
-- Security: the /api/leads route writes with the service-role key, which
-- bypasses RLS. We enable RLS with NO policies so anon/auth clients can
-- neither read nor write it — only trusted server code touches leads.
-- ============================================================

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  facility    text,
  size_bucket text,
  source      text default 'landing-demo-modal',
  user_agent  text,
  referer     text,
  created_at  timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- ============================================================
-- DONE. Verify:
--   select email, facility, size_bucket, created_at
--     from public.leads order by created_at desc limit 20;
-- ============================================================
