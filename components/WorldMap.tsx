"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe, { type COBEOptions } from "cobe";
import { motion, useReducedMotion } from "framer-motion";

type Place = {
  city: string;
  loc: [number, number]; // [lat, long]
  company: string;
  role: string;
  year: string;
  bullets: string[];
  logo?: string; // path under /public, e.g. "/logos/stamp.svg"
};

const PLACES: Place[] = [
  {
    city: "Madrid",
    loc: [40.4, -3.7],
    company: "STAMP",
    role: "Product Manager · European fintech",
    year: "2024 to now",
    bullets: [
      "First PM hire, owns the tax-free product portfolio across Italy and Spain.",
      "Leads a cross-functional squad of ten (UX/UI, frontend, backend, fullstack).",
      "5 zero-to-one launches; shipped a security system that cut disputes 31%.",
    ],
  },
  {
    city: "Italy",
    loc: [41.9, 12.5],
    company: "Born & raised",
    role: "Roots",
    year: "",
    bullets: [
      "Italian by origin and native speaker, the start of a path through six countries.",
      "FT / Il Sole 24 Ore named her one of '100 under 35' reshaping Italian entrepreneurship (2022).",
    ],
  },
  {
    city: "Berlin",
    loc: [52.5, 13.4],
    company: "ESMT Berlin",
    role: "MSc Global & Digital Strategy",
    year: "2021 to 2023",
    bullets: [
      "MSc Management, Global and Digital Strategy.",
      "Exchange semester at the Stockholm School of Economics.",
      "ESMT Scholarship for academic and professional excellence.",
    ],
  },
  {
    city: "Stockholm",
    loc: [59.3, 18.1],
    company: "Robert Bosch",
    role: "Working Student · Volvo Cars Global Sales",
    year: "2022",
    bullets: [
      "Tracked €9M in global invoices for Volvo Cars global sales.",
      "Managed 2023 worldwide order pipelines valued at €5M.",
    ],
  },
  {
    city: "London",
    loc: [51.5, -0.1],
    company: "Bayes · Grey · Wayra",
    role: "Studies, consulting & venture",
    year: "2017 to 2021",
    bullets: [
      "BSc Business Management (Digital Innovation & Entrepreneurship), Bayes Business School.",
      "At Grey Consultants, led a UK/EU aerospace market plan presented to the CEO (2020).",
      "At Wayra / Telefónica, launched SafeToNet in Italy and built CatDogFish's UK entry across 5 cities (2017).",
    ],
  },
  {
    city: "Luxembourg",
    loc: [49.6, 6.1],
    company: "Amazon EU",
    role: "Marketing intern",
    year: "2022",
    bullets: [
      "Ran 400+ nudge-based campaigns across UK, DE, FR, IT and ES, lifting efficiency 20% via A/B testing.",
      "Built the Prime Day 2022 carousel widget; managed 120+ influencers, 100M+ visits.",
    ],
  },
];

// convert lat/long to the phi/theta cobe uses to bring a point to the front
function focusFor(loc: [number, number]) {
  const [lat, long] = loc;
  const phi = Math.PI - ((long * Math.PI) / 180 - Math.PI / 2);
  const theta = (lat * Math.PI) / 180;
  return { phi, theta };
}

export default function WorldMap({ onSelectCity }: { onSelectCity?: (city: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(0);

  // animation state shared with the render loop via refs
  const phiRef = useRef(0);
  const thetaRef = useRef(0.25);
  const targetRef = useRef<{ phi: number; theta: number } | null>(null);
  const autoRef = useRef(true);
  const selectedRef = useRef<number | null>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let width = canvas.offsetWidth || 400;
    const ro = new ResizeObserver(() => {
      width = canvas.offsetWidth || width;
    });
    ro.observe(canvas);

    const opts: COBEOptions & { onRender: (state: Record<string, number>) => void } = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.25,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 7,
      baseColor: [0.3, 0.36, 0.5],
      markerColor: [0.4, 0.7, 1],
      glowColor: [0.1, 0.25, 0.45],
      markers: PLACES.map((p) => ({ location: p.loc, size: 0.06 })),
      onRender: (state: Record<string, number>) => {
        if (targetRef.current) {
          // ease toward the selected city
          phiRef.current += (targetRef.current.phi - phiRef.current) * 0.08;
          thetaRef.current += (targetRef.current.theta - thetaRef.current) * 0.08;
        } else if (autoRef.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current;
        state.theta = thetaRef.current;
        state.width = width * 2;
        state.height = width * 2;
        // highlight the selected city with a larger marker
        (state as Record<string, unknown>).markers = PLACES.map((p, i) => ({
          location: p.loc,
          size: i === selectedRef.current ? 0.13 : 0.05,
        }));
      },
    };

    const globe = createGlobe(canvas, opts);

    return () => {
      globe.destroy();
      ro.disconnect();
    };
  }, []);

  function select(i: number) {
    setSelected(i);
    selectedRef.current = i;
    onSelectCity?.(PLACES[i].city);
    autoRef.current = false;
    const f = focusFor(PLACES[i].loc);
    // keep phi continuous (avoid full spins) by matching nearest revolution
    const current = phiRef.current;
    const twoPi = Math.PI * 2;
    let target = f.phi;
    while (target - current > Math.PI) target -= twoPi;
    while (target - current < -Math.PI) target += twoPi;
    targetRef.current = { phi: target, theta: f.theta };
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      {/* Globe */}
      <div className="flex justify-center order-1">
        <canvas
          ref={canvasRef}
          className="w-full max-w-[400px] aspect-square"
        />
      </div>

      {/* Location list + detail */}
      <div className="order-2">
        {/* Hook: cue that the cities are interactive */}
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-white/60"
            animate={reduced ? {} : { opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
          <span
            className="text-[11px] tracking-widest text-neutral-300 uppercase"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            Tap a city to explore
          </span>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {PLACES.map((p, i) => (
            <button
              key={p.city}
              onClick={() => select(i)}
              className={`text-sm px-3 py-1.5 rounded-full border transition-colors duration-200 ${
                selected === i
                  ? "border-white/40 text-white bg-white/5"
                  : "border-white/10 text-neutral-300 hover:text-neutral-300 hover:border-white/20"
              }`}
            >
              {p.city}
            </button>
          ))}
        </div>

        <div className="min-h-[180px]">
            {selected === null ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-neutral-300 leading-7 max-w-md"
              >
                Six countries, one career. Tap a location to see what happened there.
              </motion.p>
            ) : (
              <motion.div
                key={selected}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-baseline gap-3 mb-3">
                  <h3
                    className="text-2xl text-white"
                    style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
                  >
                    {PLACES[selected].city}
                  </h3>
                  <span className="text-xs text-neutral-300" style={{ fontFamily: "var(--font-geist-mono)" }}>
                    {PLACES[selected].year}
                  </span>
                </div>

                {/* Company */}
                {PLACES[selected].logo ? (
                  <div className="h-7 mb-1 flex items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={PLACES[selected].logo}
                      alt={PLACES[selected].company}
                      className="h-full w-auto object-contain opacity-80"
                      style={{ filter: "grayscale(100%) brightness(1.8)" }}
                    />
                  </div>
                ) : (
                  <p className="text-base text-white mb-1">{PLACES[selected].company}</p>
                )}
                <p className="text-xs text-neutral-300 mb-4">{PLACES[selected].role}</p>

                {/* Bullets */}
                <ul className="flex flex-col gap-2 max-w-md">
                  {PLACES[selected].bullets.map((b, bi) => (
                    <li key={bi} className="flex gap-2 text-sm text-neutral-300 leading-6">
                      <span className="text-neutral-300 mt-0.5">·</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  );
}
