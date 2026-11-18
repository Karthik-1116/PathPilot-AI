-- PathPilot AI - Phase 5 personalized roadmap storage.
-- Run after 0001_profiles.sql and 0002_onboarding.sql in the Supabase SQL Editor.

create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  goal text not null,
  experience_level text not null
    check (experience_level in ('Beginner', 'Intermediate', 'Advanced')),
  weekly_hours integer not null
    check (weekly_hours between 1 and 40),
  current_skills text[] not null default '{}',
  duration_weeks integer not null
    check (duration_weeks between 1 and 104),
  phase_count integer not null
    check (phase_count between 1 and 12),
  profile_fingerprint text not null
    check (char_length(profile_fingerprint) = 64),
  ai_model text not null,
  prompt_version text not null default 'phase5-v1',
  content jsonb not null
    check (jsonb_typeof(content) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists roadmaps_user_created_idx
  on public.roadmaps (user_id, created_at desc);

alter table public.roadmaps enable row level security;

drop policy if exists "Roadmaps are viewable by their owner" on public.roadmaps;
create policy "Roadmaps are viewable by their owner"
  on public.roadmaps
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Roadmaps are insertable by their owner" on public.roadmaps;
create policy "Roadmaps are insertable by their owner"
  on public.roadmaps
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Roadmaps are updatable by their owner" on public.roadmaps;
create policy "Roadmaps are updatable by their owner"
  on public.roadmaps
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- No delete policy: previous roadmaps are preserved by design.
revoke all on public.roadmaps from anon, authenticated;
grant select, insert, update on public.roadmaps to authenticated;

create or replace function public.set_roadmaps_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists roadmaps_set_updated_at on public.roadmaps;
create trigger roadmaps_set_updated_at
  before update on public.roadmaps
  for each row
  execute function public.set_roadmaps_updated_at();
