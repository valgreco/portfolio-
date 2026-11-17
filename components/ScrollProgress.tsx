"use client";

import { motion, useScroll, useSpring } from "framer-motion";

// A thin progress bar that fills as you scroll the page.
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2px] z-[90] origin-left"
      style={{
        scaleX,
        background: "linear-gradient(90deg, rgba(127,156,255,0.2), rgba(165,195,255,0.9))",
      }}
    />
  );
}
