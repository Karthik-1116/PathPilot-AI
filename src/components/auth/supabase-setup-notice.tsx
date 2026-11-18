import { Database } from "lucide-react";

const steps = [
  "Create a free Supabase project.",
  "Copy the project URL and public anon key into .env.local.",
  "Run supabase/migrations/0001_profiles.sql and 0002_onboarding.sql in the Supabase SQL Editor.",
  "Add http://localhost:3000/** to Authentication > URL Configuration > Redirect URLs.",
  "Restart the dev server with npm run dev.",
];

export function SupabaseSetupNotice({
  context = "auth",
}: {
  context?: "auth" | "dashboard" | "onboarding";
}) {
  const title =
    context === "dashboard"
      ? "Connect Supabase to load your dashboard"
      : context === "onboarding"
        ? "Connect Supabase to save your onboarding"
        : "Connect Supabase to enable accounts";
  const description =
    context === "dashboard"
      ? "The protected dashboard is built, but account data needs a Supabase project before it can load."
      : context === "onboarding"
        ? "The onboarding wizard is built, but your learner profile needs a Supabase project before it can be saved."
        : "The sign-up, login, and password-reset flows are built, but they need a Supabase project before the forms can work.";

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-card border border-line bg-surface p-7 shadow-card sm:p-8">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-warning-soft text-warning">
          <Database aria-hidden="true" className="size-5" />
        </span>

        <h1 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-ink">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>

        <ol className="mt-5 space-y-3">
          {steps.map((step, index) => (
            <li
              key={step}
              className="flex items-start gap-3 text-sm leading-6 text-ink"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-soft font-mono text-[11px] font-medium text-accent"
              >
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-xl border border-line bg-canvas/70 p-4">
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted">
            Add to .env.local
          </p>
          <pre className="mt-2 whitespace-pre-wrap break-words text-xs leading-5 text-ink">
            <code>{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}</code>
          </pre>
        </div>

        <p className="mt-4 text-xs leading-5 text-muted">
          Use the public anon key only. Full setup steps and the schema are in
          README.md.
        </p>
      </div>
    </div>
  );
}
