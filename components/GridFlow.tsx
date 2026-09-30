"use client";

// Decorative background: faint grid-aligned paths with a comet of light that
// travels along each one (bright head, fading tail). Sits behind all content.
const PATHS: { d: string; dur: number; delay: number }[] = [
  { d: "M-40 120 H200 Q240 120 240 160 V360 Q240 400 280 400 H560", dur: 9, delay: 0 },
  { d: "M1480 240 H1160 Q1120 240 1120 280 V520 Q1120 560 1080 560 H840", dur: 11, delay: 2 },
  { d: "M-40 640 H120 Q160 640 160 600 V320 Q160 280 200 280 H440 Q480 280 480 320 V520", dur: 12, delay: 1 },
  { d: "M760 -40 V160 Q760 200 800 200 H1000 Q1040 200 1040 240 V440", dur: 10, delay: 3 },
  { d: "M1480 720 H1240 Q1200 720 1200 680 V440 Q1200 400 1160 400 H920", dur: 13, delay: 1.5 },
  { d: "M360 940 V720 Q360 680 400 680 H640 Q680 680 680 640 V440", dur: 11, delay: 4 },
];

// Comet trail: the head leads, each step trails a little further behind and dimmer.
const TRAIL = [
  { opacity: 0.95, width: 2.2, lag: 0, head: true },
  { opacity: 0.6, width: 1.9, lag: 0.12 },
  { opacity: 0.38, width: 1.6, lag: 0.26 },
  { opacity: 0.22, width: 1.3, lag: 0.42 },
  { opacity: 0.1, width: 1.1, lag: 0.6 },
];

export default function GridFlow() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
        {PATHS.map((p, i) => (
          <g key={i}>
            {/* faint static track */}
            <path d={p.d} stroke="rgba(130,160,255,0.10)" strokeWidth="1.2" strokeLinecap="round" />
            {/* comet: stacked dashes forming a bright head + fading tail */}
            {TRAIL.map((t, j) => (
              <path
                key={j}
                d={p.d}
                stroke={`rgba(160,190,255,${t.opacity})`}
                strokeWidth={t.width}
                strokeLinecap="round"
                pathLength={1000}
                style={{
                  strokeDasharray: "26 974",
                  filter: t.head ? "drop-shadow(0 0 5px rgba(120,160,255,0.8))" : undefined,
                  animation: `grid-flow ${p.dur}s linear ${p.delay + t.lag}s infinite`,
                }}
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
