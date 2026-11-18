"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  LayoutDashboard,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Route,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Logo } from "@/components/brand/logo";
import { SidebarSignOut } from "@/components/dashboard/sidebar-sign-out";
import type { LearnerProfile } from "@/types/onboarding";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/roadmaps", label: "My Roadmap", icon: Route },
  { href: "/resources", label: "Learning Resources", icon: BookOpen },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/profile", label: "Profile", icon: UserRound },
];

interface DashboardShellProps {
  user: {
    name: string;
    email: string;
    initials: string;
  };
  learnerProfile: LearnerProfile | null;
  children: ReactNode;
}

export function DashboardShell({
  user,
  learnerProfile,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const currentItem = navItems.find((item) => isActive(item.href));
  const pageTitle = currentItem?.label ?? "Overview";

  return (
    <div className="min-h-dvh bg-canvas">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to content
      </a>

      {mobileOpen ? (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        id="dashboard-sidebar"
        aria-label="Dashboard navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line bg-surface transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "lg:w-20" : "lg:w-72",
        )}
      >
        <div
          className={cn(
            "flex h-16 shrink-0 items-center justify-between gap-2 border-b border-line px-4",
            collapsed && "lg:justify-center lg:px-0",
          )}
        >
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            aria-label="PathPilot AI overview"
            className="flex items-center rounded-md"
          >
            <span className={cn(collapsed && "lg:hidden")}>
              <Logo />
            </span>
            <span className={cn("hidden", collapsed && "lg:flex")}>
              <Logo showWordmark={false} />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation"
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-canvas hover:text-ink lg:hidden"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <p
            className={cn(
              "px-3 pb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-muted",
              collapsed && "lg:hidden",
            )}
          >
            Workspace
          </p>
          <nav aria-label="Dashboard" className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  aria-current={active ? "page" : undefined}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-accent-soft font-medium text-accent"
                      : "text-muted hover:bg-canvas hover:text-ink",
                    collapsed && "lg:justify-center lg:px-0",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4 shrink-0" />
                  <span className={cn("truncate", collapsed && "lg:hidden")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div
            className={cn(
              "mt-6 rounded-xl border border-line bg-canvas/70 p-3",
              collapsed && "lg:hidden",
            )}
          >
            <p className="flex items-center gap-1.5 text-[11px] font-medium text-ink">
              <Sparkles aria-hidden="true" className="size-3.5 text-accent" />
              AI roadmaps
            </p>
            <p className="mt-1 text-[11px] leading-5 text-muted">
              Generate a Gemini learning plan from your profile, then work
              through projects and resources.
            </p>
          </div>
        </div>

        <div className="hidden border-t border-line p-3 lg:block">
          <button
            type="button"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-pressed={collapsed}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-canvas hover:text-ink",
              collapsed && "justify-center px-0",
            )}
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" className="size-4" />
            ) : (
              <PanelLeftClose aria-hidden="true" className="size-4" />
            )}
            <span className={cn(collapsed && "hidden")}>Collapse sidebar</span>
          </button>
        </div>

        <div className="border-t border-line p-3">
          <Link
            href="/profile"
            onClick={() => setMobileOpen(false)}
            title={collapsed ? user.name : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-canvas",
              collapsed && "lg:justify-center lg:p-2",
            )}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
              {user.initials}
            </span>
            <span className={cn("min-w-0", collapsed && "lg:hidden")}>
              <span className="block truncate text-sm font-medium text-ink">
                {user.name}
              </span>
              <span className="block truncate text-xs text-muted">
                {user.email || "Signed in"}
              </span>
            </span>
          </Link>

          {learnerProfile ? (
            <div
              className={cn(
                "mt-2 rounded-xl border border-line bg-canvas/70 p-3",
                collapsed && "lg:hidden",
              )}
            >
              <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                <Target aria-hidden="true" className="size-3" />
                Goal
              </p>
              <p className="mt-1 truncate text-xs font-medium text-ink">
                {learnerProfile.targetRole || "Not set"}
              </p>
              <p className="mt-0.5 text-[11px] text-muted">
                {learnerProfile.experienceLevel} ·{" "}
                {learnerProfile.weeklyHours} hrs/week
              </p>
            </div>
          ) : null}

          <div className="mt-2">
            <SidebarSignOut collapsed={collapsed} />
          </div>
        </div>
      </aside>

      <div
        className={cn(
          "min-h-dvh transition-[padding] duration-300",
          collapsed ? "lg:pl-20" : "lg:pl-72",
        )}
      >
        <header className="sticky top-0 z-20 border-b border-line bg-surface/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                aria-expanded={mobileOpen}
                aria-controls="dashboard-sidebar"
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-muted transition-colors hover:text-ink lg:hidden"
              >
                <Menu aria-hidden="true" className="size-4" />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
                  PathPilot workspace
                </p>
                <p className="truncate text-sm font-medium text-ink">
                  {pageTitle}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors hover:border-line-strong hover:bg-canvas"
              >
                <span className="flex size-7 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-white">
                  {user.initials}
                </span>
                <span className="hidden max-w-[10rem] truncate text-sm text-ink md:inline">
                  {user.name}
                </span>
              </Link>
              <div className="hidden sm:block">
                <SignOutButton />
              </div>
            </div>
          </div>
        </header>

        <main
          id="dashboard-main"
          className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
