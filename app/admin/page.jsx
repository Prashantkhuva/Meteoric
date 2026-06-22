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

  const [inquiryLeads, discoveryLeads, proposalLeads, inProgressLeads, completedLeads, lostLeads, clientsResult] =
    await Promise.all([
      countByStatus("inquiry"),
      countByStatus("discovery"),
      countByStatus("proposal"),
      countByStatus("in_progress"),
      countByStatus("completed"),
      countByStatus("lost"),
      supabase.from("clients").select("*", { count: "exact", head: true }),
    ]);

  const totalClients = clientsResult.count ?? 0;

  const { data: recentLeads } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: monthlyRaw } = await supabase
    .from("leads")
    .select("created_at, status")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  const monthBuckets = {};
  (monthlyRaw || []).forEach((lead) => {
    const d = new Date(lead.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!monthBuckets[key]) {
      monthBuckets[key] = {
        leads: 0,
        won: 0,
      };
    }
    monthBuckets[key].leads++;
    if (lead.status === "completed") monthBuckets[key].won++;
  });

  const now = new Date();
  const monthlyLeadData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const b = monthBuckets[key];
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      leads: b?.leads || 0,
      won: b?.won || 0,
    };
  });

  const { data: upcomingBookings } = await supabase
    .from("leads")
    .select("name, company, services, created_at, status")
    .eq("status", "discovery")
    .order("created_at", { ascending: false })
    .limit(4);

  const { data: invoiceTotals } = await supabase
    .from("invoices")
    .select("status, total");

  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  async function countProjects(status) {
    const { count } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("status", status);
    return count ?? 0;
  }

  const [planningProjects, activeProjects, reviewProjects, completedProjects, onHoldProjects, cancelledProjects] =
    await Promise.all([
      countProjects("planning"),
      countProjects("in_progress"),
      countProjects("review"),
      countProjects("completed"),
      countProjects("on_hold"),
      countProjects("cancelled"),
    ]);

  let totalOutstanding = 0;
  let paidThisMonth = 0;
  let overdueCount = 0;
  let totalRevenue = 0;
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  (invoiceTotals || []).forEach((inv) => {
    const amt = Number(inv.total) || 0;
    if (inv.status === "sent" || inv.status === "overdue") {
      totalOutstanding += amt;
    }
    if (inv.status === "paid") {
      totalRevenue += amt;
    }
    if (inv.status === "overdue") {
      overdueCount++;
    }
  });

  return {
    totalLeads: totalLeads ?? 0,
    inquiryLeads,
    discoveryLeads,
    proposalLeads,
    inProgressLeads,
    completedLeads,
    lostLeads,
    totalClients,
    recentLeads: recentLeads || [],
    upcomingWork: upcomingBookings || [],
    monthlyLeadData,
    totalOutstanding,
    totalRevenue,
    overdueCount,
    invoiceCount: (invoiceTotals || []).length,
    totalProjects: totalProjects ?? 0,
    planningProjects,
    activeProjects,
    reviewProjects,
    completedProjects,
    onHoldProjects,
    cancelledProjects,
  };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const supabase = await createClient();
  let userName = "Admin";
  if (supabase) {
    const { data } = await supabase.auth.getUser();
    const user = data?.user;
    userName =
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split("@")[0] ||
      "Admin";
  }

  if (!stats) {
    return (
      <div className="p-6 lg:p-8">
        <div className="border border-white/[0.06] bg-[#0a0a0a] p-8 text-center">
          <p className="text-sm text-white/40">Supabase not configured</p>
        </div>
      </div>
    );
  }

  const conversionRate = stats.totalLeads > 0 ? ((stats.completedLeads / stats.totalLeads) * 100).toFixed(0) : "0";

  return (
    <div className="p-5 lg:p-8">
      <DashboardClient
        stats={stats}
        conversionRate={conversionRate}
        monthlyLeadData={stats.monthlyLeadData}
        userName={userName}
        invoiceOutstanding={stats.totalOutstanding}
        invoiceRevenue={stats.totalRevenue}
        overdueCount={stats.overdueCount}
        invoiceCount={stats.invoiceCount}
        projectStats={{
          total: stats.totalProjects,
          planning: stats.planningProjects,
          active: stats.activeProjects,
          review: stats.reviewProjects,
          completed: stats.completedProjects,
          onHold: stats.onHoldProjects,
          cancelled: stats.cancelledProjects,
        }}
      />
    </div>
  );
}
