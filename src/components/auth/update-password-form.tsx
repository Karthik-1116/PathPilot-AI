"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAuthErrorMessage } from "@/lib/auth-utils";
import { getBrowserClient } from "@/lib/supabase/client";
import { PasswordField } from "./form-field";
import { FormError } from "./form-message";

export function UpdatePasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    const supabase = getBrowserClient();

    if (!supabase) {
      setError(
        "Supabase is not configured. Add your project URL and anon key to .env.local, then restart the dev server.",
      );
      return;
    }

    setPending(true);

    const { error: authError } = await supabase.auth.updateUser({ password });

    setPending(false);

    if (authError) {
      setError(getAuthErrorMessage(authError.message));
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? <FormError>{error}</FormError> : null}

      <p className="text-sm leading-6 text-muted">
        Signed in as <span className="font-medium text-ink">{email}</span>.
      </p>

      <PasswordField
        label="New password"
        autoComplete="new-password"
        placeholder="Choose a new password"
        hint="Use at least 8 characters."
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        disabled={pending}
      />

      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        placeholder="Repeat your new password"
        value={confirmation}
        onChange={(event) => setConfirmation(event.target.value)}
        required
        disabled={pending}
      />

      <Button type="submit" size="md" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Updating password...
          </>
        ) : (
          "Update password"
        )}
      </Button>

      <p className="text-center text-sm text-muted">
        <Link
          href="/dashboard"
          className="font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Back to dashboard
        </Link>
      </p>
    </form>
  );
}
