"use client";

import Reveal from "./Reveal";

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

function CaseIcon({ name }: { name: "card" | "users" }) {
  if (name === "card") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
        <line x1="2.5" y1="9.5" x2="21.5" y2="9.5" stroke="currentColor" strokeWidth="1.4" />
        <line x1="6" y1="14.5" x2="10" y2="14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 6.2a3 3 0 0 1 0 5.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17.5 14.2c2.3.5 4 2.3 4 4.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
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
                <span className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-neutral-300">
                  <CaseIcon name={c.icon} />
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
