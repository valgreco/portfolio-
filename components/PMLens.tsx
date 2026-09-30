"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { Target, Users, Lightbulb, Layers, TrendingUp, Flag, HelpCircle } from "lucide-react";

type Result = {
  realProblem: string;
  affected: string;
  need: string;
  scope: { in: string[]; out: string[] };
  metric: string;
  priority: { call: string; reasoning: string };
  assumption?: string;
};

const EXAMPLES = [
  "Sales keeps asking for a CSV export button on every screen.",
  "Users say the app is confusing and they can't find their invoices.",
  "Can we add AI to the dashboard?",
];

function Field({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-white/10 pt-5">
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-lg border border-white/10 bg-white/[0.03] text-blue-300/80">
          <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <p className="text-xs tracking-widest text-neutral-500 uppercase" style={{ fontFamily: "var(--font-geist-mono)" }}>
          {label}
        </p>
      </div>
      <div className="text-sm text-neutral-300 leading-7 pl-8">{children}</div>
    </div>
  );
}

function priorityStyle(call: string) {
  const c = call.toLowerCase();
  if (c.includes("now")) return "text-blue-200 bg-blue-500/20 border-blue-400/40";
  if (c.includes("next")) return "text-neutral-200 bg-white/[0.06] border-white/20";
  return "text-neutral-400 bg-white/[0.02] border-white/10";
}

export default function PMLens() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");

  async function run(text: string) {
    const value = text.trim();
    if (!value || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    track("pm_lens_run");

    try {
      const res = await fetch("/api/pm-lens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: value }),
      });
      const data = await res.json();
      if (!res.ok || !data.result) {
        setError(data.error || "Something went wrong, please try again.");
      } else {
        setResult(data.result as Result);
      }
    } catch {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
        className="rounded-3xl bg-[#1c1c1c] border border-white/5 p-6"
      >
        <textarea
          className="w-full bg-transparent text-sm text-[#f5f5f5] placeholder-neutral-600 outline-none resize-none leading-7"
          style={{ fontFamily: "var(--font-geist-sans)" }}
          rows={3}
          placeholder="Paste a fuzzy request, a user complaint, or a half-formed feature idea..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-neutral-600">Runs on Claude, with Valeria&apos;s PM approach</span>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="group text-sm text-[#f5f5f5]/80 hover:text-white transition-colors duration-200 disabled:opacity-30"
          >
            {loading ? "Thinking..." : "Run it through my lens"}{" "}
            <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      </form>

      {/* Examples */}
      {!result && !loading && (
        <div className="flex flex-wrap gap-2 mt-4">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setInput(ex);
                run(ex);
              }}
              className="text-left text-xs text-neutral-500 hover:text-neutral-300 border border-white/10 hover:border-white/20 rounded-full px-3 py-1.5 transition-colors duration-200"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-6 text-sm text-neutral-400" style={{ fontFamily: "var(--font-geist-mono)" }}>
          &gt; {error}
        </p>
      )}

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col gap-6"
        >
          <Field icon={Target} label="The real problem"><span className="text-neutral-200">{result.realProblem}</span></Field>
          <Field icon={Users} label="Who it affects">{result.affected}</Field>
          <Field icon={Lightbulb} label="What they need">{result.need}</Field>
          <Field icon={Layers} label="Scope">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-500 mb-1">In</p>
                <ul className="flex flex-col gap-1.5">
                  {result.scope.in.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-blue-300/70 mt-px">+</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs text-neutral-500 mb-1">Out</p>
                <ul className="flex flex-col gap-1.5">
                  {result.scope.out.map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-neutral-600 mt-px">·</span>
                      <span className="text-neutral-500">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Field>
          <Field icon={TrendingUp} label="Success metric">{result.metric}</Field>
          <Field icon={Flag} label="Priority">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-xs tracking-wide uppercase border rounded-full px-2.5 py-1 ${priorityStyle(result.priority.call)}`} style={{ fontFamily: "var(--font-geist-mono)" }}>
                {result.priority.call}
              </span>
              <span className="text-neutral-400">{result.priority.reasoning}</span>
            </div>
          </Field>
          {result.assumption && (
            <Field icon={HelpCircle} label="Key assumption">
              <span className="text-neutral-400 italic">{result.assumption}</span>
            </Field>
          )}

          <button
            onClick={() => { setResult(null); setInput(""); }}
            className="self-start text-xs text-neutral-500 hover:text-white transition-colors duration-200 mt-2"
          >
            ← Try another
          </button>
        </motion.div>
      )}
    </div>
  );
}
