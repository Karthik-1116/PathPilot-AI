import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "accent" | "success" | "warning" | "inverse";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "border-line bg-canvas text-muted",
  accent: "border-accent/15 bg-accent-soft text-accent",
  success: "border-success/15 bg-success-soft text-success",
  warning: "border-warning/15 bg-warning-soft text-warning",
  inverse: "border-white/15 bg-white/[0.06] text-white/70",
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  dot?: boolean;
  className?: string;
}

export function Badge({
  children,
  tone = "neutral",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        toneClasses[tone],
        className,
      )}
    >
      {dot ? (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      ) : null}
      {children}
    </span>
  );
}
