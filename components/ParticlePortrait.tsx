"use client";

import { motion, useReducedMotion } from "framer-motion";

const RING_SIZES = [1, 1.4, 1.85];
const RING_DELAYS = [0, 1, 2];

export default function ParticlePortrait() {
  const reduced = useReducedMotion();
  const size = 220;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size * 2.2, height: size * 2.2 }}>

      {/* Pulsing rings */}
      {RING_SIZES.map((scale, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-white/25"
          style={{ width: size * scale, height: size * scale }}
          {...(!reduced ? {
            animate: {
              opacity: [0.1, 0.5, 0.1],
              scale: [0.97, 1.03, 0.97],
            },
            transition: {
              duration: 3.5,
              delay: RING_DELAYS[i],
              repeat: Infinity,
              ease: "easeInOut",
            },
          } : { style: { opacity: 0.2 } })}
        />
      ))}


      {/* Photo circle */}
      <div className="relative overflow-hidden rounded-full" style={{ width: size, height: size }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/valeria.jpg"
          alt="Valeria"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 12%",
            filter: "grayscale(100%) contrast(1.1) brightness(0.88)",
          }}
        />
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 50px 15px rgba(0,0,0,0.7)" }} />

        {/* Scan line */}
        {!reduced && (
          <motion.div
            className="absolute left-0 right-0 pointer-events-none"
            style={{ height: 3, background: "linear-gradient(to right, transparent, rgba(255,255,255,0.35), transparent)" }}
            animate={{ top: ["-5%", "105%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          />
        )}
      </div>

      {/* Status label */}
      <motion.p
        className="absolute text-[10px] tracking-[0.25em] text-white/60 uppercase"
        style={{ bottom: "13%", fontFamily: "var(--font-geist-mono)" }}
        {...(!reduced ? {
          animate: { opacity: [0.3, 0.7, 0.3] },
          transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        } : {})}
      >
        agent online
      </motion.p>
    </div>
  );
}
