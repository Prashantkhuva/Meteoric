"use client";

import { Menu } from "lucide-react";

export function TopBar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 lg:px-6 border-b border-white/[0.04] bg-[#070707]/90 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-white/30 hover:bg-white/[0.04] hover:text-white/60 transition-colors lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <span className="text-sm font-medium tracking-wider text-white/40">
          /{title.toLowerCase()}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-white/[0.06] px-3 py-1 bg-[#0a0a0a]">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[10px] font-medium text-white/40 tracking-wider uppercase">Live</span>
        </div>
      </div>
    </header>
  );
}
