import Link from "next/link";

export const metadata = {
  title: "How it's built — Valeria Greco",
  description:
    "The architecture behind leragreco.com: a RAG agent with evals and observability, a PM-reasoning tool, and an interactive roadmap — built by a PM with Claude Code.",
};

function Sys({ title, href, children }: { title: string; href?: string; children: React.ReactNode }) {
  const head = href ? (
    <Link href={href} className="text-white hover:text-blue-200 transition-colors">
      {title} <span className="text-blue-300/70">&rarr;</span>
    </Link>
  ) : (
    <span className="text-white">{title}</span>
  );
  return (
    <div className="border-t border-white/10 pt-5">
      <h3 className="text-lg mb-2" style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}>
        {head}
      </h3>
      <p className="text-sm text-neutral-300 leading-7">{children}</p>
    </div>
  );
}

// Small architecture diagram — crisp in dark mode, no images.
function Diagram() {
  const box = (x: number, y: number, w: number, label: string, accent = false) => (
    <g>
      <rect x={x} y={y} width={w} height="42" rx="8" fill={accent ? "rgba(107,138,253,0.12)" : "#1c1c1c"} stroke={accent ? "rgba(127,156,255,0.5)" : "rgba(255,255,255,0.1)"} />
      <text x={x + w / 2} y={y + 26} textAnchor="middle" fontSize="13" fill={accent ? "#c9d6ff" : "#e5e5e5"} fontFamily="var(--font-geist-mono)">
        {label}
      </text>
    </g>
  );
  const line = (x1: number, y1: number, x2: number, y2: number) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(127,156,255,0.35)" strokeWidth="1.5" strokeDasharray="4 4" />
  );
  return (
    <svg viewBox="0 0 720 320" className="w-full h-auto" role="img" aria-label="Architecture diagram">
      {box(280, 10, 160, "Visitor")}
      {line(360, 52, 360, 100)}
      {box(260, 100, 200, "Next.js · Vercel", true)}
      {/* fan-out */}
      {line(300, 142, 150, 210)}
      {line(360, 142, 360, 210)}
      {line(420, 142, 580, 210)}
      {box(60, 210, 190, "Claude (ValerIA · PM lens)")}
      {box(275, 210, 170, "Upstash (obs. log)")}
      {box(500, 210, 170, "Substack (RAG source)")}
      {/* loop note */}
      {line(155, 252, 360, 300)}
      {line(360, 252, 360, 300)}
      {box(230, 290, 260, "evals · guardrails · citations")}
    </svg>
  );
}

export default function ColophonPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-28 pb-24" style={{ background: "#141414" }}>
      <div className="w-full max-w-3xl">
        <p className="text-xs tracking-widest text-neutral-300 uppercase mb-3" style={{ fontFamily: "var(--font-geist-mono)" }}>
          Colophon
        </p>
        <h1 className="text-4xl md:text-5xl text-white leading-tight" style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}>
          How this is built.
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-neutral-300 leading-7 mt-6 mb-12">
          I&apos;m a product manager, not an engineer by title &mdash; I built this site myself with Claude Code.
          The pages are the easy part. What I care about is the systems behind them: a real AI agent with
          evals and observability, a tool that runs my product reasoning, and an interactive roadmap. Here&apos;s
          the shape of it.
        </p>

        <a
          href="https://github.com/valgreco/portfolio-"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-blue-300/90 hover:text-blue-200 border border-blue-300/25 hover:border-blue-300/50 rounded-full px-4 py-2 mb-12 transition-colors"
        >
          View source on GitHub
          <span>&rarr;</span>
        </a>

        <div className="rounded-2xl bg-[#161616] border border-white/5 p-6 mb-14">
          <Diagram />
        </div>

        <div className="flex flex-col gap-6">
          <Sys title="ValerIA — a RAG agent" href="/valeria">
            A retrieval-augmented agent grounded in my real Substack writing, not a hand-typed FAQ. It scores my
            posts for relevance per question, grounds the answer in the matches with citations, and streams the
            machinery live (reading &rarr; scanning &rarr; found in &rarr; writing). Guardrails keep her from
            inventing facts.
          </Sys>
          <Sys title="Evals + observability" href="/valeria/ops">
            30 eval cases written before tuning act as a regression suite. In production, every question is logged
            with whether my writing grounded it &mdash; ungrounded ones are content gaps that become new essays
            and new evals. Deploy &rarr; measure &rarr; diagnose &rarr; improve, as a loop you can watch.
          </Sys>
          <Sys title="My PM lens" href="/tools/pm-lens">
            Paste a fuzzy ask; it returns a scoped decision &mdash; real problem, who it affects, tight scope, a
            metric, a call. A Claude route with a system prompt encoding how I actually do product.
          </Sys>
          <Sys title="Roadmap tool" href="/tools/roadmap">
            An interactive recreation of the timeline roadmap I built at STAMP: drag-to-reschedule, add items,
            grouping by theme or owner, with a two-way Jira sync. Placeholder data only.
          </Sys>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10">
          <p className="text-xs tracking-widest text-neutral-300 uppercase mb-3" style={{ fontFamily: "var(--font-geist-mono)" }}>
            Stack
          </p>
          <div className="flex flex-wrap gap-2">
            {["Next.js (App Router)", "TypeScript", "Tailwind v4", "Anthropic Claude", "Upstash Redis", "framer-motion", "cobe", "Vercel", "built with Claude Code"].map((s) => (
              <span key={s} className="text-xs text-neutral-300 border border-white/10 rounded-full px-3 py-1.5" style={{ fontFamily: "var(--font-geist-mono)" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
