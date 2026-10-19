import { SOFTCO, SoftcoLogo } from "@/components/brand/softco-logo";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="text-muted-foreground mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 text-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-4">
            <a
              href={SOFTCO.url}
              target="_blank"
              rel="noopener"
              className="w-fit transition-opacity hover:opacity-80"
            >
              <SoftcoLogo variant="logo" className="h-14" />
            </a>
            <span>Clinic management, free for every clinic.</span>
          </div>

          <div className="flex flex-col gap-2 sm:items-end sm:text-right">
            <a
              href={SOFTCO.url}
              target="_blank"
              rel="noopener"
              className="hover:text-foreground transition-colors"
            >
              softcodigitalinc.com
            </a>
            <a
              href={`mailto:${SOFTCO.email}`}
              className="hover:text-foreground transition-colors"
            >
              {SOFTCO.email}
            </a>
          </div>
        </div>
        <div className="text-muted-foreground border-t">
          <div className="mx-auto max-w-6xl px-5 py-4 text-xs">
            © {new Date().getFullYear()} {SOFTCO.name} All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
