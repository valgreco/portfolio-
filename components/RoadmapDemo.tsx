"use client";

import { useRef, useState } from "react";

// A sanitized, interactive recreation of the timeline roadmap Valeria built at
// STAMP. Everything here is PLACEHOLDER data — no real initiatives, owners,
// merchants or dates. It mirrors the real tool's structure and feel (Gantt
// timeline, owners, sprints, themes, hover details, by-theme / by-owner views,
// status filter) so people can see the craft without any confidential content.

type Status = "shipped" | "in progress" | "planned";

type Item = {
  id: string;
  name: string;
  theme: string;
  owner: string; // invented initials
  status: Status;
  start: string; // ISO
  end: string; // ISO
  sprintStart: number;
  sprintEnd: number;
};

const THEME_COLOR: Record<string, string> = {
  Onboarding: "#6b8afd",
  Payments: "#35b7ad",
  Portal: "#a78bfa",
  Compliance: "#e0a23c",
  Platform: "#e06b9c",
  Data: "#4ea8de",
};

const ITEMS: Item[] = [
  { id: "a", name: "Self-serve onboarding", theme: "Onboarding", owner: "A.R.", status: "shipped", start: "2026-07-07", end: "2026-11-20", sprintStart: 27, sprintEnd: 47 },
  { id: "b", name: "SEPA settlement", theme: "Payments", owner: "J.B.", status: "shipped", start: "2026-07-14", end: "2026-10-15", sprintStart: 28, sprintEnd: 42 },
  { id: "c", name: "Dispute shield", theme: "Payments", owner: "L.G.", status: "in progress", start: "2026-08-18", end: "2026-11-30", sprintStart: 33, sprintEnd: 48 },
  { id: "d", name: "Merchant Portal v2", theme: "Portal", owner: "L.G. + A.R.", status: "in progress", start: "2026-09-01", end: "2026-12-18", sprintStart: 35, sprintEnd: 51 },
  { id: "e", name: "3DS rollout", theme: "Payments", owner: "M.T.", status: "in progress", start: "2026-08-25", end: "2027-01-15", sprintStart: 34, sprintEnd: 55 },
  { id: "f", name: "KYC automation", theme: "Compliance", owner: "C.D.", status: "planned", start: "2026-10-06", end: "2027-02-01", sprintStart: 40, sprintEnd: 57 },
  { id: "g", name: "Analytics dashboard", theme: "Data", owner: "C.D.", status: "planned", start: "2026-10-20", end: "2027-01-20", sprintStart: 42, sprintEnd: 55 },
  { id: "h", name: "Refund API v2", theme: "Payments", owner: "J.B.", status: "planned", start: "2026-12-01", end: "2027-02-15", sprintStart: 49, sprintEnd: 58 },
  { id: "i", name: "Tax-free API", theme: "Platform", owner: "A.R. + M.T.", status: "planned", start: "2026-11-10", end: "2027-03-20", sprintStart: 46, sprintEnd: 64 },
  { id: "j", name: "Multi-currency wallet", theme: "Platform", owner: "M.T.", status: "planned", start: "2027-01-05", end: "2027-03-28", sprintStart: 54, sprintEnd: 65 },
];

const START = new Date("2026-07-01").getTime();
const END = new Date("2027-04-01").getTime();
const TOTAL = END - START;
const TODAY = new Date("2026-11-17").getTime();

const MONTHS = [
  "Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026",
  "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027",
];

function pos(iso: string | number) {
  const t = typeof iso === "number" ? iso : new Date(iso).getTime();
  return ((t - START) / TOTAL) * 100;
}

const STATUS_DOT: Record<Status, string> = {
  shipped: "#4ade80",
  "in progress": "#fbbf24",
  planned: "#9ca3af",
};

export default function RoadmapDemo() {
  const [groupBy, setGroupBy] = useState<"theme" | "owner">("theme");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [tip, setTip] = useState<{ item: Item; x: number; y: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const visible = ITEMS.filter((i) => statusFilter === "all" || i.status === statusFilter);

  // Group into labelled sections.
  const groups = (() => {
    const map = new Map<string, Item[]>();
    for (const i of visible) {
      const key = groupBy === "theme" ? i.theme : i.owner;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(i);
    }
    return Array.from(map.entries());
  })();

  function onMove(e: React.MouseEvent, item: Item) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ item, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#161616] overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#1b1b1b]">
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-sm text-white" style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}>
            ProdTech Roadmap
          </span>
          <span
            className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300/90 border border-emerald-400/30 rounded-full px-2 py-0.5"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Synced to Jira
          </span>
        </div>

        {/* View toggle */}
        <div className="flex rounded-lg border border-white/10 overflow-hidden text-xs">
          {(["theme", "owner"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`px-3 py-1.5 transition-colors ${groupBy === g ? "bg-white/10 text-white" : "text-neutral-400 hover:text-white"}`}
            >
              By {g}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | Status)}
          className="text-xs bg-[#222] text-neutral-200 border border-white/10 rounded-lg px-2.5 py-1.5 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="shipped">Shipped</option>
          <option value="in progress">In progress</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      {/* Timeline (horizontally scrollable on small screens) */}
      <div className="overflow-x-auto">
        <div ref={wrapRef} className="relative min-w-[760px]">
          {/* Month header */}
          <div className="flex sticky top-0 z-10 bg-[#161616] border-b border-white/10">
            <div className="w-[150px] shrink-0 px-3 py-2 text-[10px] tracking-widest uppercase text-neutral-500" style={{ fontFamily: "var(--font-geist-mono)" }}>
              Initiative
            </div>
            <div className="relative flex-1 h-8">
              {MONTHS.map((m, idx) => {
                const left = pos(new Date(2026, 6 + idx, 1).getTime());
                return (
                  <div
                    key={m}
                    className="absolute top-0 h-8 flex items-center text-[10px] text-neutral-500 border-l border-white/5 pl-1.5"
                    style={{ left: `${left}%`, fontFamily: "var(--font-geist-mono)" }}
                  >
                    {m.split(" ")[0]}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today line */}
          <div
            className="absolute top-8 bottom-0 w-px bg-rose-400/50 z-10 pointer-events-none"
            style={{ left: `calc(150px + ${pos(TODAY) / 100} * (100% - 150px))` }}
          >
            <span className="absolute -top-0 -translate-x-1/2 text-[9px] text-rose-300/80 bg-[#161616] px-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
              today
            </span>
          </div>

          {/* Groups */}
          {groups.map(([label, items]) => (
            <div key={label}>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border-b border-white/5">
                {groupBy === "theme" && (
                  <span className="w-2 h-2 rounded-sm" style={{ background: THEME_COLOR[label] ?? "#777" }} />
                )}
                <span className="text-[11px] tracking-wide uppercase text-neutral-400" style={{ fontFamily: "var(--font-geist-mono)" }}>
                  {label}
                </span>
              </div>

              {items.map((item) => {
                const left = pos(item.start);
                const width = pos(item.end) - left;
                const color = THEME_COLOR[item.theme] ?? "#777";
                const dim = false;
                return (
                  <div key={item.id} className="flex items-center border-b border-white/5 hover:bg-white/[0.02]">
                    <div className="w-[150px] shrink-0 px-3 py-2.5 text-xs text-neutral-300 truncate">{item.name}</div>
                    <div className="relative flex-1 h-9">
                      <div
                        onMouseEnter={(e) => onMove(e, item)}
                        onMouseMove={(e) => onMove(e, item)}
                        onMouseLeave={() => setTip(null)}
                        className="absolute top-1/2 -translate-y-1/2 h-5 rounded-md flex items-center px-2 gap-1.5 cursor-default transition-transform hover:scale-[1.01]"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          background: item.status === "planned" ? `${color}33` : color,
                          border: item.status === "planned" ? `1px solid ${color}88` : "none",
                          opacity: dim ? 0.3 : 1,
                        }}
                      >
                        <span
                          className="text-[10px] font-medium whitespace-nowrap overflow-hidden"
                          style={{ color: item.status === "planned" ? color : "#0c0c0c" }}
                        >
                          {item.owner}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Hover tooltip */}
          {tip && (
            <div
              className="absolute z-30 pointer-events-none rounded-lg border border-white/15 bg-[#0e0e0e] shadow-xl px-3 py-2.5 w-56"
              style={{ left: Math.min(tip.x + 12, 540), top: tip.y + 14 }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2 h-2 rounded-sm" style={{ background: THEME_COLOR[tip.item.theme] }} />
                <span className="text-sm text-white">{tip.item.name}</span>
              </div>
              <Row k="Owner" v={tip.item.owner} />
              <Row k="Theme" v={tip.item.theme} />
              <Row
                k="Status"
                v={
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_DOT[tip.item.status] }} />
                    {tip.item.status}
                  </span>
                }
              />
              <Row k="Dates" v={`${fmt(tip.item.start)} → ${fmt(tip.item.end)}`} />
              <Row k="Sprint" v={`${tip.item.sprintStart} → ${tip.item.sprintEnd}`} />
            </div>
          )}
        </div>
      </div>

      {/* Footnote */}
      <div className="px-4 py-2.5 border-t border-white/10 text-[11px] text-neutral-500" style={{ fontFamily: "var(--font-geist-mono)" }}>
        Recreation with placeholder data · the real one runs quarterly planning at STAMP and two-way syncs with Jira
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 text-[11px] leading-5">
      <span className="text-neutral-500" style={{ fontFamily: "var(--font-geist-mono)" }}>{k}</span>
      <span className="text-neutral-300 text-right">{v}</span>
    </div>
  );
}

function fmt(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}
