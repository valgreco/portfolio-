"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { track } from "@vercel/analytics";

// The CV file lives in /public. Drop the PDF there with this name.
const CV_PATH = "/valeria-greco-cv.pdf";

export default function DownloadCV() {
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    track("cv_download", { company: form.company });

    try {
      await fetch("/api/cv-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Never block the download on a failed notification.
    }

    // Trigger the download.
    const a = document.createElement("a");
    a.href = CV_PATH;
    a.download = "Valeria-Greco-CV.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setLoading(false);
    setDone(true);
  }

  const inputClass =
    "w-full bg-transparent border-b border-neutral-800 py-3 text-sm text-[#f5f5f5] placeholder-neutral-600 outline-none focus:border-white transition-colors duration-200";

  return (
    <div className="rounded-3xl bg-[#1c1c1c] border border-white/5 p-8 h-full flex flex-col">
        <h3
          className="text-2xl text-white mb-6"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          Download the CV
        </h3>

        {/* Document motif, mirrors the envelope on Book a call */}
        <div className="flex items-start gap-5 mb-8">
          <div className="shrink-0 mt-1">
            <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="12" y="4" width="40" height="40" rx="3" stroke="white" strokeOpacity="0.3" strokeWidth="1.4" />
              <line x1="18" y1="14" x2="46" y2="14" stroke="white" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="18" y1="20" x2="46" y2="20" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
              <line x1="18" y1="26" x2="40" y2="26" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
              <line x1="18" y1="32" x2="43" y2="32" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
            </svg>
          </div>
          <div className="flex-1 min-w-0 text-xs leading-[1.8] text-neutral-400" style={{ fontFamily: "var(--font-geist-mono)" }}>
            <div className="text-neutral-400">valeria-greco-cv.pdf</div>
            <div className="text-neutral-400">Product Manager</div>
            <div className="text-neutral-400 mt-2">PDF · 1 page</div>
          </div>
        </div>

        {done ? (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-neutral-400"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            &gt; Download started. Thanks for stopping by!
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 flex-1">
            <p className="text-sm text-neutral-400">
              A couple of details and the PDF is yours.
            </p>
            <input
              className={inputClass}
              style={{ fontFamily: "var(--font-geist-sans)" }}
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              className={inputClass}
              style={{ fontFamily: "var(--font-geist-sans)" }}
              placeholder="Work email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              className={inputClass}
              style={{ fontFamily: "var(--font-geist-sans)" }}
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="group self-start text-sm text-[#f5f5f5]/70 hover:text-white transition-colors duration-200 mt-auto pt-2 disabled:opacity-40"
            >
              {loading ? "Preparing..." : "Download CV"}{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↓</span>
            </button>
          </form>
        )}
    </div>
  );
}
