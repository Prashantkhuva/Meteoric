"use client";

import { Area, AreaChart, CartesianGrid, XAxis, Tooltip, ResponsiveContainer } from "recharts"

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a]/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur">
      <p className="mb-1 font-medium text-white/70">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="tabular-nums text-white/50">
          <span className="inline-block mr-1.5 w-1.5 h-1.5 rounded-full align-middle" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
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

      <div className="mt-4 w-full overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ left: 0, right: 0, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EAEFFF" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#EAEFFF" stopOpacity={0} />
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
              tickMargin={8}
              tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 11, fontWeight: 500 }}
              interval="preserveStartEnd"
            />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
              content={<CustomTooltip />}
            />
            <Area
              dataKey="leads"
              type="natural"
              fill="url(#leadsGradient)"
              stroke="#EAEFFF"
              strokeWidth={2}
              dot={{ fill: "#EAEFFF", strokeWidth: 0, r: 3 }}
              activeDot={{ fill: "#EAEFFF", strokeWidth: 0, r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
