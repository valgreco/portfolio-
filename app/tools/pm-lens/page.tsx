import PMLens from "@/components/PMLens";

export const metadata = {
  title: "My PM lens, Valeria Greco",
  description: "Paste any fuzzy request and see it turned into a scoped product decision, with Valeria's PM approach.",
};

export default function PMLensPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 pt-28 pb-24" style={{ background: "#141414" }}>
      <div className="w-full max-w-3xl">
        <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">Building with AI</p>
        <h1
          className="text-4xl md:text-5xl text-white leading-tight"
          style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
        >
          My PM lens.
        </h1>
        <p className="max-w-2xl text-sm md:text-base text-neutral-400 leading-7 mt-6 mb-12">
          This is the part of the job a CV never shows: taking something fuzzy and turning it into a
          decision. Paste a vague stakeholder ask, a user complaint, or a half-baked feature idea, and
          it runs my product thinking on it: the real problem, who it affects, a tight scope, a metric,
          and a call. Same reasoning I use at work, built with Claude.
        </p>

        <PMLens />
      </div>
    </main>
  );
}
