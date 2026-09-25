"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WorldMap from "@/components/WorldMap";
import WorkCases from "@/components/WorkCases";

export default function WorkPage() {
  const [selectedCity, setSelectedCity] = useState("Madrid");

  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-28 pb-12" style={{ background: "#0a0a0a" }}>
      <div className="w-full max-w-6xl">
        <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">See the work</p>
        <h1
          className="text-4xl md:text-5xl text-white mb-12 leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          Six countries, one map.
        </h1>

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
      </div>
    </main>
  );
}
