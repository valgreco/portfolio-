"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView, useReducedMotion } from "framer-motion";

// Animates a numeric value from 0 up to its target when it scrolls into view.
// Preserves any non-numeric prefix ("~") and suffix ("%"), and honors the
// visitor's reduced-motion preference (shows the final value immediately).
function parse(value: string) {
  const m = value.match(/^(\D*)(-?\d+(?:\.\d+)?)(.*)$/);
  if (!m) return { prefix: "", target: null as number | null, suffix: value, decimals: 0 };
  const [, prefix, num, suffix] = m;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return { prefix, target: parseFloat(num), suffix, decimals };
}

export default function CountUp({
  value,
  className,
  style,
  duration = 1400,
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
  duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const { prefix, target, suffix, decimals } = parse(value);
  const [display, setDisplay] = useState(
    target === null ? value : `${prefix}0${suffix}`
  );

  useEffect(() => {
    if (target === null) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    if (!inView) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(`${prefix}${target.toFixed(decimals)}${suffix}`);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, target, prefix, suffix, decimals, duration, value]);

  return (
    <div ref={ref} className={className} style={style}>
      {display}
    </div>
  );
}
