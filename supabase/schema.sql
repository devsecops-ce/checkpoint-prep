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
-- false until a Google sign-in enters the class join code (email sign-ups give the code up front)
alter table public.profiles add column if not exists joined boolean not null default true;

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
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin' and active and joined);
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active and joined);
$$;

-- Email sign-ups must supply the class join code. Google sign-ups can't pass one, so they get a
-- locked profile (joined = false) and the app asks for the code before anything else.
-- The very first account becomes the admin.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  code text := coalesce(new.raw_user_meta_data ->> 'join_code', '');
  first_user boolean := not exists (select 1 from public.profiles);
  code_ok boolean := upper(trim(code)) = upper((select join_code from public.settings where id = 1));
  social boolean := coalesce(new.raw_app_meta_data ->> 'provider', 'email') <> 'email';
begin
  if not first_user and not code_ok and not social then
    raise exception 'Invalid join code';
  end if;
  insert into public.profiles (id, email, full_name, grade, role, joined)
  values (
    new.id,
    new.email,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
             split_part(new.email, '@', 1)),
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'grade'), ''), 'Stage 8'),
    case when first_user then 'admin' else 'student' end,
    first_user or code_ok
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Students may only touch last_seen on their own profile; role/active/name changes are admin-only.
-- Not security definer: current_user must stay the caller's role so join_class() (owned by postgres)
-- can unlock a profile while a direct update from the app cannot.
create or replace function public.guard_profile_update() returns trigger
language plpgsql set search_path = public as $$
begin
  if not public.is_admin() then
    if new.role <> old.role or new.active <> old.active or new.email is distinct from old.email
       or new.full_name <> old.full_name or new.grade <> old.grade
       or (new.joined <> old.joined and current_user <> 'postgres') then
      raise exception 'Only an admin can change these fields';
    end if;
  elsif old.id = auth.uid() and (new.role <> 'admin' or not new.active) then
    raise exception 'Admins cannot demote or deactivate themselves';
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_guard on public.profiles;

create or replace function public.join_class(code text) returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if upper(trim(coalesce(code, ''))) <> upper((select join_code from public.settings where id = 1)) then
    return false;
  end if;
  update public.profiles set joined = true where id = auth.uid();
  return true;
end;
$$;
revoke all on function public.join_class(text) from public, anon;
grant execute on function public.join_class(text) to authenticated;

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


-- ---------- cleanup of a removed feature (safe to re-run) ----------
drop table if exists public.past_papers;

-- ---------- email completed test results to the admin ----------
-- Every 10 minutes, newly completed tests are emailed in one message via Resend (resend.com, free plan).
-- The 10-minute wait lets students finish self-marking written answers before the score is sent.
-- Setup: store your Resend API key once with
--   select vault.create_secret('re_YOUR_KEY', 'resend_api_key');
create extension if not exists pg_net;
create extension if not exists pg_cron;

alter table public.settings add column if not exists notify_email text default 'parepalli.satheesh@gmail.com';
alter table public.settings add column if not exists notify_from text not null default 'Checkpoint Prep <onboarding@resend.dev>';
alter table public.attempts add column if not exists emailed_at timestamptz;

create or replace function public.html_esc(t text) returns text
language sql immutable as $$
  select replace(replace(replace(replace(coalesce(t, ''), '&', '&amp;'), '<', '&lt;'), '>', '&gt;'), '"', '&quot;');
$$;

create or replace function public.subject_name(id text) returns text
language sql immutable as $$
  select case id
    when 'maths' then 'Mathematics' when 'science' then 'Science' when 'english' then 'English'
    when 'esl' then 'English as a Second Language' when 'global' then 'Global Perspectives'
    when 'computing' then 'Computing' when 'mathsboost' then 'Maths Booster' else id end;
$$;

create or replace function public.send_result_emails() returns int
language plpgsql security definer set search_path = public, extensions as $$
declare
  cfg record;
  api_key text;
  ids bigint[];
  n int;
  rows_html text;
  subj text;
begin
  select notify_email, notify_from, school_name into cfg from public.settings where id = 1;
  if coalesce(trim(cfg.notify_email), '') = '' then return 0; end if;
  select decrypted_secret into api_key from vault.decrypted_secrets where name = 'resend_api_key' limit 1;
  if api_key is null then return 0; end if;

  select array_agg(id order by created_at) into ids from (
    select id, created_at from public.attempts
    where emailed_at is null and created_at < now() - interval '10 minutes'
      and created_at > now() - interval '1 day'
    order by created_at limit 100) x;
  n := coalesce(array_length(ids, 1), 0);
  if n = 0 then return 0; end if;

  select string_agg(format(
      '<tr><td style="padding:8px;border-bottom:1px solid #eee"><b>%s</b><br><span style="color:#666;font-size:12px">%s</span></td>'
      '<td style="padding:8px;border-bottom:1px solid #eee">%s<br><span style="color:#666;font-size:12px">%s</span></td>'
      '<td style="padding:8px;border-bottom:1px solid #eee;font-size:16px"><b style="color:%s">%s/%s</b><br><span style="font-size:12px">%s%%</span></td>'
      '<td style="padding:8px;border-bottom:1px solid #eee;font-size:12px">%s</td>'
      '<td style="padding:8px;border-bottom:1px solid #eee;font-size:12px;color:#666">%s</td></tr>',
      html_esc(p.full_name), html_esc(p.email),
      html_esc(subject_name(a.subject_id)), html_esc(coalesce(a.test_title, a.test_id)),
      case when a.score * 100 >= a.max * 70 then '#15803d' when a.score * 100 >= a.max * 50 then '#a16207' else '#b91c1c' end,
      a.score, a.max, round(a.score * 100.0 / a.max),
      coalesce((select string_agg(html_esc(t.key), ', ') from jsonb_each(a.topics) t
                where (t.value ->> 'max')::numeric > 0 and (t.value ->> 'got')::numeric / (t.value ->> 'max')::numeric < 0.6), '—'),
      to_char(a.created_at at time zone 'Asia/Kolkata', 'DD Mon HH24:MI')
    ), '' order by a.created_at)
  into rows_html
  from public.attempts a join public.profiles p on p.id = a.user_id
  where a.id = any(ids);

  if n = 1 then
    select format('%s completed %s: %s/%s (%s%%)', p.full_name, coalesce(a.test_title, a.test_id), a.score, a.max, round(a.score * 100.0 / a.max))
      into subj from public.attempts a join public.profiles p on p.id = a.user_id where a.id = ids[1];
  else
    subj := format('%s tests completed: %s', n, cfg.school_name);
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object('Authorization', 'Bearer ' || api_key, 'Content-Type', 'application/json'),
    body := jsonb_build_object(
      'from', cfg.notify_from,
      'to', jsonb_build_array(trim(cfg.notify_email)),
      'subject', subj,
      'html', format(
        '<div style="font-family:Arial,sans-serif;max-width:720px">'
        '<h2 style="margin:0 0 4px">📊 %s: test results</h2>'
        '<p style="color:#666;margin:0 0 16px">%s test%s completed recently.</p>'
        '<table style="border-collapse:collapse;width:100%%;font-size:14px">'
        '<tr style="background:#f3f4f6;text-align:left"><th style="padding:8px">Student</th><th style="padding:8px">Test</th>'
        '<th style="padding:8px">Score</th><th style="padding:8px">Topics to revise (below 60%%)</th><th style="padding:8px">Time (IST)</th></tr>'
        '%s</table>'
        '<p style="color:#888;font-size:12px;margin-top:16px">Full details: open the app → 🛠 Admin → Students.</p></div>',
        html_esc(cfg.school_name), n, case when n = 1 then '' else 's' end, rows_html)));

  update public.attempts set emailed_at = now() where id = any(ids);
  return n;
end;
$$;
revoke all on function public.send_result_emails() from public, anon, authenticated;

select cron.schedule('send-result-emails', '*/10 * * * *', 'select public.send_result_emails()');
