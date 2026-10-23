-- Checkpoint Prep — Supabase schema
-- Run once in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run: objects are created with IF NOT EXISTS / OR REPLACE.

-- ---------- tables ----------
create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  join_code text not null default 'CHECKPOINT8',
  school_name text not null default 'Checkpoint Prep'
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null,
  grade text not null default 'Stage 8',
  role text not null default 'student' check (role in ('student', 'admin')),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_seen timestamptz
);

create table if not exists public.attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject_id text not null,
  test_id text not null,
  test_title text,
  kind text not null check (kind in ('quick', 'paper')),
  score int not null check (score >= 0),
  max int not null check (max > 0),
  topics jsonb not null default '{}'::jsonb, -- { "Fractions": {"got": 3, "max": 4}, ... }
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_idx on public.attempts (user_id, created_at desc);
create index if not exists attempts_subject_idx on public.attempts (subject_id, test_id);

create table if not exists public.revised (
  user_id uuid not null references public.profiles (id) on delete cascade,
  subject_id text not null,
  topic text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, subject_id, topic)
);

-- ---------- helpers ----------
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and active);
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active);
$$;

-- New sign-ups must supply the class join code. The very first account becomes the admin.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  code text := coalesce(new.raw_user_meta_data ->> 'join_code', '');
  first_user boolean := not exists (select 1 from public.profiles);
begin
  if not first_user and upper(trim(code)) <> upper((select join_code from public.settings where id = 1)) then
    raise exception 'Invalid join code';
  end if;
  insert into public.profiles (id, email, full_name, grade, role)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'grade'), ''), 'Stage 8'),
    case when first_user then 'admin' else 'student' end
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Students may only touch last_seen on their own profile; role/active/name changes are admin-only.
create or replace function public.guard_profile_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    if new.role <> old.role or new.active <> old.active or new.email is distinct from old.email
       or new.full_name <> old.full_name or new.grade <> old.grade then
      raise exception 'Only an admin can change these fields';
    end if;
  elsif old.id = auth.uid() and (new.role <> 'admin' or not new.active) then
    raise exception 'Admins cannot demote or deactivate themselves';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles
  for each row execute function public.guard_profile_update();

-- ---------- row level security ----------
alter table public.settings enable row level security;
alter table public.profiles enable row level security;
alter table public.attempts enable row level security;
alter table public.revised  enable row level security;

drop policy if exists settings_admin_read on public.settings;
drop policy if exists settings_admin_write on public.settings;
create policy settings_admin_read  on public.settings for select using (public.is_admin());
create policy settings_admin_write on public.settings for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists profiles_read on public.profiles;
drop policy if exists profiles_update on public.profiles;
create policy profiles_read   on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy profiles_update on public.profiles for update using (id = auth.uid() or public.is_admin());

drop policy if exists attempts_read on public.attempts;
drop policy if exists attempts_insert on public.attempts;
drop policy if exists attempts_update on public.attempts;
drop policy if exists attempts_delete on public.attempts;
create policy attempts_read   on public.attempts for select using (user_id = auth.uid() or public.is_admin());
create policy attempts_insert on public.attempts for insert with check (user_id = auth.uid() and public.is_active());
create policy attempts_update on public.attempts for update using (user_id = auth.uid() and public.is_active())
  with check (user_id = auth.uid());
create policy attempts_delete on public.attempts for delete using (public.is_admin());

drop policy if exists revised_read on public.revised;
drop policy if exists revised_write on public.revised;
drop policy if exists revised_delete on public.revised;
create policy revised_read   on public.revised for select using (user_id = auth.uid() or public.is_admin());
create policy revised_write  on public.revised for insert with check (user_id = auth.uid() and public.is_active());
create policy revised_delete on public.revised for delete using (user_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select, update on public.settings to authenticated;
grant select, update on public.profiles to authenticated;
grant select, insert, update, delete on public.attempts to authenticated;
grant select, insert, delete on public.revised to authenticated;

-- ---------- account deletion (required by the App Store for apps with sign-up) ----------
create or replace function public.delete_my_account() returns void
language plpgsql security definer set search_path = public, auth as $$
begin
  if auth.uid() is null then raise exception 'Not signed in'; end if;
  if exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
     and (select count(*) from public.profiles where role = 'admin' and active) <= 1 then
    raise exception 'You are the only admin. Make another user an admin first.';
  end if;
  delete from auth.users where id = auth.uid(); -- cascades to profiles, attempts, revised
end;
$$;
revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;

-- ---------- past papers (links to official papers the school is licensed to use) ----------
create table if not exists public.past_papers (
  id bigint generated always as identity primary key,
  subject_id text not null,
  year int not null check (year between 2000 and 2100),
  session text not null default 'May',
  paper text not null,
  qp_url text not null check (qp_url ~* '^https?://'),
  ms_url text check (ms_url is null or ms_url ~* '^https?://'),
  notes text,
  created_at timestamptz not null default now()
);
alter table public.past_papers enable row level security;
drop policy if exists past_read on public.past_papers;
drop policy if exists past_admin on public.past_papers;
create policy past_read  on public.past_papers for select using (public.is_active());
create policy past_admin on public.past_papers for all using (public.is_admin()) with check (public.is_admin());
grant select, insert, update, delete on public.past_papers to authenticated;

-- allow students to record their past-paper scores
alter table public.attempts drop constraint if exists attempts_kind_check;
alter table public.attempts add constraint attempts_kind_check check (kind in ('quick', 'paper', 'past'));
