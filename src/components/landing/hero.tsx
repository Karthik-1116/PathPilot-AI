import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { HeroRoadmapPreview } from "@/components/landing/hero-roadmap-preview";
import { Badge } from "@/components/ui/badge";
import { buttonStyles } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const microProof = [
  "Free for students",
  "No credit card",
  "Adapts to your schedule",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-grid mask-radial absolute inset-0 opacity-70" />
        <div className="absolute -right-32 -top-24 size-[32rem] rounded-full bg-accent/[0.07] blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-16 py-16 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:py-28">
        <div className="animate-fade-up">
          <Badge tone="accent">
            <Sparkles aria-hidden="true" className="size-3.5" />
            AI-powered learning roadmaps
          </Badge>

          <h1 className="mt-6 text-balance text-[clamp(2.5rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
            <span className="block">Your Goals. Your Skills.</span>{" "}
            <span className="mt-2 block">
              Your{" "}
              <span className="relative inline-block text-accent">
                Personalized
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 10"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1 left-0 h-2 w-full text-accent/30"
                >
                  <path
                    d="M2 7C45 2.5 118 2 218 5.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Learning Journey.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-base leading-7 text-muted sm:text-lg sm:leading-8">
            PathPilot AI turns your current skills, career goal, and available
            time into a clear stage-by-stage roadmap — with curated resources,
            practical projects, and progress you can actually see.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className={buttonStyles({ variant: "primary", size: "lg" })}
            >
              Get Started
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="#how-it-works"
              className={buttonStyles({ variant: "secondary", size: "lg" })}
            >
              See how it works
            </a>
          </div>

          <ul className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            {microProof.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 text-xs text-muted"
              >
                <Check aria-hidden="true" className="size-3.5 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="animate-fade-up animation-delay-200">
          <HeroRoadmapPreview />
        </div>
      </Container>
    </section>
  );
}
