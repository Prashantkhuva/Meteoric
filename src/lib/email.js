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
  if (!r) return
  const { default: NewLeadEmail } = await import("@/emails/new-lead-notification")
  return r.emails.send({
    from: process.env.FROM_EMAIL,
    to: [process.env.ADMIN_EMAIL],
    subject: `New lead from ${lead.name || lead.email}`,
    react: NewLeadEmail(lead),
  })
}

export async function sendLeadAutoReply(lead) {
  const r = getResend()
  if (!r || !lead.email) return
  const { default: LeadAutoReply } = await import("@/emails/lead-autoreply")
  return r.emails.send({
    from: process.env.FROM_EMAIL,
    to: [lead.email],
    subject: "Thank you for reaching out — Meteoric",
    react: LeadAutoReply({ name: lead.name }),
  })
}
