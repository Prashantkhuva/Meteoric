"use server";

import { createClient } from "@/lib/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

  const { error } = await supabase.from("leads").insert({
    name: formData.get("name"),
    email: formData.get("email"),
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
    .select("*")
    .eq("id", id)
    .single();

  if (!lead) throw new Error("Lead not found");

  const { error: insertError } = await supabase
    .from("clients")
    .insert({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: "onboarding",
    });

  if (insertError) throw insertError;

  await supabase
    .from("leads")
    .update({ status: "completed" })
    .eq("id", id);

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

  const { error } = await supabase
    .from("clients")
    .insert({ name, email, company, status: "onboarding" });

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
    .select("*, lead:leads(name, email)")
    .eq("id", id)
    .single();

  if (!proposal) throw new Error("Proposal not found");
  if (!proposal.lead?.email) throw new Error("Lead has no email address");

  const { error } = await supabase
    .from("proposals")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", id);

  if (error) throw error;

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: process.env.FROM_EMAIL || "Meteoric <onboarding@resend.dev>",
      to: proposal.lead.email,
      subject: `Proposal: ${proposal.title}`,
      html: `
        <p>Hi ${proposal.lead.name || "there"},</p>
        <p>A proposal has been prepared for you:</p>
        <h2>${proposal.title}</h2>
        <p>You can view the full proposal by logging into your account.</p>
        <p>We look forward to working with you!</p>
      `,
    });
  } catch {
    // email is best-effort; proposal is still marked as sent
  }

  revalidatePath("/admin/proposals");
  revalidatePath("/admin");
}
