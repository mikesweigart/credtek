-- ============================================================
-- CredTek — Saved onboarding drafts ("finish later" links)
-- ============================================================
-- Backs the "email me a link to finish later" button in the /get-started
-- wizard. The browser already autosaves to localStorage, but that's tied to
-- one device — this lets the office manager start an onboarding and the
-- credentialing lead finish it from their own machine.
--
-- POST /api/intake/save upserts a row and emails the contact an opaque
-- resume link (cred-tek.com/get-started?resume=<token>). The token IS the
-- bearer credential (an unguessable uuid), so NO PII ever rides in the URL.
-- GET /api/intake/save?token=... returns the draft to rehydrate the wizard.
--
-- The draft jsonb holds the in-progress provider list / roster summary. Like
-- intake_submissions, no PHI *files* land here. Run after 0001-0007. Idempotent.
--
-- Security: the route reads/writes with the service-role key, which bypasses
-- RLS. We enable RLS with NO policies so anon/auth clients can neither read
-- nor write — only trusted server code (holding the token) touches this table.
-- ============================================================

create table if not exists public.intake_drafts (
  token         uuid primary key default gen_random_uuid(),
  draft         jsonb not null,                    -- the in-progress IntakeDraft
  step_index    integer not null default 0,        -- which wizard step to resume on
  path          text,                              -- 'self' | 'concierge'
  org_name      text,
  contact_email text,
  user_agent    text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  expires_at    timestamptz not null default (now() + interval '30 days')
);

create index if not exists intake_drafts_expires_at_idx
  on public.intake_drafts (expires_at);

alter table public.intake_drafts enable row level security;

-- ============================================================
-- DONE. Housekeeping (optional) — purge expired drafts:
--   delete from public.intake_drafts where expires_at < now();
-- ============================================================
