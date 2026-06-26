"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Line } from "recharts"
import { useMemo } from "react"

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  const leadsItem = payload.find((p) => p.dataKey === "leads");
  const wonItem = payload.find((p) => p.dataKey === "won");
  const leads = leadsItem?.value ?? 0;
  const won = wonItem?.value ?? 0;
  const convRate = leads > 0 ? ((won / leads) * 100).toFixed(0) : "—";

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a]/95 px-3.5 py-2.5 text-xs shadow-xl backdrop-blur min-w-[130px]">
      <p className="mb-2 font-medium text-white/70">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="tabular-nums text-white/50 leading-5">
          <span className="inline-block mr-1.5 w-1.5 h-1.5 rounded-full align-middle" style={{ backgroundColor: entry.color }} />
          {entry.name}: <span className="text-white/80">{entry.value}</span>
        </p>
      ))}
      <div className="mt-1.5 pt-1.5 border-t border-white/[0.06] text-white/35">
        Conversion: <span className="text-white/80">{convRate}%</span>
      </div>
    </div>
  );
}

export function LeadsTrendChart({ data }) {
  const stats = useMemo(() => {
    if (!data || data.length === 0) return null;
    const totalLeads = data.reduce((s, d) => s + d.leads, 0);
    const totalWon = data.reduce((s, d) => s + d.won, 0);
    const avgConv = totalLeads > 0 ? ((totalWon / totalLeads) * 100).toFixed(0) : "0";
    const bestMonth = data.reduce((best, d) => d.leads > (best?.leads || 0) ? d : best, data[0]);
    const lastIdx = data.length - 1;
    const momChange = lastIdx > 0 && data[lastIdx - 1].leads > 0
      ? ((data[lastIdx].leads - data[lastIdx - 1].leads) / data[lastIdx - 1].leads) * 100
      : null;
    return { totalLeads, totalWon, avgConv, bestMonth, momChange };
  }, [data]);

  if (!data || data.length === 0 || !stats) {
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

  const momUp = stats.momChange >= 0;

  return (
    <div className="border border-white/[0.06] bg-[#0a0a0a] p-6">
      <div className="flex items-start justify-between mb-1">
        <div>
          <h2 className="text-sm font-semibold text-white">Lead Trends</h2>
          <p className="text-xs text-white/35">Monthly lead volume &amp; conversions</p>
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
              interval="equidistantPreserveStart"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "rgba(255,255,255,0.2)", fontSize: 10, fontWeight: 400 }}
              width={24}
              allowDecimals={false}
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
              name="Leads"
            />
            <Line
              dataKey="won"
              type="natural"
              stroke="#81c784"
              strokeWidth={2}
              dot={{ fill: "#81c784", strokeWidth: 0, r: 3 }}
              activeDot={{ fill: "#81c784", strokeWidth: 0, r: 5 }}
              name="Won"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/35">
        <span>
          Total leads: <span className="text-white/70 font-medium tabular-nums">{stats.totalLeads}</span>
        </span>
        <span>
          Won: <span className="text-[#81c784] font-medium tabular-nums">{stats.totalWon}</span>
        </span>
        <span>
          Avg conv: <span className="text-white/70 font-medium tabular-nums">{stats.avgConv}%</span>
        </span>
        <span>
          Best month: <span className="text-white/70 font-medium">{stats.bestMonth.month}</span>
          <span className="text-white/50 tabular-nums ml-1">({stats.bestMonth.leads})</span>
        </span>
      </div>
    </div>
  )
}
