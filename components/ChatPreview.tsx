"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const CONVOS = [
  {
    q: "What's Valeria's background?",
    a: "She came from marketing and consulting (Amazon, Bosch, Wayra), then moved into product two years ago. First PM hire at a European fintech.",
  },
  {
    q: "What has she built with AI?",
    a: "Five tools in five days: an MCP server, a bug triage agent, a discovery tool, a marketing framework, and me.",
  },
  {
    q: "Where is she based?",
    a: "Madrid. Italian by origin, schooled in six countries. Fluent in English, Italian, and Spanish.",
  },
];

const CHAR_SPEED = 22;
const PAUSE_AFTER_Q = 600;
const PAUSE_AFTER_A = 2200;

export default function ChatPreview() {
  const reduced = useReducedMotion();
  const [convoIdx, setConvoIdx] = useState(0);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [phase, setPhase] = useState<"typing-q" | "typing-a" | "done">("typing-q");

  useEffect(() => {
    if (reduced) {
      setQuestion(CONVOS[0].q);
      setAnswer(CONVOS[0].a);
      return;
    }

    const convo = CONVOS[convoIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing-q") {
      setQuestion("");
      setAnswer("");
      let i = 0;
      const type = () => {
        i++;
        setQuestion(convo.q.slice(0, i));
        if (i < convo.q.length) timeout = setTimeout(type, CHAR_SPEED);
        else timeout = setTimeout(() => setPhase("typing-a"), PAUSE_AFTER_Q);
      };
      timeout = setTimeout(type, CHAR_SPEED);
    }

    if (phase === "typing-a") {
      let i = 0;
      const type = () => {
        i++;
        setAnswer(convo.a.slice(0, i));
        if (i < convo.a.length) timeout = setTimeout(type, CHAR_SPEED);
        else timeout = setTimeout(() => setPhase("done"), PAUSE_AFTER_A);
      };
      timeout = setTimeout(type, CHAR_SPEED);
    }

    if (phase === "done") {
      timeout = setTimeout(() => {
        setConvoIdx((idx) => (idx + 1) % CONVOS.length);
        setPhase("typing-q");
      }, 400);
    }

    return () => clearTimeout(timeout);
  }, [phase, convoIdx, reduced]);

  return (
    <div className="flex flex-col gap-3 px-7 pb-7 pt-2">
      {/* Question bubble */}
      <div className="flex justify-end">
        <div
          className="max-w-[85%] px-3 py-2 rounded-xl text-xs text-white/70 leading-5"
          style={{ background: "#1e1e1e", fontFamily: "var(--font-geist-sans)", minHeight: 32 }}
        >
          {question}
          {phase === "typing-q" && <span className="animate-[blink_0.7s_step-end_infinite] ml-px">|</span>}
        </div>
      </div>

      {/* Answer */}
      {(answer || phase === "typing-a" || phase === "done") && (
        <div className="flex gap-2 items-start">
          <div
            className="w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5 border border-white/10"
            style={{ filter: "grayscale(100%)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/valeria.jpg" alt="" className="w-full h-full object-cover" style={{ objectPosition: "center 10%" }} />
          </div>
          <p
            className="text-xs text-neutral-400 leading-5 max-w-[85%]"
            style={{ fontFamily: "var(--font-geist-sans)", minHeight: 20 }}
          >
            {answer}
            {phase === "typing-a" && <span className="animate-[blink_0.7s_step-end_infinite] ml-px">|</span>}
          </p>
        </div>
      )}
    </div>
  );
}
