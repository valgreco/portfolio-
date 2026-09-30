"use client";

// Decorative background: faint grid-aligned paths with a light segment that
// travels along each one, so the grid feels alive. Sits behind all content.
// Paths route with rounded corners, echoing the reference's flowing lines.
const PATHS: { d: string; dur: number; delay: number }[] = [
  { d: "M-40 120 H200 Q240 120 240 160 V360 Q240 400 280 400 H560", dur: 9, delay: 0 },
  { d: "M1480 240 H1160 Q1120 240 1120 280 V520 Q1120 560 1080 560 H840", dur: 11, delay: 2 },
  { d: "M-40 640 H120 Q160 640 160 600 V320 Q160 280 200 280 H440 Q480 280 480 320 V520", dur: 12, delay: 1 },
  { d: "M760 -40 V160 Q760 200 800 200 H1000 Q1040 200 1040 240 V440", dur: 10, delay: 3 },
  { d: "M1480 720 H1240 Q1200 720 1200 680 V440 Q1200 400 1160 400 H920", dur: 13, delay: 1.5 },
  { d: "M360 940 V720 Q360 680 400 680 H640 Q680 680 680 640 V440", dur: 11, delay: 4 },
];

export default function GridFlow() {
  return (
    <div
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: -1, pointerEvents: "none" }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          <linearGradient id="flow-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(120,160,255,0)" />
            <stop offset="50%" stopColor="rgba(120,160,255,0.7)" />
            <stop offset="100%" stopColor="rgba(120,160,255,0)" />
          </linearGradient>
        </defs>
        {PATHS.map((p, i) => (
          <g key={i}>
            {/* faint static track */}
            <path d={p.d} stroke="rgba(130,160,255,0.06)" strokeWidth="1" strokeLinecap="round" />
            {/* travelling light segment */}
            <path
              d={p.d}
              stroke="url(#flow-fade)"
              strokeWidth="1.4"
              strokeLinecap="round"
              pathLength={1000}
              style={{
                strokeDasharray: "70 930",
                animation: `grid-flow ${p.dur}s linear ${p.delay}s infinite`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
