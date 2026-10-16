import type { Metadata } from "next";
import { Outfit, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const sans = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Instrument_Serif({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Lumera — Free clinic management",
    template: "%s · Lumera",
  },
  description:
    "Appointments, treatment records, invoicing and printing for aesthetic clinics. Free, for every clinic, on every device.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html
        lang="en"
        suppressHydrationWarning
        className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
      >
        <body className="bg-background text-foreground flex min-h-full flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
            <Toaster position="top-right" richColors />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
