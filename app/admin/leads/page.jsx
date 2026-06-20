import { createClient } from "@/lib/server";

const statusConfig = {
  new: { label: "New", color: "#34d399" },
  contacted: { label: "Contacted", color: "#38bdf8" },
  qualified: { label: "Qualified", color: "#7c6aff" },
  proposal: { label: "Proposal", color: "#c8a97e" },
  won: { label: "Won", color: "#EAEFFF" },
  lost: { label: "Lost", color: "#ef4444" },
};

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Leads
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {leads?.length ?? 0} total lead{leads?.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-[#EAEFFF]/8">
              <th className="px-5 py-3.5 text-xs font-medium tracking-wider text-white/30 uppercase">
                Name
              </th>
              <th className="px-5 py-3.5 text-xs font-medium tracking-wider text-white/30 uppercase">
                Email
              </th>
              <th className="px-5 py-3.5 text-xs font-medium tracking-wider text-white/30 uppercase">
                Phone
              </th>
              <th className="px-5 py-3.5 text-xs font-medium tracking-wider text-white/30 uppercase">
                Status
              </th>
              <th className="px-5 py-3.5 text-xs font-medium tracking-wider text-white/30 uppercase">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {!leads || leads.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center text-sm text-white/20"
                >
                  No leads yet. They will appear here when someone submits
                  the form.
                </td>
              </tr>
            ) : (
              leads.map((lead, i) => {
                const status = statusConfig[lead.status];
                return (
                  <tr
                    key={lead.id}
                    className="border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.02] last:border-0"
                  >
                    <td className="px-5 py-3.5 text-white/80 font-medium">
                      {lead.name || lead.company || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-white/40">
                      {lead.email || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-white/40">
                      {lead.phone || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      {status ? (
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            borderColor: `${status.color}33`,
                            color: status.color,
                            background: `${status.color}0d`,
                          }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ background: status.color }}
                          />
                          {status.label}
                        </span>
                      ) : (
                        <span className="text-white/20 text-xs">
                          {lead.status}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-white/30 text-xs tabular-nums">
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
  );
}
