-- ============================================================
-- CredTek — Facility credentialing (0009)
-- ============================================================
-- Facilities (hospitals, ASCs, clinics, labs, group practices) are a
-- first-class credentialed ENTITY, parallel to providers. A facility
-- carries its own licenses/accreditations (Joint Commission, CLIA, CMS
-- certification) and its own payer FACILITY contracts.
--
-- Design mirrors the providers pattern from 0001 so wiring the app is a
-- small refactor: tenant_id + RLS on every row, same enum/trigger idioms,
-- enrollments + documents extended to point at a facility OR a provider.
--
-- Run AFTER 0001-0008, in the Supabase SQL Editor. Idempotent.
-- ============================================================

-- ---------- ENUMS (idempotent) ----------
do $$ begin create type facility_type as enum
  ('hospital','asc','urgent_care','clinic_group','laboratory',
   'imaging_center','bh_facility','snf_ltc','pharmacy','other');
exception when duplicate_object then null; end $$;

do $$ begin create type facility_status as enum
  ('active','enrolling','revalidation','flag');
exception when duplicate_object then null; end $$;

do $$ begin create type facility_credential_kind as enum
  ('facility_license','accreditation','clia','cms_certification',
   'coi_malpractice','fire_safety','other');
exception when duplicate_object then null; end $$;

-- ---------- FACILITIES (mirrors providers) ----------
create table if not exists facilities (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  slug          text not null,
  name          text not null,
  facility_type facility_type not null default 'clinic_group',
  npi           text,                              -- organizational (Type 2) NPI
  status        facility_status not null default 'enrolling',
  status_label  text,
  primary_state char(2),
  locations     int not null default 1,            -- # of physical sites under this facility
  meta          text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (tenant_id, slug)
);
create index if not exists idx_facilities_tenant on facilities(tenant_id);

-- ---------- FACILITY CREDENTIALS (license, accreditation, CLIA, CMS, COI) ----------
create table if not exists facility_credentials (
  id            uuid primary key default gen_random_uuid(),
  tenant_id     uuid not null references tenants(id) on delete cascade,
  facility_id   uuid not null references facilities(id) on delete cascade,
  kind          facility_credential_kind not null,
  identifier    text,                              -- license #, CCN, CLIA #, accreditation ID
  issuer        text,                              -- e.g. Joint Commission · HFAP · DNV · CMS
  status        expirable_status not null default 'active',
  issued_on     date,
  expires_on    date,
  verified_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists idx_facred_facility on facility_credentials(facility_id);
create index if not exists idx_facred_expires on facility_credentials(expires_on);

-- ---------- ENROLLMENTS: allow a facility OR a provider ----------
-- Facility payer contracts flow through the same enrollment pipeline.
alter table enrollments add column if not exists facility_id
  uuid references facilities(id) on delete cascade;
alter table enrollments alter column provider_id drop not null;
alter table enrollments drop constraint if exists enrollments_one_entity;
alter table enrollments add constraint enrollments_one_entity
  check ((provider_id is not null) <> (facility_id is not null));
create index if not exists idx_enroll_facility on enrollments(facility_id);

-- ---------- DOCUMENTS: allow facility-scoped files ----------
alter table documents add column if not exists facility_id
  uuid references facilities(id) on delete cascade;
create index if not exists idx_docs_facility on documents(facility_id);

-- ---------- updated_at triggers ----------
do $$
declare t text;
begin
  foreach t in array array['facilities','facility_credentials'] loop
    execute format(
      'drop trigger if exists trg_%1$s_updated on %1$s;
       create trigger trg_%1$s_updated before update on %1$s
       for each row execute function set_updated_at();', t);
  end loop;
end $$;

-- ---------- ROW LEVEL SECURITY (tenant isolation, same as providers) ----------
alter table facilities          enable row level security;
alter table facility_credentials enable row level security;

do $$
declare t text;
begin
  foreach t in array array['facilities','facility_credentials'] loop
    execute format('drop policy if exists tenant_rw on %s;', t);
    execute format(
      'create policy tenant_rw on %s
         using (tenant_id = current_tenant_id())
         with check (tenant_id = current_tenant_id());', t);
  end loop;
end $$;

-- ============================================================
-- DONE. Verify:
--   select column_name from information_schema.columns
--    where table_name = 'enrollments' and column_name = 'facility_id';
--   select count(*) from facilities;
-- ============================================================
