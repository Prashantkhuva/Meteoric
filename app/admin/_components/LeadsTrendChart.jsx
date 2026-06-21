"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/Components/ui/chart"

const chartConfig = {
  leads: {
    label: "Leads",
    color: "#EAEFFF",
  },
  won: {
    label: "Won",
    color: "rgba(234,239,255,0.4)",
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
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-white">Lead Trends</h2>
          <p className="text-xs text-white/35">Monthly lead volume</p>
        </div>
      </div>

      <ChartContainer config={chartConfig} className="mt-4 w-full h-64">
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
        >
          <defs>
            <linearGradient id="fillLeads" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EAEFFF" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#EAEFFF" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="fillWon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(234,239,255,0.4)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="rgba(234,239,255,0.4)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 500 }}
          />
          <ChartTooltip
            cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Area
            dataKey="won"
            type="natural"
            fill="url(#fillWon)"
            fillOpacity={1}
            stroke="rgba(234,239,255,0.25)"
            strokeWidth={1.5}
            dot={false}
          />
          <Area
            dataKey="leads"
            type="natural"
            fill="url(#fillLeads)"
            fillOpacity={1}
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
