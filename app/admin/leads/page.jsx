import { createClient } from "@/lib/server";

const statusConfig = {
  new: { label: "New", color: "#34d399", bg: "bg-emerald-500/10", border: "border-emerald-500/25" },
  contacted: { label: "Contacted", color: "#38bdf8", bg: "bg-sky-500/10", border: "border-sky-500/25" },
  qualified: { label: "Qualified", color: "#7c6aff", bg: "bg-indigo-500/10", border: "border-indigo-500/25" },
  proposal: { label: "Proposal", color: "#c8a97e", bg: "bg-amber-300/10", border: "border-amber-300/25" },
  won: { label: "Won", color: "#EAEFFF", bg: "bg-[#EAEFFF]/10", border: "border-[#EAEFFF]/25" },
  lost: { label: "Lost", color: "#ef4444", bg: "bg-red-500/10", border: "border-red-500/25" },
};

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Leads</h1>
        <p className="text-sm text-white/30">Supabase not configured.</p>
      </div>
    );
  }

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Leads</h1>
          <p className="mt-1 text-sm text-white/40">
            {leads?.length ?? 0} total lead{leads?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md">
        <div className="absolute -top-40 -right-40 h-60 w-60 rounded-full bg-[#EAEFFF]/[0.015] blur-[80px]" />
        <div className="relative overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#EAEFFF]/8">
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Name</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Email</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Phone</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Status</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Created</th>
              </tr>
            </thead>
            <tbody>
              {!leads || leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center text-sm text-white/20">
                    <span className="flex flex-col items-center gap-2">
                      <span className="text-2xl">—</span>
                      <span>No leads yet</span>
                    </span>
                  </td>
                </tr>
              ) : (
                leads.map((lead) => {
                  const status = statusConfig[lead.status];
                  return (
                    <tr key={lead.id} className="border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.015] last:border-0">
                      <td className="px-5 py-4 text-white/80 font-medium">
                        {lead.name || lead.company || "—"}
                        {lead.company && lead.name && (
                          <span className="block text-xs text-white/20 font-normal">{lead.company}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-white/40">
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="transition-colors hover:text-[#EAEFFF]">
                            {lead.email}
                          </a>
                        ) : "—"}
                      </td>
                      <td className="px-5 py-4 text-white/40">{lead.phone || "—"}</td>
                      <td className="px-5 py-4">
                        {status ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-full border ${status.bg} ${status.border} px-3 py-1 text-xs font-medium`} style={{ color: status.color }}>
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.color }} />
                            {status.label}
                          </span>
                        ) : (
                          <span className="text-white/20 text-xs">{lead.status}</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs tabular-nums">
                        {lead.created_at
                          ? new Date(lead.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
