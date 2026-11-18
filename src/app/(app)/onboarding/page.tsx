import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Database } from "lucide-react";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getLearnerProfile } from "@/lib/supabase/learner-profile";

export const metadata: Metadata = {
  title: "Onboarding",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice context="onboarding" />;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/onboarding");
  }

  const { profile, error } = await getLearnerProfile(user.id);

  return (
    <div>
      {error ? (
        <div className="mx-auto mb-6 max-w-3xl rounded-xl border border-warning/20 bg-warning-soft p-4 text-sm leading-6 text-warning">
          <div className="flex items-center gap-2 font-medium">
            <Database aria-hidden="true" className="size-4" />
            Learner profile data unavailable
          </div>
          <p className="mt-1">
            Run{" "}
            <code className="font-mono text-[12px]">
              supabase/migrations/0002_onboarding.sql
            </code>{" "}
            in the Supabase SQL Editor, then reload this page.
          </p>
        </div>
      ) : null}

      <OnboardingWizard userId={user.id} initialProfile={profile} />
    </div>
  );
}
