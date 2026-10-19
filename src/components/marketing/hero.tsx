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
    <section className="relative isolate overflow-hidden bg-[oklch(0.17_0.028_262)] text-white">
      {/* The particle field blends additively, so it needs a dark stage to
          add light to — on a near-white ground every point washes out to
          nothing. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <AuroraBackdrop />
      </div>
      {/* Hands the eye back to the page: the stage fades into the body
          colour rather than ending on a hard edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-28"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(0.17 0.028 262) 62%, oklch(0.17 0.028 262) 74%, var(--background) 100%)",
        }}
      />

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="mx-auto flex max-w-3xl flex-col items-center gap-7 px-5 pt-24 pb-28 text-center sm:pt-32"
      >
        <motion.span
          variants={rise}
          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur"
        >
          <span className="size-1.5 rounded-full bg-[oklch(0.88_0.08_228)]" aria-hidden />
          Free, with nothing held back
        </motion.span>

        <motion.h1
          variants={rise}
          className="font-display text-5xl leading-[0.98] tracking-tight text-balance sm:text-7xl"
        >
          Your clinic, running on{" "}
          <span className="bg-gradient-to-r from-[oklch(0.74_0.15_258)] to-[oklch(0.88_0.08_228)] bg-clip-text italic text-transparent">light</span>.
        </motion.h1>

        <motion.p
          variants={rise}
          className="max-w-xl text-lg text-pretty text-white/65"
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
            className="inline-flex items-center rounded-full border border-white/25 px-7 py-3.5 font-medium transition hover:bg-white/10"
          >
            See how it works
          </Link>
        </motion.div>

        <motion.p variants={rise} className="text-sm text-white/45">
          Set up in about two minutes. Works on the desk computer and the phone
          in your pocket.
        </motion.p>
      </motion.div>
    </section>
  );
}
