"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { getBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function SidebarSignOut({ collapsed }: { collapsed: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    const supabase = getBrowserClient();

    if (!supabase) return;

    setPending(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setPending(false);
      return;
    }

    router.replace("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={pending}
      aria-label={pending ? "Signing out" : "Sign out"}
      className={cn(
        "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted transition-colors hover:bg-ink/[0.05] hover:text-ink disabled:opacity-60",
        collapsed && "lg:justify-center lg:px-0",
      )}
    >
      {pending ? (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <LogOut aria-hidden="true" className="size-4" />
      )}
      <span className={cn(collapsed && "lg:hidden")}>
        {pending ? "Signing out..." : "Sign out"}
      </span>
    </button>
  );
}
