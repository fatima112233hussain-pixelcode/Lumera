import Link from "next/link";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/app/theme-toggle";
import { LumeraMark } from "@/components/marketing/lumera-mark";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-50 border-b border-transparent backdrop-blur-md transition-colors">
        <div className="bg-background/70 absolute inset-0 -z-10" />
        <nav className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <LumeraMark className="size-7" />
            <span className="font-display text-xl tracking-tight">Lumera</span>
          </Link>

          <div className="text-muted-foreground ml-auto hidden items-center gap-7 text-sm sm:flex">
            <Link href="#how" className="hover:text-foreground transition">
              How it works
            </Link>
            <Link href="#features" className="hover:text-foreground transition">
              Features
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2 sm:ml-0">
            <ThemeToggle />
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hover:bg-secondary rounded-full px-4 py-2 text-sm font-medium transition">
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

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-5 py-8 text-sm">
          <LumeraMark className="size-5" />
          <span>Lumera — clinic management, free for every clinic.</span>
          <span className="ml-auto">
            © {new Date().getFullYear()} Lumera
          </span>
        </div>
      </footer>
    </div>
  );
}
