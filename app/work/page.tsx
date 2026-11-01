"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WorldMap from "@/components/WorldMap";
import WorkCases from "@/components/WorkCases";
import Recognition from "@/components/Recognition";
import Reveal from "@/components/Reveal";

export default function WorkPage() {
  const [selectedCity, setSelectedCity] = useState("Madrid");

  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-28 pb-12" style={{ background: "#141414" }}>
      <div className="w-full max-w-6xl">
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-3">See the work</p>
        <h1
          className="text-4xl md:text-5xl text-white mb-5 leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          Six countries, one map.
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-neutral-400 leading-7 mb-14">
          A product career built across Europe: from marketing and consulting at Amazon, Bosch and
          Wayra to first PM at STAMP. Tap a country to see what I did there.
        </p>

        <WorldMap onSelectCity={setSelectedCity} />

        {/* Deep dive: only for Madrid / STAMP */}
        <AnimatePresence initial={false}>
          {selectedCity === "Madrid" && (
            <motion.div
              key="stamp-deepdive"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-32">
                <WorkCases />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recognition: closes the journey, always visible */}
        <Reveal>
          <div className="mt-32 border-t border-white/10 pt-16">
            <Recognition />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
