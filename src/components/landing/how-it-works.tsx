import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { howItWorksSteps } from "@/lib/site-config";

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-24 border-y border-line bg-surface py-20 sm:py-24"
    >
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="How it works"
            title="A clear route from where you are to where you want to be."
          />
          <p className="max-w-sm text-sm leading-6 text-muted md:pb-1">
            No more guessing which tutorial comes next. PathPilot turns your
            profile into a sequence you can follow.
          </p>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {howItWorksSteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <li
                key={step.title}
                className="group relative rounded-card border border-line bg-canvas/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-line-strong hover:bg-surface hover:shadow-card"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs text-muted">
                    0{index + 1}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-xl border border-line bg-surface text-ink shadow-sm">
                    <Icon aria-hidden="true" className="size-4" />
                  </span>
                </div>
                <h3 className="mt-6 text-base font-semibold tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
