"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

function LetterToPlane({ active, launched }: { active: boolean; launched: boolean }) {
  return (
    <svg viewBox="0 0 72 56" width="72" height="56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dotted flight trail: appears on launch */}
      <motion.path
        d="M4 50 Q28 46 48 18"
        stroke="white"
        strokeOpacity="0.22"
        strokeWidth="1.2"
        strokeDasharray="2 4"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: launched ? 1 : 0 }}
        transition={{ duration: 0.7, ease: EASE }}
      />

      {/* ENVELOPE: visible until launch */}
      <motion.g
        animate={
          launched
            ? { opacity: 0, scale: 0.85 }
            : { opacity: active ? 1 : 0.55, scale: active ? 1 : 0.96 }
        }
        transition={{ duration: launched ? 0.25 : 0.5, ease: EASE }}
        style={{ transformOrigin: "36px 28px" }}
      >
        <rect x="8" y="14" width="56" height="34" rx="3" stroke="white" strokeOpacity="0.35" strokeWidth="1.4" />
        <motion.path
          d="M8 17 L36 34 L64 17"
          stroke="white" strokeWidth="1.4" strokeLinecap="round" fill="none"
          animate={active ? { d: "M8 15 L36 15 L64 15", strokeOpacity: 0.12 } : { d: "M8 17 L36 34 L64 17", strokeOpacity: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        />
        <path d="M8 47 L36 31 L64 47" stroke="white" strokeOpacity="0.12" strokeWidth="1" fill="none" />
      </motion.g>

      {/* PAPER PLANE: appears and flies off on launch */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={
          launched
            ? { opacity: [0, 1, 1, 0], x: [0, 4, 40, 66], y: [0, -2, -30, -54], scale: [0.9, 1, 0.9, 0.6] }
            : { opacity: 0, x: 0, y: 0, scale: 0.9 }
        }
        transition={{ duration: 0.85, ease: EASE, times: [0, 0.2, 0.7, 1] }}
        style={{ transformOrigin: "40px 24px" }}
      >
        <path d="M52 12 L44 44 L36 30 Z" stroke="white" strokeOpacity="0.6" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(255,255,255,0.05)" />
        <path d="M52 12 L36 30 L22 26 Z" stroke="white" strokeOpacity="0.4" strokeWidth="1.4" strokeLinejoin="round" fill="rgba(255,255,255,0.02)" />
        <path d="M52 12 L36 30" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

export default function BookACall() {
  const reduced = useReducedMotion();
  const [form, setForm] = useState({ name: "", company: "", reason: "" });
  const [everFocused, setEverFocused] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [sent, setSent] = useState(false);

  const isOpen = everFocused || form.name.length > 0 || form.company.length > 0 || form.reason.length > 0;

  const subjectLine = form.name || form.company
    ? `Call request from ${form.name || "..."}${form.company ? `, ${form.company}` : ""}`
    : "Call request from ___";

  const bodyLine = form.reason
    ? form.reason.slice(0, 55) + (form.reason.length > 55 ? "..." : "")
    : "I'd love to schedule a call...";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(`Call request from ${form.name}, ${form.company}`);
    const body = encodeURIComponent(
      `Hi Valeria,\n\nI'd love to schedule a call with you.\n\nName: ${form.name}\nCompany: ${form.company}\nReason: ${form.reason}\n\nLooking forward to connecting!`
    );
    setLaunched(true);
    // let the plane take off, then open the mail client
    setTimeout(() => {
      window.location.href = `mailto:valeria.greco29@gmail.com?subject=${subject}&body=${body}`;
      setSent(true);
    }, 700);
  }

  const inputClass = "w-full bg-transparent border-b border-neutral-800 py-3 text-sm text-[#f5f5f5] placeholder-neutral-600 outline-none focus:border-white transition-colors duration-200";

  return (
    <div className="rounded-3xl bg-[#1c1c1c] border border-white/5 p-8 h-full flex flex-col">
        <h3
          className="text-2xl text-white mb-6"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          Book a call
        </h3>

        {/* Envelope + live draft */}
        <div className="flex items-start gap-5 mb-8">
          {!reduced && (
            <div className="shrink-0 mt-1">
              <LetterToPlane active={isOpen} launched={launched} />
            </div>
          )}

          <div className="flex-1 min-w-0 text-xs leading-[1.8] text-neutral-500 break-words" style={{ fontFamily: "var(--font-geist-mono)" }}>
            <div className="flex gap-2">
              <span className="text-neutral-700 w-14 shrink-0">To:</span>
              <span className="text-neutral-400 min-w-0 break-all">Valeria Greco</span>
            </div>
            <div className="flex gap-2">
              <span className="text-neutral-700 w-14 shrink-0">Subject:</span>
              <motion.span
                key={subjectLine}
                className="text-neutral-400 min-w-0 break-words"
                initial={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {subjectLine}
              </motion.span>
            </div>
            <div className="mt-2 text-neutral-700">Hi Valeria,</div>
            <motion.div
              key={bodyLine}
              className="text-neutral-700"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {bodyLine}
            </motion.div>
          </div>
        </div>

        {/* Form */}
        {sent ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-neutral-400"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            &gt; Email client opened. Hit send when you&apos;re ready. Valeria is looking forward to it!
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              className={inputClass}
              style={{ fontFamily: "var(--font-geist-sans)" }}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onFocus={() => setEverFocused(true)}
              required
            />
            <input
              className={inputClass}
              style={{ fontFamily: "var(--font-geist-sans)" }}
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              onFocus={() => setEverFocused(true)}
              required
            />
            <textarea
              className={`${inputClass} resize-none`}
              style={{ fontFamily: "var(--font-geist-sans)" }}
              placeholder="What would you like to talk about?"
              rows={3}
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              onFocus={() => setEverFocused(true)}
              required
            />
            <button
              type="submit"
              className="group self-start text-sm text-[#f5f5f5]/70 hover:text-white transition-colors duration-200 mt-2"
            >
              Open email{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </form>
        )}
    </div>
  );
}
