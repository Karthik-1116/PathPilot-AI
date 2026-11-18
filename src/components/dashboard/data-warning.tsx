import { Database } from "lucide-react";

interface DataWarningProps {
  title: string;
  migration: string;
}

export function DataWarning({ title, migration }: DataWarningProps) {
  return (
    <div className="rounded-xl border border-warning/20 bg-warning-soft p-4 text-sm leading-6 text-warning">
      <div className="flex items-center gap-2 font-medium">
        <Database aria-hidden="true" className="size-4" />
        {title}
      </div>
      <p className="mt-1">
        Run <code className="font-mono text-[12px]">{migration}</code> in the
        Supabase SQL Editor, then reload this page.
      </p>
    </div>
  );
}
