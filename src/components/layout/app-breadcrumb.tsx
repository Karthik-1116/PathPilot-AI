"use client";

import { usePathname } from "next/navigation";

const labels: Record<string, string> = {
  dashboard: "Dashboard",
  onboarding: "Onboarding",
  roadmaps: "Roadmaps",
  resources: "Resources",
  progress: "Progress",
  profile: "Profile",
  settings: "Settings",
};

export function AppBreadcrumb() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "dashboard";
  const label = labels[segment] ?? "Workspace";

  return (
    <span className="hidden text-sm text-muted sm:inline">/ {label}</span>
  );
}
