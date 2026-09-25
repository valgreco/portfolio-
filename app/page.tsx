"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import Hero from "@/components/Hero";
import BuildingWithAI from "@/components/BuildingWithAI";
import BeyondTheCV from "@/components/BeyondTheCV";
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
      <Reveal><BookACall /></Reveal>
      <Reveal><DownloadCV /></Reveal>
    </main>
  );
}
