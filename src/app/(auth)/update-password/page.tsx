import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Update password",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function UpdatePasswordPage() {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/update-password");
  }

  return (
    <AuthCard
      eyebrow="Account security"
      title="Choose a new password"
      description="Set a new password for your PathPilot account."
    >
      <UpdatePasswordForm email={user.email ?? "your account"} />
    </AuthCard>
  );
}
