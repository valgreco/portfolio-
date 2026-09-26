"use client";

import Reveal from "./Reveal";
import { motion, useReducedMotion } from "framer-motion";

const STATS = [
  { value: "31%", label: "fewer payment disputes" },
  { value: "12%", label: "increase in invoice volume" },
  { value: "~70%", label: "faster merchant onboarding" },
  { value: "5", label: "zero-to-one launches" },
];

type Case = {
  icon: "card" | "users";
  tag: string;
  headline: string;
  video: string;
  aedifico: string;
  mitto: string;
};

const EASE_ICON = [0.16, 1, 0.3, 1] as const;

function CaseIcon({ name }: { name: "card" | "users" }) {
  const reduced = useReducedMotion();

  // Each entry: [d, delay]. Drawn in sequence for a "sketching" feel.
  const strokes: { d: string; delay: number }[] =
    name === "card"
      ? [
          { d: "M3 6.5h18a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H3A1.5 1.5 0 0 1 1.5 16V8A1.5 1.5 0 0 1 3 6.5Z", delay: 0 },
          { d: "M1.5 10.5h21", delay: 0.35 },
          { d: "M5 14.2h4.5", delay: 0.6 },
          { d: "M15.5 13.4h3.2", delay: 0.75 },
        ]
      : [
          { d: "M9 4.6a3.1 3.1 0 1 1 0 6.2 3.1 3.1 0 0 1 0-6.2Z", delay: 0 },
          { d: "M3 19.4c0-3.1 2.7-5.2 6-5.2s6 2.1 6 5.2", delay: 0.3 },
          { d: "M16.2 6a2.9 2.9 0 0 1 0 5.6", delay: 0.55 },
          { d: "M17.8 14.4c2.3.6 3.9 2.3 3.9 4.9", delay: 0.75 },
        ];

  const dot = name === "card"
    ? { cx: 5, cy: 8.4, r: 1.1 } // chip
    : null;

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {strokes.map((s, i) => (
        <motion.path
          key={i}
          d={s.d}
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE_ICON, delay: s.delay }}
        />
      ))}
      {dot && (
        <motion.circle
          cx={dot.cx} cy={dot.cy} r={dot.r}
          fill="currentColor"
          initial={reduced ? { opacity: 1 } : { opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, delay: 0.5 }}
          style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
        />
      )}
    </svg>
  );
}

const CASES: Case[] = [
  {
    icon: "card",
    tag: "Payments",
    headline: "Card payments could be disputed after the fact, and we were absorbing the loss.",
    video:
      "As first PM at STAMP, a European fintech, I owned the end-to-end payment and compliance flows (Stripe 3DS, KYC and SEPA settlement) across Italy and Spain.",
    aedifico:
      "I led the Stripe 3DS integration and shipped a merchant portal security system, so card payments were authenticated at the point of sale instead of challenged after it.",
    mitto: "31% reduction in payment disputes.",
  },
  {
    icon: "users",
    tag: "Onboarding",
    headline: "Onboarding a merchant meant manual white-glove work, so growth was capped by our own team's time.",
    video:
      "Bringing a new merchant live depended on hands-on setup from our team. It didn't scale, and it made every new merchant an operational dependency.",
    aedifico:
      "I ran on-site research with 10 merchants to find where onboarding stalled, then redesigned the flow to fully self-serve and integrated InfoCert digital signatures, so identity and signing happened without us in the loop.",
    mitto: "~70% faster onboarding: from 45 minutes with an ops person to 10 to 15 minutes, merchant self-serve.",
  },
];

function Step({ label, text }: { label: string; text: string }) {
  return (
    <div>
      <div className="mb-2">
        <span
          className="text-lg text-white"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          {label}
        </span>
      </div>
      <p className="text-sm text-neutral-400 leading-7">{text}</p>
    </div>
  );
}

export default function WorkCases() {
  return (
    <div className="w-full">
      {/* Section intro */}
      <Reveal>
        <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">My product work at STAMP</p>
        <h2
          className="text-4xl md:text-5xl text-white leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          Deeds, not words.
        </h2>
        <p className="max-w-2xl text-sm text-neutral-400 leading-7 mt-6">
          This is the work I&apos;m living now: two years owning payments, onboarding and compliance as
          the first PM at STAMP, a European fintech. Each of these started as a problem worth framing
          before it was a thing to build.
        </p>
      </Reveal>

      {/* Stats */}
      <Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-14 mb-20">
          {STATS.map((s) => (
            <div key={s.label}>
              <div
                className="text-4xl md:text-5xl text-white mb-2"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {s.value}
              </div>
              <div className="text-xs text-neutral-500 leading-5">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Cases */}
      <div className="flex flex-col gap-16">
        {CASES.map((c, i) => (
          <Reveal key={i}>
            <div className="border-t border-white/10 pt-10">
              <div className="flex items-center gap-3 mb-5">
                <span className="relative flex items-center justify-center w-14 h-14 shrink-0">
                  {/* spotlight glow */}
                  <span
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-full"
                    style={{ background: "radial-gradient(circle at 50% 32%, rgba(255,255,255,0.18), transparent 68%)" }}
                  />
                  {/* frosted glass tile */}
                  <span
                    className="relative flex items-center justify-center w-14 h-14 rounded-2xl text-white"
                    style={{
                      background: "linear-gradient(155deg, rgba(255,255,255,0.22), rgba(255,255,255,0.05) 55%, rgba(255,255,255,0.02))",
                      backdropFilter: "blur(6px)",
                      WebkitBackdropFilter: "blur(6px)",
                      border: "1px solid rgba(255,255,255,0.20)",
                      boxShadow:
                        "inset 0 1.5px 1px rgba(255,255,255,0.45), inset 0 -10px 16px rgba(255,255,255,0.04), 0 8px 24px rgba(0,0,0,0.55)",
                    }}
                  >
                    <span style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.35))" }}>
                      <CaseIcon name={c.icon} />
                    </span>
                  </span>
                </span>
                <span className="text-xs tracking-widest text-neutral-500 uppercase">{c.tag}</span>
              </div>
              <h3 className="text-xl md:text-2xl text-white leading-snug max-w-2xl mb-8">
                {c.headline}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Step label="Context" text={c.video} />
                <Step label="What I did" text={c.aedifico} />
                <Step label="Outcome" text={c.mitto} />
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
