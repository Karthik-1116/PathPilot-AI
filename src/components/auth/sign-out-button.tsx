"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
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
    <Button
      variant="secondary"
      size="sm"
      onClick={handleSignOut}
      disabled={pending}
      aria-label={pending ? "Signing out" : "Sign out"}
    >
      {pending ? (
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      ) : (
        <LogOut aria-hidden="true" className="size-4" />
      )}
      <span className="hidden sm:inline">
        {pending ? "Signing out..." : "Sign out"}
      </span>
    </Button>
  );
}
