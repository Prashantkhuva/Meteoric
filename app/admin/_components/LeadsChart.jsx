import { createClient } from "@/lib/server";

export async function LeadsChart() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data: leads } = await supabase.from("leads").select("status");

  const counts = { new: 0, contacted: 0, qualified: 0, proposal: 0, won: 0, lost: 0 };
  const steps = [
    { key: "new", label: "New", color: "#34d399" },
    { key: "contacted", label: "Contacted", color: "#38bdf8" },
    { key: "qualified", label: "Qualified", color: "#7c6aff" },
    { key: "proposal", label: "Proposal", color: "#c8a97e" },
    { key: "won", label: "Won", color: "#EAEFFF" },
    { key: "lost", label: "Lost", color: "#ef4444" },
  ];

  leads?.forEach((l) => { if (counts[l.status] !== undefined) counts[l.status]++; });

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-5">
      <h2 className="text-sm font-semibold tracking-tight text-white/80">Pipeline Funnel</h2>
      <p className="mt-0.5 text-xs text-white/25">Leads grouped by stage</p>

      <div className="mt-6 space-y-4">
        {steps.map(({ key, label, color }) => {
          const count = counts[key];
          const pct = total > 0 ? (count / total) * 100 : 0;
          return (
            <div key={key} className="group">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                  <span className="text-xs font-medium text-white/50 group-hover:text-white/70 transition-colors">{label}</span>
                </div>
                <span className="text-xs tabular-nums text-white/30">{count}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${color}88)`, boxShadow: `0 0 8px ${color}44` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
