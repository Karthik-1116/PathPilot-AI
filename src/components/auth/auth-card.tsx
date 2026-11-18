import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

interface AuthCardProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      <div className="rounded-card border border-line bg-surface p-7 shadow-card sm:p-8">
        <Badge tone="accent" dot>
          {eyebrow}
        </Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-ink">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
