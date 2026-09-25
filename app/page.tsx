"use client";

import { useState } from "react";
import BootSequence from "@/components/BootSequence";
import Hero from "@/components/Hero";
import BuildingWithAI from "@/components/BuildingWithAI";
import BookACall from "@/components/BookACall";
import Reveal from "@/components/Reveal";

export default function Home() {
  const [heroVisible, setHeroVisible] = useState(false);

  return (
    <main>
      <BootSequence onComplete={() => setHeroVisible(true)} />
      <Hero visible={heroVisible} />
      <Reveal><BuildingWithAI /></Reveal>
      <Reveal><BookACall /></Reveal>
    </main>
  );
}
