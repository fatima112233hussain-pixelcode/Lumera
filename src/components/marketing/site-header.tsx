"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { LumeraMark } from "@/components/marketing/lumera-mark";

/**
 * Transparent over the hero's dark stage, then solid once the page has
 * scrolled past it — a fixed background would either fight the stage at the
 * top or leave the links unreadable further down.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Switch a little before the stage ends so the change lands under the
    // header rather than halfway through it.
    const onScroll = () => setScrolled(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group/header fixed inset-x-0 top-0 z-50 transition-colors duration-300 data-[scrolled=true]:border-b data-[scrolled=true]:bg-[color-mix(in_oklch,var(--background)_82%,transparent)] data-[scrolled=true]:backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white transition-colors group-data-[scrolled=true]/header:text-foreground"
        >
          <LumeraMark className="size-7" />
          <span className="font-display text-xl tracking-tight">Lumera</span>
        </Link>

        <div className="ml-auto hidden items-center gap-7 text-sm text-white/65 transition-colors group-data-[scrolled=true]/header:text-muted-foreground sm:flex">
          <Link href="#how" className="transition hover:text-white group-data-[scrolled=true]/header:hover:text-foreground">
            How it works
          </Link>
          <Link href="#features" className="transition hover:text-white group-data-[scrolled=true]/header:hover:text-foreground">
            Features
          </Link>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <div className="text-white transition-colors group-data-[scrolled=true]/header:text-foreground">
            <ThemeToggle />
          </div>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 group-data-[scrolled=true]/header:text-foreground group-data-[scrolled=true]/header:hover:bg-secondary">
                Sign in
              </button>
            </SignInButton>
            <Link
              href="/sign-up"
              className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-90"
            >
              Start free
            </Link>
          </Show>
          <Show when="signed-in">
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-90"
            >
              Dashboard
            </Link>
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}
