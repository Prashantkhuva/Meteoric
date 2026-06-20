import { createClient } from "@/lib/server";

export default async function AdminClientsPage() {
  const supabase = await createClient();
  if (!supabase) {
    return (
      <div className="space-y-6 p-6 lg:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Clients</h1>
        <p className="text-sm text-white/30">Supabase not configured.</p>
      </div>
    );
  }

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Clients</h1>
          <p className="mt-1 text-sm text-white/40">
            {clients?.length ?? 0} client{clients?.length !== 1 ? "s" : ""}
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
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Company</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Status</th>
                <th className="px-5 py-4 text-xs font-medium tracking-wider text-white/30 uppercase">Created</th>
              </tr>
            </thead>
            <tbody>
              {!clients || clients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-20 text-center text-sm text-white/20">
                    <span className="flex flex-col items-center gap-2">
                      <span className="text-2xl">—</span>
                      <span>No clients yet</span>
                    </span>
                  </td>
                </tr>
              ) : (
                clients.map((client) => (
                  <tr key={client.id} className="border-b border-[#EAEFFF]/5 transition-all duration-300 hover:bg-white/[0.015] last:border-0">
                    <td className="px-5 py-4 text-white/80 font-medium">
                      {client.name || client.company || "—"}
                      {client.company && client.name && (
                        <span className="block text-xs text-white/20 font-normal">{client.company}</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white/40">
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="transition-colors hover:text-[#EAEFFF]">
                          {client.email}
                        </a>
                      ) : "—"}
                    </td>
                    <td className="px-5 py-4 text-white/40">{client.company || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAEFFF]/20 px-3 py-1 text-xs font-medium text-[#EAEFFF]/70 bg-[#EAEFFF]/5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#EAEFFF]/70" />
                        {client.status || "active"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-white/30 text-xs tabular-nums">
                      {client.created_at
                        ? new Date(client.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
