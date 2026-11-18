import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { SupabaseSetupNotice } from "@/components/auth/supabase-setup-notice";
import { sanitizeRedirectPath } from "@/lib/auth-utils";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Log in",
  robots: { index: false, follow: false },
};

const errorMessages: Record<string, string | undefined> = {
  "auth-callback-failed":
    "We could not complete that sign-in link. Request a new link and try again.",
  "session-expired": "Your session expired. Log in again to continue.",
};

interface LoginPageProps {
  searchParams: Promise<{
    error?: string | string[];
    next?: string | string[];
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (!isSupabaseConfigured) {
    return <SupabaseSetupNotice />;
  }

  const params = await searchParams;
  const errorCode = Array.isArray(params.error)
    ? params.error[0]
    : params.error;
  const nextParam = Array.isArray(params.next) ? params.next[0] : params.next;

  return (
    <AuthCard
      eyebrow="Welcome back"
      title="Log in to PathPilot"
      description="Continue building your personalized learning path."
    >
      <LoginForm
        nextPath={sanitizeRedirectPath(nextParam)}
        initialError={errorCode ? errorMessages[errorCode] : undefined}
      />
    </AuthCard>
  );
}
