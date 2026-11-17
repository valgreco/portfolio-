"use client";

export default function OffTheClock() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs tracking-widest text-neutral-300 uppercase mb-3">Beyond the CV</p>
      <h2
        className="text-4xl md:text-5xl text-white mb-10 leading-tight"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        Off the clock.
      </h2>

      <div className="max-w-2xl flex flex-col gap-6 text-base leading-8 text-neutral-300">
        <p>
          When I&apos;m not building, you&apos;ll usually find me at the gym or out in nature. Moving
          and unplugging is how I reset, and it&apos;s often where my clearest thinking happens.
        </p>
      </div>
    </section>
  );
}
