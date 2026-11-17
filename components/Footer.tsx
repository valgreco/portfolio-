"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";

export default function Footer() {
  return (
    <footer className="w-full max-w-6xl mx-auto px-6 pt-8 pb-16">
      <p
        className="text-3xl text-white mb-3"
        style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic" }}
      >
        Let&apos;s talk.
      </p>
      <p className="text-sm text-neutral-300 mb-6">
        Product manager based in Madrid.
      </p>

      <div className="flex items-center gap-6 text-sm">
        <a
          href="https://www.linkedin.com/in/valeriagreco99/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("linkedin_click")}
          className="group text-neutral-300 hover:text-white transition-colors duration-200"
        >
          LinkedIn{" "}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↗</span>
        </a>
        <a
          href="https://leragreco.substack.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("substack_click")}
          className="group text-neutral-300 hover:text-white transition-colors duration-200"
        >
          Substack{" "}
          <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">↗</span>
        </a>
      </div>

      <div className="flex items-center gap-4 mt-12 text-xs text-neutral-300">
        <span>© {new Date().getFullYear()} Valeria Greco</span>
        <span className="text-neutral-700">·</span>
        <Link href="/colophon" className="hover:text-white transition-colors duration-200">
          Built with Claude Code — how it&apos;s built
        </Link>
      </div>
    </footer>
  );
}
