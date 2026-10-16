import { LumeraMark } from "@/components/marketing/lumera-mark";
import { SiteHeader } from "@/components/marketing/site-header";

export default function MarketingLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

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
