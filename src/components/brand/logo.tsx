import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function Logo({ className, showWordmark = true }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="size-8 shrink-0"
        fill="none"
      >
        <rect width="32" height="32" rx="9" fill="#0A1124" />
        <path
          d="M9.5 22.5c0-5 4.2-5.8 6.8-8.2 2-1.8 2.9-3.6 5.4-4.4"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="9.5" cy="22.5" r="2.4" fill="#5B5BD6" />
        <path
          d="m20 8.2 4.4 1.8-2 4.3"
          stroke="#9B9BF8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showWordmark ? (
        <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">
          PathPilot <span className="text-accent">AI</span>
        </span>
      ) : null}
    </span>
  );
}
