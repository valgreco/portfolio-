"use client";

import Link from "next/link";
import ConcentricRings from "./ConcentricRings";
import ChatPreview from "./ChatPreview";

const otherCards = [
  {
    title: "My PM lens",
    description: "A live tool: paste a fuzzy ask and watch it become a scoped product decision, with my PM approach.",
    href: "/tools/pm-lens",
    live: true,
  },
  {
    title: "Product Request Form",
    description: "Structured intake that turns messy stakeholder asks into scoped, prioritized product requests.",
    href: "/tools/product-request",
    live: false,
  },
  {
    title: "Bug Triage Agent",
    description: "Automated bug prioritization that classifies reports and files Jira and Notion tickets via Claude.",
    href: "/tools/bug-triage",
    live: false,
  },
];

export default function BuildingWithAI() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">Building with AI</p>
      <h2
        className="text-4xl md:text-5xl text-white mb-12 leading-tight"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        Things I&apos;ve shipped with AI.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ValerIA card: featured with animation */}
        <Link
          href="/valeria"
          className="group relative rounded-3xl bg-[#1c1c1c] border border-white/5 overflow-hidden flex flex-col justify-between min-h-[480px] hover:border-white/10 transition-colors duration-300"
        >
          <div className="relative z-10 p-7">
            <p className="text-xs tracking-widest text-neutral-600 uppercase mb-2">Agent</p>
            <h3
              className="text-3xl text-white mb-2"
              style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
            >
              ValerIA
            </h3>
            <p className="text-sm text-neutral-500 max-w-xs">
              My AI agent. Answers recruiters and mentors about my work, how I think, and what I've built.
            </p>
          </div>

          {/* Rings + chat layered */}
          <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: 260 }}>
            {/* Rings sit at the very bottom */}
            <div className="absolute bottom-0 left-0 right-0">
              <ConcentricRings />
            </div>
            {/* Chat floats above rings */}
            <div className="absolute top-0 left-0 right-0">
              <ChatPreview />
            </div>
          </div>

          {/* bottom CTA */}
          <div className="relative z-10 px-7 pb-6 pt-2">
            <span className="text-sm text-neutral-500 group-hover:text-white transition-colors duration-200">
              Talk to ValerIA →
            </span>
          </div>
        </Link>

        {/* Other cards */}
        <div className="flex flex-col gap-4">
          {otherCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group rounded-3xl bg-[#1c1c1c] border border-white/5 p-7 flex flex-col gap-2 hover:border-white/10 transition-colors duration-300"
            >
              <div className="flex items-center gap-2">
                <h3
                  className="text-xl text-white"
                  style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
                >
                  {card.title}
                </h3>
                {card.live && (
                  <span
                    className="text-[10px] tracking-widest uppercase text-blue-300/90 border border-blue-300/30 rounded-full px-2 py-0.5"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    Live
                  </span>
                )}
              </div>
              <p className="text-sm text-neutral-500">{card.description}</p>
              <span className="text-xs text-neutral-600 group-hover:text-white transition-colors duration-200 mt-1">
                {card.live ? "Try it →" : "Read more →"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
