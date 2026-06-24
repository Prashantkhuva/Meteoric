"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSiteUrl } from "@/config/site-url";
import { sendProposalEmail, sendInvoiceEmail } from "@/lib/email/email";
import {
  idSchema,
  emailSchema,
  leadSchema,
  clientSchema,
  proposalSchema,
  invoiceSchema,
  projectSchema,
  paginationSchema,
  statusSchema,
  validateFormData,
  sanitizeProposalContent,
  VALID_LEAD_STATUSES,
  VALID_CLIENT_STATUSES,
  VALID_PROPOSAL_STATUSES,
  VALID_INVOICE_STATUSES,
  VALID_PROJECT_STATUSES,
} from "@/lib/admin-validation";

async function getSupabase() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

function revalidateAdmin(...paths) {
  paths.forEach((p) => revalidatePath(p));
  revalidatePath("/admin");
}

export async function signOut() {
  const supabase = await getSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateLeadStatus(id, status) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);
  const safeStatus = statusSchema(VALID_LEAD_STATUSES).parse(status);

  const { error } = await supabase
    .from("leads")
    .update({ status: safeStatus })
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/leads");
}

export async function addLead(formData) {
  const supabase = await getSupabase();
  const data = validateFormData(leadSchema, formData);

  if (data.email) {
    const safeEmail = emailSchema.parse(data.email);
    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", safeEmail)
      .maybeSingle();
    if (existing) throw new Error("A lead with this email already exists");
  }

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email || null,
    phone: data.phone,
    services: data.services,
    budget: data.budget,
    status: "inquiry",
  });

  if (error) throw error;
  revalidateAdmin("/admin/leads");
}

export async function updateLead(formData) {
  const supabase = await getSupabase();
  const raw = Object.fromEntries(formData.entries());
  raw.id = idSchema.parse(raw.id);
  const data = leadSchema.parse(raw);

  const { error } = await supabase
    .from("leads")
    .update({
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      services: data.services,
      budget: data.budget,
      updated_at: new Date().toISOString(),
    })
    .eq("id", raw.id);

  if (error) throw error;
  revalidateAdmin("/admin/leads");
}

export async function convertLeadToClient(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { data: lead, error: fetchError } = await supabase
    .from("leads")
    .select("name, email, phone, company, status")
    .eq("id", safeId)
    .single();

  if (fetchError || !lead) throw new Error("Lead not found");
  if (lead.status === "completed") throw new Error("Lead has already been converted");

  if (lead.email) {
    const safeEmail = emailSchema.parse(lead.email);
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .eq("email", safeEmail)
      .maybeSingle();
    if (existing) throw new Error("A client with this email already exists");
  }

  const { error: insertError } = await supabase.from("clients").insert({
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    status: "onboarding",
  });

  if (insertError) throw new Error(insertError.message);

  const { error: updateError } = await supabase
    .from("leads")
    .update({ status: "completed" })
    .eq("id", safeId);

  if (updateError) throw new Error(updateError.message);

  revalidateAdmin("/admin/leads", "/admin/clients");
}

export async function deleteLead(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/leads");
}

export async function updateClientStatus(id, status) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);
  const safeStatus = statusSchema(VALID_CLIENT_STATUSES).parse(status);

  const { error } = await supabase
    .from("clients")
    .update({ status: safeStatus })
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/clients");
}

export async function addClient(formData) {
  const supabase = await getSupabase();
  const data = validateFormData(clientSchema, formData);

  if (data.email) {
    const safeEmail = emailSchema.parse(data.email);
    const { data: existing } = await supabase
      .from("clients")
      .select("id")
      .eq("email", safeEmail)
      .maybeSingle();
    if (existing) throw new Error("A client with this email already exists");
  }

  const { error } = await supabase.from("clients").insert({
    name: data.name,
    email: data.email || null,
    phone: data.phone,
    company: data.company,
    status: "onboarding",
  });

  if (error) throw error;
  revalidateAdmin("/admin/clients");
}

export async function updateClient(formData) {
  const supabase = await getSupabase();
  const raw = Object.fromEntries(formData.entries());
  raw.id = idSchema.parse(raw.id);
  const data = clientSchema.parse(raw);

  const { error } = await supabase
    .from("clients")
    .update({
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      company: data.company,
      updated_at: new Date().toISOString(),
    })
    .eq("id", raw.id);

  if (error) throw error;
  revalidateAdmin("/admin/clients");
}

export async function deleteClient(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { data, error } = await supabase
    .from("clients")
    .delete()
    .eq("id", safeId)
    .select("id");

  if (error) throw error;
  if (!data || data.length === 0) throw new Error("Client was not deleted (0 rows affected)");

  revalidateAdmin("/admin/clients");
}

export async function createLeadFromBooking(formData) {
  const supabase = await getSupabase();
  const data = validateFormData(leadSchema, formData);

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email || "",
    phone: data.phone || "",
    services: data.services || "",
    budget: data.budget || "",
    status: "inquiry",
  });

  if (error) throw error;
  revalidateAdmin("/admin/leads");
}

export async function getLeads() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("leads")
    .select("id, name, email, company")
    .order("name", { ascending: true });
  return data || [];
}

export async function getClients() {
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("clients")
    .select("id, name, email, phone, company")
    .order("name", { ascending: true });
  return data || [];
}

export async function createProposal(formData) {
  const supabase = await getSupabase();
  const data = validateFormData(proposalSchema, formData);

  const content = data.content
    ? sanitizeProposalContent(data.content)
    : null;

  const { error } = await supabase.from("proposals").insert({
    lead_id: data.lead_id,
    title: data.title,
    status: "draft",
    content,
    pricing: data.pricing || [],
    timeline: data.timeline,
    terms: data.terms,
  });

  if (error) throw error;
  revalidateAdmin("/admin/proposals");
}

export async function updateProposal(formData) {
  const supabase = await getSupabase();
  const data = validateFormData(proposalSchema, formData);

  const content = data.content
    ? sanitizeProposalContent(data.content)
    : null;

  const { error } = await supabase
    .from("proposals")
    .update({
      lead_id: data.lead_id,
      title: data.title,
      status: data.status || "draft",
      content,
      pricing: data.pricing || [],
      timeline: data.timeline,
      terms: data.terms,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (error) throw error;
  revalidateAdmin("/admin/proposals");
}

export async function deleteProposal(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { error } = await supabase
    .from("proposals")
    .delete()
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/proposals");
}

export async function sendProposal(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { data: proposal, error: fetchError } = await supabase
      .from("proposals")
      .select("*, lead:leads(name, email, phone)")
      .eq("id", safeId)
      .single();

    if (fetchError) return { success: false, error: fetchError.message };
    if (!proposal) return { success: false, error: "Proposal not found" };
    if (!proposal.lead?.email) return { success: false, error: "Lead has no email address" };

    const shareToken = randomUUID();
    const previewUrl = `${getSiteUrl()}/preview/proposal/${safeId}?token=${shareToken}`;

    await sendProposalEmail(proposal, proposal.lead, previewUrl);

    const { error } = await supabase
      .from("proposals")
      .update({ status: "sent", sent_at: new Date().toISOString(), share_token: shareToken })
      .eq("id", safeId);

    if (error) return { success: false, error: error.message };

    revalidateAdmin("/admin/proposals");
    return { success: true };
  } catch (err) {
    console.error("sendProposal error:", err);
    return { success: false, error: err.message || "Failed to send proposal" };
  }
}

export async function updateProposalStatus(id, status) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);
  const safeStatus = statusSchema(VALID_PROPOSAL_STATUSES).parse(status);

  const { error } = await supabase
    .from("proposals")
    .update({ status: safeStatus, updated_at: new Date().toISOString() })
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/proposals");
}

function parseFormData(formData) {
  const raw = Object.fromEntries(formData.entries());
  if (typeof raw.items === "string") {
    try {
      raw.items = JSON.parse(raw.items);
    } catch {
      raw.items = [];
    }
  }
  return raw;
}

export async function createInvoice(formData) {
  const supabase = await getSupabase();
  const data = invoiceSchema.parse(parseFormData(formData));

  const { count } = await supabase
    .from("invoices")
    .select("*", { count: "exact", head: true });

  const nextNum = String((count || 0) + 1).padStart(4, "0");
  const ts = Date.now().toString(36).toUpperCase();
  const invoiceNumber = `INV-${nextNum}-${ts}`;

  const subtotal = data.items.reduce(
    (s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0),
    0
  );
  const total = subtotal + data.tax;

  const { error } = await supabase.from("invoices").insert({
    client_id: data.client_id,
    proposal_id: data.proposal_id,
    invoice_number: invoiceNumber,
    status: "draft",
    items: data.items,
    subtotal,
    tax: data.tax,
    total,
    currency: data.currency,
    notes: data.notes,
    terms: data.terms,
    due_date: data.due_date,
  });

  if (error) throw error;
  revalidateAdmin("/admin/invoices");
}

export async function updateInvoice(formData) {
  const supabase = await getSupabase();
  const data = invoiceSchema.parse(parseFormData(formData));

  const subtotal = data.items.reduce(
    (s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0),
    0
  );
  const total = subtotal + data.tax;

  const { error } = await supabase
    .from("invoices")
    .update({
      client_id: data.client_id,
      proposal_id: data.proposal_id,
      status: data.status || "draft",
      items: data.items,
      subtotal,
      tax: data.tax,
      total,
      currency: data.currency,
      notes: data.notes,
      terms: data.terms,
      due_date: data.due_date,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (error) throw error;
  revalidateAdmin("/admin/invoices");
}

export async function deleteInvoice(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/invoices");
}

export async function sendInvoice(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("*, client:clients(name, email, phone)")
      .eq("id", safeId)
      .single();

    if (fetchError) return { success: false, error: fetchError.message };
    if (!invoice) return { success: false, error: "Invoice not found" };
    if (!invoice.client?.email) return { success: false, error: "Client has no email address" };

    const shareToken = randomUUID();
    const previewUrl = `${getSiteUrl()}/preview/invoice/${safeId}?token=${shareToken}`;

    await sendInvoiceEmail(invoice, invoice.client, previewUrl);

    const { error } = await supabase
      .from("invoices")
      .update({ status: "sent", sent_at: new Date().toISOString(), share_token: shareToken })
      .eq("id", safeId);

    if (error) return { success: false, error: error.message };

    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    console.error("sendInvoice error:", err);
    return { success: false, error: err.message || "Failed to send invoice" };
  }
}

export async function markInvoiceAsPaid(id, paidAt) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);
  const safeDate = paidAt || new Date().toISOString();

  const { error } = await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: safeDate })
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/invoices");
}

export async function markInvoiceAsOverdue(ids) {
  const supabase = await getSupabase();
  const idList = Array.isArray(ids) ? ids : [ids];
  const safeIds = idList.map((id) => idSchema.parse(id));
  if (safeIds.length === 0) return;

  const { error } = await supabase
    .from("invoices")
    .update({ status: "overdue" })
    .in("id", safeIds);

  if (error) throw error;
  revalidateAdmin("/admin/invoices");
}

export async function cancelInvoice(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { error } = await supabase
    .from("invoices")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/invoices");
}

export async function updateInvoiceStatus(id, status) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);
  const safeStatus = statusSchema(VALID_INVOICE_STATUSES).parse(status);

  const { error } = await supabase
    .from("invoices")
    .update({ status: safeStatus, updated_at: new Date().toISOString() })
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/invoices");
}

export async function createProject(formData) {
  const supabase = await getSupabase();
  const data = validateFormData(projectSchema, formData);

  const { error } = await supabase.from("projects").insert({
    client_id: data.client_id,
    name: data.name,
    description: data.description,
    status: data.status || "planning",
    start_date: data.start_date,
    deadline: data.deadline,
    budget: data.budget,
    services: data.services || null,
    notes: data.notes,
  });

  if (error) throw error;
  revalidateAdmin("/admin/projects");
}

export async function updateProject(formData) {
  const supabase = await getSupabase();
  const data = validateFormData(projectSchema, formData);

  const { error } = await supabase
    .from("projects")
    .update({
      client_id: data.client_id,
      name: data.name,
      description: data.description,
      status: data.status || "planning",
      start_date: data.start_date,
      deadline: data.deadline,
      budget: data.budget,
      services: data.services || null,
      notes: data.notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (error) throw error;
  revalidateAdmin("/admin/projects");
}

export async function deleteProject(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", safeId);

  if (error) throw error;
  revalidateAdmin("/admin/projects");
}

function resolveOrder(col, dir, sort) {
  const validCols = [
    "name", "email", "status", "created_at", "invoice_number",
    "total", "budget", "deadline", "title", "company", "phone",
  ];
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

export async function getLeadsPaginated(params) {
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase.from("leads").select("*", { count: "exact" });
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getClientsPaginated(params) {
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase.from("clients").select("*", { count: "exact" });
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getProposalsPaginated(params) {
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase
    .from("proposals")
    .select("*, lead:leads(name, email, phone, company)", { count: "exact" });
  if (search) query = query.or(`title.ilike.%${search}%,lead.name.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getInvoicesPaginated(params) {
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase
    .from("invoices")
    .select("*, client:clients(name, email, phone, company), proposal:proposals(id, title)", { count: "exact" });
  if (search) query = query.or(`invoice_number.ilike.%${search}%,client.name.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function getProjectsPaginated(params) {
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase
    .from("projects")
    .select("*, client:clients(name, email, company)", { count: "exact" });
  if (search) query = query.or(`name.ilike.%${search}%,client.name.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) return { data: [], total: 0 };
  return { data: data || [], total: count || 0 };
}

export async function ensureShareToken(type, id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    if (type !== "proposal" && type !== "invoice") {
      return { token: null };
    }

    const table = type === "proposal" ? "proposals" : "invoices";

    const { data: existing } = await supabase
      .from(table)
      .select("share_token")
      .eq("id", safeId)
      .single();

    if (existing?.share_token) {
      return { token: existing.share_token };
    }

    const token = randomUUID();
    const { error } = await supabase
      .from(table)
      .update({ share_token: token })
      .eq("id", safeId);

    if (error) return { token: null };
    return { token };
  } catch {
    return { token: null };
  }
}
