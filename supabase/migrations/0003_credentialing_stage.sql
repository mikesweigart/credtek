-- ============================================================
-- CredTek — Phase 1 credentialing workflow stage
-- ============================================================
-- Adds an explicit credentialing stage to providers so the real app
-- can move a clinician through the lifecycle from intake to final
-- approval. Run after 0001/0002. Idempotent.
--
-- The column has a default of 'intake', so existing and new providers
-- get a stage automatically — the app keeps working before/after this
-- runs (it reads the stage defensively).
-- ============================================================

do $$ begin create type credentialing_stage as enum
  ('intake','psv','privileging','committee','enrollment','approved');
exception when duplicate_object then null; end $$;

alter table providers
  add column if not exists credentialing_stage credentialing_stage not null default 'intake';

-- ============================================================
-- DONE. Verify:
--   select name, status, credentialing_stage from providers limit 5;
-- ============================================================
