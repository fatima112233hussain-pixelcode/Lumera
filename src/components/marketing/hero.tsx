"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { AuroraBackdrop } from "./aurora-backdrop";

const rise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* The light volume sits behind everything and bleeds off the top. */}
      <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[46rem] opacity-80">
        <AuroraBackdrop />
      </div>
      {/* Fades the cloud into the page rather than cutting it off. */}
      <div className="from-background pointer-events-none absolute inset-x-0 top-[28rem] -z-10 h-64 bg-gradient-to-b to-transparent" />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center gap-7 px-5 pt-24 pb-28 text-center sm:pt-32"
      >
        <motion.span
          variants={rise}
          className="border-primary/25 bg-background/70 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur"
        >
          <span className="bg-primary size-1.5 rounded-full" aria-hidden />
          Free, with nothing held back
        </motion.span>

        <motion.h1
          variants={rise}
          className="font-display text-5xl leading-[0.98] tracking-tight text-balance sm:text-7xl"
        >
          Your clinic, running on{" "}
          <span className="text-primary italic">light</span>.
        </motion.h1>

        <motion.p
          variants={rise}
          className="text-muted-foreground max-w-xl text-lg text-pretty"
        >
          Appointments, patient records, prices, invoices and printing — the
          whole front desk in one place. No card, no trial clock, no feature
          locked behind a plan.
        </motion.p>

        <motion.div variants={rise} className="flex flex-wrap justify-center gap-3">
          <Link
            href="/sign-up"
            className="bg-primary text-primary-foreground shadow-primary/25 hover:shadow-primary/40 group inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-medium shadow-lg transition hover:-translate-y-0.5"
          >
            Open your clinic
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
          <Link
            href="#how"
            className="border-border hover:bg-secondary inline-flex items-center rounded-full border px-7 py-3.5 font-medium transition"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.p variants={rise} className="text-muted-foreground text-sm">
          Set up in about two minutes. Works on the desk computer and the phone
          in your pocket.
        </motion.p>
      </motion.div>
    </section>
  );
}
