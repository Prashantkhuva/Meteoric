"use server";

import { createClient } from "@/lib/supabase/server";
import { sendNewLeadNotification, sendLeadAutoReply, sendHotLeadAlert } from "@/lib/email/email";
import ReviewNotification from "@/emails/review-notification";
import { resend } from "@/lib/email/resend";
import { getSiteUrl } from "@/config/site-url";
import { callAIJson } from "@/lib/ai/provider";
import { scoreLeadPrompt } from "@/lib/ai/prompts";

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

    let aiCategory = null;
    let aiScore = null;
    let aiSummary = null;

    if (process.env.GOOGLE_API) {
      try {
        const aiRes = await callAIJson(scoreLeadPrompt(data).system, scoreLeadPrompt(data).user);
        if (aiRes && typeof aiRes.score === "number") {
          aiScore = aiRes.score;
          aiCategory = aiRes.category || null;
          aiSummary = aiRes.summary || null;
          await supabase
            .from("leads")
            .update({ ai_score: aiScore, ai_category: aiCategory, ai_summary: aiSummary })
            .eq("email", data.email)
            .is("ai_score", null);
        }
      } catch (aiErr) {
        console.warn("[ai] lead scoring failed:", aiErr?.message);
      }
    }

    let emailError = null
    if (process.env.RESEND_API_KEY) {
      const emails = [];

      if (aiCategory === "spam") {
        // spam — no notification, no auto-reply
      } else if (aiScore >= 70) {
        // hot — priority alert + fast reply
        emails.push(sendHotLeadAlert(data, aiScore, aiCategory, aiSummary));
        if (data.email) emails.push(sendLeadAutoReply(data));
      } else {
        // warm/cold — standard notification + auto-reply
        emails.push(sendNewLeadNotification(data));
        if (data.email) emails.push(sendLeadAutoReply(data));
      }

      const results = await Promise.allSettled(emails);
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

    if (process.env.GOOGLE_API && data.content) {
      try {
        const { callAIJson } = await import("@/lib/ai/provider");
        const { reviewModerationPrompt } = await import("@/lib/ai/prompts");
        const prompt = reviewModerationPrompt(data);
        const aiRes = await callAIJson(prompt.system, prompt.user);
        if (aiRes && !aiRes.is_spam && aiRes.score >= 60) {
          await supabase.from("reviews").update({ status: "approved" }).eq("email", data.email).eq("status", "pending");
        }
      } catch (aiErr) {
        console.warn("[ai] review moderation skipped:", aiErr?.message);
      }
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
