"use server";

import { createClient } from "@/lib/server";
import { sendNewLeadNotification, sendLeadAutoReply } from "@/lib/email";

export async function createLead(formData) {
  const supabase = await createClient();

  const { error } = await supabase.from("leads").insert([
    {
      name: formData.name || null,
      email: formData.email || null,
      phone: formData.phone || null,
      services: formData.services || null,
      details: formData.details || null,
      budget: formData.budget || null,
      status: "new",
    },
  ]);

  if (error) {
    console.error("Failed to save lead:", error);
    return { success: false, error: error.message };
  }

  if (process.env.RESEND_API_KEY) {
    Promise.allSettled([
      sendNewLeadNotification(formData),
      formData.email ? sendLeadAutoReply(formData) : Promise.resolve(),
    ]);
  }

  return { success: true };
}
