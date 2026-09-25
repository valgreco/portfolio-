"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 py-5 bg-gradient-to-b from-[#141414] via-[#141414]/80 to-transparent backdrop-blur-[2px]">
      <Link
        href="/"
        className={`text-xs tracking-wide hover:text-white transition-colors duration-200 ${pathname === "/" ? "text-white" : "text-white/70"}`}
      >
        Home
      </Link>

      <div className="flex items-center gap-6 text-xs tracking-wide text-white/70">
        <Link
          href="/work"
          className={`hover:text-white transition-colors duration-200 ${pathname === "/work" ? "text-white" : ""}`}
        >
          Work
        </Link>
        <Link
          href="/valeria"
          className={`hover:text-white transition-colors duration-200 ${pathname === "/valeria" ? "text-white" : ""}`}
        >
          ValerIA
        </Link>
      </div>
    </nav>
  );
}
