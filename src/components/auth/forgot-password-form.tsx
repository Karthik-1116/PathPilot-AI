"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { getAuthErrorMessage, isValidEmail } from "@/lib/auth-utils";
import { getBrowserClient } from "@/lib/supabase/client";
import { TextField } from "./form-field";
import { FormError } from "./form-message";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
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

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      },
    );

    setPending(false);

    if (authError) {
      setError(getAuthErrorMessage(authError.message));
      return;
    }

    setSentTo(email.trim());
  }

  if (sentTo) {
    return (
      <div className="space-y-4">
        <div
          role="status"
          className="rounded-xl border border-success/20 bg-success-soft p-4 text-sm leading-6 text-success"
        >
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 aria-hidden="true" className="size-4" />
            Check your email
          </div>
          <p className="mt-1.5">
            If an account exists for{" "}
            <strong className="font-semibold">{sentTo}</strong>, a password reset
            link is on its way. Open it in this browser and choose a new
            password.
          </p>
        </div>

        <Link
          href="/login"
          className={buttonStyles({
            variant: "primary",
            size: "md",
            className: "w-full",
          })}
        >
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? <FormError>{error}</FormError> : null}

      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={pending}
      />

      <Button type="submit" size="md" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Sending reset link...
          </>
        ) : (
          "Send reset link"
        )}
      </Button>

      <p className="text-center text-sm text-muted">
        Remembered your password?{" "}
        <Link
          href="/login"
          className="font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
