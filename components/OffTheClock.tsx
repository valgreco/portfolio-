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
          When I&apos;m not building, you&apos;ll usually find me lifting at the gym or up in the
          mountains (always more mountains than sea). Moving and unplugging is how I reset &mdash; and,
          honestly, where my clearest thinking tends to happen. Half the ideas I bring into work on
          Monday started on a trail, not at a desk.
        </p>
        <p>
          I&apos;m also the person who signs up for a random workshop just to make something with my
          hands &mdash; ceramics, painting, candle-making. It&apos;s the same instinct that makes me
          want to build at work: I&apos;d rather make the thing than just read about it.
        </p>
      </div>
    </section>
  );
}
