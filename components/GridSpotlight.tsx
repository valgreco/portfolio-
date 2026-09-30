"use client";

import { useEffect, useRef } from "react";

// A viewport-fixed overlay that shows a brighter, blue-tinted copy of the grid,
// revealed only in a soft circle around the cursor. Aligns with the body grid
// (same 40px cell, both viewport-fixed).
export default function GridSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Respect reduced motion: no cursor tracking.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };
    const onLeave = () => { el.style.opacity = "0"; };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const mask =
    "radial-gradient(circle 170px at var(--mx, -300px) var(--my, -300px), rgba(0,0,0,1), rgba(0,0,0,0) 72%)";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0,
        transition: "opacity 0.4s ease",
        backgroundImage:
          "linear-gradient(to right, rgba(120,160,255,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,160,255,0.45) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        backgroundAttachment: "fixed",
        maskImage: mask,
        WebkitMaskImage: mask,
      }}
    />
  );
}
