import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { SignupForm } from "@/components/auth/signup-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Create account",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  return (
    <AuthCard
      eyebrow="Create account"
      title="Build your learning path"
      description="Create an account to save your goals, roadmap, and progress."
    >
      <SignupForm />
    </AuthCard>
  );
}
