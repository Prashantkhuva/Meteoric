import { createClient } from "@/lib/server";
import { LeadsChart } from "./_components/LeadsChart";

async function getStats() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  const { count: newLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "new");

  const { count: contactedLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "contacted");

  const { count: wonLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true })
    .eq("status", "won");

  const { count: totalClients } = await supabase
    .from("clients")
    .select("*", { count: "exact", head: true });

  return {
    totalLeads: totalLeads ?? 0,
    newLeads: newLeads ?? 0,
    contactedLeads: contactedLeads ?? 0,
    wonLeads: wonLeads ?? 0,
    totalClients: totalClients ?? 0,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-white/40">
          {stats ? "Overview of your sales pipeline" : "Supabase not configured — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"}
        </p>
      </div>

      {stats ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Leads" value={stats.totalLeads} gradient="from-[#EAEFFF]/20 via-[#EAEFFF]/10 to-transparent" />
            <StatCard label="New" value={stats.newLeads} gradient="from-emerald-500/20 via-emerald-500/10 to-transparent" />
            <StatCard label="Contacted" value={stats.contactedLeads} gradient="from-sky-500/20 via-sky-500/10 to-transparent" />
            <StatCard label="Won" value={stats.wonLeads} gradient="from-violet-500/20 via-violet-500/10 to-transparent" />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LeadsChart />
            </div>
            <ClientsMini total={stats.totalClients} />
          </div>
        </>
      ) : (
        <div className="rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-8 text-center">
          <p className="text-sm text-white/30">Connect Supabase to see your data here.</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, gradient }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md transition-all duration-500 hover:border-[#EAEFFF]/20 hover:shadow-[0_0_40px_rgba(234,239,255,0.04)]">
      <div className="absolute inset-0 bg-gradient-to-b opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ backgroundImage: `linear-gradient(to bottom, ${gradient.replace('from-', '').replace('via-', '').replace('to-', '')})` }} />
      <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-30 bg-[#EAEFFF]/10" />
      <div className="relative p-5">
        <p className="text-xs font-medium tracking-wider text-white/40 uppercase">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white tabular-nums">{value}</p>
        <div className="mt-2 h-[2px] w-12 rounded-full bg-gradient-to-r from-white/20 to-transparent" />
      </div>
    </div>
  );
}

async function ClientsMini({ total }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#EAEFFF]/10 bg-black/40 backdrop-blur-md p-6 transition-all duration-500 hover:border-[#EAEFFF]/20 hover:shadow-[0_0_40px_rgba(234,239,255,0.04)]">
      <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#EAEFFF]/5 blur-3xl transition-all duration-500 group-hover:opacity-60" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-2 w-2 rounded-full bg-[#EAEFFF]" />
          <span className="text-xs font-medium tracking-wider text-white/40 uppercase">Total Clients</span>
        </div>
        <p className="text-5xl font-bold tracking-tight text-white tabular-nums">{total}</p>
        <p className="mt-2 text-xs text-white/25">Active accounts</p>
        <div className="mt-4 h-[2px] w-16 rounded-full bg-gradient-to-r from-[#EAEFFF]/30 to-transparent" />
      </div>
    </div>
  );
}
