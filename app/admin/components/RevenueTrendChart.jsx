"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from "recharts"
import { useMemo } from "react"

function formatMoney(v) {
  if (v >= 1000) return `$${(v / 1000).toFixed(1)}k`;
  return `$${Math.round(v)}`;
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a]/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur min-w-[140px]">
      <p className="mb-2 font-medium text-white/70">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="tabular-nums text-white/50 leading-5">
          <span className="inline-block mr-1.5 w-1.5 h-1.5 rounded-full align-middle" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="text-white/80">{formatMoney(entry.value)}</span>
        </p>
      ))}
    </div>
  );
}

export function RevenueTrendChart({ data }) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const totalPaid = data.reduce((s, d) => s + d.paid, 0);
    const totalOutstanding = data.reduce((s, d) => s + d.outstanding, 0);
    const lastIdx = data.length - 1;
    const momChange = lastIdx > 0 && data[lastIdx - 1].paid > 0
      ? ((data[lastIdx].paid - data[lastIdx - 1].paid) / data[lastIdx - 1].paid) * 100
      : null;
    return { totalPaid, totalOutstanding, momChange };
  }, [data]);

  if (!data || data.length === 0 || !stats) {
    return (
      <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
        <h2 className="text-sm font-semibold text-white">Revenue Trends</h2>
        <p className="mt-1 text-xs text-white/35">Monthly paid vs outstanding (USD)</p>
        <div className="flex items-center justify-center h-48 text-white/15 text-sm mt-4">
          No invoice data yet
        </div>
      </div>
    )
  }

  const momUp = stats.momChange >= 0;

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-white">Revenue Trends</h2>
          <p className="text-xs text-white/35">Monthly paid vs outstanding (USD)</p>
        </div>
        {stats.momChange !== null && (
          <div className={`flex items-center gap-1 text-xs font-medium tabular-nums ${momUp ? "text-[#81c784]" : "text-[#e57373]"}`}>
            <span>{momUp ? "+" : ""}{stats.momChange.toFixed(1)}%</span>
            <span>{momUp ? "\u25B2" : "\u25BC"}</span>
          </div>
        )}
      </div>

      <div className="mt-4 w-full overflow-hidden" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart
            data={data}
            margin={{ left: 0, right: 4, top: 8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="paidGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#81c784" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#81c784" stopOpacity={0} />
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
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 400 }}
              width={44}
              tickFormatter={formatMoney}
            />
            <Tooltip
              cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }}
              content={<CustomTooltip />}
            />
            <Area
              dataKey="paid"
              type="natural"
              fill="url(#paidGradient)"
              stroke="#81c784"
              strokeWidth={2}
              dot={{ fill: "#81c784", strokeWidth: 0, r: 3 }}
              activeDot={{ fill: "#81c784", strokeWidth: 0, r: 5 }}
              name="Paid"
            />
            <Line
              dataKey="outstanding"
              type="natural"
              stroke="#fbbf24"
              strokeWidth={2}
              strokeDasharray="5 4"
              dot={{ fill: "#fbbf24", strokeWidth: 0, r: 3 }}
              activeDot={{ fill: "#fbbf24", strokeWidth: 0, r: 5 }}
              name="Outstanding"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/35">
        <span>
          Paid (6 mo): <span className="text-[#81c784] font-medium tabular-nums">{formatMoney(stats.totalPaid)}</span>
        </span>
        <span>
          Outstanding (6 mo): <span className="text-[#fbbf24] font-medium tabular-nums">{formatMoney(stats.totalOutstanding)}</span>
        </span>
      </div>
    </div>
  )
}