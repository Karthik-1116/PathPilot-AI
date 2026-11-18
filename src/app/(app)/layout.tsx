import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { AppBreadcrumb } from "@/components/layout/app-breadcrumb";
import { getCurrentUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = isSupabaseConfigured ? await getCurrentUser() : null;

  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-line bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="PathPilot AI home" className="rounded-md">
              <Logo />
            </Link>
            <AppBreadcrumb />
          </div>

          <div className="flex min-w-0 items-center gap-3">
            {user?.email ? (
              <span className="hidden max-w-[14rem] truncate text-sm text-muted sm:inline">
                {user.email}
              </span>
            ) : null}
            {user ? <SignOutButton /> : null}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8">
        {children}
      </main>
    </div>
  );
}
