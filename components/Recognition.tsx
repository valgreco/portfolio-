"use client";

const ITEMS = [
  {
    title: "BCG ASPIRE",
    detail: "One of 90 top female students across EMEA and LATAM.",
    year: "2023",
  },
  {
    title: "FT / Il Sole 24 Ore",
    detail: "Named one of '100 under 35' reshaping Italian entrepreneurship.",
    year: "2022",
  },
  {
    title: "ESMT Scholarship",
    detail: "Awarded for academic and professional excellence.",
    year: "2021",
  },
];

export default function Recognition() {
  return (
    <section className="w-full max-w-6xl mx-auto px-6 py-24">
      <p className="text-xs tracking-widest text-neutral-600 uppercase mb-3">Recognition</p>
      <h2
        className="text-4xl md:text-5xl text-white mb-12 leading-tight"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        Along the way.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ITEMS.map((item) => (
          <div key={item.title} className="border-t border-white/10 pt-6">
            <div className="flex items-baseline justify-between gap-3 mb-2">
              <h3
                className="text-xl text-white"
                style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
              >
                {item.title}
              </h3>
              <span className="text-xs text-neutral-500" style={{ fontFamily: "var(--font-geist-mono)" }}>
                {item.year}
              </span>
            </div>
            <p className="text-sm text-neutral-400 leading-6">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
