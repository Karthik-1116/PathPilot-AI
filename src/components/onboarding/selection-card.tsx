import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectionCardProps {
  selected: boolean;
  title: string;
  description: string;
  icon: ReactNode;
  onSelect: () => void;
}

export function SelectionCard({
  selected,
  title,
  description,
  icon,
  onSelect,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "flex h-full w-full items-start gap-3 rounded-2xl border p-4 text-left transition-colors",
        selected
          ? "border-accent/40 bg-accent-soft ring-4 ring-accent/10"
          : "border-line bg-surface hover:border-line-strong hover:bg-canvas/60",
      )}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-xl border",
          selected
            ? "border-accent/20 bg-surface text-accent"
            : "border-line bg-canvas text-muted",
        )}
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-ink">{title}</span>
          <span
            className={cn(
              "flex size-5 shrink-0 items-center justify-center rounded-full border",
              selected
                ? "border-accent bg-accent text-white"
                : "border-line text-transparent",
            )}
          >
            <Check aria-hidden="true" className="size-3" />
          </span>
        </span>
        <span className="mt-1 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>
    </button>
  );
}
