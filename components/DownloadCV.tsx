"use client";

import { useState } from "react";
import { motion } from "framer-motion";

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
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">Résumé</p>
      <h2
        className="text-4xl md:text-5xl text-white mb-12 leading-tight"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        Download the CV.
      </h2>

      <div className="rounded-3xl bg-[#1c1c1c] border border-white/5 p-8 max-w-xl">
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <p className="text-sm text-neutral-500">
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
              className="group self-start text-sm text-[#f5f5f5]/70 hover:text-white transition-colors duration-200 mt-2 disabled:opacity-40"
            >
              {loading ? "Preparing..." : "Download CV"}{" "}
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↓</span>
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
