"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  CalendarDays,
  Receipt,
  Users,
  Printer,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/** Wraps a block so it animates the first time it scrolls into view. */
function Reveal({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? "show" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

const STEPS = [
  {
    n: "01",
    title: "Make your account",
    body: "Sign in with Google or an email address. Name the clinic. That is the whole setup.",
  },
  {
    n: "02",
    title: "Set your prices",
    body: "A starter price list is already there — change the numbers to what you actually charge, add what is missing.",
  },
  {
    n: "03",
    title: "Add your people",
    body: "Each person gets their own login, and you decide who may change a price or give a discount.",
  },
  {
    n: "04",
    title: "Start billing",
    body: "Pick the treatments, take the payment, print the receipt. The day's takings add themselves up.",
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.4"],
  });
  // The rail fills as the steps pass, which is the whole visual idea here.
  const fill = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="how" className="mx-auto max-w-5xl px-5 py-28">
      <Reveal className="mb-16 max-w-2xl">
        <motion.h2
          variants={rise}
          className="font-display text-4xl tracking-tight text-balance sm:text-5xl"
        >
          Open it on Monday. Bill on Monday.
        </motion.h2>
        <motion.p variants={rise} className="text-muted-foreground mt-4 text-lg">
          Nothing to install, nobody to call out, no setup fee waiting at the
          end of a sales call.
        </motion.p>
      </Reveal>

      <div ref={ref} className="relative">
        {/* The rail: a dim track with a bright fill tied to scroll. */}
        <div className="bg-border absolute top-0 bottom-0 left-[1.35rem] w-px sm:left-[1.85rem]">
          <motion.div
            style={{ height: fill }}
            className="from-primary to-warning w-px bg-gradient-to-b"
          />
        </div>

        <div className="flex flex-col gap-12">
          {STEPS.map((step) => (
            <Reveal key={step.n} className="relative pl-14 sm:pl-20">
              <motion.div variants={rise}>
                <span className="bg-background border-primary/30 text-primary absolute left-0 grid size-11 place-items-center rounded-full border font-mono text-sm sm:size-15">
                  {step.n}
                </span>
                <h3 className="text-xl font-medium">{step.title}</h3>
                <p className="text-muted-foreground mt-2 max-w-xl text-pretty">
                  {step.body}
                </p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: CalendarDays,
    title: "The day's diary",
    body: "Who is coming, for what, with whom. Book, move and cancel without a paper book.",
  },
  {
    icon: Users,
    title: "Patient records",
    body: "History, contact details and every invoice that patient has ever had, on one page.",
  },
  {
    icon: Sparkles,
    title: "Your price list",
    body: "Treatments grouped the way your clinic thinks about them, each with its own price and duration.",
  },
  {
    icon: Receipt,
    title: "Invoices and payments",
    body: "Build an invoice from the price list, apply a discount if the person is allowed to, record what was paid.",
  },
  {
    icon: Printer,
    title: "Printing that fits",
    body: "A4, A5, or the thermal roll at the counter. Set each printer up once and pick it when you print.",
  },
  {
    icon: ShieldCheck,
    title: "Who may do what",
    body: "Switch a permission off and it is off — including the discount cap, down to the percent.",
  },
];

export function Features() {
  return (
    <section id="features" className="border-y">
      <div className="mx-auto max-w-6xl px-5 py-28">
        <Reveal className="mb-14 max-w-2xl">
          <motion.h2
            variants={rise}
            className="font-display text-4xl tracking-tight text-balance sm:text-5xl"
          >
            Everything the front desk touches.
          </motion.h2>
        </Reveal>

        <Reveal className="grid gap-px overflow-hidden rounded-3xl border sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={rise}
              className="bg-card hover:bg-accent/40 group relative p-7 transition-colors"
            >
              <feature.icon
                className="text-primary size-6 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden
              />
              <h3 className="mt-5 font-medium">{feature.title}</h3>
              <p className="text-muted-foreground mt-2 text-sm text-pretty">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

export function FreeForever() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-28">
      <Reveal className="relative overflow-hidden rounded-3xl border p-10 text-center sm:p-16">
        {/* A soft wash rather than a flat panel, so the section has weight. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            background:
              "radial-gradient(70% 60% at 50% 0%, color-mix(in oklch, var(--primary) 20%, transparent), transparent 70%)",
          }}
        />
        <motion.h2
          variants={rise}
          className="font-display text-4xl tracking-tight text-balance sm:text-5xl"
        >
          There is no pricing page.
        </motion.h2>
        <motion.p
          variants={rise}
          className="text-muted-foreground mx-auto mt-5 max-w-xl text-lg text-pretty"
        >
          Not a free tier with the useful parts removed, and not a trial that
          runs out. Every clinic gets every feature: unlimited patients,
          unlimited invoices, unlimited staff logins, every printer.
        </motion.p>
        <motion.div variants={rise} className="mt-9">
          <Link
            href="/sign-up"
            className="bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/40 group inline-flex items-center gap-2 rounded-full px-8 py-4 font-medium shadow-lg transition hover:-translate-y-0.5"
          >
            Open your clinic
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </motion.div>
      </Reveal>
    </section>
  );
}
