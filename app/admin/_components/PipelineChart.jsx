"use client";

import { cn } from "@/lib/utils"

const stages = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
]

const funnelColors = {
  new: "rgba(234,239,255,0.45)",
  contacted: "rgba(234,239,255,0.30)",
  qualified: "rgba(234,239,255,0.20)",
  proposal: "rgba(234,239,255,0.14)",
  won: "#EAEFFF",
  lost: "rgba(239,68,68,0.30)",
}

export function PipelineChart({ counts, total }) {
  if (!total || total === 0) {
    return (
      <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
        <h2 className="text-sm font-semibold text-white">Pipeline Funnel</h2>
        <p className="mt-1 text-xs text-white/35">Lead progression by stage</p>
        <div className="flex items-center justify-center h-48 text-white/15 text-sm mt-4">
          No lead data yet
        </div>
      </div>
    )
  }

  const maxCount = Math.max(...stages.map((s) => counts[s.key] || 0), 1)

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Pipeline Funnel</h2>
          <p className="text-xs text-white/35">Lead progression by stage</p>
        </div>
        <span className="text-xs text-white/35 tabular-nums">{total} total</span>
      </div>

      <div className="space-y-[3px]">
        {stages.map((s, i) => {
          const count = counts[s.key] || 0
          const pct = total > 0 ? (count / total) * 100 : 0
          const widthPct = maxCount > 0 ? (count / maxCount) * 100 : 0
          const color = funnelColors[s.key]

          return (
            <div key={s.key} className="flex items-center gap-3 group">
              <span className="w-[72px] text-[11px] font-medium text-white/35 text-right shrink-0 transition-colors group-hover:text-white/50">
                {s.label}
              </span>
              <div className="flex-1 h-5 relative overflow-hidden bg-white/[0.015]">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${Math.max(widthPct, 2)}%`,
                    marginLeft: `${i * 2.5}%`,
                    background: `linear-gradient(90deg, ${color} 0%, ${s.key === "won" ? "#EAEFFF" : color} 55%, transparent 100%)`,
                    boxShadow: s.key === "won" ? "0 0 16px rgba(234,239,255,0.12), inset 0 0 0.5px rgba(234,239,255,0.3)" : "none",
                  }}
                />
              </div>
              <div className="w-14 text-right shrink-0">
                <span className={cn(
                  "text-xs font-semibold tabular-nums leading-none",
                  s.key === "won" ? "text-[#EAEFFF]" : "text-white/70"
                )}>
                  {count}
                </span>
                <span className="text-[10px] text-white/25 tabular-nums ml-1 leading-none">
                  ({pct.toFixed(0)}%)
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
