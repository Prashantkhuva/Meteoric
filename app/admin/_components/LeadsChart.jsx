import { createClient } from "@/lib/server";

export async function LeadsChart() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: leads } = await supabase.from("leads").select("status");

  const counts = { new: 0, contacted: 0, qualified: 0, proposal: 0, won: 0, lost: 0 };
  const steps = [
    { key: "new", label: "New", color: "#34d399", progress: "from-emerald-400/60 to-emerald-500/40" },
    { key: "contacted", label: "Contacted", color: "#38bdf8", progress: "from-sky-400/60 to-sky-500/40" },
    { key: "qualified", label: "Qualified", color: "#7c6aff", progress: "from-indigo-400/60 to-indigo-500/40" },
    { key: "proposal", label: "Proposal", color: "#c8a97e", progress: "from-amber-300/60 to-amber-400/40" },
    { key: "won", label: "Won", color: "#EAEFFF", progress: "from-[#EAEFFF]/60 to-[#EAEFFF]/40" },
    { key: "lost", label: "Lost", color: "#ef4444", progress: "from-red-400/60 to-red-500/40" },
  ];

  leads?.forEach((l) => { if (counts[l.status] !== undefined) counts[l.status]++; });

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-6">
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#EAEFFF]/[0.02] blur-[100px]" />
      <div className="relative">
        <h2 className="text-base font-semibold tracking-tight text-white/90">Pipeline Funnel</h2>
        <p className="mt-0.5 text-xs text-white/25">Leads grouped by stage</p>

        <div className="mt-6 space-y-5">
          {steps.map(({ key, label, color, progress }) => {
            const count = counts[key];
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={key} className="group">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="absolute inline-flex h-full w-full rounded-full opacity-40" style={{ background: color }} />
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: color }} />
                    </span>
                    <span className="text-xs font-medium text-white/50 transition-colors group-hover:text-white/70 tracking-wide">{label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs tabular-nums text-white/30">{count}</span>
                    <span className="text-[11px] tabular-nums text-white/15 w-10 text-right">{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-white/[0.03] border border-white/[0.03]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out opacity-80 group-hover:opacity-100 shadow-[0_0_12px_rgba(234,239,255,0.08)]"
                    style={{ width: `${pct}%` }}
                  >
                    <div className={`h-full w-full rounded-full bg-gradient-to-r ${progress}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
