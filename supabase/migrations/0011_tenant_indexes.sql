-- 0011_tenant_indexes.sql
--
-- Indexes on tenant_id for every tenant-owned table that lacked one.
--
-- Two things make these matter more than they look:
--
--   1. The data layer now filters EVERY read by tenant_id (defence in
--      depth alongside RLS). Without an index, each of those filters is a
--      sequential scan. Fine at 10 providers, not fine at 10,000.
--
--   2. RLS policies themselves compare tenant_id = current_tenant_id() on
--      every single row access. An unindexed tenant_id makes the policy
--      itself the bottleneck — this is the single most common cause of
--      slow Postgres under Supabase RLS.
--
-- providers, facilities, integration_jobs, and audit_log already had one
-- (migration 0001/0009) and are intentionally not repeated here.
--
-- Composite (tenant_id, expires_on) where the query filters on both: the
-- expirables sweep asks "everything in MY tenant expiring in 90 days", so
-- a composite index answers it from the index alone.
--
-- Safe to re-run: every statement is IF NOT EXISTS. These are ordinary
-- CREATE INDEX statements, which take a brief write lock — harmless on
-- pre-launch tables. If you ever re-run this against a large, live table,
-- switch to CREATE INDEX CONCURRENTLY (which cannot run inside a
-- transaction block).

-- Expirables: "my tenant's licences/credentials expiring soon"
create index if not exists idx_lic_tenant_expires
  on provider_licenses (tenant_id, expires_on);
create index if not exists idx_cred_tenant_expires
  on provider_credentials (tenant_id, expires_on);

-- Coverage matrix: pulls every enrollment in the tenant
create index if not exists idx_enroll_tenant
  on enrollments (tenant_id);

-- Team / workspace member list
create index if not exists idx_profiles_tenant
  on profiles (tenant_id);

-- Provider workspace tabs
create index if not exists idx_docs_tenant
  on documents (tenant_id);
create index if not exists idx_screenings_tenant
  on screenings (tenant_id);

-- Facility credentialing
create index if not exists idx_facred_tenant
  on facility_credentials (tenant_id);

-- Supervision tracking
create index if not exists idx_sup_tenant
  on supervision_plans (tenant_id);
create index if not exists idx_suphours_tenant
  on supervision_hours (tenant_id);
