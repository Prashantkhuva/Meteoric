import { createClient } from "@/lib/server";
import DashboardClient from "./_components/DashboardClient";

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

  const [newLeads, contactedLeads, qualifiedLeads, proposalLeads, wonLeads, lostLeads, clientsResult] =
    await Promise.all([
      countByStatus("new"),
      countByStatus("contacted"),
      countByStatus("qualified"),
      countByStatus("proposal"),
      countByStatus("won"),
      countByStatus("lost"),
      supabase.from("clients").select("*", { count: "exact", head: true }),
    ]);

  const totalClients = clientsResult.count ?? 0;

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: upcomingBookings } = await supabase
    .from("leads")
    .select("name, company, services, created_at, status")
    .eq("status", "contacted")
    .order("created_at", { ascending: false })
    .limit(4);

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
    upcomingWork: upcomingBookings || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  if (!stats) {
    return (
      <div className="p-6 lg:p-8">
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-8 text-center">
          <p className="text-sm text-white/40">Supabase not configured</p>
        </div>
      </div>
    );
  }

  const conversionRate = stats.totalLeads > 0 ? ((stats.wonLeads / stats.totalLeads) * 100).toFixed(0) : "0";

  return (
    <div className="p-5 lg:p-8">
      <DashboardClient stats={stats} conversionRate={conversionRate} />
    </div>
  );
}
