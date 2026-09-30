"use client";

// Decorative background: faint grid-aligned paths, each with an even streak of
// light travelling along it. Paths are spread across the whole field (and the
// centre strip, which is what stays visible on narrow screens) with varied
// speed and brightness for depth. Sits behind all content.
type Flow = { d: string; dur: number; delay: number; op: number; w: number };

const PATHS: Flow[] = [
  // left region
  { d: "M-40 120 H200 Q240 120 240 160 V360 Q240 400 280 400 H560", dur: 9, delay: 0, op: 0.9, w: 1.6 },
  { d: "M-40 640 H120 Q160 640 160 600 V320 Q160 280 200 280 H440 Q480 280 480 320 V520", dur: 12, delay: 1, op: 0.55, w: 1.3 },
  { d: "M-40 820 H320 Q360 820 360 780 V560", dur: 10.5, delay: 3.5, op: 0.7, w: 1.4 },
  // centre strip (visible on mobile)
  { d: "M760 -40 V160 Q760 200 800 200 H1000 Q1040 200 1040 240 V440", dur: 10, delay: 3, op: 0.9, w: 1.6 },
  { d: "M600 -40 V240 Q600 280 640 280 H760", dur: 8.5, delay: 5, op: 0.5, w: 1.2 },
  { d: "M520 940 V760 Q520 720 560 720 H720 Q760 720 760 680 V520", dur: 11.5, delay: 2, op: 0.7, w: 1.4 },
  { d: "M880 940 V720 Q880 680 840 680 H720", dur: 9.5, delay: 6, op: 0.55, w: 1.3 },
  { d: "M680 480 H840 Q880 480 880 520 V720", dur: 10, delay: 4.5, op: 0.6, w: 1.3 },
  // right region
  { d: "M1480 240 H1160 Q1120 240 1120 280 V520 Q1120 560 1080 560 H840", dur: 11, delay: 2, op: 0.9, w: 1.6 },
  { d: "M1480 720 H1240 Q1200 720 1200 680 V440 Q1200 400 1160 400 H920", dur: 13, delay: 1.5, op: 0.6, w: 1.3 },
  { d: "M1480 440 H1320 Q1280 440 1280 400 V160", dur: 9, delay: 5.5, op: 0.7, w: 1.4 },
  { d: "M1480 860 H1200 Q1160 860 1160 820 V600", dur: 12.5, delay: 3, op: 0.5, w: 1.2 },
  // long sweepers
  { d: "M360 940 V720 Q360 680 400 680 H640 Q680 680 680 640 V440", dur: 11, delay: 4, op: 0.75, w: 1.5 },
  { d: "M1040 -40 V120 Q1040 160 1000 160 H760 Q720 160 720 200 V360", dur: 12, delay: 0.5, op: 0.5, w: 1.2 },
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
            <path d={p.d} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeLinecap="round" />
            {/* even streak travelling the line, subtle white */}
            <path
              d={p.d}
              stroke={`rgba(255,255,255,${(p.op * 0.4).toFixed(2)})`}
              strokeWidth={Math.max(1, p.w - 0.3)}
              strokeLinecap="round"
              pathLength={1000}
              style={{
                strokeDasharray: "52 948",
                animation: `grid-flow ${p.dur}s linear ${p.delay}s infinite`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  );
}
