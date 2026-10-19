import Link from "next/link";
import { SoftcoLogo } from "@/components/brand/softco-logo";

/**
 * The frame around Clerk's own sign-in, sign-up and create-clinic widgets.
 * Clerk renders its card in the middle; everything around it is ours, so
 * the moment of signing in still looks like Softco rather than a bare
 * centred form on a white page.
 */
export function AuthShell({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate flex min-h-svh flex-col items-center justify-center gap-9 overflow-hidden px-4 py-14">
      {/* Same blue-to-sky wash as the landing hero, kept soft so it
          never competes with the form it sits behind. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-32 -z-10 h-[34rem] opacity-70 blur-3xl"
        style={{
          background:
            "radial-gradient(45% 55% at 50% 40%, color-mix(in oklch, var(--primary) 34%, transparent), transparent 70%), radial-gradient(35% 45% at 68% 60%, color-mix(in oklch, var(--chart-2) 26%, transparent), transparent 70%)",
        }}
      />

      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        <Link href="/" aria-label="Softco home">
          <SoftcoLogo variant="logo" className="h-14" priority />
        </Link>
        <h1 className="font-display text-3xl tracking-tight text-balance">
          {title}
        </h1>
        <p className="text-muted-foreground text-sm text-pretty">{body}</p>
      </div>

      {children}
    </div>
  );
}
