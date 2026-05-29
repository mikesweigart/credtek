-- ============================================================
-- Set up Chris Cessna as a full-access admin in a shared workspace.
-- Run this in the Supabase SQL Editor AFTER creating his auth user
-- (Authentication > Users > Add User, with "Auto Confirm User" checked).
-- Idempotent — safe to re-run.
-- ============================================================

-- 1) Shared team workspace
insert into tenants (name, slug)
values ('KSM Network', 'ksm-network')
on conflict (slug) do nothing;

-- 2) Point Chris's profile at it with full admin access. Creates the
--    profile if the signup trigger didn't, updates it if it did.
do $$
declare uid uuid; tid uuid;
begin
  select id into uid from auth.users where lower(email) = 'ccessna@ksmnetwork.com';
  select id into tid from tenants where slug = 'ksm-network';
  if uid is null then
    raise exception 'Auth user ccessna@ksmnetwork.com not found — create it first in Authentication > Users (Add User, Auto Confirm).';
  end if;
  insert into profiles (id, tenant_id, email, full_name, role)
  values (uid, tid, 'ccessna@ksmnetwork.com', 'Chris Cessna', 'admin')
  on conflict (id) do update
    set tenant_id = excluded.tenant_id,
        full_name = 'Chris Cessna',
        role = 'admin';
end $$;

-- 3) OPTIONAL — put your own account in the SAME workspace so you and
--    Chris see the same providers. Replace the email with your CredTek
--    login, then uncomment:
-- update profiles
--   set tenant_id = (select id from tenants where slug = 'ksm-network')
--   where lower(email) = 'you@youremail.com';

-- Verify:
select p.email, p.full_name, p.role, t.name as workspace
from profiles p join tenants t on t.id = p.tenant_id
where lower(p.email) = 'ccessna@ksmnetwork.com';
