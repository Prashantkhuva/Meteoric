"use server";

import { createClient } from "@/lib/supabase/server";
import { sendNewLeadNotification, sendLeadAutoReply } from "@/lib/email/email";
import ReviewNotification from "@/emails/review-notification";
import { resend } from "@/lib/email/resend";
import { getSiteUrl } from "@/config/site-url";

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

export async function createReview(data) {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Supabase not configured" }
    }

    const { error } = await supabase.from("reviews").insert([
      {
        name: data.name || null,
        email: data.email || null,
        role: data.role || null,
        company: data.company || null,
        project: data.project || null,
        rating: data.rating || 5,
        content: data.content || null,
        status: "pending",
        is_verified: false,
      },
    ])

    if (error) {
      console.error("Supabase insert error:", error)
      return { success: false, error: error.message }
    }

    if (process.env.RESEND_API_KEY) {
      try {
        const siteUrl = getSiteUrl()
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "Meteoric <onboarding@resend.dev>",
          to: [process.env.ADMIN_EMAIL],
          subject: `New review from ${data.name}`,
          react: ReviewNotification({
            name: data.name,
            email: data.email,
            role: data.role,
            company: data.company,
            project: data.project,
            rating: data.rating,
            content: data.content,
            siteUrl,
          }),
        })
      } catch (emailErr) {
        console.error("[resend] review notification failed:", emailErr)
      }
    }

    return { success: true }
  } catch (err) {
    console.error("createReview error:", err)
    return { success: false, error: err.message }
  }
}

export async function getApprovedReviews() {
  try {
    const supabase = await createClient()
    if (!supabase) {
      return { success: false, error: "Supabase not configured", data: [] }
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase select error:", error)
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (err) {
    console.error("getApprovedReviews error:", err)
    return { success: false, error: err.message, data: [] }
  }
}
