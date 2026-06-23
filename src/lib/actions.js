"use server";

import { createClient } from "@/lib/supabase/server";
import { sendNewLeadNotification, sendLeadAutoReply } from "@/lib/email/email";

export async function createLead(data) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      console.error("createLead failed: Supabase not configured (env vars missing)")
      return { success: false, error: "Supabase not configured" }
    }

    const { error } = await supabase.from("leads").insert([
      {
        name: data.name || null,
        email: data.email || null,
        phone: data.phone || null,
        services: data.services || null,
        details: data.details || null,
        budget: data.budget || null,
        status: "new",
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error)
      return { success: false, error: error.message }
    }

    let emailError = null
    if (process.env.RESEND_API_KEY) {
      const results = await Promise.allSettled([
        sendNewLeadNotification(data),
        data.email ? sendLeadAutoReply(data) : Promise.resolve(),
      ])
      for (const r of results) {
        if (r.status === "rejected") {
          emailError = typeof r.reason === "string" ? r.reason : r.reason?.message || JSON.stringify(r.reason)
        } else if (r.value?.error) {
          const err = r.value.error
          emailError = typeof err === "string" ? err : err?.message || JSON.stringify(err)
        }
      }
    }

    return { success: true, emailError }
  } catch (err) {
    console.error("createLead error:", err)
    return { success: false, error: err.message }
  }
}
