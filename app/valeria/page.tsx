"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticlePortrait from "@/components/ParticlePortrait";
import RichText from "@/components/RichText";

type Message = { role: "user" | "assistant"; content: string };

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
          className="mb-6 font-mono text-xs text-neutral-500 space-y-1"
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

export default function ValerIAPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booted, setBooted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const updated: Message[] = [...messages, { role: "user", content: text }];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages([...updated, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Something went wrong, please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-28 pb-12" style={{ background: "#0a0a0a" }}>
      <div className="w-full max-w-[700px] flex flex-col flex-1">

        {/* Portrait */}
        <div className="flex justify-center mb-6 overflow-hidden">
          <div className="relative scale-[0.72] sm:scale-100 origin-center">
            <ParticlePortrait />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
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
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start items-start"}`}>
              {m.role === "assistant" && <Avatar />}
              {m.role === "user" ? (
                <div
                  className="max-w-[80%] px-4 py-3 rounded-2xl text-sm text-[#f5f5f5] leading-6"
                  style={{ background: "#1a1a1a", fontFamily: "var(--font-geist-sans)" }}
                >
                  {m.content}
                </div>
              ) : (
                <div
                  className="max-w-[80%] text-sm text-neutral-300 leading-7"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  <RichText content={m.content} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <Avatar />
              <div className="flex items-center gap-2">
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-white/40"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-white/40"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.span
                  className="w-1.5 h-1.5 rounded-full bg-white/40"
                  animate={{ opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
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
              className="text-[11px] text-neutral-600"
              style={{ fontFamily: "var(--font-geist-mono)" }}
            >
              {loading ? "Thinking..." : "Ready to answer"}
            </span>
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-3 border border-neutral-800 rounded-2xl px-4 py-3"
            style={{ background: "#111" }}
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

      </div>
    </main>
  );
}
