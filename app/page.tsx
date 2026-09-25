"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import Hero from "@/components/Hero";
import BuildingWithAI from "@/components/BuildingWithAI";
import BeyondTheCV from "@/components/BeyondTheCV";
import OffTheClock from "@/components/OffTheClock";
import BookACall from "@/components/BookACall";
import DownloadCV from "@/components/DownloadCV";
import Reveal from "@/components/Reveal";

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);

  return (
    <main>
      <BootSequence onComplete={() => setHeroVisible(true)} />
      <Hero visible={heroVisible} />
      <Reveal><BuildingWithAI /></Reveal>
      <Reveal><BeyondTheCV /></Reveal>
      <Reveal><OffTheClock /></Reveal>
      <Reveal>
        <section className="w-full max-w-6xl mx-auto px-6 py-24">
          <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">Contact</p>
          <h2
            className="text-4xl md:text-5xl text-white mb-12 leading-tight"
            style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
          >
            Two ways to reach me.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            <BookACall />
            <DownloadCV />
          </div>
        </section>
      </Reveal>
    </main>
  );
}
