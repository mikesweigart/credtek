-- ============================================================
-- CredTek — Background checks / sanctions screening (0010)
-- ============================================================
-- Persistent, audit-ready screening records for each provider (and
-- facility): OIG LEIE, SAM.gov, NPDB, state Medicaid sanctions, OFAC,
-- criminal background, and license-board sanctions. Each row records the
-- source, the result (clear / flagged / pending / not run), when it was
-- checked, and a reference — exactly what an NCQA delegated-credentialing
-- audit asks for ("show me the monthly OIG screen with dates").
--
-- Mirrors the providers/credentials pattern: tenant_id + RLS on every row,
-- same enum/trigger idioms. Run AFTER 0001-0009. Idempotent.
-- ============================================================

do $$ begin create type screening_source as enum
  ('oig_leie','sam_gov','npdb','state_medicaid','ofac',
   'criminal_background','license_sanctions','other');
exception when duplicate_object then null; end $$;

do $$ begin create type screening_result as enum
  ('clear','flagged','pending','not_run');
exception when duplicate_object then null; end $$;

create table if not exists screenings (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references tenants(id) on delete cascade,
  provider_id uuid references providers(id) on delete cascade,
  facility_id uuid references facilities(id) on delete cascade,
  source      screening_source not null,
  result      screening_result not null default 'not_run',
  checked_on  date,
  reference   text,               -- case # / vendor reference
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- a screening belongs to a provider OR a facility
  check (provider_id is not null or facility_id is not null)
);
create index if not exists idx_screenings_provider on screenings(provider_id);
create index if not exists idx_screenings_facility on screenings(facility_id);

do $$ begin
  execute 'drop trigger if exists trg_screenings_updated on screenings;
    create trigger trg_screenings_updated before update on screenings
    for each row execute function set_updated_at();';
end $$;

alter table screenings enable row level security;
drop policy if exists tenant_rw on screenings;
create policy tenant_rw on screenings
  using (tenant_id = current_tenant_id())
  with check (tenant_id = current_tenant_id());

-- ============================================================
-- DONE. Verify:
--   select provider_id, source, result, checked_on from screenings limit 20;
-- ============================================================
