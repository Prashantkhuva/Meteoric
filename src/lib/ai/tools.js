const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

const REST_URL = url ? `${url}/rest/v1` : null;

async function fetchFrom(table, query = {}) {
  if (!REST_URL || !key) return { error: "Supabase not configured" };

  const params = new URLSearchParams();
  if (query.select) params.set("select", query.select);
  if (query.order) params.set("order", query.order);
  if (query.limit) params.set("limit", query.limit);
  if (query.or) params.set("or", query.or);
  if (query.gte) params.set(query.gte.column, `gte.${query.gte.value}`);
  if (query.eq) params.set(query.eq.column, `eq.${query.eq.value}`);
  if (query.count) params.set("count", query.count);

  const qs = params.toString();

  try {
    const res = await fetch(`${REST_URL}/${table}${qs ? `?${qs}` : ""}`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      const msg = `Supabase ${res.status}: ${text.slice(0, 200)}`;
      console.error("[ai/tools] fetch error:", msg);
      return { error: msg };
    }

    if (query.count === "exact") {
      const count = parseInt(res.headers.get("content-range")?.split("/")[1] || "0", 10);
      return { count };
    }

    return await res.json();
  } catch (err) {
    console.error("[ai/tools] fetch error:", err);
    return { error: err.message };
  }
}

export async function getLeadStats() {
  const data = await fetchFrom("leads", { select: "status" });
  if (data.error) return { total: 0, byStatus: {}, error: data.error };
  const byStatus = {};
  data.forEach((l) => { byStatus[l.status] = (byStatus[l.status] || 0) + 1; });
  return { total: data.length, byStatus };
}

export async function searchLeads(queryStr) {
  const data = await fetchFrom("leads", {
    select: "id,name,email,company,services,budget,status,ai_score,ai_category,created_at",
    or: `name.ilike.%${queryStr}%,email.ilike.%${queryStr}%,company.ilike.%${queryStr}%`,
    order: "created_at.desc",
    limit: 10,
  });
  return Array.isArray(data) ? data : [];
}

export async function getRecentLeads(days = 7) {
  const cutoff = new Date(Date.now() - days * 86400000).toISOString();
  const data = await fetchFrom("leads", {
    select: "id,name,email,company,services,budget,status,ai_score,created_at",
    gte: { column: "created_at", value: cutoff },
    order: "created_at.desc",
  });
  return Array.isArray(data) ? data : [];
}

export async function getRevenue() {
  const data = await fetchFrom("invoices", { select: "status,total,currency" });
  if (!Array.isArray(data)) return { total: 0, paid: 0, overdue: 0, pending: 0, count: 0 };
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
  const data = await fetchFrom("proposals", { select: "status,total" });
  if (!Array.isArray(data)) return { total: 0, byStatus: {} };
  const byStatus = {};
  data.forEach((p) => { byStatus[p.status] = (byStatus[p.status] || 0) + 1; });
  return { total: data.length, byStatus };
}

export async function getOverdueInvoices() {
  const data = await fetchFrom("invoices", {
    select: "id,invoice_number,total,due_date,client:clients(name,email)",
    eq: { column: "status", value: "overdue" },
    order: "due_date.asc",
  });
  return Array.isArray(data) ? data : [];
}

export async function getClientCount() {
  const result = await fetchFrom("clients", { select: "id", count: "exact" });
  return result.count || 0;
}
