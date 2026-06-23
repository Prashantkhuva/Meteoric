import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./components/DashboardClient";

async function getStats() {
  const supabase = await createClient();
  if (!supabase) return null;

  const { count: totalLeads } = await supabase
    .from("leads")
    .select("*", { count: "exact", head: true });

  const { data: leadStatusCounts } = await supabase
    .from("leads")
    .select("status");

  const statusBuckets = { inquiry: 0, discovery: 0, proposal: 0, in_progress: 0, completed: 0, lost: 0 };
  (leadStatusCounts || []).forEach((l) => { if (statusBuckets[l.status] !== undefined) statusBuckets[l.status]++; });

  const [clientsResult] = await Promise.all([
    supabase.from("clients").select("*", { count: "exact", head: true }),
  ]);

  const totalClients = clientsResult.count ?? 0;

  const inquiryLeads = statusBuckets.inquiry;
  const discoveryLeads = statusBuckets.discovery;
  const proposalLeads = statusBuckets.proposal;
  const inProgressLeads = statusBuckets.in_progress;
  const completedLeads = statusBuckets.completed;
  const lostLeads = statusBuckets.lost;

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

  const { data: invoiceTotals } = await supabase
    .from("invoices")
    .select("status, total");

  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { data: projectStatusData } = await supabase
    .from("projects")
    .select("status");

  const projectBuckets = { planning: 0, in_progress: 0, review: 0, completed: 0, on_hold: 0, cancelled: 0 };
  (projectStatusData || []).forEach((p) => { if (projectBuckets[p.status] !== undefined) projectBuckets[p.status]++; });

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
    monthlyLeadData,
    totalOutstanding,
    totalRevenue,
    overdueCount,
    invoiceCount: (invoiceTotals || []).length,
    totalProjects: totalProjects ?? 0,
    planningProjects: projectBuckets.planning,
    activeProjects: projectBuckets.in_progress,
    reviewProjects: projectBuckets.review,
    completedProjects: projectBuckets.completed,
    onHoldProjects: projectBuckets.on_hold,
    cancelledProjects: projectBuckets.cancelled,
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
