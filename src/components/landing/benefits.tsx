import { ArrowRight, Check, Sparkles, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { benefits } from "@/lib/site-config";

const withoutPlan = [
  "Another saved tutorial you never start",
  "No idea which topic comes next",
  "Side projects that stall halfway",
];

const withPlan = [
  "One clear next step, every session",
  "Projects tied to each learning stage",
  "Progress you can point to and prove",
];

export function Benefits() {
  return (
    <section
      id="benefits"
      className="scroll-mt-24 py-20 sm:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="Why PathPilot"
              title="Less wandering. More building."
              description="A good roadmap does more than list topics. It removes the daily decision of what to study and turns effort into visible proof."
            />

            <ul className="mt-10 space-y-6">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <li key={benefit.title} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-ink shadow-sm">
                      <Icon aria-hidden="true" className="size-[18px]" />
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold tracking-tight text-ink">
                        {benefit.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-muted">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-card border border-line bg-surface p-2 shadow-card">
            <div className="p-5 sm:p-6">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
                Without a clear path
              </p>
              <ul className="mt-4 space-y-3">
                {withoutPlan.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-6 text-muted"
                  >
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-ink/[0.05] text-muted">
                      <X aria-hidden="true" className="size-2.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.15rem] bg-ink p-5 text-white sm:p-6">
              <p className="flex items-center gap-2 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white/55">
                <Sparkles
                  aria-hidden="true"
                  className="size-3.5 text-[#a5a5ff]"
                />
                With PathPilot
              </p>
              <ul className="mt-4 space-y-3">
                {withPlan.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm leading-6 text-white/85"
                  >
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-white/10 text-[#b8b8ff]">
                      <Check aria-hidden="true" className="size-2.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                <p className="text-xs text-white/45">
                  Start with one clear next step.
                </p>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 text-white/35"
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
