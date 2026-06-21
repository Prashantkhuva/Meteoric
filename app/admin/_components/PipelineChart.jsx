"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/Components/ui/chart"
import { STATUS_COLORS } from "./admin-tokens"

const stages = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
]

const chartConfig = Object.fromEntries(
  stages.map((s) => [s.key, { label: s.label, color: STATUS_COLORS[s.key] }])
)

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

  const chartData = stages
    .filter((s) => (counts[s.key] || 0) > 0)
    .map((s) => ({ stage: s.label, count: counts[s.key] || 0, fill: STATUS_COLORS[s.key] }))

  const maxVal = Math.max(...chartData.map((d) => d.count), 1)

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-white">Pipeline Funnel</h2>
        <span className="text-xs text-white/35 tabular-nums">{total} total</span>
      </div>
      <p className="text-xs text-white/35 mb-4">Lead progression by stage</p>

      <ChartContainer config={chartConfig} className="w-full h-72">
        <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 0, top: 4, bottom: 4 }}>
          <CartesianGrid horizontal={false} stroke="rgba(255,255,255,0.04)" />
          <XAxis type="number" hide domain={[0, maxVal]} />
          <YAxis
            type="category"
            dataKey="stage"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 500 }}
            width={80}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.03)" }}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <Bar dataKey="count" radius={[0, 3, 3, 0]} barSize={20} />
        </BarChart>
      </ChartContainer>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {stages.map((s) => {
          const count = counts[s.key] || 0
          const pct = total > 0 ? (count / total) * 100 : 0
          return (
            <div key={s.key} className="flex items-center gap-2 border border-white/[0.04] px-2.5 py-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: STATUS_COLORS[s.key] }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/40 truncate">{s.label}</p>
                <p className="text-xs font-semibold text-white tabular-nums">
                  {count} <span className="text-[10px] text-white/30 font-normal">({pct.toFixed(0)}%)</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
