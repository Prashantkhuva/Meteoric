"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSiteUrl } from "@/config/site-url";
import { sendProposalEmail, sendInvoiceEmail, sendOverdueReminder, sendClientWelcome, sendHotLeadAlert, sendCustomEmail } from "@/lib/email/email";
import { callAIJson } from "@/lib/ai/provider";
import { scoreLeadPrompt } from "@/lib/ai/prompts";
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
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeStatus = statusSchema(VALID_LEAD_STATUSES).parse(status);

    const { error } = await supabase
      .from("leads")
      .update({ status: safeStatus })
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/leads");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update lead status" };
  }
}

export async function addLead(formData) {
  const supabase = await getSupabase();

  let data;
  try {
    data = validateFormData(leadSchema, formData);
  } catch (err) {
    return { error: err.message };
  }

  if (data.email) {
    const safeEmail = emailSchema.parse(data.email);
    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("email", safeEmail)
      .maybeSingle();
    if (existing) return { error: "A lead with this email already exists" };
  }

  const { error } = await supabase.from("leads").insert({
    name: data.name,
    email: data.email || null,
    phone: data.phone,
    services: data.services,
    budget: data.budget,
    status: "inquiry",
  });

  if (error) return { error: error.message };

  let aiScore = null;
  let aiCategory = null;
  let aiSummary = null;

  if (process.env.GOOGLE_API && data.email) {
    try {
      const prompt = scoreLeadPrompt(data);
      const aiRes = await callAIJson(prompt.system, prompt.user);
      if (aiRes && typeof aiRes.score === "number") {
        aiScore = aiRes.score;
        aiCategory = aiRes.category || null;
        aiSummary = aiRes.summary || null;
        await supabase
          .from("leads")
          .update({
            ai_score: aiScore,
            ai_category: aiCategory,
            ai_summary: aiSummary,
          })
          .eq("email", data.email)
          .is("ai_score", null);
      }
    } catch (aiErr) {
      console.warn("[ai] lead scoring failed:", aiErr?.message);
    }
  }

  if (process.env.RESEND_API_KEY && aiScore >= 70 && aiCategory !== "spam") {
    sendHotLeadAlert(data, aiScore, aiCategory, aiSummary).catch(() => {});
  }

  revalidateAdmin("/admin/leads");
  return { success: true };
}

export async function updateLead(formData) {
  const supabase = await getSupabase();
  const raw = Object.fromEntries(formData.entries());

  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/leads");
  } catch (err) {
    return { error: err.message || "Failed to update lead" };
  }
}

export async function convertLeadToClient(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { data: lead, error: fetchError } = await supabase
      .from("leads")
      .select("name, email, phone, company, status")
      .eq("id", safeId)
      .single();

    if (fetchError || !lead) return { error: "Lead not found" };
    if (lead.status === "completed") return { error: "Lead has already been converted" };

    if (lead.email) {
      const safeEmail = emailSchema.parse(lead.email);
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("email", safeEmail)
        .maybeSingle();
      if (existing) return { error: "A client with this email already exists" };
    }

    const { error: insertError } = await supabase.from("clients").insert({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: "onboarding",
    });

    if (insertError) return { error: insertError.message };

    const { error: updateError } = await supabase
      .from("leads")
      .update({ status: "completed" })
      .eq("id", safeId);

    if (updateError) return { error: updateError.message };

    if (process.env.RESEND_API_KEY && lead.email) {
      try {
        await sendClientWelcome({ name: lead.name, email: lead.email });
      } catch (welcomeErr) {
        console.warn("[email] client welcome failed:", welcomeErr?.message);
      }
    }

    revalidateAdmin("/admin/leads", "/admin/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to convert lead to client" };
  }
}

export async function deleteLead(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/leads");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to delete lead" };
  }
}

export async function updateClientStatus(id, status) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeStatus = statusSchema(VALID_CLIENT_STATUSES).parse(status);

    const { error } = await supabase
      .from("clients")
      .update({ status: safeStatus })
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update client status" };
  }
}

export async function addClient(formData) {
  try {
    const supabase = await getSupabase();
    const data = validateFormData(clientSchema, formData);

    if (data.email) {
      const safeEmail = emailSchema.parse(data.email);
      const { data: existing } = await supabase
        .from("clients")
        .select("id")
        .eq("email", safeEmail)
        .maybeSingle();
      if (existing) return { error: "A client with this email already exists" };
    }

    const { error } = await supabase.from("clients").insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      company: data.company,
      status: "onboarding",
    });

    if (error) return { error: error.message };
    revalidateAdmin("/admin/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to add client" };
  }
}

export async function updateClient(formData) {
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update client" };
  }
}

export async function deleteClient(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { data, error } = await supabase
      .from("clients")
      .delete()
      .eq("id", safeId)
      .select("id");

    if (error) return { error: error.message };
    if (!data || data.length === 0) return { error: "Client was not deleted (0 rows affected)" };

    revalidateAdmin("/admin/clients");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to delete client" };
  }
}

export async function updateBookingStatus(bookingId, status) {
  const key = process.env.CALCOM_API_KEY;
  if (!key) return { error: "CALCOM_API_KEY not set" };

  const baseUrl = `https://api.cal.com/v2/bookings/${bookingId}`;

  const endpoint = status === "accepted"
    ? `${baseUrl}/confirm`
    : `${baseUrl}/cancel`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "cal-api-version": "2024-08-13",
        "Content-Type": "application/json",
      },
      body: status === "rejected" ? JSON.stringify({ cancellationReason: "Cancelled by admin" }) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.error?.message || `Cal.com API error: ${res.status}` };
    }

    revalidateAdmin("/admin/cal-bookings");
    return { success: true };
  } catch (err) {
    console.error("[updateBookingStatus]", err);
    return { error: err.message };
  }
}

export async function createLeadFromBooking(formData) {
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/leads");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to create lead from booking" };
  }
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

export async function generateProposalDraft(leadId) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(leadId);

  const { data: lead, error } = await supabase
    .from("leads")
    .select("name, email, phone, company, services, budget, details")
    .eq("id", safeId)
    .single();

  if (error || !lead) throw new Error("Lead not found");

  if (!process.env.GOOGLE_API) {
    return {
      title: `${lead.services || "Web Development"} — Proposal`,
      content: `<p>We propose delivering a tailored solution for ${lead.company || lead.name} covering ${lead.services || "web development"} within your budget of ${lead.budget || "market rate"}.</p>`,
      pricing: [{ description: lead.services || "Web Development", quantity: 1, rate: 2500 }],
      timeline: "4-6 weeks",
      terms: "50% deposit to start, net 30 on completion",
    };
  }

  const { callAIJson } = await import("@/lib/ai/provider");
  const { proposalDraftPrompt } = await import("@/lib/ai/prompts");
  const prompt = proposalDraftPrompt(lead);
  const result = await callAIJson(prompt.system, prompt.user);

  return {
    title: result?.title || `${lead.services || "Web Development"} — Proposal`,
    content: result?.content
      ? `<p>${result.content.replace(/\n/g, "</p><p>")}</p>`
      : `<p>Proposal for ${lead.company || lead.name}.</p>`,
    pricing: result?.pricing?.length ? result.pricing : [{ description: lead.services || "Web Development", quantity: 1, rate: 2500 }],
    timeline: result?.timeline || "4-6 weeks",
    terms: result?.terms || "50% deposit to start, net 30 on completion",
  };
}

export async function getProposalPricing(id) {
  const supabase = await getSupabase();
  const safeId = idSchema.parse(id);

  const { data, error } = await supabase
    .from("proposals")
    .select("pricing, title, lead:leads(name, email, phone, company)")
    .eq("id", safeId)
    .single();

  if (error) return null;
  return data;
}

export async function createProposal(formData) {
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/proposals");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to create proposal" };
  }
}

export async function updateProposal(formData) {
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/proposals");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update proposal" };
  }
}

export async function deleteProposal(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { error } = await supabase
      .from("proposals")
      .delete()
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/proposals");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to delete proposal" };
  }
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
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeStatus = statusSchema(VALID_PROPOSAL_STATUSES).parse(status);

    const { error } = await supabase
      .from("proposals")
      .update({ status: safeStatus, updated_at: new Date().toISOString() })
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/proposals");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update proposal status" };
  }
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
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to create invoice" };
  }
}

export async function updateInvoice(formData) {
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update invoice" };
  }
}

export async function deleteInvoice(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { error } = await supabase
      .from("invoices")
      .delete()
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to delete invoice" };
  }
}

export async function checkOverdueInvoices() {
  const supabase = await getSupabase();

  const { data: overdue, error } = await supabase
    .from("invoices")
    .select("*, client:clients(name, email, phone, company)")
    .eq("status", "sent")
    .lt("due_date", new Date().toISOString())
    .or(`last_reminder_sent_at.is.null,last_reminder_sent_at.lt.${new Date(Date.now() - 86400000 * 3).toISOString()}`);

  if (error) {
    console.error("[overdue] query failed:", error);
    return { sent: 0, errors: [error.message] };
  }

  const errors = [];
  let sent = 0;

  for (const invoice of overdue || []) {
    if (!invoice.client?.email) continue;

    const shareToken = invoice.share_token || randomUUID();
    const previewUrl = `${getSiteUrl()}/preview/invoice/${invoice.id}?token=${shareToken}`;

    try {
      await sendOverdueReminder(invoice, invoice.client, previewUrl);
      await supabase
        .from("invoices")
        .update({
          last_reminder_sent_at: new Date().toISOString(),
          reminder_count: (invoice.reminder_count || 0) + 1,
          share_token: invoice.share_token || shareToken,
        })
        .eq("id", invoice.id);
      sent++;
    } catch (e) {
      errors.push(e.message);
    }
  }

  return { sent, errors };
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
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeDate = paidAt || new Date().toISOString();

    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid", paid_at: safeDate })
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to mark invoice as paid" };
  }
}

export async function markInvoiceAsOverdue(ids) {
  try {
    const supabase = await getSupabase();
    const idList = Array.isArray(ids) ? ids : [ids];
    const safeIds = idList.map((id) => idSchema.parse(id));
    if (safeIds.length === 0) return { success: true };

    const { error } = await supabase
      .from("invoices")
      .update({ status: "overdue" })
      .in("id", safeIds);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to mark invoices as overdue" };
  }
}

export async function cancelInvoice(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { error } = await supabase
      .from("invoices")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to cancel invoice" };
  }
}

export async function updateInvoiceStatus(id, status) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeStatus = statusSchema(VALID_INVOICE_STATUSES).parse(status);

    const { error } = await supabase
      .from("invoices")
      .update({ status: safeStatus, updated_at: new Date().toISOString() })
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update invoice status" };
  }
}

export async function createProject(formData) {
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/projects");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to create project" };
  }
}

export async function updateProject(formData) {
  try {
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

    if (error) return { error: error.message };
    revalidateAdmin("/admin/projects");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update project" };
  }
}

export async function deleteProject(id) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", safeId);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/projects");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to delete project" };
  }
}

export async function updateProjectStatus(id, newStatus) {
  try {
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const { error } = await supabase
      .from("projects")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", safeId);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/projects");
    return { success: true };
  } catch (err) {
    return { error: err.message || "Failed to update project status" };
  }
}

function resolveOrder(col, dir, sort) {
  const validCols = [
    "name", "email", "status", "created_at", "invoice_number",
    "total", "budget", "deadline", "title", "company", "phone", "ai_score",
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
  const { page, pageSize, search, status, score: scoreFilter, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase.from("leads").select("*", { count: "exact" });
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  if (status !== "all") query = query.eq("status", status);
  if (scoreFilter === "hot") query = query.gte("ai_score", 70);
  else if (scoreFilter === "warm") query = query.gte("ai_score", 40).lt("ai_score", 70);
  else if (scoreFilter === "cold") query = query.gte("ai_score", 0).lt("ai_score", 40);
  else if (scoreFilter === "scored") query = query.not("ai_score", "is", null);
  else if (scoreFilter === "unscored") query = query.is("ai_score", null);
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

export async function getRecipients() {
  try {
    const supabase = await getSupabase();
    const [leads, clients] = await Promise.all([
      supabase.from("leads").select("id, name, email").not("email", "is", null),
      supabase.from("clients").select("id, name, email").not("email", "is", null),
    ]);

    const recipients = [
      ...(leads.data || []).map((l) => ({ id: l.id, name: l.name, email: l.email, type: "lead" })),
      ...(clients.data || []).map((c) => ({ id: c.id, name: c.name, email: c.email, type: "client" })),
    ].filter((r) => r.email);

    return { data: recipients };
  } catch {
    return { data: [] };
  }
}

export async function sendCustomEmailAction(formData) {
  try {
    const supabase = await getSupabase();
    const from = formData.get("from");
    const toRaw = formData.get("to");
    const to = toRaw ? JSON.parse(toRaw) : [];
    const subject = formData.get("subject");
    const body = formData.get("body");
    const leadId = formData.get("lead_id") || null;
    const clientId = formData.get("client_id") || null;

    if (!from || !to.length || !subject || !body) {
      return { error: "From, to, subject, and body are required" };
    }

    const files = formData.getAll("attachments");
    const uploaded = [];
    for (const file of files) {
      if (!file || typeof file === "string" || file.size === 0) continue;
      try {
        const path = `attachments/${Date.now()}-${file.name}`;
        const { data, error: uploadErr } = await supabase.storage
          .from("email-attachments")
          .upload(path, file);
        if (!uploadErr && data) {
          const { data: urlData } = supabase.storage
            .from("email-attachments")
            .getPublicUrl(data.path);
          uploaded.push({ name: file.name, size: file.size, url: urlData.publicUrl });
        }
      } catch (uploadErr) {
        console.warn("[actions] file upload failed, continuing without:", uploadErr.message);
      }
    }

    let result;
    try {
      result = await sendCustomEmail({
        from,
        to,
        subject,
        html: body,
        attachments: uploaded.map((f) => ({
          filename: f.name,
          content: f.url,
        })),
      });
    } catch (sendErr) {
      console.error("[actions] sendCustomEmail failed:", sendErr);
      return { error: sendErr.message || "Failed to send email via Resend" };
    }

    try {
      await supabase.from("sent_emails").insert({
        from_address: `${from}@withmeteoric.com`,
        to_addresses: to,
        subject,
        body,
        attachments: uploaded.length ? uploaded : null,
        resend_id: result?.data?.id || null,
        status: "sent",
        lead_id: leadId,
        client_id: clientId,
      });
    } catch (logErr) {
      console.warn("[actions] failed to log sent email:", logErr.message);
    }

    return { success: true, id: result?.data?.id };
  } catch (err) {
    console.error("[actions] sendCustomEmailAction failed:", err);
    return { error: err.message || "Failed to send email" };
  }
}

export async function getSentEmails(page = 1, pageSize = 15) {
  try {
    const supabase = await getSupabase();
    const from = (page - 1) * pageSize;

    const { data, count } = await supabase
      .from("sent_emails")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    return { data: data || [], total: count || 0 };
  } catch {
    return { data: [], total: 0 };
  }
}
