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
