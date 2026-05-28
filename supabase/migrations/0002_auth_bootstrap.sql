-- ============================================================
-- CredTek — Phase 1 auth bootstrap
-- ============================================================
-- When a new user signs up via Supabase Auth, automatically create
-- their workspace (tenant) + profile so the app has somewhere to put
-- them. Self-serve signup = one tenant per new account, user is admin.
--
-- Run AFTER 0001_phase1_schema.sql. Idempotent.
-- ============================================================

create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_tenant_id uuid;
  org text;
begin
  -- Org name from signup metadata, else derived from the email.
  org := coalesce(
    nullif(new.raw_user_meta_data->>'org_name', ''),
    initcap(split_part(new.email, '@', 1)) || '''s Workspace'
  );

  insert into tenants (name, slug)
  values (org, 'org-' || substr(replace(new.id::text, '-', ''), 1, 12))
  returning id into new_tenant_id;

  insert into profiles (id, tenant_id, email, full_name, role)
  values (
    new.id,
    new_tenant_id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'admin'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- DONE. New signups now get a tenant + admin profile automatically.
-- Verify after a test signup:
--   select p.email, p.role, t.name
--   from profiles p join tenants t on t.id = p.tenant_id;
-- ============================================================
