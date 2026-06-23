"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toolbar({ search, onSearchChange, children, resultCount, searchRef }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative flex-1 max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          ref={searchRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          className="w-full rounded-xl border border-white/[0.08] bg-[#0a0a0a] pl-9 pr-8 py-2 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#EAEFFF]/30 focus:bg-[#121212]"
          aria-label="Search"
        />
        {search && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/20 hover:text-white/50 transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        {children}
      </div>
      {resultCount !== undefined && (
        <p className="text-xs text-white/40 tabular-nums sm:ml-auto">{resultCount} result{resultCount !== 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

export function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-[#EAEFFF]/30 bg-[#EAEFFF]/8 text-[#EAEFFF]"
          : "border-white/[0.06] text-white/40 hover:border-white/[0.12] hover:text-white/60"
      )}
    >
      {children}
    </button>
  );
}

export function SortDropdown({ value, onChange, options, label }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-transparent px-3 py-1 text-xs text-white/40 hover:text-white/60 transition-colors outline-none"
        aria-label={label}
        aria-expanded={open}
      >
        {current?.label || value}
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[130px] border border-white/[0.08] bg-[#0a0a0a] shadow-xl">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={cn(
                "block w-full text-left px-3 py-2 text-xs transition-colors",
                opt.value === value
                  ? "text-[#EAEFFF] bg-[#EAEFFF]/[0.04]"
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.02]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ClearFiltersButton({ onClick, visible }) {
  if (!visible) return null;
  return (
    <button
      onClick={onClick}
      className="text-xs text-white/30 hover:text-white/60 transition-colors"
    >
      Clear filters
    </button>
  );
}
