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

export async function updateLeadStatus(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const id = formData.get("id");
  const status = formData.get("status");

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function convertLeadToClient(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const id = formData.get("id");

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
      status: "active",
    });

  if (insertError) throw insertError;

  await supabase
    .from("leads")
    .update({ status: "won" })
    .eq("id", id);

  revalidatePath("/admin/leads");
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
    .insert({ name, email, company, status: "active" });

  if (error) throw error;
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}

export async function deleteLead(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const id = formData.get("id");

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/leads");
  revalidatePath("/admin");
}

export async function deleteClient(formData) {
  const supabase = await createClient();
  if (!supabase) throw new Error("Supabase not configured");

  const id = formData.get("id");

  const { error } = await supabase
    .from("clients")
    .delete()
    .eq("id", id);

  if (error) throw error;
  revalidatePath("/admin/clients");
  revalidatePath("/admin");
}
