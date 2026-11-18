import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";

interface QuickActionProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export function QuickAction({
  href,
  icon: Icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-line bg-surface p-3 transition-colors hover:border-line-strong hover:bg-canvas/60"
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">{title}</span>
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
          />
        </span>
        <span className="mt-0.5 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>
    </Link>
  );
}
