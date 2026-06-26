"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  leads: {
    label: "Leads",
    color: "#EAEFFF",
  },
}

export function LeadsTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
        <h2 className="text-sm font-semibold text-white">Lead Trends</h2>
        <p className="mt-1 text-xs text-white/35">Monthly lead volume</p>
        <div className="flex items-center justify-center h-48 text-white/15 text-sm mt-4">
          No lead data yet
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden border border-white/[0.06] bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-white">Lead Trends</h2>
          <p className="text-xs text-white/35">Monthly lead volume</p>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="mt-4 w-full" style={{ height: 260, aspectRatio: "unset" }}>
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 500 }}
          />
          <ChartTooltip
            cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="leads"
            type="natural"
            fill="#EAEFFF"
            fillOpacity={0.1}
            stroke="#EAEFFF"
            strokeWidth={2}
            dot={{ fill: "#EAEFFF", strokeWidth: 0, r: 3 }}
            activeDot={{ fill: "#EAEFFF", strokeWidth: 0, r: 5 }}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
