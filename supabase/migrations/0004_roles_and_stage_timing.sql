-- ============================================================
-- CredTek — Phase 1 roles + stage timing
-- ============================================================
-- Adds the super_admin + client role tiers and a stage_entered_at
-- timestamp so the app can compute days-in-stage and surface SLA
-- red flags. Run after 0001-0003.
--
-- NOTE: if the two ALTER TYPE lines error with "cannot run inside a
-- transaction block", run them ONE AT A TIME (each on its own).
-- ============================================================

alter type user_role add value if not exists 'super_admin';
alter type user_role add value if not exists 'client';

alter table providers
  add column if not exists stage_entered_at timestamptz not null default now();

-- ============================================================
-- DONE. Verify:
--   select unnest(enum_range(null::user_role));
--   select name, credentialing_stage, stage_entered_at from providers limit 5;
-- ============================================================
