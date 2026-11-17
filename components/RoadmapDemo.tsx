"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// A sanitized, interactive recreation of the timeline roadmap Valeria built at
// STAMP. Everything here is PLACEHOLDER data — no real initiatives, owners,
// merchants or dates. It mirrors the real tool's structure and feel (Gantt
// timeline, owners, sprints, themes, hover details, by-theme / by-owner views,
// status filter, drag-to-reschedule, add item, and a Jira sync affordance).

type Status = "shipped" | "in progress" | "planned";

type Item = {
  id: string;
  name: string;
  theme: string;
  owner: string;
  status: Status;
  start: string;
  end: string;
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
const THEMES = Object.keys(THEME_COLOR);

const START = new Date("2026-07-01").getTime();
const END = new Date("2027-04-01").getTime();
const TOTAL = END - START;
const TODAY = new Date("2026-11-17").getTime();
const WEEK = 7 * 24 * 3600 * 1000;

const MONTHS = ["Jul 2026", "Aug 2026", "Sep 2026", "Oct 2026", "Nov 2026", "Dec 2026", "Jan 2027", "Feb 2027", "Mar 2027"];

const STATUS_DOT: Record<Status, string> = {
  shipped: "#4ade80",
  "in progress": "#fbbf24",
  planned: "#9ca3af",
};

const INITIAL: Item[] = [
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

const clampMs = (t: number) => Math.max(START, Math.min(END, t));
const pos = (iso: string | number) => (((typeof iso === "number" ? iso : new Date(iso).getTime()) - START) / TOTAL) * 100;
const sprintOf = (ms: number) => 27 + Math.round((ms - START) / WEEK);
const fmt = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}`;
};

export default function RoadmapDemo() {
  const [items, setItems] = useState<Item[]>(INITIAL);
  const [groupBy, setGroupBy] = useState<"theme" | "owner">("theme");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [tip, setTip] = useState<{ item: Item; x: number; y: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; startX: number; origStart: number; origEnd: number; trackW: number } | null>(null);

  const triggerSync = useCallback(() => {
    setSynced(true);
    window.setTimeout(() => setSynced(false), 1700);
  }, []);

  const onDragMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const deltaMs = ((e.clientX - d.startX) / d.trackW) * TOTAL;
    let ns = d.origStart + deltaMs;
    let ne = d.origEnd + deltaMs;
    if (ns < START) { ne += START - ns; ns = START; }
    if (ne > END) { ns -= ne - END; ne = END; }
    ns = clampMs(ns); ne = clampMs(ne);
    setItems((prev) =>
      prev.map((it) =>
        it.id === d.id
          ? { ...it, start: new Date(ns).toISOString(), end: new Date(ne).toISOString(), sprintStart: sprintOf(ns), sprintEnd: sprintOf(ne) }
          : it
      )
    );
  }, []);

  const onDragUp = useCallback(() => {
    window.removeEventListener("pointermove", onDragMove);
    window.removeEventListener("pointerup", onDragUp);
    if (dragRef.current) triggerSync();
    dragRef.current = null;
    setDraggingId(null);
  }, [onDragMove, triggerSync]);

  function onBarPointerDown(e: React.PointerEvent, item: Item) {
    const track = (e.currentTarget as HTMLElement).parentElement;
    if (!track) return;
    e.preventDefault();
    dragRef.current = {
      id: item.id,
      startX: e.clientX,
      origStart: new Date(item.start).getTime(),
      origEnd: new Date(item.end).getTime(),
      trackW: track.getBoundingClientRect().width,
    };
    setDraggingId(item.id);
    setTip(null);
    window.addEventListener("pointermove", onDragMove);
    window.addEventListener("pointerup", onDragUp);
  }

  function onHover(e: React.MouseEvent, item: Item) {
    if (draggingId) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTip({ item, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  const visible = items.filter((i) => statusFilter === "all" || i.status === statusFilter);
  const groups = (() => {
    const map = new Map<string, Item[]>();
    for (const i of visible) {
      const key = groupBy === "theme" ? i.theme : i.owner;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(i);
    }
    return Array.from(map.entries());
  })();

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#161616] overflow-hidden relative">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/10 bg-[#1b1b1b]">
        <div className="flex items-center gap-2 mr-auto">
          <span className="text-sm text-white" style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}>
            ProdTech Roadmap
          </span>
          <motion.span
            animate={synced ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 text-[11px] text-emerald-300/90 border border-emerald-400/30 rounded-full px-2 py-0.5"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Synced to Jira
          </motion.span>
        </div>

        <button
          onClick={() => setShowAdd((s) => !s)}
          className="text-xs text-emerald-300 border border-emerald-400/30 hover:border-emerald-400/60 rounded-lg px-2.5 py-1.5 transition-colors"
        >
          + Add item
        </button>

        <div className="flex rounded-lg border border-white/10 overflow-hidden text-xs">
          {(["theme", "owner"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGroupBy(g)}
              className={`px-3 py-1.5 transition-colors ${groupBy === g ? "bg-white/10 text-white" : "text-neutral-300 hover:text-white"}`}
            >
              By {g}
            </button>
          ))}
        </div>

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

      {/* Add item form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/10 bg-[#141414] overflow-hidden"
          >
            <AddItemForm
              onAdd={(it) => {
                setItems((prev) => [...prev, it]);
                setShowAdd(false);
                triggerSync();
              }}
              onCancel={() => setShowAdd(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline */}
      <div className="overflow-x-auto">
        <div ref={wrapRef} className="relative min-w-[760px]" style={{ userSelect: draggingId ? "none" : "auto" }}>
          {/* Month header */}
          <div className="flex sticky top-0 z-10 bg-[#161616] border-b border-white/10">
            <div className="w-[150px] shrink-0 px-3 py-2 text-[10px] tracking-widest uppercase text-neutral-500" style={{ fontFamily: "var(--font-geist-mono)" }}>
              Initiative
            </div>
            <div className="relative flex-1 h-8">
              {MONTHS.map((m, idx) => (
                <div
                  key={m}
                  className="absolute top-0 h-8 flex items-center text-[10px] text-neutral-500 border-l border-white/5 pl-1.5"
                  style={{ left: `${pos(new Date(2026, 6 + idx, 1).getTime())}%`, fontFamily: "var(--font-geist-mono)" }}
                >
                  {m.split(" ")[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Today line */}
          <div
            className="absolute top-8 bottom-0 w-px bg-rose-400/50 z-10 pointer-events-none"
            style={{ left: `calc(150px + ${pos(TODAY) / 100} * (100% - 150px))` }}
          >
            <span className="absolute -translate-x-1/2 text-[9px] text-rose-300/80 bg-[#161616] px-1" style={{ fontFamily: "var(--font-geist-mono)" }}>
              today
            </span>
          </div>

          {/* Groups */}
          {groups.map(([label, groupItems]) => (
            <div key={label}>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/[0.02] border-b border-white/5">
                {groupBy === "theme" && <span className="w-2 h-2 rounded-sm" style={{ background: THEME_COLOR[label] ?? "#777" }} />}
                <span className="text-[11px] tracking-wide uppercase text-neutral-300" style={{ fontFamily: "var(--font-geist-mono)" }}>
                  {label}
                </span>
              </div>

              {groupItems.map((item) => {
                const left = pos(item.start);
                const width = pos(item.end) - left;
                const color = THEME_COLOR[item.theme] ?? "#777";
                const isDragging = draggingId === item.id;
                return (
                  <div key={item.id} className="flex items-center border-b border-white/5 hover:bg-white/[0.02]">
                    <div className="w-[150px] shrink-0 px-3 py-2.5 text-xs text-neutral-300 truncate">{item.name}</div>
                    <div className="relative flex-1 h-9">
                      <div
                        onPointerDown={(e) => onBarPointerDown(e, item)}
                        onMouseEnter={(e) => onHover(e, item)}
                        onMouseMove={(e) => onHover(e, item)}
                        onMouseLeave={() => setTip(null)}
                        className="absolute top-1/2 -translate-y-1/2 h-5 rounded-md flex items-center px-2 gap-1.5 transition-shadow touch-none"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          background: item.status === "planned" ? `${color}33` : color,
                          border: item.status === "planned" ? `1px solid ${color}88` : "none",
                          cursor: isDragging ? "grabbing" : "grab",
                          boxShadow: isDragging ? `0 0 0 2px ${color}, 0 6px 18px rgba(0,0,0,0.5)` : "none",
                          zIndex: isDragging ? 20 : 1,
                        }}
                      >
                        <span className="text-[10px] font-medium whitespace-nowrap overflow-hidden" style={{ color: item.status === "planned" ? color : "#0c0c0c" }}>
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
          {tip && !draggingId && (
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
              <Row k="Status" v={<span className="inline-flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full" style={{ background: STATUS_DOT[tip.item.status] }} />{tip.item.status}</span>} />
              <Row k="Dates" v={`${fmt(tip.item.start)} → ${fmt(tip.item.end)}`} />
              <Row k="Sprint" v={`${tip.item.sprintStart} → ${tip.item.sprintEnd}`} />
            </div>
          )}
        </div>
      </div>

      {/* Footnote */}
      <div className="px-4 py-2.5 border-t border-white/10 text-[11px] text-neutral-500" style={{ fontFamily: "var(--font-geist-mono)" }}>
        Drag a bar to reschedule · it syncs to Jira · placeholder data, the real one runs quarterly planning at STAMP
      </div>

      {/* Sync toast */}
      <AnimatePresence>
        {synced && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-16 right-4 z-40 flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-[#0e1a14] px-3 py-2 shadow-xl"
            style={{ fontFamily: "var(--font-geist-mono)" }}
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.05, type: "spring", stiffness: 500, damping: 18 }}
              className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-400 text-[#0e1a14] text-[10px] font-bold"
            >
              ✓
            </motion.span>
            <span className="text-xs text-emerald-200">Synced to Jira</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AddItemForm({ onAdd, onCancel }: { onAdd: (i: Item) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [theme, setTheme] = useState(THEMES[0]);
  const [owner, setOwner] = useState("");
  const [status, setStatus] = useState<Status>("planned");
  const [start, setStart] = useState("2026-12-01");
  const [end, setEnd] = useState("2027-02-01");

  function save() {
    if (!name.trim()) return;
    const s = clampMs(new Date(start).getTime());
    const e = clampMs(Math.max(new Date(end).getTime(), s + WEEK));
    onAdd({
      id: Math.random().toString(36).slice(2, 8),
      name: name.trim(),
      theme,
      owner: owner.trim() || "—",
      status,
      start: new Date(s).toISOString(),
      end: new Date(e).toISOString(),
      sprintStart: sprintOf(s),
      sprintEnd: sprintOf(e),
    });
  }

  const field = "bg-[#1c1c1c] text-neutral-200 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-white/25";
  const label = "block text-[10px] tracking-widest uppercase text-neutral-500 mb-1";

  return (
    <div className="p-4 flex flex-wrap items-end gap-3" style={{ fontFamily: "var(--font-geist-sans)" }}>
      <div className="flex-1 min-w-[180px]">
        <span className={label} style={{ fontFamily: "var(--font-geist-mono)" }}>Name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Payout scheduler" className={`${field} w-full`} />
      </div>
      <div>
        <span className={label} style={{ fontFamily: "var(--font-geist-mono)" }}>Theme</span>
        <select value={theme} onChange={(e) => setTheme(e.target.value)} className={field}>
          {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div>
        <span className={label} style={{ fontFamily: "var(--font-geist-mono)" }}>Owner</span>
        <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="e.g. A.R." className={`${field} w-24`} />
      </div>
      <div>
        <span className={label} style={{ fontFamily: "var(--font-geist-mono)" }}>Status</span>
        <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className={field}>
          <option value="planned">Planned</option>
          <option value="in progress">In progress</option>
          <option value="shipped">Shipped</option>
        </select>
      </div>
      <div>
        <span className={label} style={{ fontFamily: "var(--font-geist-mono)" }}>Start</span>
        <input type="date" value={start} min="2026-07-01" max="2027-03-31" onChange={(e) => setStart(e.target.value)} className={field} />
      </div>
      <div>
        <span className={label} style={{ fontFamily: "var(--font-geist-mono)" }}>Target</span>
        <input type="date" value={end} min="2026-07-01" max="2027-03-31" onChange={(e) => setEnd(e.target.value)} className={field} />
      </div>
      <div className="flex gap-2">
        <button onClick={save} className="text-xs text-[#0c0c0c] bg-emerald-400 hover:bg-emerald-300 rounded-lg px-3 py-1.5 font-medium transition-colors">Save</button>
        <button onClick={onCancel} className="text-xs text-neutral-300 hover:text-white rounded-lg px-2 py-1.5 transition-colors">Cancel</button>
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
