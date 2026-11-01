"use client";

export default function BeyondTheCV() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs tracking-widest text-neutral-400 uppercase mb-3">How I work</p>
      <h2
        className="text-4xl md:text-5xl text-white mb-10 leading-tight"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        How I actually work.
      </h2>

      <div className="max-w-2xl flex flex-col gap-6 text-base leading-8 text-neutral-300">
        <p>
          The CV lists what I shipped. This is the part it never captures.
        </p>
        <p>
          I do discovery with my feet. Before redesigning our merchant onboarding, I spent weekends
          walking Madrid boutiques as a slightly confused tourist, just to feel the friction our
          merchants live with. The best problems rarely show up first in a dashboard.
        </p>
        <p>
          I&apos;m comfortable in the technical detail without writing production code, and I&apos;d
          rather build a rough version of something than write a long document about it. This site, my
          AI agent, and a handful of internal tools are all things I made myself, usually with Claude
          in the loop.
        </p>
        <p>
          Mostly, I&apos;m curious. I like ambiguous problems, products that cross borders, and figuring
          out how AI changes what a single PM can actually build.
        </p>
      </div>
    </section>
  );
}
