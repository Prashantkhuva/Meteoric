import { createClient } from "@/lib/server";

export default async function AdminClientsPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Clients
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {clients?.length ?? 0} client{clients?.length !== 1 ? "s" : ""}
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
                Company
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
            {!clients || clients.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center text-sm text-white/20"
                >
                  No clients yet.
                </td>
              </tr>
            ) : (
              clients.map((client) => (
                <tr
                  key={client.id}
                  className="border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.02] last:border-0"
                >
                  <td className="px-5 py-3.5 text-white/80 font-medium">
                    {client.name || client.company || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-white/40">
                    {client.email || "—"}
                  </td>
                  <td className="px-5 py-3.5 text-white/40">
                    {client.company || "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEFFF]/20 px-2.5 py-0.5 text-xs font-medium text-[#EAEFFF]/70 bg-[#EAEFFF]/5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#EAEFFF]/70" />
                      {client.status || "active"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/30 text-xs tabular-nums">
                    {client.created_at
                      ? new Date(client.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
