"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import { after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { generateAutoPassword } from "@/lib/utils/generate-password";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSiteUrl } from "@/config/site-url";
import { sanitizeEmailHtml } from "@/lib/sanitize";
import { sendProposalEmail, sendInvoiceEmail, sendOverdueReminder, sendClientWelcome, sendHotLeadAlert, sendCustomEmail, sendPaymentConfirmation, sendInvitationEmail } from "@/lib/email/email";
import { callAIJson } from "@/lib/ai/provider";
import { getExchangeRate } from "@/lib/exchange-rate";
import { scoreLeadPrompt } from "@/lib/ai/prompts";
import { sanitizeSearch } from "@/lib/search";
import { assertCan, getCallerPermissions } from "@/lib/admin-permissions";
import { createNotification, NOTIFICATION_TYPES } from "@/lib/notifications";
import { runDecisionForLead, runDecisionsForLeads } from "@/lib/decisions";
import {
  getDecisionAccuracy,
  getRecentDecisions,
  recordDecisionReview,
} from "@/lib/decisions/store";
import {
  idSchema,
  emailSchema,
  leadSchema,
  clientSchema,
  proposalSchema,
  invoiceSchema,
  projectSchema,
  bankAccountSchema,
  paginationSchema,
  statusSchema,
  validateFormData,
  sanitizeProposalContent,
  sanitizePricing,
  VALID_LEAD_STATUSES,
  VALID_CLIENT_STATUSES,
  VALID_PROPOSAL_STATUSES,
  VALID_INVOICE_STATUSES,
  VALID_PROJECT_STATUSES,
  VALID_REVIEW_STATUSES,
  normalizeImportStatus,
  normalizeImportSource,
} from "@/lib/admin-validation";

async function getSupabase() {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");
  return supabase;
}

function getAdminClient() {
  const supabase = createServiceClient();
  if (!supabase) throw new Error("Service role key not configured");
  return supabase;
}

function revalidateAdmin(...paths: string[]) {
  paths.forEach((p) => revalidatePath(p));
  revalidatePath("/admin");
}

async function isRateLimited(supabase: Awaited<ReturnType<typeof getSupabase>>, scope: string, email: string | null | undefined, maxPerMinute = 5) {
  const since = new Date(Date.now() - 60000).toISOString();

  if (scope === "sent_emails") {
    const { count } = await supabase
      .from("sent_emails")
      .select("id", { count: "exact", head: true })
      .gte("created_at", since);
    if ((count || 0) >= maxPerMinute) return true;

    if (email) {
      const { count: perRecipient } = await supabase
        .from("sent_emails")
        .select("id", { count: "exact", head: true })
        .gte("created_at", since)
        .contains("to_addresses", [email]);
      if ((perRecipient || 0) >= 2) return true;
    }
    return false;
  }

  const { count } = await supabase
    .from(scope)
    .select("id", { count: "exact", head: true })
    .gte("sent_at", since);
  return (count || 0) >= maxPerMinute;
}

export async function signOut() {
  const supabase = await getSupabase();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateLeadStatus(id: number | string, status: string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to update lead status" };
  }
}

export async function addLead(formData: FormData) {
  const denied = await assertCan("write");
  if (denied) return denied;
  const supabase = await getSupabase();

  let data;
  try {
    data = validateFormData(leadSchema, formData);
  } catch (err) {
    return { error: (err as Error).message };
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

  const { data: inserted, error } = await supabase
    .from("leads")
    .insert({
      name: data.name,
      email: data.email || null,
      phone: data.phone,
      company: data.company,
      services: data.services,
      budget: data.budget,
      currency: data.currency || "USD",
      details: data.details,
      notes: data.notes || null,
      follow_up_at: data.follow_up_at || null,
      follow_up_time: data.follow_up_time || null,
      follow_up_note: data.follow_up_note || null,
      follow_up_status: data.follow_up_status || null,
      source: data.source || "manual",
      status: "inquiry",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  after(() => runDecisionForLead({ ...data, id: inserted?.id, status: "inquiry" }));

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
      console.warn("[ai] lead scoring failed:", (aiErr as Error)?.message);
    }
  }

  if (process.env.RESEND_API_KEY && aiScore >= 70 && aiCategory !== "spam") {
    sendHotLeadAlert(data, aiScore, aiCategory, aiSummary).catch(() => {});
  }

  revalidateAdmin("/admin/leads");
  return { success: true };
}

const IMPORT_CHUNK_SIZE = 50;
const IMPORT_MAX_ROWS = 1000;

export async function importLeads(rows: unknown) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    if (!Array.isArray(rows) || rows.length === 0) return { error: "No rows provided" };
    if (rows.length > IMPORT_MAX_ROWS) return { error: `Maximum ${IMPORT_MAX_ROWS} rows per import` };

    const prepared = [];
    const errors = [];
    const seenEmails = new Set();

    for (let i = 0; i < rows.length; i++) {
      const raw = rows[i] || {};
      const rowNum = i + 2;

      const name = raw.name != null ? String(raw.name).trim() : "";
      if (!name) {
        errors.push({ row: rowNum, reason: "Missing name" });
        continue;
      }

      const email = raw.email != null ? String(raw.email).trim().toLowerCase() : "";
      if (email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          errors.push({ row: rowNum, reason: `Invalid email: ${email}` });
          continue;
        }
        if (seenEmails.has(email)) {
          errors.push({ row: rowNum, reason: "Duplicate email within file" });
          continue;
        }
        seenEmails.add(email);
      }

      let status = "inquiry";
      if (raw.status != null && String(raw.status).trim()) {
        const mapped = normalizeImportStatus(raw.status);
        if (!mapped) {
          errors.push({ row: rowNum, reason: `Unknown status: ${String(raw.status).trim()}` });
          continue;
        }
        status = mapped;
      }

      const sourceRaw = raw.source != null ? String(raw.source).trim().toLowerCase() : "";
      const source = sourceRaw ? normalizeImportSource(sourceRaw) : "csv_import";

      try {
        const data = leadSchema.parse({ ...raw, name, email, source });
        prepared.push({ row: rowNum, data: { ...data, email: email || null, status, source: source || "csv_import" } });
      } catch (err) {
        errors.push({ row: rowNum, reason: (err as Error).message || "Invalid row" });
      }
    }

    const emailsToCheck = prepared.filter((p) => p.data.email).map((p) => p.data.email);
    const existingEmails = new Set();
    if (emailsToCheck.length) {
      const { data: existing } = await supabase
        .from("leads")
        .select("email")
        .in("email", emailsToCheck);
      (existing || []).forEach((e) => { if (e.email) existingEmails.add(e.email); });
    }

    const final = [];
    for (const item of prepared) {
      if (item.data.email && existingEmails.has(item.data.email)) {
        errors.push({ row: item.row, reason: "Already exists in database" });
      } else {
        final.push(item);
      }
    }

    let imported = 0;
    const decisionLeads: any[] = [];
    for (let i = 0; i < final.length; i += IMPORT_CHUNK_SIZE) {
      const chunk = final.slice(i, i + IMPORT_CHUNK_SIZE).map((item) => item.data);
      const { data: inserted, error } = await supabase
        .from("leads")
        .insert(chunk)
        .select("id, name, email, company, services, budget, details, source, status");
      if (error) {
        errors.push({ row: 0, reason: `Batch insert failed: ${error.message}` });
        break;
      }
      for (const row of inserted || []) decisionLeads.push(row);
      imported += chunk.length;
    }

    if (decisionLeads.length) after(() => runDecisionsForLeads(decisionLeads));

    revalidateAdmin("/admin/leads");
    return { success: true, imported, skipped: errors.length, errors };
  } catch (err) {
    return { error: (err as Error).message || "Failed to import leads" };
  }
}

export async function getDecisionsAccuracy() {
  const denied = await assertCan("view");
  if (denied) return denied;
  try {
    return { success: true, data: await getDecisionAccuracy() };
  } catch (err) {
    return { error: (err as Error).message || "Failed to load accuracy" };
  }
}

export async function getDecisionsRecent() {
  const denied = await assertCan("view");
  if (denied) return denied;
  try {
    return { success: true, data: await getRecentDecisions(50) };
  } catch (err) {
    return { error: (err as Error).message || "Failed to load decisions" };
  }
}

export async function reviewDecision(id: number | string, verdict: string) {
  const denied = await assertCan("write");
  if (denied) return denied;
  try {
    const safeId = idSchema.parse(id);
    if (verdict !== "agree" && verdict !== "disagree") return { error: "Invalid verdict" };
    const caller = await getCallerPermissions();
    await recordDecisionReview({ decisionId: safeId, verdict, reviewerId: caller?.userId || null });
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to record review" };
  }
}

export async function updateLead(formData: FormData) {
  const denied = await assertCan("write");
  if (denied) return denied;
  const supabase = await getSupabase();
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());

  try {
    raw.id = idSchema.parse(raw.id);
    const data = leadSchema.parse(raw);

    const { error } = await supabase
      .from("leads")
      .update({
        name: data.name,
        email: data.email || null,
        phone: data.phone,
        company: data.company,
        services: data.services,
        budget: data.budget,
        currency: data.currency || "USD",
        details: data.details,
        notes: data.notes || null,
        follow_up_at: data.follow_up_at || null,
        follow_up_time: data.follow_up_time || null,
        follow_up_note: data.follow_up_note || null,
        follow_up_status: data.follow_up_status || null,
        source: data.source || null,
      })
      .eq("id", raw.id);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/leads");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update lead" };
  }
}

export async function updateLeadFollowUp(formData: FormData) {
  const denied = await assertCan("write");
  if (denied) return denied;
  const supabase = await getSupabase();
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());

  try {
    raw.id = idSchema.parse(raw.id);
    const status = z
      .enum(["pending", "completed", "rescheduled", "skipped"])
      .parse(raw.follow_up_status);

    const patch: Record<string, unknown> = { follow_up_status: status };
    if (typeof raw.follow_up_at === "string") {
      patch.follow_up_at = leadSchema.shape.follow_up_at.parse(raw.follow_up_at);
    }
    if (typeof raw.follow_up_time === "string") {
      patch.follow_up_time = leadSchema.shape.follow_up_time.parse(raw.follow_up_time);
    }

    const { error } = await supabase.from("leads").update(patch).eq("id", raw.id);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/leads");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update follow-up" };
  }
}

export async function convertLeadToClient(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
        console.warn("[email] client welcome failed:", (welcomeErr as Error)?.message);
      }
    }

    revalidateAdmin("/admin/leads", "/admin/clients");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to convert lead to client" };
  }
}

export async function deleteLead(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to delete lead" };
  }
}

export async function updateClientStatus(id: number | string, status: string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to update client status" };
  }
}

export async function addClient(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to add client" };
  }
}

export async function updateClient(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
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
    return { error: (err as Error).message || "Failed to update client" };
  }
}

export async function deleteClient(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to delete client" };
  }
}

export async function updateBookingStatus(bookingId: number | string, status: string) {
  const denied = await assertCan("write");
  if (denied) return denied;
  const key = process.env.CALCOM_API_KEY;
  if (!key) return { error: "CALCOM_API_KEY not set" };

  let safeStatus;
  let safeId;
  try {
    safeStatus = statusSchema(["accepted", "rejected"]).parse(status);
    // Cal.com v2 uses string UIDs — accept both numbers and strings
    safeId = z.string().min(1).parse(String(bookingId));
  } catch (err) {
    return { error: (err as Error).message || "Invalid booking or status" };
  }

  const baseUrl = `https://api.cal.com/v2/bookings/${safeId}`;

  const endpoint = safeStatus === "accepted"
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
      body: safeStatus === "rejected" ? JSON.stringify({ cancellationReason: "Cancelled by admin" }) : undefined,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { error: err.error?.message || `Cal.com API error: ${res.status}` };
    }

    revalidateAdmin("/admin/cal-bookings");
    return { success: true };
  } catch (err) {
    console.error("[updateBookingStatus]", err);
    return { error: (err as Error).message };
  }
}

export async function createLeadFromBooking(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const data = validateFormData(leadSchema, formData);

    const { error } = await supabase.from("leads").insert({
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      company: data.company || null,
      services: data.services || "",
      budget: data.budget || "",
      source: "cal.com",
      status: "inquiry",
    });

    if (error) return { error: error.message };
    revalidateAdmin("/admin/leads");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to create lead from booking" };
  }
}

export async function getLeads() {
  const denied = await assertCan("view");
  if (denied) return denied;
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("leads")
    .select("id, name, email, company, notes, follow_up_at")
    .order("name", { ascending: true })
    .limit(200);
  return data || [];
}

export async function getClients() {
  const denied = await assertCan("view");
  if (denied) return denied;
  const supabase = await getSupabase();
  const { data } = await supabase
    .from("clients")
    .select("id, name, email, phone, company")
    .order("name", { ascending: true })
    .limit(200);
  return data || [];
}

export async function generateProposalDraft(leadId: number | string) {
  const denied = await assertCan("write");
  if (denied) return denied;
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

export async function getProposalPricing(id: number | string) {
  const denied = await assertCan("view");
  if (denied) return denied;
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

export async function createProposal(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const data = validateFormData(proposalSchema, formData);

      const content = data.content
      ? sanitizeProposalContent(data.content)
      : null;

    const pricing = sanitizePricing(data.pricing);

    const { error } = await supabase.from("proposals").insert({
      lead_id: data.lead_id,
      title: data.title,
      status: "draft",
      content,
      pricing,
      currency: data.currency || "USD",
      timeline: data.timeline,
      terms: data.terms,
    });

    if (error) return { error: error.message };
    revalidateAdmin("/admin/proposals");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to create proposal" };
  }
}

export async function updateProposal(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const data = validateFormData(proposalSchema, formData);

    const content = data.content
      ? sanitizeProposalContent(data.content)
      : null;

    const pricing = sanitizePricing(data.pricing);

    const { error } = await supabase
      .from("proposals")
      .update({
        lead_id: data.lead_id,
        title: data.title,
        status: data.status || "draft",
        content,
        pricing,
        currency: data.currency || "USD",
        timeline: data.timeline,
        terms: data.terms,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/proposals");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update proposal" };
  }
}

export async function deleteProposal(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to delete proposal" };
  }
}

export async function sendProposal(id: number | string) {
  try {
    const denied = await assertCan("send_email");
    if (denied) return denied;
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

    if (await isRateLimited(supabase, "proposals", proposal.lead.email)) {
      return { success: false, error: "Too many proposal emails sent recently. Try again in a minute." };
    }

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
    return { success: false, error: (err as Error).message || "Failed to send proposal" };
  }
}

export async function updateProposalStatus(id: number | string, status: string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to update proposal status" };
  }
}

function parseFormData(formData: FormData) {
  const raw: Record<string, unknown> = Object.fromEntries(formData.entries());
  if (typeof raw.items === "string") {
    try {
      raw.items = JSON.parse(raw.items);
    } catch {
      raw.items = [];
    }
  }
  return raw;
}

export async function createInvoice(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const data = invoiceSchema.parse(parseFormData(formData));

    const { data: latest } = await supabase
      .from("invoices")
      .select("invoice_number")
      .order("id", { ascending: false })
      .limit(1);

    let seq = 1;
    const lastMatch = latest?.[0]?.invoice_number?.match(/^INV-(\d{4})/i);
    if (lastMatch) seq = parseInt(lastMatch[1], 10) + 1;
    const ts = Date.now().toString(36).toUpperCase();
    const invoiceNumber = `INV-${String(seq).padStart(4, "0")}-${ts}`;

    const subtotal = data.items.reduce(
      (s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0),
      0
    );
    const total = subtotal + data.tax;
    const exchange_rate_to_usd = await getExchangeRate(data.currency, new Date());

    const { error } = await supabase.from("invoices").insert({
      client_id: data.client_id,
      proposal_id: data.proposal_id,
      bank_account_id: data.bank_account_id,
      invoice_number: invoiceNumber,
      status: "draft",
      items: data.items,
      subtotal,
      tax: data.tax,
      total,
      currency: data.currency,
      exchange_rate_to_usd,
      notes: data.notes,
      terms: data.terms,
      due_date: data.due_date,
    });

    if (error) return { error: error.message };
    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to create invoice" };
  }
}

export async function updateInvoice(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const data = invoiceSchema.parse(parseFormData(formData));

    const subtotal = data.items.reduce(
      (s, i) => s + (Number(i.quantity) || 0) * (Number(i.rate) || 0),
      0
    );
    const total = subtotal + data.tax;
    const exchange_rate_to_usd = await getExchangeRate(data.currency, new Date());

    const { error } = await supabase
      .from("invoices")
      .update({
        client_id: data.client_id,
        proposal_id: data.proposal_id,
        bank_account_id: data.bank_account_id,
        status: data.status || "draft",
        items: data.items,
        subtotal,
        tax: data.tax,
        total,
        currency: data.currency,
        exchange_rate_to_usd,
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
    return { error: (err as Error).message || "Failed to update invoice" };
  }
}

export async function deleteInvoice(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to delete invoice" };
  }
}

export async function checkOverdueInvoices() {
  const supabase = await getSupabase();

  const { data: overdue, error } = await supabase
    .from("invoices")
    .select("*, client:clients(name, email, phone, company), bank_account:bank_accounts(*)")
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
    await createNotification({
      type: NOTIFICATION_TYPES.INVOICE_OVERDUE,
      title: `Overdue · ${invoice.invoice_number || `#${invoice.id}`}`,
      body:
        invoice.total != null
          ? `${invoice.currency || "USD"} ${Number(invoice.total).toFixed(2)}${invoice.client?.name ? ` — ${invoice.client.name}` : ""}`
          : null,
      entityType: "invoice",
      entityId: invoice.id,
      dedupeKey: `invoice_overdue:${invoice.id}`,
    });

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
      errors.push((e as Error).message);
    }
  }

  return { sent, errors };
}

export async function sendInvoice(id: number | string) {
  try {
    const denied = await assertCan("send_email");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("*, client:clients(name, email, phone), bank_account:bank_accounts(*)")
      .eq("id", safeId)
      .single();

    if (fetchError) return { success: false, error: fetchError.message };
    if (!invoice) return { success: false, error: "Invoice not found" };
    if (!invoice.client?.email) return { success: false, error: "Client has no email address" };

    if (await isRateLimited(supabase, "invoices", invoice.client.email)) {
      return { success: false, error: "Too many invoice emails sent recently. Try again in a minute." };
    }

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
    return { success: false, error: (err as Error).message || "Failed to send invoice" };
  }
}

export async function markInvoiceAsPaid(id: number | string, paidAt?: string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeDate = z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}/, "Invalid date format")
      .optional()
      .transform((v) => v || new Date().toISOString())
      .parse(paidAt);

    const { error } = await supabase
      .from("invoices")
      .update({ status: "paid", paid_at: safeDate })
      .eq("id", safeId);

    if (error) return { error: error.message };

    const { data: paidInvoiceRow } = await supabase
      .from("invoices")
      .select("invoice_number, total, currency, client:clients(name)")
      .eq("id", safeId)
      .single();
    const paidInvoice = paidInvoiceRow as unknown as {
      invoice_number?: string;
      total?: number;
      currency?: string;
      client?: { name?: string } | null;
    } | null;

    await createNotification({
      type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
      title: `Payment received · ${paidInvoice?.invoice_number || `#${safeId}`}`,
      body:
        paidInvoice?.total != null
          ? `${paidInvoice.currency || "USD"} ${Number(paidInvoice.total).toFixed(2)}${paidInvoice?.client?.name ? ` — ${paidInvoice.client.name}` : ""}`
          : null,
      entityType: "invoice",
      entityId: safeId,
    });

    let whatsappUrl = null;
    try {
      const { data: invoice } = await supabase
        .from("invoices")
        .select("*, client:clients(name, email, phone), bank_account:bank_accounts(*)")
        .eq("id", safeId)
        .single();

      if (invoice?.client) {
        const shareToken = invoice.share_token || randomUUID();

        await supabase
          .from("invoices")
          .update({ share_token: shareToken })
          .eq("id", safeId)
          .is("share_token", null);

        await sendPaymentConfirmation(
          { ...invoice, paid_at: safeDate },
          invoice.client
        );

        if (invoice.client.phone) {
          const phone = invoice.client.phone.replace(/[^0-9]/g, "");
          const pdfUrl = `${getSiteUrl()}/api/pdf/invoice/${safeId}?token=${shareToken}`;
          const msg = encodeURIComponent(
            `Hi ${invoice.client.name || "there"}!\n\nPayment received for Invoice ${invoice.invoice_number}\nAmount: ${invoice.currency || "USD"} ${Number(invoice.total).toFixed(2)}\n\nThank you for your business!\n\nView receipt:\n${pdfUrl || ""}`
          );
          whatsappUrl = `https://wa.me/${phone}?text=${msg}`;
        }
      }
    } catch (notifyErr) {
      console.warn("[markInvoiceAsPaid] confirmation send failed:", (notifyErr as Error).message);
    }

    revalidateAdmin("/admin/invoices");
    return { success: true, whatsappUrl };
  } catch (err) {
    return { error: (err as Error).message || "Failed to mark invoice as paid" };
  }
}

export async function sendPaymentConfirmationAction(id: number | string) {
  try {
    const denied = await assertCan("send_email");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);

    const { data: invoice, error: fetchError } = await supabase
      .from("invoices")
      .select("*, client:clients(name, email, phone), bank_account:bank_accounts(*)")
      .eq("id", safeId)
      .single();

    if (fetchError) return { error: fetchError.message };
    if (!invoice) return { error: "Invoice not found" };
    if (!invoice.client?.email) return { error: "Client has no email address" };
    if (invoice.status !== "paid") return { error: "Invoice is not marked as paid" };

    const shareToken = invoice.share_token || randomUUID();

    await supabase
      .from("invoices")
      .update({ share_token: shareToken })
      .eq("id", safeId)
      .is("share_token", null);

    await sendPaymentConfirmation(invoice, invoice.client);

    let whatsappUrl = null;
    if (invoice.client.phone) {
      const phone = invoice.client.phone.replace(/[^0-9]/g, "");
      const pdfUrl = `${getSiteUrl()}/api/pdf/invoice/${safeId}?token=${shareToken}`;
      const msg = encodeURIComponent(
        `Hi ${invoice.client.name || "there"}!\n\nPayment received for Invoice ${invoice.invoice_number}\nAmount: ${invoice.currency || "USD"} ${Number(invoice.total).toFixed(2)}\n\nThank you for your business!\n\nView receipt:\n${pdfUrl || ""}`
      );
      whatsappUrl = `https://wa.me/${phone}?text=${msg}`;
    }

    revalidateAdmin("/admin/invoices");
    return { success: true, whatsappUrl };
  } catch (err) {
    return { error: (err as Error).message || "Failed to send payment confirmation" };
  }
}

export async function markInvoiceAsOverdue(ids: unknown) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const idList: unknown[] = Array.isArray(ids) ? ids : [ids];
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
    return { error: (err as Error).message || "Failed to mark invoices as overdue" };
  }
}

export async function cancelInvoice(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to cancel invoice" };
  }
}

export async function updateInvoiceStatus(id: number | string, status: string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeStatus = statusSchema(VALID_INVOICE_STATUSES).parse(status);

    const { error } = await supabase
      .from("invoices")
      .update({ status: safeStatus, updated_at: new Date().toISOString() })
      .eq("id", safeId);

    if (error) return { error: error.message };

    if (safeStatus === "paid") {
      const { data: paidInvoiceRow } = await supabase
        .from("invoices")
        .select("invoice_number, total, currency, client:clients(name)")
        .eq("id", safeId)
        .single();
      const paidInvoice = paidInvoiceRow as unknown as {
        invoice_number?: string;
        total?: number;
        currency?: string;
        client?: { name?: string } | null;
      } | null;

      await createNotification({
        type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
        title: `Payment received · ${paidInvoice?.invoice_number || `#${safeId}`}`,
        body:
          paidInvoice?.total != null
            ? `${paidInvoice.currency || "USD"} ${Number(paidInvoice.total).toFixed(2)}${paidInvoice?.client?.name ? ` — ${paidInvoice.client.name}` : ""}`
            : null,
        entityType: "invoice",
        entityId: safeId,
        dedupeKey: `invoice_paid:${safeId}:${new Date().toISOString().slice(0, 10)}`,
      });
    }

    revalidateAdmin("/admin/invoices");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update invoice status" };
  }
}

export async function createProject(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
      currency: data.currency || "INR",
      services: data.services || null,
      notes: data.notes,
    });

    if (error) return { error: error.message };
    revalidateAdmin("/admin/projects");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to create project" };
  }
}

export async function updateProject(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
        currency: data.currency || "INR",
        services: data.services || null,
        notes: data.notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    if (error) return { error: error.message };
    revalidateAdmin("/admin/projects");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update project" };
  }
}

export async function deleteProject(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    return { error: (err as Error).message || "Failed to delete project" };
  }
}

export async function updateProjectStatus(id: number | string, newStatus: string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeStatus = statusSchema(VALID_PROJECT_STATUSES).parse(newStatus);
    const { error } = await supabase
      .from("projects")
      .update({ status: safeStatus, updated_at: new Date().toISOString() })
      .eq("id", safeId);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/projects");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update project status" };
  }
}

function resolveOrder(col: string, dir: string, sort: string) {
  const validCols = [
    "name", "email", "status", "created_at", "invoice_number",
    "total", "budget", "deadline", "title", "company", "phone", "ai_score", "source",
    "rating",
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
  return sortMap[sort as keyof typeof sortMap] || { column: "created_at", ascending: false };
}

export async function getLeadsPaginated(params: unknown) {
  const denied = await assertCan("view");
  if (denied) return denied;
  const supabase = await getSupabase();
  const { page, pageSize, search, status, score: scoreFilter, source, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase.from("leads").select("*", { count: "exact" });
  if (search) query = query.or(`name.ilike.%${sanitizeSearch(search)}%,email.ilike.%${sanitizeSearch(search)}%,company.ilike.%${sanitizeSearch(search)}%`);
  if (status !== "all") query = query.eq("status", status);
  if (source !== "all") query = query.eq("source", source);
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
  if (error) {
    console.error("getLeadsPaginated error:", error.message);
    return { data: [], total: 0, error: error.message };
  }
  return { data: data || [], total: count || 0 };
}

export async function getClientsPaginated(params: unknown) {
  const denied = await assertCan("view");
  if (denied) return denied;
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase.from("clients").select("*", { count: "exact" });
  if (search) query = query.or(`name.ilike.%${sanitizeSearch(search)}%,email.ilike.%${sanitizeSearch(search)}%,company.ilike.%${sanitizeSearch(search)}%`);
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("getClientsPaginated error:", error.message);
    return { data: [], total: 0, error: error.message };
  }
  return { data: data || [], total: count || 0 };
}

export async function getProposalsPaginated(params: unknown) {
  const denied = await assertCan("view");
  if (denied) return denied;
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase
    .from("proposals")
    .select("*, lead:leads(name, email, phone, company)", { count: "exact" });
  if (search) {
    const s = sanitizeSearch(search);
    try {
      query = query.or(`title.ilike.%${s}%,lead.name.ilike.%${s}%`);
    } catch {
      query = query.ilike("title", `%${s}%`);
    }
  }
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("getProposalsPaginated error:", error.message);
    return { data: [], total: 0, error: error.message };
  }
  return { data: data || [], total: count || 0 };
}

export async function getInvoicesPaginated(params: unknown) {
  const denied = await assertCan("view");
  if (denied) return denied;
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase
    .from("invoices")
    .select("*, client:clients(name, email, phone, company), proposal:proposals(id, title), bank_account:bank_accounts(*)", { count: "exact" });
  if (search) {
    const s = sanitizeSearch(search);
    try {
      query = query.or(`invoice_number.ilike.%${s}%,client.name.ilike.%${s}%`);
    } catch {
      query = query.ilike("invoice_number", `%${s}%`);
    }
  }
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("getInvoicesPaginated error:", error.message);
    return { data: [], total: 0, error: error.message };
  }
  return { data: data || [], total: count || 0 };
}

export async function getInvoiceById(id: number | string) {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const safeId = idSchema.parse(id);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("invoices")
      .select("*, client:clients(name, email, phone, company), proposal:proposals(id, title), bank_account:bank_accounts(*)")
      .eq("id", safeId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getProposalById(id: number | string) {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const safeId = idSchema.parse(id);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("proposals")
      .select("*, lead:leads(name, email, phone, company)")
      .eq("id", safeId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getLeadById(id: number | string) {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const safeId = idSchema.parse(id);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("id", safeId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getClientById(id: number | string) {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const safeId = idSchema.parse(id);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("id", safeId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getProjectById(id: number | string) {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const safeId = idSchema.parse(id);
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*, client:clients(name, email, company)")
      .eq("id", safeId)
      .single();
    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getProjectsPaginated(params: unknown) {
  const denied = await assertCan("view");
  if (denied) return denied;
  const supabase = await getSupabase();
  const { page, pageSize, search, status, col, dir, sort } = paginationSchema.parse(params);

  let query = supabase
    .from("projects")
    .select("*, client:clients(name, email, company)", { count: "exact" });
  if (search) {
    const s = sanitizeSearch(search);
    try {
      query = query.or(`name.ilike.%${s}%,client.name.ilike.%${s}%`);
    } catch {
      query = query.ilike("name", `%${s}%`);
    }
  }
  if (status !== "all") query = query.eq("status", status);
  const order = resolveOrder(col, dir, sort);
  query = query.order(order.column, { ascending: order.ascending });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("getProjectsPaginated error:", error.message);
    return { data: [], total: 0, error: error.message };
  }
  return { data: data || [], total: count || 0 };
}

export async function ensureShareToken(type: string, id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
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
    const denied = await assertCan("view");
    if (denied) return denied;
    const supabase = await getSupabase();
    const [leads, clients] = await Promise.all([
      supabase.from("leads").select("id, name, email").not("email", "is", null).limit(200),
      supabase.from("clients").select("id, name, email").not("email", "is", null).limit(200),
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

type CustomEmailPayload = {
  from?: string;
  subject?: string;
  body?: string;
  to?: string;
  files?: string;
  lead_id?: number | null;
  client_id?: number | null;
};

export async function sendCustomEmailAction(data: CustomEmailPayload) {
  try {
    const denied = await assertCan("send_email");
    if (denied) return denied;
    const supabase = await getSupabase();
    const from = data.from;
    const subject = data.subject;
    const body = data.body;
    const leadId = data.lead_id || null;
    const clientId = data.client_id || null;

    if (!from || !subject || !body) {
      return { error: "From, subject, and body are required" };
    }

    let to = [];
    try {
      to = data.to ? JSON.parse(data.to) : [];
    } catch {
      return { error: "Invalid recipient list" };
    }
    if (!Array.isArray(to) || to.length === 0) {
      return { error: "At least one recipient is required" };
    }
    if (to.length > 50) {
      return { error: "Cannot send to more than 50 recipients" };
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const addr of to) {
      if (!emailRegex.test(addr)) {
        return { error: `Invalid email address: ${addr}` };
      }
    }

    const validSenders = ["contact", "admin", "billing", "support"];
    if (!validSenders.includes(from)) {
      return { error: "Invalid sender" };
    }

    if (await isRateLimited(supabase, "sent_emails", to[0])) {
      return { error: "Too many emails sent recently. Try again in a minute." };
    }

    const safeBody = sanitizeEmailHtml(body);
    if (!safeBody) {
      return { error: "Email body is empty after sanitization" };
    }

    let files = [];
    try {
      files = data.files ? JSON.parse(data.files) : [];
    } catch {
      return { error: "Invalid file list" };
    }
    if (!Array.isArray(files)) files = [];
    const attachmentBuffers = [];
    for (const file of files) {
      if (!file || !file.path) continue;
      try {
        const { data: signedUrlData, error: urlErr } = await supabase.storage
          .from("email-attachments")
          .createSignedUrl(file.path, 300);
        if (urlErr || !signedUrlData?.signedUrl) {
          console.warn("[actions] signed URL error:", urlErr?.message);
          continue;
        }
        const response = await fetch(signedUrlData.signedUrl);
        if (!response.ok) {
          console.warn("[actions] file fetch failed:", response.status);
          continue;
        }
        const arrayBuffer = await response.arrayBuffer();
        attachmentBuffers.push({ filename: file.name, content: Buffer.from(arrayBuffer) });
      } catch (fileErr) {
        console.warn("[actions] file download failed:", (fileErr as Error).message);
      }
    }

    let result;
    try {
      result = await sendCustomEmail({
        from,
        to,
        subject,
        html: safeBody,
        attachments: attachmentBuffers,
      });
    } catch (sendErr) {
      console.error("[actions] sendCustomEmail failed:", sendErr);
      return { error: (sendErr as Error).message || "Failed to send email via Resend" };
    }

    const uploadedMeta = files.map((f) => ({ name: f.name, size: f.size, path: f.path }));
    try {
      await supabase.from("sent_emails").insert({
        from_address: `${from}@withmeteoric.com`,
        to_addresses: to,
        subject,
        body: safeBody,
        attachments: uploadedMeta.length ? uploadedMeta : null,
        resend_id: result?.data?.id || null,
        status: "sent",
        lead_id: leadId,
        client_id: clientId,
      });
    } catch (logErr) {
      console.warn("[actions] failed to log sent email:", (logErr as Error).message);
    }

    return { success: true, id: result?.data?.id };
  } catch (err) {
    console.error("[actions] sendCustomEmailAction failed:", err);
    return { error: (err as Error).message || "Failed to send email" };
  }
}

export async function getSentEmails(page = 1, pageSize = 15, search?: string) {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const supabase = await getSupabase();
    const from = (page - 1) * pageSize;

    let query = supabase
      .from("sent_emails")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);
    if (search) {
      const s = sanitizeSearch(search);
      query = query.or(
        `subject.ilike.%${s}%,from_address.ilike.%${s}%,to_addresses::text.ilike.%${s}%`
      );
    }

    let result = await query;

    if (result.error && search) {
      // Cast fallback: to_addresses::text may be rejected on some PostgREST setups
      result = await supabase
        .from("sent_emails")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, from + pageSize - 1)
        .or(
          `subject.ilike.%${sanitizeSearch(search)}%,from_address.ilike.%${sanitizeSearch(search)}%`
        );
    }

    return { data: result.data || [], total: result.count || 0 };
  } catch {
    return { data: [], total: 0 };
  }
}

export async function deleteSentEmail(id: number | string) {
  try {
    const denied = await assertCan("send_email");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const { error } = await supabase.from("sent_emails").delete().eq("id", safeId);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/sent-emails");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to delete email" };
  }
}

// ─── Bank Accounts ────────────────────────────────────────────────────────────

export async function getBankAccounts() {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("bank_accounts")
      .select("*")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) return { error: error.message };
    return { data: data || [] };
  } catch (err) {
    return { error: (err as Error).message || "Failed to fetch bank accounts" };
  }
}

export async function createBankAccount(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const data = bankAccountSchema.parse(parseFormData(formData));

    if (data.is_default) {
      await supabase.from("bank_accounts").update({ is_default: false }).eq("is_default", true);
    }

    const { error } = await supabase.from("bank_accounts").insert({
      label: data.label,
      bank_name: data.bank_name,
      account_holder: data.account_holder,
      account_number: data.account_number,
      iban: data.iban,
      swift_bic: data.swift_bic,
      routing_number: data.routing_number,
      ifsc: data.ifsc,
      upi_id: data.upi_id,
      currency: data.currency,
      country: data.country,
      is_default: data.is_default,
    });
    if (error) return { error: error.message };
    revalidateAdmin("/admin/bank-accounts");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to create bank account" };
  }
}

export async function updateBankAccount(formData: FormData) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const data = bankAccountSchema.parse(parseFormData(formData));
    if (!data.id) return { error: "Bank account ID is required" };

    if (data.is_default) {
      await supabase.from("bank_accounts").update({ is_default: false }).eq("is_default", true);
    }

    const { error } = await supabase
      .from("bank_accounts")
      .update({
        label: data.label,
        bank_name: data.bank_name,
        account_holder: data.account_holder,
        account_number: data.account_number,
        iban: data.iban,
        swift_bic: data.swift_bic,
        routing_number: data.routing_number,
        ifsc: data.ifsc,
        upi_id: data.upi_id,
        currency: data.currency,
        country: data.country,
        is_default: data.is_default,
      })
      .eq("id", data.id);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/bank-accounts");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update bank account" };
  }
}

export async function deleteBankAccount(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const { error } = await supabase.from("bank_accounts").delete().eq("id", safeId);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/bank-accounts");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to delete bank account" };
  }
}

export async function getReviewsPaginated({
  page = 1,
  pageSize = 15,
  status,
  search,
  col = "created_at",
  dir = "desc",
}: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
  col?: string;
  dir?: string;
} = {}) {
  try {
    const denied = await assertCan("view");
    if (denied) return denied;
    const supabase = await getSupabase();
    let query = supabase.from("reviews").select("*", { count: "exact" });
    if (status && status !== "all") query = query.eq("status", status);
    if (search) query = query.or(`name.ilike.%${sanitizeSearch(search)}%,email.ilike.%${sanitizeSearch(search)}%,company.ilike.%${sanitizeSearch(search)}%,content.ilike.%${sanitizeSearch(search)}%`);
    const from = (page - 1) * pageSize;
    query = query.order(col, { ascending: dir === "asc" }).range(from, from + pageSize - 1);
    const { data, error, count } = await query;
    if (error) return { error: error.message, data: [], total: 0 };
    return { data: data || [], total: count || 0 };
  } catch (err) {
    return { error: (err as Error).message, data: [], total: 0 };
  }
}

export async function updateReviewStatus(id: number | string, status: string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeStatus = statusSchema(VALID_REVIEW_STATUSES).parse(status);
    const { error } = await supabase.from("reviews").update({ status: safeStatus }).eq("id", safeId);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/reviews");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update review" };
  }
}

export async function toggleReviewVerified(id: number | string, is_verified: boolean | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const safeVerified = z.union([z.boolean(), z.string().transform((v) => v === "true")]).parse(is_verified);
    const { error } = await supabase.from("reviews").update({ is_verified: safeVerified }).eq("id", safeId);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/reviews");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to update review" };
  }
}

export async function deleteReview(id: number | string) {
  try {
    const denied = await assertCan("write");
    if (denied) return denied;
    const supabase = await getSupabase();
    const safeId = idSchema.parse(id);
    const { error } = await supabase.from("reviews").delete().eq("id", safeId);
    if (error) return { error: error.message };
    revalidateAdmin("/admin/reviews");
    return { success: true };
  } catch (err) {
    return { error: (err as Error).message || "Failed to delete review" };
  }
}

export async function addUserInvite(formData: FormData) {
  try {
    const denied = await assertCan("manage_users");
    if (denied) return denied;
    const supabase = getAdminClient();
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const role = formData.get("role")?.toString().trim();

    if (!name || !email || !role) {
      return { error: "Name, email, and role are required" };
    }

    const validRoles = ["superadmin", "admin", "speaker"];
    if (!validRoles.includes(role)) {
      return { error: "Invalid role specified" };
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser.users.some((u) => u.email === email);

    if (userExists) {
      return { error: "A user with this email already exists" };
    }

    // Create user in Supabase Auth
    const generatedPassword = generateAutoPassword();
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: generatedPassword,
      email_confirm: true,
      user_metadata: { full_name: name, role, onboarding_completed: false },
    });

    if (authError) return { error: authError.message };
    if (!authUser.user) return { error: "Failed to create user" };

    // Assign role in user_roles table
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: authUser.user.id,
      role,
      can_manage_users: role === "superadmin",
      can_view_all_data: true,
      can_send_emails: role !== "speaker",
      onboarding_completed: false,
    });

    if (roleError) {
      // Clean up auth user if role assignment fails
      await supabase.auth.admin.deleteUser(authUser.user.id);
      return { error: roleError.message };
    }

    // Send invitation email
    const loginUrl = `${getSiteUrl()}/login?redirect=/admin`;
    await sendInvitationEmail({
      name,
      email,
      role,
      password: generatedPassword,
      loginUrl,
    });

    return { success: true, userId: authUser.user.id };
  } catch (err) {
    console.error("[actions] addUserInvite error:", err);
    return { error: (err as Error).message || "Failed to add user invite" };
  }
}

export async function resendInvitation(userId: string) {
  try {
    const denied = await assertCan("manage_users");
    if (denied) return denied;
    const supabase = getAdminClient();
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(userId);

    if (userError || !user.user) return { error: "User not found" };

    // Check if onboarding is completed
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!roleData) return { error: "User role not found" };
    if (roleData.onboarding_completed) {
      return { error: "Onboarding already completed" };
    }

    const loginUrl = `${getSiteUrl()}/login?redirect=/admin`;
    const resetEmailHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset / First Login</h2>
        <p>Hello,</p>
        <p>This is a reminder to complete your first login and set a new password.</p>
        <p>Login here: <a href="${loginUrl}" style="color: #EAEFFF; text-decoration: underline;">${loginUrl}</a></p>
        <p>Best regards,<br/>Meteoric Team</p>
      </div>
    `;

    await sendCustomEmail({
      from: "admin",
      to: [user.user.email],
      subject: "Complete your first login - Meteoric Admin",
      html: resetEmailHtml,
      attachments: [],
    });

    return { success: true };
  } catch (err) {
    console.error("[actions] resendInvitation error:", err);
    return { error: (err as Error).message || "Failed to resend invitation" };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const denied = await assertCan("manage_users");
    if (denied) return denied;
    const sessionSupabase = await getSupabase();

    // Verify current user is superadmin (uses session client — RLS allows reading own row)
    const { data: { user: currentUser } } = await sessionSupabase.auth.getUser();
    const { data: currentRole } = await sessionSupabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser!.id)
      .single();

    if (currentRole?.role !== "superadmin") {
      return { error: "Only superadmin can change user roles" };
    }

    const validRoles = ["superadmin", "admin", "speaker"];
    if (!validRoles.includes(newRole)) {
      return { error: "Invalid role specified" };
    }

    const supabase = getAdminClient();

    // Update role in user_roles table
    const { error } = await supabase
      .from("user_roles")
      .update({
        role: newRole,
        can_manage_users: newRole === "superadmin",
      })
      .eq("user_id", userId);

    if (error) return { error: error.message };

    // Update auth user metadata
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role: newRole },
    });

    return { success: true };
  } catch (err) {
    console.error("[actions] updateUserRole error:", err);
    return { error: (err as Error).message || "Failed to update user role" };
  }
}

export async function onboardUserComplete(userId: string) {
  try {
    const supabase = getAdminClient();

    const { error } = await supabase
      .from("user_roles")
      .update({ onboarding_completed: true })
      .eq("user_id", userId);

    if (error) return { error: error.message };

    // Update auth user metadata (merge to preserve full_name, role)
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    if (userData.user) {
      await supabase.auth.admin.updateUserById(userId, {
        user_metadata: { ...userData.user.user_metadata, onboarding_completed: true },
      });
    }

    return { success: true };
  } catch (err) {
    console.error("[actions] onboardUserComplete error:", err);
    return { error: (err as Error).message || "Failed to complete onboarding" };
  }
}

export async function getUserPermissions(userId: string) {
  try {
    const denied = await assertCan("manage_users");
    if (denied) return denied;
    const supabase = getAdminClient();

    const { data: roleData } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (!roleData) return { error: "User role not found" };

    return {
      role: roleData.role,
      canManageUsers: roleData.can_manage_users,
      canViewAllData: roleData.can_view_all_data,
      canSendEmails: roleData.can_send_emails,
      onboardingCompleted: roleData.onboarding_completed,
    };
  } catch (err) {
    console.error("[actions] getUserPermissions error:", err);
    return { error: (err as Error).message || "Failed to get user permissions" };
  }
}

export async function getUsersWithRoles() {
  try {
    const denied = await assertCan("manage_users");
    if (denied) return denied;
    const supabase = getAdminClient();

    const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) return { error: listError.message };

    const { data: roles } = await supabase
      .from("user_roles")
      .select("*")
      .order("created_at", { ascending: true });

    const roleMap: Record<string, NonNullable<typeof roles>[number]> = {};
    (roles || []).forEach((r) => { roleMap[r.user_id] = r; });

    const users = authUsers.users.map((u) => {
      const roleData = roleMap[u.id] || null;
      return {
        id: u.id,
        email: u.email,
        full_name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "",
        role: roleData?.role || null,
        can_manage_users: roleData?.can_manage_users ?? false,
        can_send_emails: roleData?.can_send_emails ?? false,
        onboarding_completed: roleData?.onboarding_completed ?? false,
        created_at: u.created_at,
      };
    });

    users.sort((a, b) => {
      const order = { superadmin: 0, admin: 1, speaker: 2 };
      const ra = order[a.role as keyof typeof order] ?? 3;
      const rb = order[b.role as keyof typeof order] ?? 3;
      return ra - rb;
    });

    return { users };
  } catch (err) {
    console.error("[actions] getUsersWithRoles error:", err);
    return { error: (err as Error).message || "Failed to fetch users" };
  }
}

export async function deleteUser(userId: string) {
  try {
    const denied = await assertCan("manage_users");
    if (denied) return denied;
    const sessionSupabase = await getSupabase();

    // Verify current user is superadmin
    const { data: { user: currentUser } } = await sessionSupabase.auth.getUser();
    if (!currentUser) return { error: "Not authenticated" };

    const { data: currentRole } = await sessionSupabase
      .from("user_roles")
      .select("role")
      .eq("user_id", currentUser.id)
      .single();

    if (currentRole?.role !== "superadmin") {
      return { error: "Only superadmin can delete users" };
    }

    // Prevent self-deletion
    if (userId === currentUser.id) {
      return { error: "You cannot delete your own account" };
    }

    const supabase = getAdminClient();

    // Delete from user_roles (ON DELETE CASCADE will handle this, but explicit is safer)
    await supabase.from("user_roles").delete().eq("user_id", userId);

    // Delete from auth.users (this cascades to user_roles via FK)
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return { error: error.message };

    return { success: true };
  } catch (err) {
    console.error("[actions] deleteUser error:", err);
    return { error: (err as Error).message || "Failed to delete user" };
  }
}

export interface GlobalSearchItem {
  id: number | string;
  title: string;
  subtitle?: string;
  meta?: string;
  /** Raw field names that matched the query (e.g. "email", "invoice_number"). */
  matched?: string[];
  /** Full row (with list-compatible embeds) — used by mobile detail screens. */
  data?: Record<string, unknown>;
}

export interface GlobalSearchGroup {
  key:
    | "leads"
    | "clients"
    | "invoices"
    | "proposals"
    | "projects"
    | "sent_emails"
    | "bookings";
  label: string;
  href: string;
  /** Total matches (exact unless phase-2 row fetch capped at 200 — admin scale). */
  count: number;
  items: GlobalSearchItem[];
}

type GlobalSearchGroups = { groups: GlobalSearchGroup[] };

const CAL_BOOKINGS_API = "https://api.cal.com/v2";
const MEMO_TTL_MS = 3000;
const searchMemo = new Map<string, { exp: number; value: GlobalSearchGroups }>();

function pickField(row: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((o, k) => {
    if (o && typeof o === "object") return (o as Record<string, unknown>)[k];
    return undefined;
  }, row);
}

function fieldText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value
      .map((v) =>
        typeof v === "string" ? v : v && typeof v === "object" ? JSON.stringify(v) : ""
      )
      .join(" ");
  }
  return "";
}

function matchedFields(
  row: Record<string, unknown>,
  cols: string[],
  needle: string
): string[] {
  const n = needle.toLowerCase();
  return cols.filter((c) => fieldText(pickField(row, c)).toLowerCase().includes(n));
}

/**
 * Merge phase-1 rows (direct column matches) with phase-2 rows (matched via
 * related client/lead name). Count = count1 + count2 − overlap, where overlap
 * = phase-2 rows that also match phase-1's own predicates.
 */
function mergePhase(
  phase1Rows: Record<string, unknown>[],
  phase1Count: number,
  phase2: { data?: Record<string, unknown>[] | null; count?: number | null; error?: unknown } | null,
  matchesPhase1: (row: Record<string, unknown>) => boolean,
  idOf: (row: Record<string, unknown>) => number | string
): { rows: Record<string, unknown>[]; count: number } {
  const rows2 = (phase2 && !phase2.error && phase2.data) || [];
  const count2 = (phase2 && !phase2.error && phase2.count) || 0;
  const seen = new Set(phase1Rows.map(idOf));
  const extras: Record<string, unknown>[] = [];
  let overlap = 0;
  for (const row of rows2) {
    if (matchesPhase1(row)) overlap++;
    const id = idOf(row);
    if (!seen.has(id)) {
      seen.add(id);
      extras.push(row);
    }
  }
  const rows = [...phase1Rows, ...extras];
  return { rows, count: Math.max(phase1Count + count2 - overlap, rows.length) };
}

async function searchCalBookings(
  q: string
): Promise<{ count: number; items: GlobalSearchItem[] } | null> {
  const key = process.env.CALCOM_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`${CAL_BOOKINGS_API}/bookings?limit=250&sort=startDate:desc`, {
      headers: {
        Authorization: `Bearer ${key}`,
        "cal-api-version": "2024-08-13",
      },
      next: { revalidate: 120 },
    });
    if (!res.ok) {
      console.error("[globalSearch] cal bookings:", res.status);
      return null;
    }
    const json = await res.json();
    const all: Record<string, unknown>[] = Array.isArray(json?.data) ? json.data : [];
    const n = q.toLowerCase();
    const haystack = (b: Record<string, unknown>): string => {
      const attendees = Array.isArray(b.attendees) ? b.attendees : [];
      return [
        b.title,
        b.description,
        ...attendees.map((a) =>
          a && typeof a === "object"
            ? `${(a as Record<string, unknown>).name || ""} ${(a as Record<string, unknown>).email || ""}`
            : ""
        ),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    };
    const matches = all.filter((b) => haystack(b).includes(n));
    const items = matches.slice(0, 5).map((b) => {
      const attendees = Array.isArray(b.attendees)
        ? (b.attendees as Record<string, unknown>[])
        : [];
      const first = attendees[0];
      const matched: string[] = [];
      if ((b.title || "").toString().toLowerCase().includes(n)) matched.push("title");
      if ((b.description || "").toString().toLowerCase().includes(n)) matched.push("description");
      if (
        attendees.some((a) =>
          `${a?.name || ""} ${a?.email || ""}`.toLowerCase().includes(n)
        )
      ) {
        matched.push("attendee");
      }
      return {
        id: (b.id as number | string) ?? 0,
        title: (b.title as string) || "Booking",
        subtitle:
          (first?.name as string) ||
          (first?.email as string) ||
          (b.start as string) ||
          undefined,
        meta: (b.status as string) || undefined,
        matched,
        data: b,
      };
    });
    return { count: matches.length, items };
  } catch (err) {
    console.error("[globalSearch] cal bookings:", err);
    return null;
  }
}

export async function globalSearch(
  rawQuery: string
): Promise<GlobalSearchGroups | { error: string; status?: number }> {
  const denied = await assertCan("view");
  if (denied) return denied;

  const q = (rawQuery || "").trim();
  if (q.length < 2) return { groups: [] };

  const s = sanitizeSearch(q);
  const n = q.toLowerCase();
  const like = (col: string) => `${col}.ilike.%${s}%`;
  const seed = encodeURIComponent(q);

  // Per-user 3s memo — key includes userId so one user's search is never
  // served to another (RLS could differ between roles).
  let userId = "anon";
  try {
    userId = (await getCallerPermissions())?.userId || "anon";
  } catch {
    userId = "anon";
  }
  const memoKey = `${userId}|${s}`;
  const hit = searchMemo.get(memoKey);
  if (hit && hit.exp > Date.now()) return hit.value;

  const supabase = await getSupabase();

  const [
    leadsRes,
    clientsRes,
    clientIdsRes,
    leadIdsRes,
    invoicesRes,
    proposalsRes,
    projectsRes,
    emailsRes,
    bookingsRes,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("*", { count: "exact" })
      .or(`${like("name")},${like("email")},${like("phone")},${like("company")}`)
      .limit(5),
    supabase
      .from("clients")
      .select("*", { count: "exact" })
      .or(`${like("name")},${like("email")},${like("phone")},${like("company")}`)
      .limit(5),
    supabase
      .from("clients")
      .select("id")
      .or(`${like("name")},${like("email")},${like("phone")},${like("company")}`)
      .limit(100),
    supabase
      .from("leads")
      .select("id")
      .or(`${like("name")},${like("email")},${like("phone")},${like("company")}`)
      .limit(100),
    supabase
      .from("invoices")
      .select(
        "*, client:clients(name, email, phone, company), proposal:proposals(id, title), bank_account:bank_accounts(*)",
        { count: "exact" }
      )
      .or(`${like("invoice_number")},${like("notes")}`)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("proposals")
      .select("*, lead:leads(name, email, phone, company)", { count: "exact" })
      .or(like("title"))
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("projects")
      .select("*, client:clients(name, email, company)", { count: "exact" })
      .or(`${like("name")},${like("services")}`)
      .limit(5),
    (async () => {
      const base = () =>
        supabase
          .from("sent_emails")
          .select("*", { count: "exact" })
          .or(`${like("subject")},${like("from_address")},to_addresses::text.ilike.%${s}%`)
          .order("created_at", { ascending: false })
          .limit(5);
      let res = await base();
      if (res.error) {
        // PostgREST cast fallback: subject/from_address only
        res = await supabase
          .from("sent_emails")
          .select("*", { count: "exact" })
          .or(`${like("subject")},${like("from_address")}`)
          .order("created_at", { ascending: false })
          .limit(5);
      }
      return res;
    })(),
    searchCalBookings(q),
  ]);

  // Phase 2: rows that match via related client/lead name (or-filter cannot
  // span embeds without !inner, which would drop null-FK rows).
  const clientIds = ((clientIdsRes.data || []) as { id: number }[]).map((r) => r.id);
  const leadIds = ((leadIdsRes.data || []) as { id: number }[]).map((r) => r.id);

  const [invoicesExtra, proposalsExtra, projectsExtra] = await Promise.all([
    clientIds.length
      ? supabase
          .from("invoices")
          .select(
            "*, client:clients(name, email, phone, company), proposal:proposals(id, title), bank_account:bank_accounts(*)",
            { count: "exact" }
          )
          .in("client_id", clientIds)
          .order("created_at", { ascending: false })
          .limit(200)
      : Promise.resolve(null),
    leadIds.length
      ? supabase
          .from("proposals")
          .select("*, lead:leads(name, email, phone, company)", { count: "exact" })
          .in("lead_id", leadIds)
          .order("created_at", { ascending: false })
          .limit(200)
      : Promise.resolve(null),
    clientIds.length
      ? supabase
          .from("projects")
          .select("*, client:clients(name, email, company)", { count: "exact" })
          .in("client_id", clientIds)
          .order("created_at", { ascending: false })
          .limit(200)
      : Promise.resolve(null),
  ]);

  const logErr = (key: string, err: { message: string } | null) => {
    if (err) console.error(`[globalSearch] ${key}:`, err.message);
  };
  logErr("leads", leadsRes.error);
  logErr("clients", clientsRes.error);
  logErr("invoices", invoicesRes.error);
  logErr("proposals", proposalsRes.error);
  logErr("projects", projectsRes.error);
  logErr("sent_emails", emailsRes.error);
  logErr("invoices_extra", invoicesExtra?.error || null);
  logErr("proposals_extra", proposalsExtra?.error || null);
  logErr("projects_extra", projectsExtra?.error || null);

  const groups: GlobalSearchGroup[] = [];

  if (!leadsRes.error) {
    const rows = (leadsRes.data || []) as Record<string, unknown>[];
    const items: GlobalSearchItem[] = rows.map((l) => ({
      id: l.id as number,
      title: (l.name as string) || (l.email as string) || `Lead #${l.id}`,
      subtitle:
        (l.company as string) ||
        (l.email as string) ||
        (l.phone as string) ||
        undefined,
      meta: (l.status as string) || undefined,
      matched: matchedFields(l, ["name", "email", "phone", "company"], q),
      data: l,
    }));
    if (items.length) {
      groups.push({
        key: "leads",
        label: "Leads",
        href: `/admin/leads?search=${seed}`,
        count: leadsRes.count ?? items.length,
        items,
      });
    }
  }

  if (!clientsRes.error) {
    const rows = (clientsRes.data || []) as Record<string, unknown>[];
    const items: GlobalSearchItem[] = rows.map((c) => ({
      id: c.id as number,
      title: (c.name as string) || (c.email as string) || `Client #${c.id}`,
      subtitle:
        (c.company as string) ||
        (c.email as string) ||
        (c.phone as string) ||
        undefined,
      meta: (c.status as string) || undefined,
      matched: matchedFields(c, ["name", "email", "phone", "company"], q),
      data: c,
    }));
    if (items.length) {
      groups.push({
        key: "clients",
        label: "Clients",
        href: `/admin/clients?search=${seed}`,
        count: clientsRes.count ?? items.length,
        items,
      });
    }
  }

  if (!invoicesRes.error) {
    const phase1 = (invoicesRes.data || []) as Record<string, unknown>[];
    const merged = mergePhase(
      phase1,
      invoicesRes.count ?? phase1.length,
      invoicesExtra,
      (r) =>
        fieldText(r.invoice_number).toLowerCase().includes(n) ||
        fieldText(r.notes).toLowerCase().includes(n),
      (r) => r.id as number | string
    );
    const items: GlobalSearchItem[] = merged.rows.slice(0, 5).map((i) => {
      const client = i.client as Record<string, unknown> | null;
      return {
        id: i.id as number,
        title: i.invoice_number as string,
        subtitle: ((client?.name as string) || (client?.company as string)) || undefined,
        meta: (i.status as string) || undefined,
        matched: matchedFields(i, ["invoice_number", "notes", "client.name"], q),
        data: i,
      };
    });
    if (items.length) {
      groups.push({
        key: "invoices",
        label: "Invoices",
        href: `/admin/invoices?search=${seed}`,
        count: merged.count,
        items,
      });
    }
  }

  if (!proposalsRes.error) {
    const phase1 = (proposalsRes.data || []) as Record<string, unknown>[];
    const merged = mergePhase(
      phase1,
      proposalsRes.count ?? phase1.length,
      proposalsExtra,
      (r) => fieldText(r.title).toLowerCase().includes(n),
      (r) => r.id as number | string
    );
    const items: GlobalSearchItem[] = merged.rows.slice(0, 5).map((p) => {
      const lead = p.lead as Record<string, unknown> | null;
      return {
        id: p.id as number,
        title: p.title as string,
        subtitle: (lead?.name as string) || undefined,
        meta: (p.status as string) || undefined,
        matched: matchedFields(p, ["title", "lead.name"], q),
        data: p,
      };
    });
    if (items.length) {
      groups.push({
        key: "proposals",
        label: "Proposals",
        href: `/admin/proposals?search=${seed}`,
        count: merged.count,
        items,
      });
    }
  }

  if (!projectsRes.error) {
    const phase1 = (projectsRes.data || []) as Record<string, unknown>[];
    const merged = mergePhase(
      phase1,
      projectsRes.count ?? phase1.length,
      projectsExtra,
      (r) =>
        fieldText(r.name).toLowerCase().includes(n) ||
        fieldText(r.services).toLowerCase().includes(n),
      (r) => r.id as number | string
    );
    const items: GlobalSearchItem[] = merged.rows.slice(0, 5).map((p) => {
      const client = p.client as Record<string, unknown> | null;
      return {
        id: p.id as number,
        title: p.name as string,
        subtitle: ((client?.name as string) || (client?.company as string)) || undefined,
        meta: (p.status as string) || undefined,
        matched: matchedFields(p, ["name", "services", "client.name"], q),
        data: p,
      };
    });
    if (items.length) {
      groups.push({
        key: "projects",
        label: "Projects",
        href: `/admin/projects?search=${seed}`,
        count: merged.count,
        items,
      });
    }
  }

  if (!emailsRes.error) {
    const rows = (emailsRes.data || []) as Record<string, unknown>[];
    const items: GlobalSearchItem[] = rows.map((e) => ({
      id: e.id as number,
      title: e.subject as string,
      subtitle: (e.from_address as string) || undefined,
      meta: (e.status as string) || undefined,
      matched: matchedFields(e, ["subject", "from_address", "to_addresses"], q),
      data: e,
    }));
    if (items.length) {
      groups.push({
        key: "sent_emails",
        label: "Sent Emails",
        href: `/admin/sent-emails?search=${seed}`,
        count: emailsRes.count ?? items.length,
        items,
      });
    }
  }

  if (bookingsRes && bookingsRes.items.length) {
    groups.push({
      key: "bookings",
      label: "Bookings",
      href: `/admin/cal-bookings?search=${seed}`,
      count: bookingsRes.count,
      items: bookingsRes.items,
    });
  }

  const result: GlobalSearchGroups = { groups };
  if (searchMemo.size > 100) searchMemo.clear();
  searchMemo.set(memoKey, { exp: Date.now() + MEMO_TTL_MS, value: result });
  return result;
}
