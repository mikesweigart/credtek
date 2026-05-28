-- ============================================================
-- CredTek — Phase 1 schema (multi-tenant credentialing core)
-- ============================================================
-- Run in the Supabase SQL Editor. Idempotent where practical, so
-- it's safe to re-run during development.
--
-- Design notes:
--   * Every tenant-scoped table carries tenant_id + RLS so one
--     customer can never see another's data.
--   * Column shapes mirror the existing TypeScript types
--     (app/_lib/ial/types.ts, app/_lib/mockProviders.ts) so wiring
--     the app to this schema is a small refactor, not a rewrite.
--   * Server-side code using the service-role key bypasses RLS;
--     the browser/authed client respects it.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- ENUMS (idempotent) ----------
do $$ begin create type user_role as enum
  ('admin','coordinator','provider','finance','readonly');
exception when duplicate_object then null; end $$;

do $$ begin create type provider_status as enum
  ('active','enrolling','supervision','flag');
exception when duplicate_object then null; end $$;

do $$ begin create type integration_tier as enum
  ('tier_1_api','tier_2_partner','tier_3_browser','tier_4_human');
exception when duplicate_object then null; end $$;

do $$ begin create type integration_status as enum
  ('drafted','awaiting_approval','submitted','in_progress',
   'awaiting_info','completed','failed','cancelled');
exception when duplicate_object then null; end $$;

do $$ begin create type actor_type as enum
  ('system','user','agent','specialist');
exception when duplicate_object then null; end $$;

do $$ begin create type audit_action as enum
  ('view','edit','submit','approve','reject','auth',
   'transition','external_call','create','delete');
exception when duplicate_object then null; end $$;

do $$ begin create type enrollment_status as enum
  ('not_started','drafted','submitted','awaiting_info',
   'active','denied','termed');
exception when duplicate_object then null; end $$;

do $$ begin create type credential_kind as enum
  ('state_license','dea','cds','board_cert','coi_malpractice','caqh','other');
exception when duplicate_object then null; end $$;

do $$ begin create type expirable_status as enum
  ('active','expiring_soon','expired','pending','awaiting');
exception when duplicate_object then null; end $$;

-- ---------- updated_at trigger helper ----------
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

-- ---------- TENANTS ----------
create table if not exists tenants (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- PROFILES (app users, linked to Supabase auth) ----------
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  tenant_id   uuid references tenants(id) on delete cascade,
  email       text,
  full_name   text,
  role        user_role not null default 'coordinator',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- PROVIDERS ----------
create table if not exists providers (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  slug          text not null,
  name          text not null,
  credential    text,
  npi           text,
  status        provider_status not null default 'enrolling',
  status_label  text,
  specialty     text,
  license_states text[] not null default '{}',
  meta          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (tenant_id, slug)
);
create index if not exists idx_providers_tenant on providers(tenant_id);

-- ---------- PROVIDER LICENSES (state, expirable) ----------
create table if not exists provider_licenses (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  provider_id   uuid not null references providers(id) on delete cascade,
  state         char(2) not null,
  license_number text,
  status        expirable_status not null default 'active',
  issued_on     date,
  expires_on    date,
  verified_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_lic_provider on provider_licenses(provider_id);
create index if not exists idx_lic_expires on provider_licenses(expires_on);

-- ---------- PROVIDER CREDENTIALS (DEA, board, COI, etc.) ----------
create table if not exists provider_credentials (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  provider_id   uuid not null references providers(id) on delete cascade,
  kind          credential_kind not null,
  identifier    text,
  status        expirable_status not null default 'active',
  issued_on     date,
  expires_on    date,
  verified_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_cred_provider on provider_credentials(provider_id);
create index if not exists idx_cred_expires on provider_credentials(expires_on);

-- ---------- SUPERVISION PLANS (BH differentiator) ----------
create table if not exists supervision_plans (
  id                     uuid primary key default gen_random_uuid(),
  tenant_id              uuid not null references tenants(id) on delete cascade,
  provider_id            uuid not null references providers(id) on delete cascade,
  target_credential      text not null,
  state                  char(2) not null,
  required_hours         int not null,
  completed_hours        int not null default 0,
  required_direct_client int not null default 0,
  completed_direct_client int not null default 0,
  required_group         int not null default 0,
  completed_group        int not null default 0,
  supervisor_name        text,
  supervisor_provider_id uuid references providers(id),
  weekly_hours           numeric not null default 0,
  projected_licensure    date,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);
create index if not exists idx_sup_provider on supervision_plans(provider_id);

-- ---------- SUPERVISION HOURS (weekly logged entries) ----------
create table if not exists supervision_hours (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references tenants(id) on delete cascade,
  plan_id            uuid not null references supervision_plans(id) on delete cascade,
  logged_for_week    date not null,
  hours              numeric not null,
  direct_client_hours numeric not null default 0,
  group_hours        numeric not null default 0,
  cosigned           boolean not null default false,
  cosigned_at        timestamptz,
  created_at         timestamptz not null default now()
);
create index if not exists idx_suphours_plan on supervision_hours(plan_id);

-- ---------- PAYERS (reference data, NOT tenant-scoped) ----------
create table if not exists payers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  short_name  text,
  kind        text,            -- commercial | medicare | medicaid | tricare | specialty
  created_at  timestamptz not null default now()
);

-- ---------- ENROLLMENTS (provider x payer x state) ----------
create table if not exists enrollments (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null references tenants(id) on delete cascade,
  provider_id        uuid not null references providers(id) on delete cascade,
  payer_id           uuid not null references payers(id),
  state              char(2),
  status             enrollment_status not null default 'not_started',
  submitted_on       date,
  effective_date     date,
  missing_items      text[] not null default '{}',
  external_reference text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index if not exists idx_enroll_provider on enrollments(provider_id);
create index if not exists idx_enroll_status on enrollments(status);

-- ---------- DOCUMENTS ----------
create table if not exists documents (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  provider_id uuid references providers(id) on delete cascade,
  name        text not null,
  doc_type    text not null,
  status      text not null default 'current',
  storage_key text,            -- Supabase Storage object path
  expires_on  date,
  size_bytes  bigint,
  uploaded_by uuid references profiles(id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_docs_provider on documents(provider_id);

-- ---------- INTEGRATION JOBS (IAL queue — mirrors IntegrationJob) ----------
create table if not exists integration_jobs (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references tenants(id) on delete cascade,
  integration_type text not null,
  tier             integration_tier not null,
  provider_id      uuid references providers(id) on delete cascade,
  status           integration_status not null default 'drafted',
  payload          jsonb not null default '{}'::jsonb,
  result           jsonb,
  eta              timestamptz,
  submitted_at     timestamptz,
  completed_at     timestamptz,
  created_by       uuid references profiles(id),
  cost_cents       int not null default 0,
  metadata         jsonb not null default '{"attempts":0}'::jsonb,
  audit_log_id     uuid,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists idx_jobs_tenant on integration_jobs(tenant_id);
create index if not exists idx_jobs_status on integration_jobs(status);

-- ---------- AUDIT LOG (hash-chained, append-only — mirrors AuditEntry) ----------
create table if not exists audit_log (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid references tenants(id) on delete set null,
  actor_id      uuid,
  actor_type    actor_type not null,
  actor_ip      text,
  resource_type text not null,
  resource_id   text not null,
  action        audit_action not null,
  before_state  jsonb,
  after_state   jsonb,
  metadata      jsonb not null default '{}'::jsonb,
  prev_log_hash text,
  log_hash      text not null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_audit_tenant on audit_log(tenant_id);
create index if not exists idx_audit_resource on audit_log(resource_type, resource_id);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array[
    'tenants','profiles','providers','provider_licenses','provider_credentials',
    'supervision_plans','enrollments','documents','integration_jobs'
  ] loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Helper: the current user's tenant, read from their profile.
-- SECURITY DEFINER so the policy can read profiles without recursion.
create or replace function current_tenant_id() returns uuid as $$
  select tenant_id from profiles where id = auth.uid();
$$ language sql stable security definer;

-- Enable RLS on every tenant-scoped table.
alter table tenants               enable row level security;
alter table profiles              enable row level security;
alter table providers             enable row level security;
alter table provider_licenses     enable row level security;
alter table provider_credentials  enable row level security;
alter table supervision_plans     enable row level security;
alter table supervision_hours     enable row level security;
alter table enrollments           enable row level security;
alter table documents             enable row level security;
alter table integration_jobs      enable row level security;
alter table audit_log             enable row level security;
alter table payers                enable row level security;

-- Tenant-isolation policy for the standard tenant-scoped tables.
do $$
declare t text;
begin
  foreach t in array array[
    'providers','provider_licenses','provider_credentials','supervision_plans',
    'supervision_hours','enrollments','documents','integration_jobs'
  ] loop
    execute format('drop policy if exists tenant_rw on %s;', t);
    execute format(
      'create policy tenant_rw on %s
         using (tenant_id = current_tenant_id())
         with check (tenant_id = current_tenant_id());', t);
  end loop;
end $$;

-- tenants: a user can see their own tenant.
drop policy if exists tenant_self on tenants;
create policy tenant_self on tenants
  for select using (id = current_tenant_id());

-- profiles: see profiles in your tenant; update only your own row.
drop policy if exists profile_read on profiles;
create policy profile_read on profiles
  for select using (tenant_id = current_tenant_id() or id = auth.uid());
drop policy if exists profile_update_self on profiles;
create policy profile_update_self on profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

-- audit_log: readable within tenant, insert allowed; no update/delete
-- (append-only — absence of update/delete policies denies them).
drop policy if exists audit_read on audit_log;
create policy audit_read on audit_log
  for select using (tenant_id = current_tenant_id());
drop policy if exists audit_insert on audit_log;
create policy audit_insert on audit_log
  for insert with check (tenant_id = current_tenant_id());

-- payers: reference data — any authenticated user can read.
drop policy if exists payers_read on payers;
create policy payers_read on payers
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- SEED — payer reference data + one demo tenant
-- ============================================================
insert into payers (name, short_name, kind) values
  ('Aetna','Aetna','commercial'),
  ('Anthem Blue Cross Blue Shield','Anthem BCBS','commercial'),
  ('Cigna','Cigna','commercial'),
  ('UnitedHealthcare','UHC','commercial'),
  ('Humana','Humana','commercial'),
  ('Optum Behavioral Health','Optum BH','specialty'),
  ('Tricare','Tricare','tricare'),
  ('Medicare','Medicare','medicare'),
  ('Carelon Behavioral Health','Carelon','specialty'),
  ('Magellan Health','Magellan','specialty')
on conflict do nothing;

insert into tenants (name, slug) values
  ('CredTek Demo Group','credtek-demo')
on conflict (slug) do nothing;

-- ============================================================
-- DONE. Verify with:
--   select table_name from information_schema.tables
--   where table_schema = 'public' order by table_name;
-- ============================================================
