"use server";

import { createClient } from "@/lib/server";

export async function createLead(formData) {
  try {
    const supabase = await createClient()

    if (supabase) {
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
      ])

      if (error) {
        console.error("Failed to save lead:", error)
      }
    }

    if (process.env.RESEND_API_KEY) {
      const { sendNewLeadNotification, sendLeadAutoReply } = await import("@/lib/email")
      Promise.allSettled([
        sendNewLeadNotification(formData).catch(() => {}),
        formData.email ? sendLeadAutoReply(formData).catch(() => {}) : Promise.resolve(),
      ])
    }
  } catch (err) {
    console.error("createLead error:", err)
  }

  return { success: true }
}
