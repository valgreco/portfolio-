"use client";

export default function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto px-6 py-16 border-t border-white/10">
      <p
        className="text-3xl text-white mb-3"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        Let&apos;s talk.
      </p>
      <p className="text-sm text-neutral-500 mb-6">
        Lived in six countries. Currently in Madrid.
      </p>

      <div className="flex items-center gap-6 text-sm">
        <a
          href="https://www.linkedin.com/in/valeriagreco99/"
          target="_blank"
          rel="noopener noreferrer"
          className="group text-neutral-400 hover:text-white transition-colors duration-200"
        >
          LinkedIn{" "}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↗</span>
        </a>
        <a
          href="https://substack.com/@leragre"
          target="_blank"
          rel="noopener noreferrer"
          className="group text-neutral-400 hover:text-white transition-colors duration-200"
        >
          Substack{" "}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↗</span>
        </a>
      </div>

      <p className="text-xs text-neutral-700 mt-12">© {new Date().getFullYear()} Valeria Greco</p>
    </footer>
  );
}
