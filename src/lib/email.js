let _resend = null

function getResend() {
  if (!_resend && process.env.RESEND_API_KEY) {
    const { Resend } = require("resend")
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export async function sendNewLeadNotification(lead) {
  const r = getResend()
  if (!r) { console.log("[email] RESEND_API_KEY not set"); return }
  const { default: NewLeadEmail } = await import("@/emails/new-lead-notification")
  const result = await r.emails.send({
    from: process.env.FROM_EMAIL,
    to: [process.env.ADMIN_EMAIL],
    subject: `New lead from ${lead.name || lead.email}`,
    react: NewLeadEmail(lead),
  })
  if (result?.error) console.error("[email] admin notification failed:", result.error)
  else console.log("[email] admin notification sent")
  return result
}

export async function sendLeadAutoReply(lead) {
  const r = getResend()
  if (!r) { console.log("[email] RESEND_API_KEY not set"); return }
  if (!lead.email) { console.log("[email] no lead email, skipping auto-reply"); return }
  const { default: LeadAutoReply } = await import("@/emails/lead-autoreply")
  console.log("[email] sending auto-reply to", lead.email)
  const result = await r.emails.send({
    from: process.env.FROM_EMAIL,
    to: [lead.email],
    subject: "Thank you for reaching out — Meteoric",
    react: LeadAutoReply({ name: lead.name }),
  })
  if (result?.error) console.error("[email] auto-reply failed:", result.error)
  else console.log("[email] auto-reply sent to", lead.email)
  return result
}
