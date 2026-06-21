import { createClient } from "@/lib/server";
import { LeadsChart } from "./_components/LeadsChart";
import RecentLeadsTable from "./_components/RecentLeadsTable";

async function getStats() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  async function countByStatus(status) {
    const { count } = await supabase
      .from("leads")
      .select("*", { count: "exact", head: true })
      .eq("status", status);
    return count ?? 0;
  }

  const [newLeads, contactedLeads, qualifiedLeads, proposalLeads, wonLeads, lostLeads, totalClients] =
    await Promise.all([
      countByStatus("new"),
      countByStatus("contacted"),
      countByStatus("qualified"),
      countByStatus("proposal"),
      countByStatus("won"),
      countByStatus("lost"),
      supabase.from("clients").select("*", { count: "exact", head: true }).then((r) => r.count ?? 0),
    ]);

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalLeads: totalLeads ?? 0,
    newLeads,
    contactedLeads,
    qualifiedLeads,
    proposalLeads,
    wonLeads,
    lostLeads,
    totalClients,
    recentLeads: recentLeads || [],
  };
}

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default async function AdminDashboard() {
  const stats = await getStats();

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dateStr = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  if (!stats) {
    return (
      <div className="p-6 lg:p-8">
        <div className="border border-white/10 bg-black p-8 text-center">
          <p className="text-sm text-white/30">Supabase not configured</p>
        </div>
      </div>
    );
  }

  const totalLeads = stats.totalLeads;
  const conversionRate = totalLeads > 0 ? ((stats.wonLeads / totalLeads) * 100).toFixed(0) : "0";

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">
            {greeting}, Prashant
          </h1>
          <p className="mt-0.5 text-sm text-white/25">{dateStr}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Leads" value={stats.totalLeads} />
        <StatCard label="New" value={stats.newLeads} />
        <StatCard label="Contacted" value={stats.contactedLeads} />
        <StatCard label="Won" value={stats.wonLeads} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadsChart
            data={{
              counts: {
                new: stats.newLeads,
                contacted: stats.contactedLeads,
                qualified: stats.qualifiedLeads,
                proposal: stats.proposalLeads,
                won: stats.wonLeads,
                lost: stats.lostLeads,
              },
              total: stats.totalLeads,
            }}
          />
        </div>
        <div className="space-y-6">
          <ClientsMini total={stats.totalClients} conversionRate={conversionRate} />
          <QuickActionCard />
        </div>
      </div>

      <RecentLeadsTable leads={stats.recentLeads} />
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="border border-white/5 bg-black p-4 transition-all duration-300 hover:border-white/10">
      <p className="text-[11px] font-medium tracking-wider text-white/30 uppercase">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-white tabular-nums">{value}</p>
      <div className="mt-2 h-px w-8 bg-white/5" />
    </div>
  );
}

async function ClientsMini({ total, conversionRate }) {
  return (
    <div className="border border-white/5 bg-black p-5 transition-all duration-300 hover:border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-1.5 w-1.5 rounded-full bg-[#EAEFFF]" />
        <span className="text-[11px] font-medium tracking-wider text-white/30 uppercase">Total Clients</span>
      </div>
      <p className="text-3xl font-bold tracking-tight text-white tabular-nums">{total}</p>
      <p className="mt-1 text-xs text-white/20">Active accounts</p>
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <span className="text-[11px] text-white/25">Conversion rate</span>
        <span className="text-sm font-semibold text-[#EAEFFF] tabular-nums">{conversionRate}%</span>
      </div>
    </div>
  );
}

function QuickActionCard() {
  return (
    <div className="border border-white/5 bg-black p-5 transition-all duration-300 hover:border-white/10">
      <p className="text-[11px] font-medium tracking-wider text-white/30 uppercase mb-3">Quick Actions</p>
      <div className="space-y-2">
        <a
          href="/admin/leads"
          className="block w-full text-left border border-white/5 bg-black px-3 py-2 text-xs text-white/40 transition-all duration-300 hover:border-white/10 hover:text-white/60"
        >
          View all leads &rarr;
        </a>
        <a
          href="/admin/clients"
          className="block w-full text-left border border-white/5 bg-black px-3 py-2 text-xs text-white/40 transition-all duration-300 hover:border-white/10 hover:text-white/60"
        >
          Manage clients &rarr;
        </a>
      </div>
    </div>
  );
}
