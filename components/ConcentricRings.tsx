"use client";

import { motion, useReducedMotion } from "framer-motion";

const rings = [
  { rx: 72, ry: 24,  opacity: 0.9, dashed: true,  fill: false, delay: 0 },
  { rx: 132, ry: 46, opacity: 0.5, dashed: false, fill: true,  delay: 0.3 },
  { rx: 174, ry: 61, opacity: 0.35, dashed: true,  fill: true,  delay: 0.6 },
  { rx: 227, ry: 79, opacity: 0.2, dashed: false, fill: true,  delay: 0.9 },
  { rx: 257, ry: 90, opacity: 0.15, dashed: true,  fill: false, delay: 1.2 },
  { rx: 300, ry: 105, opacity: 0.1, dashed: false, fill: false, delay: 1.5 },
];

export default function ConcentricRings() {
  const reduced = useReducedMotion();

  return (
    <div className="relative w-full flex items-end justify-center overflow-hidden" style={{ height: 220 }}>
      <svg
        viewBox="0 0 620 220"
        width="620"
        height="220"
        style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", maxWidth: "100%" }}
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="rg-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%"  stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {rings.map((r, i) => {
          const cx = 310, cy = 220;
          const pulse = !reduced
            ? {
                animate: {
                  scaleX: [0.97, 1.03, 0.97],
                  scaleY: [0.97, 1.03, 0.97],
                  opacity: [r.opacity * 0.6, r.opacity, r.opacity * 0.6],
                },
                transition: {
                  duration: 3,
                  delay: r.delay,
                  repeat: Infinity,
                  ease: "easeInOut" as const,
                },
              }
            : {};

          return (
            <motion.g key={i} style={{ transformOrigin: `${cx}px ${cy}px` }} {...pulse}>
              {r.fill && (
                <ellipse
                  cx={cx} cy={cy}
                  rx={r.rx} ry={r.ry}
                  fill="url(#rg-center)"
                  fillOpacity={r.opacity * 0.18}
                />
              )}
              <ellipse
                cx={cx} cy={cy}
                rx={r.rx} ry={r.ry}
                fill="none"
                stroke="white"
                strokeOpacity={r.opacity}
                strokeWidth={1.5}
                strokeDasharray={r.dashed ? "8 8" : undefined}
              />
            </motion.g>
          );
        })}

        {/* central glow */}
        <motion.ellipse
          cx={310} cy={220} rx={60} ry={20}
          fill="url(#rg-center)"
          fillOpacity={0.6}
          {...(!reduced ? {
            animate: { fillOpacity: [0.4, 0.8, 0.4] },
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
          } : {})}
        />
      </svg>
    </div>
  );
}
