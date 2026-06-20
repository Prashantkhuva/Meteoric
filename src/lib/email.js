import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNewLeadNotification(lead) {
  const { default: NewLeadEmail } = await import(
    "@/emails/new-lead-notification"
  );
  return resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: [process.env.ADMIN_EMAIL],
    subject: `New lead from ${lead.name || lead.email}`,
    react: NewLeadEmail(lead),
  });
}

export async function sendLeadAutoReply(lead) {
  const { default: LeadAutoReply } = await import(
    "@/emails/lead-autoreply"
  );
  return resend.emails.send({
    from: process.env.FROM_EMAIL,
    to: [lead.email],
    subject: "Thank you for reaching out — Meteoric",
    react: LeadAutoReply({ name: lead.name }),
  });
}
