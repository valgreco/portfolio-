"use client";

import Reveal from "./Reveal";

type ToolDetailProps = {
  eyebrow: string;
  title: string;
  intro: string;
  problem: string;
  solution: string;
  outcome: string;
  stat?: { value: string; label: string };
};

function Block({ label, text }: { label: string; text: string }) {
  return (
    <div className="border-t border-white/10 pt-8">
      <p
        className="text-lg text-white mb-3"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        {label}
      </p>
      <p className="text-sm text-neutral-300 leading-7 max-w-2xl">{text}</p>
    </div>
  );
}

export default function ToolDetail({
  eyebrow,
  title,
  intro,
  problem,
  solution,
  outcome,
  stat,
}: ToolDetailProps) {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-28 pb-24" style={{ background: "#141414" }}>
      <div className="w-full max-w-3xl">
        <Reveal>
          <p className="text-xs tracking-widest text-neutral-300 uppercase mb-3">{eyebrow}</p>
          <h1
            className="text-4xl md:text-5xl text-white leading-tight"
            style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
          >
            {title}
          </h1>
          <p className="max-w-2xl text-sm text-neutral-300 leading-7 mt-6">{intro}</p>
        </Reveal>

        {stat && (
          <Reveal>
            <div className="mt-12 mb-4">
              <div
                className="text-5xl md:text-6xl text-white mb-2"
                style={{ fontFamily: "var(--font-geist-mono)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-neutral-300">{stat.label}</div>
            </div>
          </Reveal>
        )}

        <div className="flex flex-col gap-10 mt-16">
          <Reveal><Block label="Problem" text={problem} /></Reveal>
          <Reveal><Block label="Solution" text={solution} /></Reveal>
          <Reveal><Block label="Outcome" text={outcome} /></Reveal>
        </div>
      </div>
    </main>
  );
}
