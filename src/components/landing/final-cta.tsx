import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function FinalCta() {
  return (
    <section className="pb-20 pt-4 sm:pb-24">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-ink px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="bg-grid-dark mask-radial pointer-events-none absolute inset-0 opacity-60"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full bg-accent/25 blur-3xl"
          />

          <div className="relative max-w-2xl">
            <p className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-white/55">
              <Sparkles
                aria-hidden="true"
                className="size-3.5 text-[#a5a5ff]"
              />
              Start with clarity
            </p>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">
              Your next skill is closer than you think.
            </h2>
            <p className="mt-4 max-w-xl text-pretty text-sm leading-6 text-white/60 sm:text-base sm:leading-7">
              Build your profile once. Get a roadmap that respects your goal,
              your level, and the hours you actually have.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className={buttonStyles({ variant: "inverse", size: "lg" })}
              >
                Get Started
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
              <a
                href="#roadmap"
                className={buttonStyles({
                  variant: "outline-inverse",
                  size: "lg",
                })}
              >
                Explore the sample roadmap
              </a>
            </div>

            <p className="mt-6 text-xs text-white/40">
              Free for students · Build your profile in minutes
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
