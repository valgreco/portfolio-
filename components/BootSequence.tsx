"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAME = "Valeria";
const CHAR_DELAY = 1200 / NAME.length; // ~1.2s total

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Only show on first visit
    const seen = sessionStorage.getItem("boot-seen");
    if (seen) {
      onComplete();
      return;
    }
    sessionStorage.setItem("boot-seen", "1");
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

  if (!visible) return null;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="boot"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#141414]"
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
    </AnimatePresence>
  );
}
