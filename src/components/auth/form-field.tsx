"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

const inputClasses =
  "h-11 w-full rounded-xl border border-line bg-surface px-3.5 text-sm text-ink shadow-sm outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-red-300 aria-[invalid=true]:ring-red-100";

function FieldMessages({
  fieldId,
  error,
  hint,
}: {
  fieldId: string;
  error?: string;
  hint?: string;
}) {
  if (error) {
    return (
      <p id={`${fieldId}-error`} className="mt-1.5 text-[13px] text-red-600">
        {error}
      </p>
    );
  }

  if (hint) {
    return (
      <p id={`${fieldId}-hint`} className="mt-1.5 text-xs text-muted">
        {hint}
      </p>
    );
  }

  return null;
}

export function TextField({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: FieldProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = error
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-ink"
      >
        {label}
      </label>
      <input
        id={fieldId}
        className={cn(inputClasses, "mt-1.5", className)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...props}
      />
      <FieldMessages fieldId={fieldId} error={error} hint={hint} />
    </div>
  );
}

export function PasswordField({
  label,
  error,
  hint,
  id,
  className,
  ...props
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const describedBy = error
    ? `${fieldId}-error`
    : hint
      ? `${fieldId}-hint`
      : undefined;

  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-ink"
      >
        {label}
      </label>
      <div className="relative mt-1.5">
        <input
          id={fieldId}
          type={visible ? "text" : "password"}
          className={cn(inputClasses, "pr-11", className)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted transition-colors hover:text-ink"
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </button>
      </div>
      <FieldMessages fieldId={fieldId} error={error} hint={hint} />
    </div>
  );
}
