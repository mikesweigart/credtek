-- ============================================================
-- CredTek — Group onboarding / intake submissions
-- ============================================================
-- Persists the structured onboarding payload from the /get-started
-- wizard (POST /api/intake) — both the self-serve provider list and the
-- concierge roster summary. Like /api/leads, the route ALSO emails the
-- team the instant a group submits, so this table is optional: without
-- it the best-effort insert silently no-ops and you still get the email.
-- With it, you get a durable, queryable record of every onboarding.
--
-- NOTE: no PHI files land here. For the concierge path the browser sends
-- only the roster's filename + a row count; a coordinator follows up with
-- a secure link to receive the actual file. The provider rows captured on
-- the self-serve path (name, credential, NPI, state) are stored as jsonb.
--
-- These are pre-auth PUBLIC submissions (no tenant yet), so the table is
-- intentionally NOT tenant-scoped. Run after 0001-0006. Idempotent.
--
-- Security: the /api/intake route writes with the service-role key, which
-- bypasses RLS. We enable RLS with NO policies so anon/auth clients can
-- neither read nor write it — only trusted server code touches this table.
-- ============================================================

create table if not exists public.intake_submissions (
  id               uuid primary key default gen_random_uuid(),
  path             text not null default 'self'
                     check (path in ('self', 'concierge')),
  org_name         text not null,
  contact_name     text,
  contact_email    text not null,
  contact_phone    text,
  size_bucket      text,
  states           text[] not null default '{}',     -- selected state codes
  payors           text[] not null default '{}',     -- selected payor ids
  providers        jsonb  not null default '[]'::jsonb, -- self-serve provider rows
  roster_file_name text,                              -- concierge: filename only
  roster_row_count integer,                           -- concierge: detected rows
  notes            text,
  auth_psv         boolean not null default false,    -- authorized primary-source verification
  auth_baa         boolean not null default false,    -- acknowledged BAA / HIPAA handling
  user_agent       text,
  referer          text,
  source           text default 'get-started',
  created_at       timestamptz not null default now()
);

create index if not exists intake_submissions_created_at_idx
  on public.intake_submissions (created_at desc);
create index if not exists intake_submissions_path_idx
  on public.intake_submissions (path);

alter table public.intake_submissions enable row level security;

-- ============================================================
-- DONE. Verify:
--   select org_name, path, contact_email,
--          array_length(states, 1)  as states,
--          jsonb_array_length(providers) as providers,
--          roster_row_count, created_at
--     from public.intake_submissions
--    order by created_at desc limit 20;
-- ============================================================
