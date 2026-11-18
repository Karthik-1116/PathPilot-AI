import "server-only";

import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getLearnerProfile } from "@/lib/supabase/learner-profile";
import { getProfile } from "@/lib/supabase/profile";
import { getDisplayName } from "@/lib/user-display";

export async function requireDashboardUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/dashboard");
  }

  const [{ profile: learnerProfile, error: learnerError }, { profile, error: profileError }] =
    await Promise.all([getLearnerProfile(user.id), getProfile(user.id)]);

  if (!learnerError && !learnerProfile?.onboardingCompleted) {
    redirect("/onboarding");
  }

  return {
    user,
    learnerProfile,
    learnerError,
    profile,
    profileError,
    displayName: getDisplayName(profile?.fullName, user.email),
  };
}
