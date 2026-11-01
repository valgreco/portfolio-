"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { track } from "@vercel/analytics";
import ParticlePortrait from "@/components/ParticlePortrait";
import RichText from "@/components/RichText";
import type { Source } from "@/lib/retrieve";

type Message = { role: "user" | "assistant"; content: string; sources?: Source[] };

const INITIAL: Message = {
  role: "assistant",
  content:
    "Hi, I'm ValerIA, Valeria's AI agent. I can tell you about her work, how she thinks, or anything else you're curious about. What would you like to know?",
};

const BOOT_LINES = [
  "> Initializing ValerIA...",
  "> Loading context...",
  "> Ready.",
];

function TerminalBoot({ onDone }: { onDone: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const next = () => {
      if (i < BOOT_LINES.length) {
        setLines((l) => [...l, BOOT_LINES[i]]);
        i++;
        setTimeout(next, i === BOOT_LINES.length ? 600 : 380);
      } else {
        setDone(true);
        setTimeout(onDone, 500);
      }
    };
    setTimeout(next, 300);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 font-mono text-xs text-neutral-400 space-y-1"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          {lines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              style={{ color: line === "> Ready." ? "rgba(255,255,255,0.5)" : undefined }}
            >
              {line}
            </motion.p>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Avatar() {
  return (
    <div
      className="w-6 h-6 rounded-full overflow-hidden shrink-0 mt-1 border border-white/10"
      style={{ filter: "grayscale(100%)" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/valeria.jpg" alt="ValerIA" className="w-full h-full object-cover" style={{ objectPosition: "center 10%" }} />
    </div>
  );
}

function TraceLine({ done, children }: { done: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2 text-[11px] text-neutral-400"
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <span className={done ? "text-neutral-400" : "text-blue-300"}>{done ? "✓" : "›"}</span>
      {children}
    </motion.div>
  );
}

function SourceChips({ sources }: { sources: Source[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {sources.map((s) => (
        <a
          key={s.link}
          href={s.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 text-[11px] text-blue-200/80 hover:text-blue-100 border border-blue-300/20 hover:border-blue-300/40 rounded-full px-2.5 py-1 transition-colors duration-200"
          style={{ fontFamily: "var(--font-geist-mono)" }}
        >
          <span className="w-1 h-1 rounded-full bg-blue-300/70" />
          {s.title}
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
        </a>
      ))}
    </div>
  );
}

export default function ValerIAPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booted, setBooted] = useState(false);
  const [streaming, setStreaming] = useState("");
  const [sources, setSources] = useState<Source[] | null>(null);
  const [mach, setMach] = useState({ searched: false, resolved: false, writing: false });
  const questionRef = useRef<HTMLDivElement>(null);

  // On a new question, bring it just under the nav and let the answer stream in
  // below it — instead of chasing the bottom of the page on every token.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "user") {
      questionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    // Track only the first question of the session.
    if (messages.filter((m) => m.role === "user").length === 0) {
      track("valeria_chat_started");
    }

    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setStreaming("");
    setSources(null);
    setMach({ searched: false, resolved: false, writing: false });

    // Pace the "machinery" trace so it reads as a system at work.
    const t1 = setTimeout(() => setMach((m) => ({ ...m, searched: true })), 450);

    let answer = "";
    let got: Source[] = [];
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      if (!res.body) throw new Error("no stream");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const ev = JSON.parse(line);
          if (ev.type === "sources") {
            got = ev.posts as Source[];
            setSources(got);
            // show the "found" result a beat after the "scanning" line
            setTimeout(() => setMach((m) => ({ ...m, searched: true, resolved: true })), 350);
          } else if (ev.type === "delta") {
            if (!answer) setMach((m) => ({ ...m, searched: true, resolved: true, writing: true }));
            answer += ev.text;
            setStreaming(answer);
          } else if (ev.type === "error") {
            answer = answer || ev.text;
            setStreaming(answer);
          }
        }
      }

      setMessages([...updated, { role: "assistant", content: answer, sources: got }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Something went wrong, please try again." }]);
    } finally {
      clearTimeout(t1);
      setLoading(false);
      setStreaming("");
      setSources(null);
      setMach({ searched: false, resolved: false, writing: false });
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-28 pb-12" style={{ background: "#141414" }}>
      <div className="w-full max-w-[700px] flex flex-col flex-1">

        {/* Portrait */}
        <div className="flex justify-center mb-6 overflow-hidden">
          <div className="relative scale-[0.72] sm:scale-100 origin-center">
            <ParticlePortrait />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Terminal boot */}
        <TerminalBoot onDone={() => setBooted(true)} />

        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: booted ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-4xl text-white mb-2"
            style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
          >
            Chat with ValerIA
          </h1>
          <p className="text-sm text-neutral-400" style={{ fontFamily: "var(--font-geist-sans)" }}>
            I know Valeria&apos;s work. Ask me anything.
          </p>
        </motion.div>

        {/* Messages */}
        <motion.div
          className="flex flex-col gap-5 flex-1 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: booted ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              ref={i === messages.length - 1 && m.role === "user" ? questionRef : undefined}
              className={`flex gap-3 scroll-mt-28 ${m.role === "user" ? "justify-end" : "justify-start items-start"}`}
            >
              {m.role === "assistant" && <Avatar />}
              {m.role === "user" ? (
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm text-[#f5f5f5] leading-6"
                  style={{ background: "#1a1a1a", fontFamily: "var(--font-geist-sans)" }}
                >
                  {m.content}
                </div>
              ) : (
                <div className="max-w-[80%] flex flex-col gap-2">
                  <div
                    className="text-sm text-neutral-300 leading-7"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    <RichText content={m.content} />
                  </div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      <span className="text-[11px] text-neutral-400" style={{ fontFamily: "var(--font-geist-mono)" }}>
                        sourced from
                      </span>
                      <SourceChips sources={m.sources} />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-start">
              <Avatar />
              <div className="max-w-[80%] flex flex-col gap-2.5">
                {/* The machinery: a live trace of the retrieval + generation */}
                <div className="flex flex-col gap-1.5">
                  <TraceLine done>reading the question</TraceLine>
                  {mach.searched && (
                    <TraceLine done={mach.resolved}>scanning her essays</TraceLine>
                  )}
                  {mach.resolved &&
                    (sources && sources.length > 0 ? (
                      <div className="flex items-start gap-2 text-[11px]" style={{ fontFamily: "var(--font-geist-mono)" }}>
                        <span className="text-neutral-400 mt-1">✓ found in</span>
                        <SourceChips sources={sources} />
                      </div>
                    ) : (
                      <TraceLine done>no essay match — answering from her background</TraceLine>
                    ))}
                  {mach.writing && (
                    <TraceLine done={streaming.length > 0}>writing</TraceLine>
                  )}
                </div>

                {/* Streamed answer */}
                {streaming && (
                  <div
                    className="text-sm text-neutral-300 leading-7"
                    style={{ fontFamily: "var(--font-geist-sans)" }}
                  >
                    <RichText content={streaming} />
                    <span className="animate-[blink_0.7s_step-end_infinite] text-blue-300 ml-0.5">▍</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>

        {/* Status + Input */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: booted ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Status line */}
          <div className="flex items-center gap-2 mb-3 px-1">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              animate={{ opacity: loading ? [0.3, 1, 0.3] : 1 }}
              transition={{ duration: 0.8, repeat: loading ? Infinity : 0 }}
            />
            <span
              className="text-[11px] text-neutral-400"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {loading ? "Thinking..." : "Ready to answer"}
            </span>
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-3 border border-neutral-800 rounded-2xl px-4 py-3"
            style={{ background: "#1c1c1c" }}
          >
            <input
              className="flex-1 bg-transparent text-sm text-[#f5f5f5] placeholder-neutral-600 outline-none"
              style={{ fontFamily: "var(--font-geist-sans)" }}
              placeholder="Ask ValerIA..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="text-neutral-400 hover:text-white transition-colors disabled:opacity-30"
            >
              →
            </button>
          </div>
        </motion.div>

        {/* How ValerIA is built */}
        <div className="mt-24 pt-10 border-t border-white/10">
          <p className="text-xs tracking-widest text-neutral-400 uppercase mb-5" style={{ fontFamily: "var(--font-geist-mono)" }}>
            How she&apos;s built
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {[
              { k: "Claude Haiku", v: "The model behind her answers." },
              { k: "Live retrieval", v: "She scans Valeria's Substack essays in real time, shows which one she's drawing from, and answers in her real words — streamed as she writes." },
              { k: "Guardrails", v: "A curated source of truth, so she never invents facts, reveals salary, or guesses — she points to LinkedIn when unsure." },
            ].map((c) => (
              <div key={c.k}>
                <p className="text-sm text-white mb-1">{c.k}</p>
                <p className="text-xs text-neutral-400 leading-6">{c.v}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-[#1c1c1c] border border-white/5 p-6">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-3xl text-white" style={{ fontFamily: "var(--font-geist-mono)" }}>30</span>
              <span className="text-sm text-neutral-400">eval questions she&apos;s tested against, written before tuning.</span>
            </div>
            <p className="text-xs text-neutral-400 leading-7">
              Every change to her prompt runs against this suite, so she stays accurate as I improve her.
              The ones she can&apos;t answer become new content and new tests. A few of them:
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                "What's the most measurable impact she's had?",
                "Tell me about the disputes work.",
                "What does she do right now?",
                "What languages does she speak?",
              ].map((q) => (
                <span key={q} className="text-xs text-neutral-400 border border-white/10 rounded-full px-3 py-1.5">
                  {q}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
