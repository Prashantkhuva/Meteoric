import { resend } from "@/lib/email/resend";
import NewLeadEmail from "@/emails/new-lead-notification";
import LeadAutoReply from "@/emails/lead-autoreply";
import ProposalEmail from "@/emails/proposal-email";
import InvoiceEmail from "@/emails/invoice-email";

const FROM =
  process.env.FROM_EMAIL || "Meteoric <onboarding@resend.dev>";
const ADMIN = process.env.ADMIN_EMAIL;
const DOMAIN = (FROM || "").match(/@([^>]+)/)?.[1];

function isTestMode() {
  return DOMAIN === "resend.dev";
}

function testModeWarning(recipient) {
  console.warn(
    `[resend] Test mode: can only send to ${ADMIN}, not ${recipient}. ` +
      `Verify a domain at https://resend.com/domains and update FROM_EMAIL.`
  );
}

export async function sendNewLeadNotification(lead) {
  const result = await resend.emails.send({
    from: FROM,
    to: [ADMIN],
    subject: `New lead from ${lead.name || lead.email}`,
    react: NewLeadEmail(lead),
  });
  if (result?.error) console.error("[resend] admin notification failed:", result.error);
  return result;
}

export async function sendLeadAutoReply(lead) {
  if (!lead.email) return;

  if (isTestMode() && lead.email !== ADMIN) {
    testModeWarning(lead.email);
    return { success: false, message: "Cannot send in test mode — verify a domain first" };
  }

  const result = await resend.emails.send({
    from: FROM,
    to: [lead.email],
    subject: "Thank you for reaching out — Meteoric",
    react: LeadAutoReply({ name: lead.name }),
  });
  if (result?.error) console.error("[resend] auto-reply failed:", result.error);
  return result;
}

export async function sendProposalEmail(proposal, lead, previewUrl) {
  if (!lead?.email) throw new Error("Lead has no email address");

  if (isTestMode() && lead.email !== ADMIN) {
    testModeWarning(lead.email);
    throw new Error("Cannot send — verify a custom domain in Resend first (test mode only delivers to admin)");
  }

  let result;
  try {
    result = await resend.emails.send({
      from: FROM,
      to: lead.email,
      subject: `Proposal: ${proposal.title}`,
      react: ProposalEmail({
        name: lead.name,
        title: proposal.title,
        timeline: proposal.timeline,
        terms: proposal.terms,
        previewUrl,
      }),
    });
  } catch (raw) {
    console.error("[resend] proposal email threw:", raw);
    throw new Error(raw?.message || "Failed to send proposal email");
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send proposal email");
  return result;
}

export async function sendInvoiceEmail(invoice, client, previewUrl) {
  if (!client?.email) throw new Error("Client has no email address");

  if (isTestMode() && client.email !== ADMIN) {
    testModeWarning(client.email);
    throw new Error("Cannot send — verify a custom domain in Resend first (test mode only delivers to admin)");
  }

  const dueDate = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  let result;
  try {
    result = await resend.emails.send({
      from: FROM,
      to: client.email,
      subject: `Invoice ${invoice.invoice_number} from Meteoric`,
      react: InvoiceEmail({
        name: client.name,
        invoiceNumber: invoice.invoice_number,
        total: invoice.total,
        dueDate,
        previewUrl,
      }),
    });
  } catch (raw) {
    console.error("[resend] invoice email threw:", raw);
    throw new Error(raw?.message || "Failed to send invoice email");
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send invoice email");
  return result;
}
