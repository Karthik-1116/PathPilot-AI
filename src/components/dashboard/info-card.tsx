import type { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function InfoCard({ icon: Icon, label, value }: InfoCardProps) {
  return (
    <div className="rounded-card border border-line bg-surface p-5 shadow-card">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-muted">
        <Icon aria-hidden="true" className="size-3.5 text-accent" />
        {label}
      </div>
      <p className="mt-2 text-base font-semibold text-ink">{value}</p>
    </div>
  );
}
