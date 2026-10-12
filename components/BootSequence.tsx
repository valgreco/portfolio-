"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "Valeria";
const CHAR_DELAY = 1200 / NAME.length; // ~1.2s total

// In-memory, module-scoped: survives client-side navigation (Home ↔ Work ↔
// ValerIA) but resets on every full page load. So the intro plays on each load
// or refresh and for every new visitor, yet never repeats while navigating the
// site within a single visit. (sessionStorage was the opposite: it survived
// reloads, so a returning tab never saw the intro again.)
let playedThisLoad = false;

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (playedThisLoad) {
      onComplete();
      return;
    }
    playedThisLoad = true;
    setVisible(true);
  }, [onComplete]);

  useEffect(() => {
    if (!visible) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(NAME.slice(0, i));
      if (i === NAME.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(() => {
            setShow(false);
          }, 400);
        }, 300);
      }
    }, CHAR_DELAY);
    return () => clearInterval(interval);
  }, [visible]);

  if (!visible || typeof document === "undefined") return null;

  // Portal to <body> so the overlay escapes the page-transition wrapper
  // (app/template.tsx), whose transform/filter would otherwise break this
  // fixed overlay's positioning and push the text off-screen.
  return createPortal(
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#141414]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <span
            className="text-5xl font-light tracking-widest text-white"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            {displayed}
            {!done && (
              <span className="animate-[blink_0.7s_step-end_infinite]">_</span>
            )}
          </span>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
