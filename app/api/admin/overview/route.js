import { authGuard, fail } from "../_lib/helpers";
import { createClient } from "@/lib/supabase/server";
import { backfillMissingRates } from "@/lib/exchange-rate";

async function getStats() {
  const supabase = await createClient();
  if (!supabase) return null;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();

  const [
    totalLeadsResult,
    leadStatusCountsResult,
    clientsResult,
    recentClientsResult,
    recentLeadsResult,
    monthlyRawResult,
    invoiceTotalsResult,
    totalProjectsResult,
    projectStatusDataResult,
    clientsThisMonthResult,
    clientsLastMonthResult,
    overdueInvoicesResult,
    recentInvoicesResult,
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("status"),
    supabase.from("clients").select("*", { count: "exact", head: true }),
    supabase.from("clients").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(5),
    supabase
      .from("leads")
      .select("created_at, status")
      .gte("created_at", sixMonthsAgo.toISOString())
      .order("created_at", { ascending: true }),
    supabase.from("invoices").select("id, status, total, currency, created_at, paid_at, exchange_rate_to_usd"),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("status"),
    supabase.from("clients").select("*", { count: "exact", head: true }).gte("created_at", thisMonthStart),
    supabase
      .from("clients")
      .select("*", { count: "exact", head: true })
      .gte("created_at", lastMonthStart)
      .lt("created_at", thisMonthStart),
    supabase
      .from("invoices")
      .select("*, client:clients(name, email)")
      .eq("status", "overdue")
      .order("due_date", { ascending: true })
      .limit(5),
    supabase
      .from("invoices")
      .select("*, client:clients(name, email)")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const leadStatusCounts = leadStatusCountsResult.data || [];
  const statusBuckets = { inquiry: 0, discovery: 0, proposal: 0, in_progress: 0, completed: 0, lost: 0 };
  leadStatusCounts.forEach((l) => { if (statusBuckets[l.status] !== undefined) statusBuckets[l.status]++; });

  const totalClients = clientsResult.count ?? 0;
  const recentClients = recentClientsResult?.data || [];

  const recentLeads = recentLeadsResult?.data || [];

  const monthBuckets = {};
  (monthlyRawResult?.data || []).forEach((lead) => {
    const d = new Date(lead.created_at);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!monthBuckets[key]) {
      monthBuckets[key] = { leads: 0, won: 0 };
    }
    monthBuckets[key].leads++;
    if (lead.status === "completed") monthBuckets[key].won++;
  });

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

  const invoiceData = await backfillMissingRates(supabase, invoiceTotalsResult.data || []);

  const totalProjects = totalProjectsResult.count ?? 0;

  const projectBuckets = { planning: 0, in_progress: 0, review: 0, completed: 0, on_hold: 0, cancelled: 0 };
  (projectStatusDataResult?.data || []).forEach((p) => { if (projectBuckets[p.status] !== undefined) projectBuckets[p.status]++; });

  let totalOutstanding = 0;
  let overdueCount = 0;
  let totalRevenue = 0;
  const revenueMonthBuckets = {};
  (invoiceData || []).forEach((inv) => {
    const amt = (Number(inv.total) || 0) * (Number(inv.exchange_rate_to_usd) || 1);
    const date = inv.status === "paid" ? (inv.paid_at || inv.created_at) : (inv.created_at || new Date().toISOString());
    const d = new Date(date);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    if (!revenueMonthBuckets[key]) revenueMonthBuckets[key] = { paid: 0, outstanding: 0 };
    if (inv.status === "sent" || inv.status === "overdue") {
      totalOutstanding += amt;
      revenueMonthBuckets[key].outstanding += amt;
    }
    if (inv.status === "paid") {
      totalRevenue += amt;
      revenueMonthBuckets[key].paid += amt;
    }
    if (inv.status === "overdue") {
      overdueCount++;
    }
  });

  const monthlyRevenue = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, "0")}`;
    const b = revenueMonthBuckets[key];
    return {
      month: d.toLocaleDateString("en-US", { month: "short" }),
      paid: b?.paid || 0,
      outstanding: b?.outstanding || 0,
    };
  });

  const leadsMomChange = (() => {
    const len = monthlyLeadData.length;
    if (len < 2 || monthlyLeadData[len - 2].leads === 0) return null;
    const prev = monthlyLeadData[len - 2].leads;
    return ((monthlyLeadData[len - 1].leads - prev) / prev) * 100;
  })();

  const revenueMomChange = (() => {
    const len = monthlyRevenue.length;
    if (len < 2 || monthlyRevenue[len - 2].paid === 0) return null;
    const prev = monthlyRevenue[len - 2].paid;
    return ((monthlyRevenue[len - 1].paid - prev) / prev) * 100;
  })();

  const clientsMom = (clientsThisMonthResult.count || 0) - (clientsLastMonthResult.count || 0);

  return {
    totalLeads: totalLeadsResult.count ?? 0,
    inquiryLeads: statusBuckets.inquiry,
    discoveryLeads: statusBuckets.discovery,
    proposalLeads: statusBuckets.proposal,
    inProgressLeads: statusBuckets.in_progress,
    completedLeads: statusBuckets.completed,
    lostLeads: statusBuckets.lost,
    totalClients,
    recentLeads,
    recentClients,
    monthlyLeadData,
    monthlyRevenue,
    leadsMomChange,
    revenueMomChange,
    clientsMom,
    totalOutstanding,
    totalRevenue,
    overdueCount,
    overdueInvoices: overdueInvoicesResult?.data || [],
    recentInvoices: recentInvoicesResult?.data || [],
    invoiceCount: (invoiceData || []).length,
    totalProjects,
    planningProjects: projectBuckets.planning,
    activeProjects: projectBuckets.in_progress,
    reviewProjects: projectBuckets.review,
    completedProjects: projectBuckets.completed,
    onHoldProjects: projectBuckets.on_hold,
    cancelledProjects: projectBuckets.cancelled,
  };
}

export async function GET(request) {
  const auth = await authGuard(request);
  if (!auth) return fail("Unauthorized", 401);

  const stats = await getStats();
  if (!stats) return fail("Supabase not configured", 500);

  const supabase = await createClient();
  let userName = "Admin";
  if (supabase) {
    try {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;
      userName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "Admin";
    } catch { /* ignore auth errors */ }
  }

  const conversionRate = stats.totalLeads > 0 ? ((stats.completedLeads / stats.totalLeads) * 100).toFixed(0) : "0";

  return Response.json({ stats, conversionRate, userName });
}