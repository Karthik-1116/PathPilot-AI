"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonStyles } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6 lg:px-8">
        <Link
          href="/"
          aria-label="PathPilot AI home"
          className="rounded-md"
          onClick={closeMenu}
        >
          <Logo />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-muted transition-colors hover:bg-ink/[0.04] hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/login"
            className={buttonStyles({ variant: "ghost", size: "sm" })}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className={buttonStyles({ variant: "primary", size: "sm" })}
          >
            Get Started
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-canvas md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          <span className="sr-only">
            {isOpen ? "Close navigation menu" : "Open navigation menu"}
          </span>
          {isOpen ? (
            <X aria-hidden="true" className="size-5" />
          ) : (
            <Menu aria-hidden="true" className="size-5" />
          )}
        </button>
      </div>

      {isOpen ? (
        <div
          id="mobile-navigation"
          className="animate-fade-in max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-canvas md:hidden"
        >
          <nav
            aria-label="Mobile navigation"
            className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4"
          >
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-[15px] font-medium text-ink transition-colors hover:bg-ink/[0.04]"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-3 grid gap-2 border-t border-line pt-4">
              <Link
                href="/login"
                onClick={closeMenu}
                className={buttonStyles({ variant: "secondary", size: "md" })}
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={closeMenu}
                className={buttonStyles({ variant: "primary", size: "md" })}
              >
                Get Started
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
