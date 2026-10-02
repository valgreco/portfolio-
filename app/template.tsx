"use client";

import { motion, useReducedMotion } from "framer-motion";

// Runs on every route change (Next re-mounts the template), giving each page a
// soft fade + rise as it enters — so Home ↔ Work ↔ ValerIA feel connected
// instead of hard-cutting. Honors reduced-motion.
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
