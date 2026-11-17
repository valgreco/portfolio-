import RoadmapDemo from "@/components/RoadmapDemo";

export const metadata = {
  title: "Roadmap tool, Valeria Greco",
  description:
    "An interactive timeline roadmap I built and run at STAMP — recreated here with placeholder data. Owners, sprints, themes, and a two-way Jira sync.",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-28 pb-24" style={{ background: "#141414" }}>
      <div className="w-full max-w-4xl">
        <p className="text-xs tracking-widest text-neutral-400 uppercase mb-3">Building with AI</p>
        <h1
          className="text-4xl md:text-5xl text-white leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          The roadmap I run on.
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-neutral-400 leading-7 mt-6 mb-12">
          Our roadmap used to live in a spreadsheet nobody trusted. So I built a timeline tool the whole
          team plans on: initiatives as phases with owners, sprints and target dates, grouped by theme or
          by owner, with dependencies and a live two-way sync to Jira — move a card here, it updates there.
          Below is a working recreation with <span className="text-neutral-200">placeholder data</span> (no
          real initiatives or people). Hover a bar, switch the view, filter by status.
        </p>

        <RoadmapDemo />

        {/* How it's built */}
        <div className="mt-16 pt-8 border-t border-white/10 max-w-2xl">
          <p className="text-xs tracking-widest text-neutral-400 uppercase mb-3" style={{ fontFamily: "var(--font-geist-mono)" }}>
            How it&apos;s built
          </p>
          <p className="text-sm text-neutral-400 leading-7">
            A React timeline that maps each initiative&apos;s dates onto a sprint calendar, grouped on the fly
            by theme or owner. The real version at STAMP persists to a database and syncs both ways with the
            Jira API through a webhook, so planning here and delivery there never drift. I built it to replace
            the meeting where we used to reconcile them by hand.
          </p>
        </div>
      </div>
    </main>
  );
}
