"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  new: "#34d399",
  contacted: "#38bdf8",
  qualified: "#7c6aff",
  proposal: "#c8a97e",
  won: "#EAEFFF",
  lost: "#ef4444",
};

const STEPS = [
  { key: "new", label: "New" },
  { key: "contacted", label: "Contacted" },
  { key: "qualified", label: "Qualified" },
  { key: "proposal", label: "Proposal" },
  { key: "won", label: "Won" },
  { key: "lost", label: "Lost" },
];

export function LeadsChart({ data }) {
  if (!data || data.total === 0) {
    return (
      <div className="border border-white/5 bg-black p-6">
        <h2 className="text-base font-semibold tracking-tight text-white/90">Pipeline Funnel</h2>
        <p className="mt-0.5 text-xs text-white/25">Leads grouped by stage</p>
        <div className="flex items-center justify-center h-48 text-white/15 text-sm mt-4">
          No lead data yet
        </div>
      </div>
    );
  }

  const { counts, total } = data;

  const chartData = STEPS.map((s) => ({
    name: s.label,
    value: counts[s.key] || 0,
    color: COLORS[s.key],
    key: s.key,
  })).filter((d) => d.value > 0);

  const RADIAN = Math.PI / 180;
  const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const radius = outerRadius + 24;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const item = chartData[index];
    if (!item || percent < 0.05) return null;
    return (
      <text
        x={x}
        y={y}
        fill="rgba(255,255,255,0.4)"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={11}
      >
        {item.name}
      </text>
    );
  };

  return (
    <div className="border border-white/5 bg-black p-6">
      <h2 className="text-base font-semibold tracking-tight text-white/90">Pipeline Funnel</h2>
      <p className="mt-0.5 text-xs text-white/25">{total} total leads across {chartData.length} stages</p>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        <div className="lg:col-span-3 flex justify-center">
          <div className="relative">
            <ResponsiveContainer width={280} height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={100}
                  dataKey="value"
                  strokeWidth={0}
                  label={renderCustomLabel}
                  labelLine={false}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-bold tracking-tight text-white tabular-nums">{total}</p>
                <p className="text-[11px] text-white/25 font-medium tracking-wider uppercase">Total</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-2.5">
          {STEPS.map((s) => {
            const count = counts[s.key] || 0;
            const pct = total > 0 ? (count / total) * 100 : 0;
            if (count === 0 && s.key !== "lost") return null;
            return (
              <div key={s.key} className="group flex items-center justify-between px-3.5 py-2.5 transition-all duration-300 hover:bg-white/[0.02]">
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: COLORS[s.key] }}
                  />
                  <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{s.label}</span>
                </div>
                <div className="flex items-center gap-3 tabular-nums">
                  <span className="text-sm font-medium text-white/80">{count}</span>
                  <span className="text-xs text-white/20 w-8 text-right">{pct.toFixed(0)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
