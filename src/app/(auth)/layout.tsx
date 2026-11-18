import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const year = new Date().getFullYear();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-grid mask-radial pointer-events-none absolute inset-0 opacity-60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full bg-accent/[0.06] blur-3xl"
      />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-5 lg:px-8">
        <Link href="/" aria-label="PathPilot AI home" className="rounded-md">
          <Logo />
        </Link>
        <Link
          href="/"
          className="text-sm text-muted transition-colors hover:text-ink"
        >
          Back to home
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-10">
        {children}
      </main>

      <footer className="relative z-10 pb-6 text-center text-xs text-muted">
        © {year} PathPilot AI
      </footer>
    </div>
  );
}
