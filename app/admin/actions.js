"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSiteUrl } from "@/lib/site-url";
import { sendProposalEmail, sendInvoiceEmail } from "@/lib/email";

export async function signOut() {
  const supabase = await createClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export async function updateLeadStatus(id, status) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function addLead(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const email = formData.get("email");
  if (email) {
    const { data: existing } = await supabase.from("leads").select("id").eq("email", email).maybeSingle();
    if (existing) throw new Error("A lead with this email already exists");
  }

  const { error } = await supabase.from("leads").insert({
    name: formData.get("name"),
    email,
    phone: formData.get("phone"),
    services: formData.get("services"),
    budget: formData.get("budget"),
    status: "inquiry",
  });

  if (error) throw error;
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function convertLeadToClient(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data: lead } = await supabase
    .from("leads")
    .select("name, email, phone, company, status")
    .eq("id", id)
    .single();

  if (!lead) throw new Error("Lead not found");
  if (lead.status === "completed") throw new Error("Lead has already been converted");

  if (lead.email) {
    const { data: existing } = await supabase.from("clients").select("id").eq("email", lead.email).maybeSingle();
    if (existing) throw new Error("A client with this email already exists");
  }

  const { error: insertError } = await supabase
    .from("clients")
    .insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: "onboarding",
    });

  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from("leads")
    .update({ status: "completed" })
    .eq("id", id);

  if (updateError) throw updateError;

  revalidatePath("/admin/leads");
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}

export async function deleteLead(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function updateClientStatus(id, status) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("clients")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}

export async function addClient(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const name = formData.get("name");
  const email = formData.get("email");
  const company = formData.get("company");
  const phone = formData.get("phone");

  if (email) {
    const { data: existing } = await supabase.from("clients").select("id").eq("email", email).maybeSingle();
    if (existing) throw new Error("A client with this email already exists");
  }

  const { error } = await supabase
    .from("clients")
    .insert({ name, email, phone: phone || null, company, status: "onboarding" });

  if (error) throw error;
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}

export async function deleteClient(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}

export async function createLeadFromBooking(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("leads").insert({
    name: formData.get("name") || "Unknown",
    email: formData.get("email") || "",
    phone: formData.get("phone") || "",
    company: formData.get("company") || "",
    services: formData.get("services") || "",
    details: formData.get("details") || "",
    budget: formData.get("budget") || "",
    status: "inquiry",
  });

  if (error) throw error;
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function getLeads() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("leads")
    .select("id, name, email, company")
    .order("name", { ascending: true });
  return data || [];
}

export async function getClients() {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("clients")
    .select("id, name, email, phone, company")
    .order("name", { ascending: true });
  return data || [];
}

export async function createProposal(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  let content = null;
  try { content = JSON.parse(formData.get("content")); } catch {}

  let pricing = [];
  try { pricing = JSON.parse(formData.get("pricing")); } catch {}

  const { error } = await supabase.from("proposals").insert({
    lead_id: formData.get("lead_id") || null,
    title: formData.get("title"),
    status: "draft",
    content,
    pricing,
    timeline: formData.get("timeline") || null,
    terms: formData.get("terms") || null,
  });

  if (error) throw error;
  revalidatePath("/admin/proposals");
  revalidatePath("/admin");
}

export async function updateProposal(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const id = formData.get("id");

  let content = null;
  try { content = JSON.parse(formData.get("content")); } catch {}

  let pricing = [];
  try { pricing = JSON.parse(formData.get("pricing")); } catch {}

  const { error } = await supabase
    .from("proposals")
    .update({
      lead_id: formData.get("lead_id") || null,
      title: formData.get("title"),
      status: formData.get("status") || "draft",
      content,
      pricing,
      timeline: formData.get("timeline") || null,
      terms: formData.get("terms") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/proposals");
  revalidatePath("/admin");
}

export async function deleteProposal(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("proposals")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/proposals");
  revalidatePath("/admin");
}

export async function sendProposal(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data: proposal } = await supabase
    .from("proposals")
    .select("*, lead:leads(name, email, phone)")
    .eq("id", id)
    .single();

  if (!proposal) throw new Error("Proposal not found");
  if (!proposal.lead?.email) throw new Error("Lead has no email address");

  const { error } = await supabase
    .from("proposals")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;

  const previewUrl = `${getSiteUrl()}/preview/proposal/${id}`;

  try {
    await sendProposalEmail(proposal, proposal.lead, previewUrl);
  } catch (err) {
    console.error("Failed to send proposal email:", err);
  }

  revalidatePath("/admin/proposals");
  revalidatePath("/admin");
}

export async function createInvoice(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });

  const nextNum = String((count || 0) + 1).padStart(4, "0");
  const ts = Date.now().toString(36).toUpperCase();
  const invoiceNumber = `INV-${nextNum}-${ts}`;

  let items = [];
  try { items = JSON.parse(formData.get("items")); } catch {}

  const subtotal = items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0), 0);
  const tax = Number(formData.get("tax")) || 0;
  const total = subtotal + tax;

  const { error } = await supabase.from("invoices").insert({
    client_id: formData.get("client_id") || null,
    proposal_id: formData.get("proposal_id") || null,
    invoice_number: invoiceNumber,
    status: "draft",
    items,
    subtotal,
    tax,
    total,
    notes: formData.get("notes") || null,
    terms: formData.get("terms") || null,
    due_date: formData.get("due_date") || null,
  });

  if (error) throw error;
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
}

export async function updateInvoice(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const id = formData.get("id");

  let items = [];
  try { items = JSON.parse(formData.get("items")); } catch {}

  const subtotal = items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0), 0);
  const tax = Number(formData.get("tax")) || 0;
  const total = subtotal + tax;

  const { error } = await supabase
    .from("invoices")
    .update({
      client_id: formData.get("client_id") || null,
      proposal_id: formData.get("proposal_id") || null,
      status: formData.get("status") || "draft",
      items,
      subtotal,
      tax,
      total,
      notes: formData.get("notes") || null,
      terms: formData.get("terms") || null,
      due_date: formData.get("due_date") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
}

export async function deleteInvoice(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
}

export async function sendInvoice(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*, client:clients(name, email, phone)")
    .eq("id", id)
    .single();

  if (!invoice) throw new Error("Invoice not found");
  if (!invoice.client?.email) throw new Error("Client has no email address");

  const { error } = await supabase
    .from("invoices")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;

  const previewUrl = `${getSiteUrl()}/preview/invoice/${id}`;

  try {
    await sendInvoiceEmail(invoice, invoice.client, previewUrl);
  } catch (err) {
    console.error("Failed to send invoice email:", err);
  }

  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
}

export async function markInvoiceAsPaid(id, paidAt) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: paidAt || new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
}

export async function markInvoiceAsOverdue(ids) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const idList = Array.isArray(ids) ? ids : [ids];
  if (idList.length === 0) return;

  const { error } = await supabase
    .from("invoices")
    .update({ status: "overdue" })
    .in("id", idList);

  if (error) throw error;
  revalidatePath("/admin/invoices");
  revalidatePath("/admin");
}

export async function createProject(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const services = formData.get("services") || null;
  const parsedServices = services ? services.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const { error } = await supabase.from("projects").insert({
    client_id: formData.get("client_id") || null,
    name: formData.get("name"),
    description: formData.get("description") || null,
    status: formData.get("status") || "planning",
    start_date: formData.get("start_date") || null,
    deadline: formData.get("deadline") || null,
    budget: formData.get("budget") ? Number(formData.get("budget")) : null,
    services: parsedServices,
    notes: formData.get("notes") || null,
  });

  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

export async function updateProject(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const id = formData.get("id");
  const services = formData.get("services") || null;
  const parsedServices = services ? services.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const { error } = await supabase
    .from("projects")
    .update({
      client_id: formData.get("client_id") || null,
      name: formData.get("name"),
      description: formData.get("description") || null,
      status: formData.get("status") || "planning",
      start_date: formData.get("start_date") || null,
      deadline: formData.get("deadline") || null,
      budget: formData.get("budget") ? Number(formData.get("budget")) : null,
      services: parsedServices,
      notes: formData.get("notes") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

export async function deleteProject(id) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/projects");
  revalidatePath("/admin");
}

function resolveOrder(col, dir, sort) {
  const validCols = ["name", "email", "status", "created_at", "invoice_number", "total", "budget", "deadline", "title", "company", "phone"];
  if (col && validCols.includes(col)) {
    return { column: col, ascending: dir !== "desc" };
  }
  const sortMap = {
    newest: { column: "created_at", ascending: false },
    oldest: { column: "created_at", ascending: true },
    name: { column: "name", ascending: true },
    title: { column: "title", ascending: true },
    amount: { column: "total", ascending: false },
    number: { column: "invoice_number", ascending: true },
    deadline: { column: "deadline", ascending: true },
  };
  return sortMap[sort] || { column: "created_at", ascending: false };
}

export async function getLeadsPaginated({ page = 1, pageSize = 15, search = "", status = "all", col = "", dir = "asc", sort = "newest" }) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  let query = supabase.from("leads").select("*", { count: "exact" });
  if (search) { query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`); }
  if (status !== "all") { query = query.eq("status", status); }
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getClientsPaginated({ page = 1, pageSize = 15, search = "", status = "all", col = "", dir = "asc", sort = "newest" }) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  let query = supabase.from("clients").select("*", { count: "exact" });
  if (search) { query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`); }
  if (status !== "all") { query = query.eq("status", status); }
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getProposalsPaginated({ page = 1, pageSize = 15, search = "", status = "all", col = "", dir = "asc", sort = "newest" }) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  let query = supabase.from("proposals").select("*, lead:leads(name, email, phone, company)", { count: "exact" });
  if (search) { query = query.or(`title.ilike.%${search}%,lead.name.ilike.%${search}%`); }
  if (status !== "all") { query = query.eq("status", status); }
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getInvoicesPaginated({ page = 1, pageSize = 15, search = "", status = "all", col = "", dir = "asc", sort = "newest" }) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  let query = supabase.from("invoices").select("*, client:clients(name, email, phone, company), proposal:proposals(id, title)", { count: "exact" });
  if (search) { query = query.or(`invoice_number.ilike.%${search}%,client.name.ilike.%${search}%`); }
  if (status !== "all") { query = query.eq("status", status); }
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getProjectsPaginated({ page = 1, pageSize = 15, search = "", status = "all", col = "", dir = "asc", sort = "newest" }) {
  const supabase = await createClient();
  if (!supabase) return { data: [], total: 0 };

  let query = supabase.from("projects").select("*, client:clients(name, email, company)", { count: "exact" });
  if (search) { query = query.or(`name.ilike.%${search}%,client.name.ilike.%${search}%`); }
  if (status !== "all") { query = query.eq("status", status); }
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}
