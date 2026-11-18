"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { FormError, FormSuccess } from "@/components/auth/form-message";
import { TextField } from "@/components/auth/form-field";
import { Button } from "@/components/ui/button";
import { getBrowserClient } from "@/lib/supabase/client";

interface ProfileNameFormProps {
  userId: string;
  initialName: string;
}

export function ProfileNameForm({ userId, initialName }: ProfileNameFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialName);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = fullName.trim();
    setError(null);
    setSuccess(false);

    if (name.length < 2) {
      setError("Enter your full name using at least 2 characters.");
      return;
    }

    if (name.length > 80) {
      setError("Your name must be 80 characters or fewer.");
      return;
    }

    const supabase = getBrowserClient();

    if (!supabase) {
      setError("Supabase is not configured in this environment.");
      return;
    }

    setPending(true);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", userId);

    setPending(false);

    if (updateError) {
      setError(
        "Could not update your name. Run 0001_profiles.sql in Supabase and try again.",
      );
      return;
    }

    setSuccess(true);
    router.refresh();
  }

  const unchanged = fullName.trim() === initialName.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {error ? <FormError>{error}</FormError> : null}
      {success ? (
        <FormSuccess>Your display name is updated.</FormSuccess>
      ) : null}

      <TextField
        label="Display name"
        name="fullName"
        type="text"
        autoComplete="name"
        value={fullName}
        maxLength={80}
        required
        onChange={(event) => {
          setFullName(event.target.value);
          setSuccess(false);
        }}
      />

      <Button type="submit" disabled={pending || unchanged}>
        {pending ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Save aria-hidden="true" className="size-4" />
        )}
        {pending ? "Saving..." : "Save name"}
      </Button>
    </form>
  );
}
