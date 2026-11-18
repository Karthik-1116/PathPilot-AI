"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button, buttonStyles } from "@/components/ui/button";
import { getAuthErrorMessage, isValidEmail } from "@/lib/auth-utils";
import { getBrowserClient } from "@/lib/supabase/client";
import { PasswordField, TextField } from "./form-field";
import { FormError } from "./form-message";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmationEmail, setConfirmationEmail] = useState<string | null>(
    null,
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const name = fullName.trim();

    if (name.length < 2) {
      setError("Enter your full name.");
      return;
    }

    if (name.length > 80) {
      setError("Name must be 80 characters or fewer.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
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

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    setPending(false);

    if (authError) {
      setError(getAuthErrorMessage(authError.message));
      return;
    }

    if (data.user?.identities?.length === 0) {
      setError(
        "An account with this email already exists. Try logging in instead.",
      );
      return;
    }

    if (data.session) {
      router.replace("/onboarding");
      router.refresh();
      return;
    }

    setConfirmationEmail(email.trim());
  }

  if (confirmationEmail) {
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
            We sent a confirmation link to{" "}
            <strong className="font-semibold">{confirmationEmail}</strong>. Open
            it in this browser to finish signing in.
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
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? <FormError>{error}</FormError> : null}

      <TextField
        label="Full name"
        type="text"
        autoComplete="name"
        placeholder="Your name"
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        maxLength={80}
        required
        disabled={pending}
      />

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

      <PasswordField
        label="Password"
        autoComplete="new-password"
        placeholder="Create a password"
        hint="Use at least 8 characters."
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        disabled={pending}
      />

      <Button type="submit" size="md" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
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
