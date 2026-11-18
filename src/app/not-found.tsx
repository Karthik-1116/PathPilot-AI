import Link from "next/link";
import { ArrowRight, Compass, Home } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-70"
      />

      <div className="relative w-full max-w-md text-center">
        <Link
          href="/"
          aria-label="PathPilot AI home"
          className="inline-flex rounded-md"
        >
          <Logo />
        </Link>

        <p className="mt-10 inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          <Compass aria-hidden="true" className="size-3.5 text-accent" />
          404 — Off the map
        </p>

        <h1 className="mt-4 text-balance text-3xl font-semibold tracking-[-0.035em] text-ink sm:text-4xl">
          This path hasn&apos;t been charted.
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          The page you are looking for does not exist yet. Head back to the
          landing page or explore the sample roadmap.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className={buttonStyles({ variant: "primary", size: "md" })}
          >
            <Home aria-hidden="true" className="size-4" />
            Back home
          </Link>
          <Link
            href="/#roadmap"
            className={buttonStyles({ variant: "secondary", size: "md" })}
          >
            View sample roadmap
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
