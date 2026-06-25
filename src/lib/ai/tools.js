import { createClient } from "@/lib/supabase/server";

async function getDb() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

export async function getLeadStats() {
  const supabase = await getDb();
  const { data } = await supabase.from("leads").select("status");
  if (!data) return { total: 0, byStatus: {} };
  const byStatus = {};
  data.forEach((l) => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
  return { total: data.length, byStatus };
}

export async function searchLeads(query) {
  const supabase = await getDb();
  const { data } = await supabase
    .from("leads")
    .select("id, name, email, company, services, budget, status, ai_score, ai_category, created_at")
    .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
    .order("created_at", { ascending: false })
    .limit(10);
  return data || [];
}

export async function getRecentLeads(days = 7) {
  const supabase = await getDb();
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const { data } = await supabase
    .from("leads")
    .select("id, name, email, company, services, budget, status, ai_score, created_at")
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function getRevenue() {
  const supabase = await getDb();
  const { data } = await supabase.from("invoices").select("status, total, currency");
  if (!data) return { total: 0, paid: 0, overdue: 0, pending: 0 };
  let total = 0, paid = 0, overdue = 0, pending = 0;
  data.forEach((inv) => {
    const amt = Number(inv.total) || 0;
    total += amt;
    if (inv.status === "paid") paid += amt;
    else if (inv.status === "overdue") overdue += amt;
    else if (inv.status === "sent") pending += amt;
  });
  return { total, paid, overdue, pending, count: data.length };
}

export async function getProposalStats() {
  const supabase = await getDb();
  const { data } = await supabase.from("proposals").select("status, total");
  if (!data) return { total: 0, byStatus: {} };
  const byStatus = {};
  data.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });
  return { total: data.length, byStatus };
}

export async function getOverdueInvoices() {
  const supabase = await getDb();
  const { data } = await supabase
    .from("invoices")
    .select("id, invoice_number, total, due_date, client:clients(name, email)")
    .eq("status", "overdue")
    .order("due_date", { ascending: true });
  return data || [];
}

export async function getClientCount() {
  const supabase = await getDb();
  const { count } = await supabase.from("clients").select("*", { count: "exact", head: true });
  return count || 0;
}
