import Link from "next/link";

type Bet = {
  title: string;
  blurb: string;
  stack: string[];
  status: "In progress" | "Scoping";
  href?: string;
};

const BETS: Bet[] = [
  {
    title: "Dev-enablement agent",
    blurb:
      "An agent that reads our entire codebase through Devin and answers teammates' “how does this actually work?” in plain language — so engineers stop being the documentation.",
    stack: ["Claude", "RAG over the repo", "Devin"],
    status: "Scoping",
  },
  {
    title: "Roadmap ↔ Jira sync",
    blurb:
      "Two-way sync for the roadmap tool I built: move a card on the timeline and it updates Jira, and the other way around — so planning and delivery never drift.",
    stack: ["Jira API", "webhooks"],
    status: "In progress",
    href: "/tools/roadmap",
  },
];

function StatusChip({ status }: { status: Bet["status"] }) {
  const inProgress = status === "In progress";
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10px] tracking-widest uppercase rounded-full px-2.5 py-1 border ${
        inProgress
          ? "text-amber-300/90 border-amber-400/30"
          : "text-blue-300/90 border-blue-300/30"
      }`}
      style={{ fontFamily: "var(--font-geist-mono)" }}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${inProgress ? "bg-amber-400" : "bg-blue-400"}`} />
      {status}
    </span>
  );
}

export default function BuildingNow() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs tracking-widest text-neutral-300 uppercase mb-3">Building now</p>
      <h2
        className="text-4xl md:text-5xl text-white mb-4 leading-tight"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        On the bench.
      </h2>
      <p className="max-w-2xl text-sm text-neutral-300 leading-7 mb-12">
        Live bets I&apos;m building right now, with honest status. This is the part that dates fast &mdash;
        which is the point: I&apos;m always shipping with AI, not just talking about it.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {BETS.map((bet) => {
          const inner = (
            <div className="h-full rounded-3xl bg-[#1c1c1c] border border-white/5 p-7 flex flex-col gap-4 group-hover:border-white/10 transition-colors duration-300">
              <div className="flex items-start justify-between gap-3">
                <h3
                  className="text-xl text-white"
                  style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
                >
                  {bet.title}
                </h3>
                <StatusChip status={bet.status} />
              </div>
              <p className="text-sm text-neutral-300 leading-7">{bet.blurb}</p>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                {bet.stack.map((s) => (
                  <span
                    key={s}
                    className="text-[11px] text-neutral-300 border border-white/10 rounded-full px-2.5 py-1"
                    style={{ fontFamily: "var(--font-geist-mono)" }}
                  >
                    {s}
                  </span>
                ))}
              </div>
              {bet.href && (
                <span className="text-xs text-neutral-300 group-hover:text-white transition-colors duration-200">
                  See the tool &rarr;
                </span>
              )}
            </div>
          );

          return bet.href ? (
            <Link key={bet.title} href={bet.href} className="group block">
              {inner}
            </Link>
          ) : (
            <div key={bet.title} className="group">
              {inner}
            </div>
          );
        })}
      </div>
    </section>
  );
}
