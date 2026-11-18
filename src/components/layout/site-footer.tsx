import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" aria-label="PathPilot AI home" className="rounded-md">
              <Logo />
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted">
              A clear, personalized route from the skills you have today to the
              role you want next.
            </p>
            <Badge tone="accent" dot className="mt-5">
              Capstone build · Phase 5
            </Badge>
          </div>

          <div>
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.footerNav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
              Built with
            </h2>
            <ul className="mt-4 space-y-2.5">
              {siteConfig.builtWith.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
                  >
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 text-muted/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {year} PathPilot AI. Built for students, not shortcuts.
          </p>
          <a
            href="#main"
            className="text-xs font-medium text-muted transition-colors hover:text-ink"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
