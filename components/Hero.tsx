"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

function fadeIn(delay: number, visible: boolean) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.8, ease: EASE, delay },
  };
}

export default function Hero({ visible }: { visible: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -180]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <motion.div style={{ y }} className="flex flex-col items-center text-center gap-0 max-w-5xl">

        {/* Title */}
        <motion.h1
          {...fadeIn(0, visible)}
          className="text-6xl md:text-8xl leading-[1] tracking-tight text-white"
        >
          <motion.em
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={visible ? { opacity: 1, filter: "blur(0px)" } : { opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >
            Hi, I&apos;m Valeria.
          </motion.em>
        </motion.h1>

        {/* Nickname */}
        <motion.div
          {...fadeIn(0.2, visible)}
          className="flex items-center gap-2 text-base text-neutral-500 mt-3"
        >
          <span style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}>
            Lera to friends
          </span>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M7.6 13 C8.3 12.6 15.7 12.6 16.4 13 C16.4 15.6 14.4 16.9 12 16.9 C9.6 16.9 7.6 15.6 7.6 13 Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
            <circle cx="8.9" cy="9.6" r="1.05" fill="currentColor" />
            <circle cx="15.1" cy="9.6" r="1.05" fill="currentColor" />
          </svg>
        </motion.div>

        {/* Subheading */}
        <motion.p
          {...fadeIn(0.3, visible)}
          className="max-w-[560px] text-xl md:text-2xl leading-snug text-white/90 font-sans mt-8"
        >
          I find the real problem. I build the solution. I work AI-natively.
        </motion.p>

        {/* Subtitle */}
        <motion.p
          {...fadeIn(0.5, visible)}
          className="max-w-[600px] text-base leading-7 text-[#f5f5f5]/50 mt-5"
        >
          Product manager focused on discovery and zero-to-one delivery, across products and markets.
          First PM at a European fintech, close to the technical detail, shipping products end to end.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeIn(0.8, visible)} className="flex flex-col sm:flex-row gap-6 mt-8">
          <Link href="/valeria" className="group text-sm text-[#f5f5f5]/70 hover:text-white transition-colors duration-200">
            Talk to ValerIA{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
          <Link href="/#work" className="group text-sm text-[#f5f5f5]/70 hover:text-white transition-colors duration-200">
            See the work{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </motion.div>

      </motion.div>
    </section>
  );
}
