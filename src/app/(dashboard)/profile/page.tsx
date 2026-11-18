import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarDays,
  Clock,
  Gauge,
  Mail,
  Pencil,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { buttonStyles } from "@/components/ui/button";
import { DataWarning } from "@/components/dashboard/data-warning";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProfileNameForm } from "@/components/dashboard/profile-name-form";
import { requireDashboardUser } from "@/lib/dashboard";
import { getInitials } from "@/lib/user-display";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const {
    user,
    learnerProfile,
    learnerError,
    profile,
    profileError,
    displayName,
  } = await requireDashboardUser();

  const createdAt = profile?.createdAt ? new Date(profile.createdAt) : null;
  const memberSince =
    createdAt && !Number.isNaN(createdAt.getTime())
      ? new Intl.DateTimeFormat("en-US", {
          month: "long",
          year: "numeric",
        }).format(createdAt)
      : null;
  const skills = learnerProfile?.currentSkills ?? [];
  const goal = learnerProfile?.targetRole || "Not set";
  const experience = learnerProfile?.experienceLevel ?? "Beginner";
  const weeklyHours = learnerProfile?.weeklyHours ?? 10;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Your account"
        description="Manage your account details and review the learning profile used for roadmap generation."
      />

      {learnerError ? (
        <DataWarning
          title="Learner profile data unavailable"
          migration="supabase/migrations/0002_onboarding.sql"
        />
      ) : null}

      {profileError ? (
        <DataWarning
          title="Profile data unavailable"
          migration="supabase/migrations/0001_profiles.sql"
        />
      ) : null}

      <section className="rounded-card border border-line bg-surface p-6 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-ink text-lg font-semibold text-white">
            {getInitials(displayName)}
          </span>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-ink">
              {displayName}
            </h2>
            <p className="mt-1 flex items-center gap-1.5 break-all text-sm text-muted">
              <Mail aria-hidden="true" className="size-4 shrink-0" />
              {user.email ?? "No email on file"}
            </p>
            {memberSince ? (
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <CalendarDays
                  aria-hidden="true"
                  className="size-4 shrink-0"
                />
                Member since {memberSince}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <h3 className="text-sm font-medium text-ink">Display name</h3>
          <p className="mt-1 text-xs leading-5 text-muted">
            This name appears in the sidebar, welcome message, and future
            roadmap views.
          </p>
          <div className="mt-4 max-w-md">
            <ProfileNameForm
              userId={user.id}
              initialName={profile?.fullName || displayName}
            />
          </div>
        </div>
      </section>

      <section className="rounded-card border border-line bg-surface p-6 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles aria-hidden="true" className="size-4 text-accent" />
            <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
              Learning profile
            </h2>
          </div>
          <Link
            href="/onboarding"
            className={buttonStyles({ variant: "secondary", size: "sm" })}
          >
            <Pencil aria-hidden="true" className="size-3.5" />
            Edit onboarding
          </Link>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-line bg-canvas/50 p-4">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              <Target aria-hidden="true" className="size-3.5 text-accent" />
              Learning goal
            </dt>
            <dd className="mt-2 text-sm font-medium text-ink">{goal}</dd>
          </div>
          <div className="rounded-xl border border-line bg-canvas/50 p-4">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              <Gauge aria-hidden="true" className="size-3.5 text-accent" />
              Experience
            </dt>
            <dd className="mt-2 text-sm font-medium text-ink">
              {experience}
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-canvas/50 p-4">
            <dt className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
              <Clock aria-hidden="true" className="size-3.5 text-accent" />
              Weekly hours
            </dt>
            <dd className="mt-2 text-sm font-medium text-ink">
              {weeklyHours} hrs/week
            </dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-line pt-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
            Current skills
          </p>
          {skills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-line bg-canvas px-2.5 py-1 text-xs text-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted">
              No skills selected yet. Add them through onboarding.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-card border border-line bg-surface p-6 shadow-card">
        <div className="flex items-center gap-2">
          <ShieldCheck aria-hidden="true" className="size-4 text-success" />
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-ink">
            Session
          </h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted">
          You are signed in with a secure Supabase cookie session. Signing out
          will return you to the marketing site.
        </p>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </section>
    </div>
  );
}
