import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Reset password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  return (
    <AuthCard
      eyebrow="Password help"
      title="Reset your password"
      description="Enter the email linked to your account and we will send a secure reset link."
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
