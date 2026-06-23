"use client";

import { cn } from "@/lib/utils";

export function KPICard({ label, value, accent, subtext, trend }) {
  return (
    <div className={cn("group relative border border-white/[0.06] bg-[#0a0a0a] p-5 transition-all duration-300 hover:border-white/[0.10]")}>
      <p className="text-xs font-medium tracking-wider text-white/50 uppercase">{label}</p>
      <p className={cn("mt-1.5 text-3xl font-bold tracking-tight tabular-nums", accent ? "text-[#EAEFFF]" : "text-white")}>
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-white/40">{subtext}</p>
      )}
      {trend !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          <span className={cn("text-xs font-medium tabular-nums", trend >= 0 ? "text-emerald-400" : "text-red-400")}>
            {trend >= 0 ? "+" : ""}{trend}%
          </span>
          <span className="text-xs text-white/30">vs last period</span>
        </div>
      )}
      <div className="mt-3 h-px w-10 bg-white/[0.06]" />
    </div>
  );
}

export function StatCard({ label, value, sublabel }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-[#0a0a0a] px-4 py-3">
      <div>
        <p className="text-sm text-white/60">{label}</p>
        {sublabel && <p className="text-xs text-white/35 mt-0.5">{sublabel}</p>}
      </div>
      <p className="text-lg font-semibold text-white tabular-nums">{value}</p>
    </div>
  );
}
