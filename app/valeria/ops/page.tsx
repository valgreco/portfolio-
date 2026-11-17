import { getStats } from "@/lib/observability";
import { EVALS } from "@/evals/valeria-evals";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "ValerIA — Ops",
  description: "How Valeria operates her AI agent in production: real questions, content gaps, and the eval loop.",
  robots: { index: false, follow: false },
};

function fmtWhen(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-[#1c1c1c] border border-white/5 p-5">
      <div className="text-3xl text-white mb-1" style={{ fontFamily: "var(--font-geist-mono)" }}>{value}</div>
      <div className="text-xs text-neutral-300">{label}</div>
      {sub && <div className="text-[11px] text-neutral-500 mt-1">{sub}</div>}
    </div>
  );
}

const LOOP = [
  { k: "Deploy", v: "ValerIA answers, grounded in my real writing." },
  { k: "Measure", v: "Every question is logged with whether it was grounded." },
  { k: "Diagnose", v: "Ungrounded questions = content gaps — what I haven't written yet." },
  { k: "Improve", v: "Gaps become new essays and new eval cases, so she gets sharper." },
];

export default async function OpsPage() {
  const stats = await getStats(60);
  const gaps = stats.total - stats.grounded;
  const groundedPct = stats.total > 0 ? Math.round((stats.grounded / stats.total) * 100) : 0;
  const gapQuestions = stats.recent.filter((r) => !r.grounded).slice(0, 8);

  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-28 pb-24" style={{ background: "#141414" }}>
      <div className="w-full max-w-4xl">
        <p className="text-xs tracking-widest text-neutral-300 uppercase mb-3" style={{ fontFamily: "var(--font-geist-mono)" }}>
          ValerIA · Ops
        </p>
        <h1 className="text-4xl md:text-5xl text-white leading-tight" style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}>
          How I keep my agent honest.
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-neutral-300 leading-7 mt-6 mb-12">
          Shipping an AI agent is the easy part. Operating it is the job: I log every real question ValerIA gets,
          track whether my own writing actually grounded the answer, and turn the gaps into new content and new
          eval cases. This is that loop, live.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Stat value={String(stats.total)} label="Questions logged" sub="in production" />
          <Stat value={`${groundedPct}%`} label="Grounded in her writing" sub={`${stats.grounded} of ${stats.total}`} />
          <Stat value={String(Math.max(0, gaps))} label="Content gaps" sub="→ next essays & evals" />
          <Stat value={String(EVALS.length)} label="Eval cases" sub="regression suite" />
        </div>

        {/* The loop */}
        <div className="rounded-2xl bg-[#1c1c1c] border border-white/5 p-6 mb-12">
          <p className="text-xs tracking-widest text-neutral-300 uppercase mb-5" style={{ fontFamily: "var(--font-geist-mono)" }}>
            The loop
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {LOOP.map((s, i) => (
              <div key={s.k}>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[11px] text-blue-300/80" style={{ fontFamily: "var(--font-geist-mono)" }}>{i + 1}</span>
                  <span className="text-sm text-white">{s.k}</span>
                </div>
                <p className="text-xs text-neutral-300 leading-6">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {!stats.configured ? (
          <div className="rounded-2xl border border-white/10 bg-[#161616] p-6 text-sm text-neutral-300 leading-7">
            <span className="text-neutral-200">Live logging isn&apos;t connected yet.</span> The loop above is how it
            works; once the datastore is enabled, this page fills with the real questions ValerIA is being asked and
            the gaps they reveal.
          </div>
        ) : stats.recent.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#161616] p-6 text-sm text-neutral-300 leading-7">
            Connected and listening — waiting for the first questions. Go{" "}
            <a href="/valeria" className="text-blue-300/90 hover:text-blue-200 underline underline-offset-2">ask ValerIA something</a>,
            then refresh.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content gaps */}
            <div>
              <p className="text-xs tracking-widest text-neutral-300 uppercase mb-4" style={{ fontFamily: "var(--font-geist-mono)" }}>
                Content gaps → write next
              </p>
              {gapQuestions.length === 0 ? (
                <p className="text-sm text-neutral-500 leading-7">No gaps in the recent window — her writing is covering what people ask.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {gapQuestions.map((g, i) => (
                    <div key={i} className="rounded-xl border border-amber-400/15 bg-amber-400/[0.03] px-3 py-2.5 text-sm text-neutral-300">
                      {g.q}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent questions */}
            <div>
              <p className="text-xs tracking-widest text-neutral-300 uppercase mb-4" style={{ fontFamily: "var(--font-geist-mono)" }}>
                Recent questions
              </p>
              <div className="flex flex-col divide-y divide-white/5">
                {stats.recent.slice(0, 16).map((r, i) => (
                  <div key={i} className="flex items-start gap-3 py-2.5">
                    <span
                      className={`mt-1 shrink-0 w-1.5 h-1.5 rounded-full ${r.grounded ? "bg-emerald-400" : "bg-amber-400"}`}
                      title={r.grounded ? "grounded in her writing" : "content gap"}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-neutral-300 leading-6 truncate">{r.q}</p>
                      <p className="text-[11px] text-neutral-600" style={{ fontFamily: "var(--font-geist-mono)" }}>
                        {fmtWhen(r.ts)}
                        {r.grounded && r.sources.length > 0 ? ` · ${r.sources[0]}` : r.grounded ? "" : " · no essay match"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-[11px] text-neutral-600 mt-12 leading-6" style={{ fontFamily: "var(--font-geist-mono)" }}>
          Questions are stored without any visitor identity. This is the same instrumentation I&apos;d put on any agent in production.
        </p>
      </div>
    </main>
  );
}
