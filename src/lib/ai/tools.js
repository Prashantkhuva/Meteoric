import { createClient } from "@supabase/supabase-js";

function getDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase not configured");
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function query(fn) {
  try {
    return await fn();
  } catch (err) {
    console.error("[ai/tools] query error:", err);
    return { error: err.message || "Query failed" };
  }
}

export async function getLeadStats() {
  return query(async () => {
    const { data } = await getDb().from("leads").select("status");
    if (!data) return { total: 0, byStatus: {} };
    const byStatus = {};
    data.forEach((l) => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
    return { total: data.length, byStatus };
  });
}

export async function searchLeads(queryStr) {
  return query(async () => {
    const { data } = await getDb()
      .from("leads")
      .select("id, name, email, company, services, budget, status, ai_score, ai_category, created_at")
      .or(`name.ilike.%${queryStr}%,email.ilike.%${queryStr}%,company.ilike.%${queryStr}%`)
      .order("created_at", { ascending: false })
      .limit(10);
    return data || [];
  });
}

export async function getRecentLeads(days = 7) {
  return query(async () => {
    const cutoff = new Date(Date.now() - days * 86400000).toISOString();
    const { data } = await getDb()
      .from("leads")
      .select("id, name, email, company, services, budget, status, ai_score, created_at")
      .gte("created_at", cutoff)
      .order("created_at", { ascending: false });
    return data || [];
  });
}

export async function getRevenue() {
  return query(async () => {
    const { data } = await getDb().from("invoices").select("status, total, currency");
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
  });
}

export async function getProposalStats() {
  return query(async () => {
    const { data } = await getDb().from("proposals").select("status, total");
    if (!data) return { total: 0, byStatus: {} };
    const byStatus = {};
    data.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });
    return { total: data.length, byStatus };
  });
}

export async function getOverdueInvoices() {
  return query(async () => {
    const { data } = await getDb()
      .from("invoices")
      .select("id, invoice_number, total, due_date, client:clients(name, email)")
      .eq("status", "overdue")
      .order("due_date", { ascending: true });
    return data || [];
  });
}

export async function getClientCount() {
  return query(async () => {
    const { count } = await getDb().from("clients").select("*", { count: "exact", head: true });
    return count || 0;
  });
}
