-- ============================================================
-- CredTek — Phase 1 onboarding: per-account guide flag
-- ============================================================
-- Records the moment a user first dismisses (or completes) the Cred
-- welcome tour, so the guide auto-opens exactly ONCE per account
-- instead of once per browser. Run after 0001-0004. Idempotent.
--
-- Why server-side: localStorage is per-device, so a user who logs in
-- on a second browser/phone would see the first-run tour again. This
-- column makes "seen" travel with the account.
--
-- The app reads this defensively: before this migration runs it falls
-- back to localStorage, so onboarding keeps working either way.
-- ============================================================

alter table profiles
  add column if not exists guide_seen_at timestamptz;

-- ============================================================
-- DONE. Verify:
--   select id, email, guide_seen_at from profiles limit 5;
-- ============================================================
