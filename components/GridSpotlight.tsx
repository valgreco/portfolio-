"use client";

import { useEffect, useRef } from "react";

// A viewport-fixed overlay that lights up the grid (plus a soft glow) around the
// cursor. Uses "screen" blending so it only ADDS light and never darkens content.
export default function GridSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
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
    "radial-gradient(circle 200px at var(--mx, -400px) var(--my, -400px), rgba(0,0,0,1), rgba(0,0,0,0) 75%)";

  return (
    <>
      {/* Soft blue light that follows the cursor */}
      <div
        aria-hidden="true"
        ref={ref}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 30,
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.35s ease",
          mixBlendMode: "screen",
          background:
            "radial-gradient(circle 220px at var(--mx, -400px) var(--my, -400px), rgba(70,120,240,0.16), rgba(70,120,240,0) 70%)",
        }}
      >
        {/* Brighter grid revealed inside the spotlight */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right, rgba(130,170,255,0.9) 1px, transparent 1px), linear-gradient(to bottom, rgba(130,170,255,0.9) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            backgroundAttachment: "fixed",
            maskImage: mask,
            WebkitMaskImage: mask,
          }}
        />
      </div>
    </>
  );
}
