-- PathPilot AI - Phase 3 learner onboarding schema.
-- Run after 0001_profiles.sql in Supabase Dashboard > SQL Editor.

create table if not exists public.learner_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  target_role text not null default '',
  experience_level text not null default 'Beginner'
    check (experience_level in ('Beginner', 'Intermediate', 'Advanced')),
  weekly_hours integer not null default 10
    check (weekly_hours between 1 and 40),
  current_skills text[] not null default '{}',
  onboarding_completed boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.learner_profiles enable row level security;

drop policy if exists "Learner profiles are viewable by their owner" on public.learner_profiles;
create policy "Learner profiles are viewable by their owner"
  on public.learner_profiles
  for select
  to authenticated
  using ((select auth.uid()) = id);

drop policy if exists "Learner profiles are insertable by their owner" on public.learner_profiles;
create policy "Learner profiles are insertable by their owner"
  on public.learner_profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

drop policy if exists "Learner profiles are updatable by their owner" on public.learner_profiles;
create policy "Learner profiles are updatable by their owner"
  on public.learner_profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke all on public.learner_profiles from anon, authenticated;
grant select, insert, update on public.learner_profiles to authenticated;

create or replace function public.set_learner_profiles_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists learner_profiles_set_updated_at on public.learner_profiles;
create trigger learner_profiles_set_updated_at
  before update on public.learner_profiles
  for each row
  execute function public.set_learner_profiles_updated_at();

create or replace function public.handle_new_pathpilot_learner()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.learner_profiles (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_pathpilot_learner_created on auth.users;
create trigger on_pathpilot_learner_created
  after insert on auth.users
  for each row
  execute function public.handle_new_pathpilot_learner();

insert into public.learner_profiles (id)
select id from auth.users
on conflict (id) do nothing;
