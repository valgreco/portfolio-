"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

export default function EasterEgg() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === SEQUENCE[idx]) {
        idx++;
        if (idx === SEQUENCE.length) {
          idx = 0;
          setShow(true);
          setTimeout(() => setShow(false), 5000);
        }
      } else {
        idx = key === SEQUENCE[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[120] rounded-xl border border-white/10 px-5 py-3"
          style={{ background: "#1c1c1c", boxShadow: "0 12px 40px rgba(0,0,0,0.5)", fontFamily: "var(--font-geist-mono)" }}
        >
          <p className="text-xs text-neutral-400">
            <span className="text-neutral-600">$</span> access granted.{" "}
            <span className="text-white">You really read the fine print.</span>{" "}
            <span className="text-neutral-500">Lera likes you already.</span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
