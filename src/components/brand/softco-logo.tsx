import Image from "next/image";
import { cn } from "@/lib/utils";

/** Softco Digital Inc. — whose name and logo the whole product carries. */
export const SOFTCO = {
  name: "Softco Digital Inc.",
  url: "https://softcodigitalinc.com",
  email: "Support@Softcodigitalinc.com",
} as const;

const ART = {
  // The full lockup carries the "Reimage your business for the digital age"
  // line, which is unreadable below ~140px wide; the wordmark is for
  // everything smaller than that, and the lone "S" for square slots.
  logo: { width: 900, height: 280 },
  wordmark: { width: 900, height: 214 },
  mark: { width: 256, height: 256 },
} as const;

/**
 * The Softco logo, in the brand blue on light grounds and white on dark.
 * Both images are rendered and CSS picks one, so the right version is on
 * screen from the first paint instead of after the theme resolves.
 *
 * `tone` forces one version for surfaces that are always dark or always
 * light regardless of theme (the landing hero, a printed receipt).
 */
export function SoftcoLogo({
  variant = "wordmark",
  tone = "auto",
  className,
  priority,
}: {
  variant?: keyof typeof ART;
  tone?: "auto" | "color" | "white";
  className?: string;
  priority?: boolean;
}) {
  const { width, height } = ART[variant];
  const alt = SOFTCO.name;
  const color = `/brand/softco-${variant}.png`;
  const white = `/brand/softco-${variant}-white.png`;
  const img = "h-full w-auto max-w-none";

  if (tone !== "auto") {
    return (
      <span className={cn("inline-flex h-6", className)}>
        <Image
          src={tone === "white" ? white : color}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          className={img}
        />
      </span>
    );
  }

  return (
    <span className={cn("inline-flex h-6", className)}>
      <Image
        src={color}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn(img, "dark:hidden")}
      />
      <Image
        src={white}
        alt=""
        aria-hidden
        width={width}
        height={height}
        priority={priority}
        className={cn(img, "hidden dark:block")}
      />
    </span>
  );
}
