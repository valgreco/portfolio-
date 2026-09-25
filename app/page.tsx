"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import Hero from "@/components/Hero";
import BuildingWithAI from "@/components/BuildingWithAI";
import BookACall from "@/components/BookACall";
import WorkCases from "@/components/WorkCases";
import WorldMap from "@/components/WorldMap";
import Reveal from "@/components/Reveal";

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);

  return (
    <main>
      <BootSequence onComplete={() => setHeroVisible(true)} />
      <Hero visible={heroVisible} />

      {/* Product work at STAMP: metrics + case studies (WorkCases has its own scroll fade-in) */}
      <section id="work" className="w-full max-w-6xl mx-auto px-6 py-24">
        <WorkCases />
      </section>

      <Reveal><BuildingWithAI /></Reveal>

      {/* Country map: moved as is from /work, placed above Contact */}
      <Reveal>
        <section className="w-full max-w-6xl mx-auto px-6 py-24">
          <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">See the work</p>
          <h2
            className="text-4xl md:text-5xl text-white mb-12 leading-tight"
            style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
          >
            Six countries, one map.
          </h2>
          <WorldMap />
        </section>
      </Reveal>

      <Reveal><BookACall /></Reveal>
    </main>
  );
}
