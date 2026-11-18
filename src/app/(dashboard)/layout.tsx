import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireDashboardUser } from "@/lib/dashboard";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getInitials } from "@/lib/user-display";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice context="dashboard" />;
  }

  const { user, learnerProfile, displayName } = await requireDashboardUser();

  return (
    <DashboardShell
      user={{
        name: displayName,
        email: user.email ?? "",
        initials: getInitials(displayName),
      }}
      learnerProfile={learnerProfile}
    >
      {children}
    </DashboardShell>
  );
}
