# PathPilot AI

**Personalized, project-based learning roadmaps for students.**

PathPilot AI turns a learner's current skills, career goal, experience level, and available study time into a clear stage-by-stage roadmap with topics, resources, projects, and progress tracking.

This repository is being built phase by phase as a full-stack college capstone project.

---

## Current status

| Phase | Scope | Status |
|---|---|---|
| 1 | Project setup, design system, landing page | Complete |
| 2 | Supabase schema, authentication, profiles, protected dashboard | Complete in code - add your Supabase keys to verify live auth |
| 3 | Multi-step onboarding | Complete in code - run `0002_onboarding.sql` to verify |
| 4 | Dashboard shell and overview | Complete in code - verify in the browser |
| 5 | Gemini roadmap generation and persistence | Complete in code - run `0003_roadmaps.sql` and add `GEMINI_API_KEY` to verify |
| 6 | AI assistant, skill assessments, recommendations | Planned |
| 7 | Progress tracking, charts, projects | Planned |
| 8 | Testing, GitHub preparation, Vercel deployment | Planned |

Phase 2 includes real email/password sign-up, login, email confirmation
handling, password reset, session refresh, protected routes, profile creation,
and a protected `/dashboard`. Authentication is not mocked or faked.

Phase 3 adds a protected five-step onboarding wizard for the learner's career
goal, experience level, current skills, weekly study time, and a final review.
Answers are saved to a dedicated `learner_profiles` table. New accounts are sent
to `/onboarding`, and the dashboard redirects anyone who has not finished
onboarding. Completed learners can revisit onboarding to update their profile.

Phase 4 adds the dashboard shell and overview. Every dashboard route shares a
responsive sidebar with desktop collapse, a mobile drawer, active navigation,
the learner's goal, and sign out. The overview shows the real name, goal,
experience level, weekly hours, and skills saved in Supabase. Roadmap, resource,
and progress views use explicit empty states instead of invented statistics.

Phase 5 adds personalized roadmap generation. The server reads the signed-in
learner's profile, asks Gemini for a structured 4-8 phase plan, validates it with
Zod, and stores it as JSONB in `public.roadmaps`. Users get a detailed timeline
with objectives, topics, assignments, portfolio projects, and curated resources,
plus roadmap history and regeneration. `/resources` aggregates links from the
latest roadmap. No Gemini key or raw AI response ever reaches the browser.

## What works now

- Responsive marketing site with working `/signup` and `/login` routes
- Email/password registration with a full name stored in user metadata
- Automatic `profiles` row creation through a Postgres trigger
- Secure Supabase cookie sessions managed by `@supabase/ssr`
- Email confirmation support (Supabase setting dependent)
- Forgot-password and update-password flows
- Protected `/dashboard` that shows the signed-in account
- Sign out from the dashboard header
- A clear setup screen when Supabase environment variables are missing
- Row Level Security so users can only read and update their own profile
- Five-step onboarding wizard with progress, validation, and review
- Learner goal, experience level, skills, and weekly hours saved per user
- Automatic redirect to onboarding until the learner profile is complete
- Editable onboarding from the dashboard
- Responsive dashboard shell with a collapsible sidebar and mobile drawer
- Overview with real onboarding data, honest empty states, and quick actions
- Gemini-powered roadmap generation with structured JSON output
- Primary/fallback Gemini models, low-latency thinking, and bounded request timeouts
- Zod validation of AI output with an automatic repair attempt
- Roadmap persistence in Supabase with owner-only RLS
- Detailed roadmap timeline with phases, topics, assignments, and projects
- Curated resource library aggregated from the latest roadmap
- Roadmap history: regeneration creates a new version and preserves old plans
- Profile-change detection with a regenerate prompt
- Duplicate-request, cooldown, daily-limit, and in-flight generation guards
- Profile page with account details, display-name editing, and sign out

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + custom design tokens
- **Icons:** Lucide React
- **Database and auth:** Supabase PostgreSQL + Supabase Auth
- **AI:** Google Gemini REST API (`generateContent`) called from server-only code
- **Validation:** Zod schemas for AI output and stored roadmap content
- **Deployment (Phase 8):** Vercel

## Prerequisites

- Node.js 20.9 or newer (this project was built with Node 26)
- npm
- A free [Supabase](https://supabase.com) account

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Sign in at [supabase.com/dashboard](https://supabase.com/dashboard).
2. Create a new project and wait for provisioning to finish.
3. Open **Project Settings > API**.
4. Copy the **Project URL** and the **public anon key**.

### 3. Add environment variables

Open `.env.local` in the project root and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-public-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
GEMINI_API_KEY=your-server-only-gemini-key
GEMINI_MODEL=gemini-3.8-flash
GEMINI_FALLBACK_MODEL=gemini-3.5-flash
GEMINI_PRIMARY_TIMEOUT_MS=15000
GEMINI_FALLBACK_TIMEOUT_MS=35000
GEMINI_TOTAL_TIMEOUT_MS=50000
ROADMAP_DAILY_LIMIT=10
```

`.env.local` is ignored by Git. The anon key is designed to be public, but RLS
still protects your data. `GEMINI_API_KEY` is server-only and must never use a
`NEXT_PUBLIC_` prefix. The Gemini model and timeout variables are optional; the
defaults are shown above. Keep `GEMINI_TOTAL_TIMEOUT_MS` below the route's
60-second `maxDuration`. Never put the service-role key in a `NEXT_PUBLIC_`
variable or in client code.

### 4. Create the database tables

Open the Supabase **SQL Editor**, paste the contents of
`supabase/migrations/0001_profiles.sql`, run it, then do the same with
`supabase/migrations/0002_onboarding.sql` and
`supabase/migrations/0003_roadmaps.sql`.

`0001_profiles.sql` creates:

- `public.profiles` with a one-to-one link to `auth.users`
- RLS policies for selecting, inserting, and updating your own profile
- A trigger that creates a profile whenever a user signs up
- A backfill for any auth users that already exist

`0002_onboarding.sql` creates:

- `public.learner_profiles` with goal, experience level, weekly hours, skills,
  and onboarding completion state
- RLS policies for selecting, inserting, and updating your own learner profile
- An `updated_at` trigger
- A sign-up trigger and a backfill so every auth user has a learner profile row

`0003_roadmaps.sql` creates:

- `public.roadmaps` with profile snapshot fields, a SHA-256 profile fingerprint,
  Gemini metadata, and validated JSONB content
- Owner-only select, insert, and update RLS policies
- No delete policy, so previous roadmap versions are preserved
- An index for the latest-roadmap query and an `updated_at` trigger

### 5. Configure Supabase Auth URLs

In **Authentication > URL Configuration**:

- Set **Site URL** to `http://localhost:3000`
- Add `http://localhost:3000/**` to **Redirect URLs** for local development
- Add your production URL and `/auth/callback` allowlist entry in Phase 8

### 6. Optional: simplify local testing

Supabase requires email confirmation by default. For faster local testing, go
to **Authentication > Providers > Email** and disable **Confirm email**. With
confirmation disabled, new accounts are logged in immediately after sign-up.

If you leave confirmation enabled, the sign-up form shows a "check your email"
message. Open the link in the same browser you signed up from.

### 7. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). If the auth pages show the
setup notice, check `.env.local` and restart the dev server.

## Auth flows and routes

| Route | Purpose |
|---|---|
| `/signup` | Create an account with full name, email, and password |
| `/login` | Sign in and return to the requested protected route |
| `/forgot-password` | Send a Supabase password reset email |
| `/update-password` | Set a new password after opening a reset link |
| `/auth/callback` | Exchange the Supabase PKCE code for a cookie session |
| `/dashboard` | Protected overview inside the dashboard shell |
| `/roadmaps` | Protected roadmap workspace with generation and history |
| `/roadmaps/[id]` | Protected detailed roadmap timeline |
| `/api/roadmaps/generate` | Authenticated JSON endpoint for Gemini generation |
| `/resources` | Protected resource library from the latest roadmap |
| `/progress` | Protected progress view (Phase 7 empty state) |
| `/profile` | Protected account, learner profile, and sign out |
| `/onboarding` | Protected five-step learner profile wizard |

Protected route prefixes are `/dashboard`, `/onboarding`, `/roadmaps`,
`/resources`, `/progress`, `/profile`, and `/settings`. Logged-out visitors are
redirected to `/login` with a safe `next` path. Logged-in visitors are redirected
away from `/login`, `/signup`, and `/forgot-password`. New sign-ups land on
`/onboarding`, and every dashboard route redirects anyone whose learner profile
is not complete.

`/api/roadmaps/generate` is intentionally not covered by the proxy matcher.
It verifies the session itself and returns JSON `401`/`503`/`409`/`429` errors
instead of redirecting an API client to an HTML login page.

## How authentication is wired

- `src/lib/supabase/client.ts` creates the browser client used by forms.
- `src/lib/supabase/server.ts` creates a request-scoped server client.
- `src/lib/supabase/auth.ts` exposes a cached `getCurrentUser()` for Server
  Components. `getUser()` verifies the session with Supabase.
- `src/lib/supabase/learner-profile.ts` reads the signed-in user's onboarding
  profile for Server Components.
- `src/lib/supabase/profile.ts` reads the profile row used by the dashboard.
- `src/lib/supabase/roadmaps.ts` reads the latest roadmap, history, and inserts
  validated content.
- `src/lib/roadmaps.ts` builds the profile fingerprint, maps database rows, and
  derives display statuses.
- `src/lib/roadmaps/schema.ts` defines the Zod schemas used for AI responses and
  stored JSONB content.
- `src/lib/gemini/` holds the server-only REST client, prompt, and generation
  pipeline.
- `src/lib/dashboard.ts` guards dashboard routes and returns the signed-in user,
  profile, and learner profile in one place.
- `src/lib/user-display.ts` derives display names and initials from real account
  data.
- `src/lib/supabase/session.ts` refreshes sessions and performs optimistic
  redirects inside `src/proxy.ts`.
- `src/proxy.ts` is the Next.js 16 replacement for `middleware.ts`.
- `src/app/auth/callback/route.ts` exchanges the email-link code and sets
  cookies before redirecting.
- Server Components repeat secure checks close to the data instead of trusting
  the proxy alone.

## Database schema

`public.profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, references `auth.users(id)` with cascade delete |
| `full_name` | `text` | Filled from sign-up metadata; defaults to empty |
| `avatar_url` | `text` | Reserved for a later profile phase |
| `created_at` | `timestamptz` | Defaults to `now()` |
| `updated_at` | `timestamptz` | Updated automatically by a trigger |

RLS is enabled. Authenticated users can only select, insert, and update their
own row. The `anon` role has no table privileges. The sign-up trigger runs with
definer privileges so the profile can be created before the user has a session.

`public.learner_profiles`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, references `auth.users(id)` with cascade delete |
| `target_role` | `text` | Career goal selected or typed during onboarding |
| `experience_level` | `text` | `Beginner`, `Intermediate`, or `Advanced` |
| `weekly_hours` | `integer` | Weekly study budget from 1 to 40 |
| `current_skills` | `text[]` | Skills selected or added during onboarding |
| `onboarding_completed` | `boolean` | Set to true when the wizard is saved |
| `onboarding_completed_at` | `timestamptz` | Last completion timestamp |
| `created_at` | `timestamptz` | Defaults to `now()` |
| `updated_at` | `timestamptz` | Updated automatically by a trigger |

RLS is enabled on `learner_profiles` with the same owner-only select, insert, and
update policies as `profiles`. The onboarding wizard saves with an upsert; the
browser can only write the row whose `id` matches the signed-in user.

`public.roadmaps`

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` | Primary key, generated automatically |
| `user_id` | `uuid` | References `auth.users(id)` with cascade delete |
| `title` | `text` | Human-readable roadmap title |
| `goal` | `text` | Profile target role snapshot used for generation |
| `experience_level` | `text` | `Beginner`, `Intermediate`, or `Advanced` |
| `weekly_hours` | `integer` | Weekly study budget at generation time |
| `current_skills` | `text[]` | Skill snapshot used for generation |
| `duration_weeks` | `integer` | Normalized total duration |
| `phase_count` | `integer` | Number of generated phases |
| `profile_fingerprint` | `text` | SHA-256 of the normalized learner profile |
| `ai_model` | `text` | Gemini model used for this version |
| `prompt_version` | `text` | Prompt/schema version for traceability |
| `content` | `jsonb` | Validated roadmap content |
| `created_at` | `timestamptz` | Version timestamp |
| `updated_at` | `timestamptz` | Updated automatically by a trigger |

RLS is enabled. Authenticated users can select, insert, and update only their own
rows. There is intentionally no delete policy, so regeneration keeps history.
The latest roadmap is the newest row for the signed-in user.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build locally |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |

Run `npm run typecheck` and `npm run build` one at a time. Running them
simultaneously can race over generated `.next/types` files.

## Project structure

```text
src/
|-- app/
|   |-- (marketing)/          # Public landing page + marketing layout
|   |-- (auth)/               # Login, signup, forgot/update password
|   |-- (app)/                # Authenticated header shell + onboarding
|   |-- (dashboard)/          # Sidebar shell + dashboard pages
|   |   |-- dashboard/        # Overview
|   |   |-- roadmaps/         # Roadmap workspace + detail timeline
|   |   |-- resources/        # Aggregated roadmap resources
|   |   |-- progress/         # Progress view
|   |   `-- profile/          # Account and learner profile
|   |-- api/roadmaps/generate/ # Authenticated Gemini generation endpoint
|   |-- auth/callback/        # Supabase PKCE code exchange route
|   |-- globals.css           # Tailwind import + design tokens
|   |-- icon.svg              # Favicon / brand mark
|   |-- layout.tsx            # Fonts, metadata, root HTML shell
|   `-- not-found.tsx         # Branded 404 page
|-- components/
|   |-- auth/                 # Auth forms, fields, setup notice, sign out
|   |-- brand/                # Logo
|   |-- dashboard/            # Shell, sidebar, cards, empty states, profile form
|   |-- landing/              # Landing page sections
|   |-- layout/               # Header, footer, app breadcrumb
|   |-- onboarding/           # Progress, selection cards, wizard
|   |-- roadmaps/             # Generation controls, timeline, history cards
|   `-- ui/                   # Button, badge, container, section heading
|-- lib/
|   |-- gemini/               # Server-only Gemini config, prompt, REST pipeline
|   |-- roadmaps/             # Zod roadmap schemas
|   |-- supabase/             # Browser, server, auth, config, session helpers
|   |-- auth-utils.ts         # Redirect, email, and error-message helpers
|   |-- dashboard.ts          # Dashboard auth + onboarding guard
|   |-- demo-roadmap.ts       # Clearly labelled sample roadmap data
|   |-- format.ts             # Date formatting helper
|   |-- onboarding.ts         # Steps, options, validation, skill helpers
|   |-- roadmap-display.ts    # Status and resource-type labels
|   |-- roadmaps.ts           # Fingerprints, row mapping, status derivation
|   |-- site-config.ts        # Navigation and landing page content
|   |-- user-display.ts       # Display name and initials helpers
|   `-- utils.ts              # Small class-name helper
|-- types/
|   |-- generated-roadmap.ts  # Generated roadmap, row, and summary types
|   |-- onboarding.ts         # Learner profile and onboarding types
|   `-- roadmap.ts            # Shared demo roadmap types
`-- proxy.ts                  # Next.js 16 session refresh + route protection

supabase/migrations/0001_profiles.sql
supabase/migrations/0002_onboarding.sql
supabase/migrations/0003_roadmaps.sql
```

## Design system

The visual direction is a calm, neutral SaaS workspace inspired by Linear,
Notion, and Vercel:

- Warm off-white canvas, white surfaces, deep navy text
- One restrained indigo-violet accent, plus green for completed states
- Geist Sans and Geist Mono
- Rounded cards, one-pixel borders, soft low-opacity shadows
- Motion limited to a hero fade-up, hover states, and the roadmap accordion
- Reduced-motion support and keyboard-accessible navigation

Design tokens live in `src/app/globals.css` under `@theme`.

## Phase 1 verification

- [x] Landing page renders at `/`
- [x] Responsive header with accessible mobile menu
- [x] Hero, how-it-works, features, sample roadmap, benefits, CTA, footer
- [x] Interactive, accessible sample roadmap accordion
- [x] Working `/signup` and `/login` routes
- [x] Branded 404 page
- [x] Lint, typecheck, and production build pass

## Phase 2 verification

- [x] Auth pages render real forms when Supabase is configured
- [x] Missing Supabase config shows a clear setup notice instead of crashing
- [x] Protected routes redirect logged-out visitors to `/login`
- [ ] Logged-in visitors redirected away from login/signup (requires a live session)
- [x] Password visibility, validation, loading, and error states implemented
- [x] Profiles table migration file includes RLS and a sign-up trigger
- [ ] Migration applied and profile row created against your Supabase project
- [x] Password reset and auth callback routes implemented
- [x] Lint, typecheck, and production build pass
- [ ] Live sign-up, login, email confirmation, password reset, and sign-out
      verified against your Supabase project

Phase 2 was also smoke-tested with a placeholder Supabase URL and anon key to
confirm that the real forms render, client-side validation works, password
visibility toggles, protected routes redirect, and the callback failure path
returns to login. Those tests do not create real accounts or send email.

The final live-auth checkbox requires your Supabase project URL and anon key.
Add them to `.env.local`, run the migration, restart the server, and test the
flows in the browser.

## Phase 3 verification

- [x] Protected `/onboarding` route with a five-step wizard
- [x] Goal, experience level, skills, weekly hours, and review steps
- [x] Per-step validation with inline error messages
- [x] Progress indicator, back/continue navigation, and summary edit links
- [x] Skills can be selected, added as custom chips, and removed
- [x] Save uses an upsert into `learner_profiles` with RLS protection
- [x] New sign-ups are redirected to `/onboarding`
- [x] Incomplete learners are redirected from `/dashboard` to `/onboarding`
- [x] Completed learners can revisit onboarding to update their profile
- [x] Dashboard shows the saved goal, level, hours, and skills
- [x] `0002_onboarding.sql` includes RLS, triggers, and a backfill
- [x] Lint, typecheck, and production build pass
- [ ] Migration applied and onboarding saved against your Supabase project

The final checkbox needs your Supabase project. Add the keys to `.env.local`,
run both migrations, restart the server, and complete onboarding in the browser.

## Phase 4 verification

- [x] Responsive dashboard layout with a collapsible desktop sidebar
- [x] Mobile drawer with overlay, Escape handling, and scroll lock
- [x] Navigation for Overview, My Roadmap, Learning Resources, Progress, Profile
- [x] Welcome message uses the saved profile name with an email fallback
- [x] Goal, experience level, weekly hours, and skills read from Supabase
- [x] Stat cards show real values or explicit "Not generated" / "No data" states
- [x] Weekly activity empty state contains no invented numbers
- [x] Quick actions, roadmap preview, and a real profile page
- [x] Display-name editing writes to `profiles` under RLS
- [x] Sign out available from the sidebar and dashboard header
- [x] New dashboard routes are protected in `proxy.ts`
- [x] Lint, typecheck, and production build pass
- [ ] Live browser walkthrough against your Supabase project

The final checkbox needs a logged-in account. Sign in after running all three
migrations, then visit `/dashboard`, `/roadmaps`, `/resources`, `/progress`, and
`/profile` at desktop and mobile widths.

## Phase 5 verification

- [x] Server-only Gemini REST client using `generateContent`
- [x] `GEMINI_API_KEY`, primary/fallback model, and timeout configuration
- [x] Zod schema for AI output and stored JSONB content
- [x] Automatic fallback and repair attempts for timeouts or invalid structure
- [x] Stage timing and Gemini provider error logs
- [x] `0003_roadmaps.sql` with owner-only RLS and preserved history
- [x] Authenticated `POST /api/roadmaps/generate` endpoint
- [x] Duplicate-profile, cooldown, daily-limit, and in-flight guards
- [x] Roadmap list, generation controls, phase overview, and history
- [x] Detailed timeline with objectives, topics, assignments, and projects
- [x] Resource library aggregated from the latest roadmap
- [x] Dashboard roadmap status and resource quick action
- [x] Profile-change detection with a regenerate prompt
- [x] Missing-table, missing-key, rate-limit, timeout, and validation errors
- [x] Logged-out API smoke test returns JSON `401`
- [x] Protected roadmap routes redirect to `/login`
- [x] Lint, typecheck, and production build pass
- [ ] `0003_roadmaps.sql` applied against your Supabase project
- [ ] `GEMINI_API_KEY` added and live generation verified
- [ ] Authenticated browser walkthrough of generation, history, and resources

The remaining checkboxes need your live project and API key. Add
`GEMINI_API_KEY` to `.env.local`, run all three migrations, restart `npm run dev`,
and generate a roadmap from `/roadmaps`. Test at desktop and mobile widths.
Gemini occasionally suggests an unstable resource URL; verify external links
before relying on them.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Auth pages show "Connect Supabase" | Fill `.env.local` and restart `npm run dev` |
| `database error saving new user` | Run `0001_profiles.sql` in the Supabase SQL Editor |
| Onboarding says the learner profile table is missing | Run `0002_onboarding.sql` in the Supabase SQL Editor |
| Dashboard redirects back to onboarding | Save the final onboarding step successfully |
| Roadmap says the roadmap table is missing | Run `0003_roadmaps.sql` in the Supabase SQL Editor |
| "Roadmap generation is not configured" | Add `GEMINI_API_KEY` to `.env.local` and restart the server |
| Gemini rejects the API key or model | Check `GEMINI_API_KEY` and set models enabled for your key in `GEMINI_MODEL` and `GEMINI_FALLBACK_MODEL` |
| Generation times out | Check the `[roadmap-gemini]` logs, then adjust `GEMINI_PRIMARY_TIMEOUT_MS`, `GEMINI_FALLBACK_TIMEOUT_MS`, or the model choice |
| Generation says it is rate limited | Wait and retry; lower usage or raise `ROADMAP_DAILY_LIMIT` if appropriate |
| Email link says invalid or expired | Request a new link and open it in the same browser |
| Password reset email never arrives | Check spam; Supabase's built-in email service has rate limits |
| Redirected to localhost:3000 incorrectly | Add `http://localhost:3000/**` to Supabase Redirect URLs |
| Invalid API key | Re-copy the anon key from Project Settings > API and restart |
| Profile warning on dashboard | Run the migration, then reload the page |

## Security notes

- RLS is enabled on `profiles`; users can only access their own row.
- RLS is enabled on `learner_profiles`; the onboarding upsert can only write the
  signed-in user's row.
- RLS is enabled on `roadmaps`; users can only read and create their own
  versions, and there is no delete policy.
- `GEMINI_API_KEY` is read only in server code. It is never exposed through a
  `NEXT_PUBLIC_` variable, a client component, or an API response.
- AI output is parsed and validated with Zod before it is displayed or stored.
- The generation endpoint re-checks the session and onboarding state even though
  the dashboard proxy already protects page routes.
- Cooldown and in-flight locks reduce accidental duplicate generation. The
  in-flight lock is process-local; the database daily limit is the durable
  safeguard.
- Resource links are AI-generated. Treat them as suggestions and verify them
  before relying on external content.
- The anon key is public by design. The service-role key is not used in this
  phase and must never be exposed to the browser.
- Session cookies are managed by `@supabase/ssr` and refreshed in `proxy.ts`.
- Auth and protected responses are marked `no-store`.
- Redirect targets are validated to allow only internal paths.
- Passwords are handled by Supabase Auth and are never stored by this app.

## External documentation

- [Next.js App Router](https://nextjs.org/docs/app)
- [Next.js Proxy](https://nextjs.org/docs/app/getting-started/proxy)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Supabase Auth server-side rendering](https://supabase.com/docs/guides/auth/server-side)
- [Google Gemini API](https://ai.google.dev/gemini-api/docs)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)

---

Built as a student capstone project. Sample roadmap data is illustrative and
does not represent a real student.
