"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAuthErrorMessage,
  isValidEmail,
  sanitizeRedirectPath,
} from "@/lib/auth-utils";
import { getBrowserClient } from "@/lib/supabase/client";
import { PasswordField, TextField } from "./form-field";
import { FormError } from "./form-message";

export function LoginForm({
  nextPath,
  initialError,
}: {
  nextPath: string;
  initialError?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
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

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setPending(false);

    if (authError) {
      setError(getAuthErrorMessage(authError.message));
      return;
    }

    router.replace(sanitizeRedirectPath(nextPath));
    router.refresh();
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

      <div>
        <PasswordField
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          disabled={pending}
        />
        <div className="mt-2 text-right">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-accent transition-colors hover:text-accent-hover"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <Button type="submit" size="md" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Logging in...
          </>
        ) : (
          "Log in"
        )}
      </Button>

      <p className="text-center text-sm text-muted">
        New to PathPilot?{" "}
        <Link
          href="/signup"
          className="font-medium text-accent transition-colors hover:text-accent-hover"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
