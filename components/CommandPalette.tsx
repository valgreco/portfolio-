"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type Item = {
  label: string;
  hint: string;
  keywords: string;
  action: () => void;
};

export default function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items: Item[] = useMemo(
    () => [
      { label: "Home", hint: "Start", keywords: "home start hero valeria", action: () => router.push("/") },
      { label: "See the work", hint: "Map + case studies", keywords: "work map stamp countries case studies experience", action: () => router.push("/work") },
      { label: "Chat with ValerIA", hint: "My AI agent", keywords: "valeria chat agent ai ask", action: () => router.push("/valeria") },
      { label: "My PM lens", hint: "Live tool", keywords: "pm lens tool product decision", action: () => router.push("/tools/pm-lens") },
      { label: "Product Request Form", hint: "Tool", keywords: "product request form intake tool", action: () => router.push("/tools/product-request") },
      { label: "Bug Triage Agent", hint: "Tool", keywords: "bug triage agent tool", action: () => router.push("/tools/bug-triage") },
      { label: "LinkedIn", hint: "Open profile", keywords: "linkedin contact social profile", action: () => window.open("https://www.linkedin.com/in/valeriagreco99/", "_blank") },
      { label: "Substack", hint: "Open writing", keywords: "substack writing blog newsletter", action: () => window.open("https://substack.com/@leragre", "_blank") },
    ],
    [router]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => (i.label + " " + i.keywords).toLowerCase().includes(q));
  }, [query, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  function run(i: Item) {
    setOpen(false);
    i.action();
  }

  function onListKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) run(filtered[active]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[18vh] px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: "#1c1c1c", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onListKey}
          placeholder="Jump to..."
          className="w-full bg-transparent px-5 py-4 text-sm text-[#f5f5f5] placeholder-neutral-600 outline-none border-b border-white/10"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        />
        <ul className="max-h-[320px] overflow-y-auto py-2">
          {filtered.length === 0 && (
            <li className="px-5 py-3 text-sm text-neutral-600">No matches.</li>
          )}
          {filtered.map((i, idx) => (
            <li key={i.label}>
              <button
                onMouseEnter={() => setActive(idx)}
                onClick={() => run(i)}
                className={`w-full flex items-center justify-between px-5 py-2.5 text-left transition-colors duration-150 ${
                  idx === active ? "bg-white/[0.06]" : ""
                }`}
              >
                <span className="text-sm text-[#f5f5f5]">{i.label}</span>
                <span className="text-xs text-neutral-600">{i.hint}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="px-5 py-2.5 border-t border-white/10 flex items-center gap-3 text-[11px] text-neutral-600" style={{ fontFamily: "var(--font-geist-mono)" }}>
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}
