import { resend } from "@/lib/email/resend";
import NewLeadEmail from "@/emails/new-lead-notification";
import LeadAutoReply from "@/emails/lead-autoreply";
import ProposalEmail from "@/emails/proposal-email";
import InvoiceEmail from "@/emails/invoice-email";
import OverdueReminder from "@/emails/overdue-reminder";
import ClientWelcome from "@/emails/client-welcome";
import { generateProposalPdf, generateInvoicePdf } from "@/lib/pdf/generate";

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

  const pdfBuffer = await generateProposalPdf(proposal, lead);

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
      attachments: [
        {
          filename: `Proposal-${proposal.title.replace(/[^a-zA-Z0-9]/g, "-")}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  } catch (raw) {
    console.error("[resend] proposal email threw:", raw);
    throw new Error(raw?.message || "Failed to send proposal email");
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send proposal email");
  return result;
}

export async function sendClientWelcome(client) {
  if (!client?.email) return;

  if (isTestMode() && client.email !== ADMIN) {
    testModeWarning(client.email);
    return { success: false, message: "Cannot send in test mode" };
  }

  const result = await resend.emails.send({
    from: FROM,
    to: [client.email],
    subject: "Welcome to Meteoric — Let's Build Something Great",
    react: ClientWelcome({ name: client.name }),
  });
  if (result?.error) console.error("[resend] client welcome failed:", result.error);
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

  const pdfBuffer = await generateInvoicePdf(invoice, client);

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
      attachments: [
        {
          filename: `Invoice-${invoice.invoice_number}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
  } catch (raw) {
    console.error("[resend] invoice email threw:", raw);
    throw new Error(raw?.message || "Failed to send invoice email");
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send invoice email");
  return result;
}

export async function sendOverdueReminder(invoice, client, previewUrl) {
  if (!client?.email) throw new Error("Client has no email address");

  const dueDate = invoice.due_date
    ? new Date(invoice.due_date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  const daysOverdue = invoice.due_date
    ? Math.floor((Date.now() - new Date(invoice.due_date).getTime()) / 86400000)
    : 0;

  let result;
  try {
    result = await resend.emails.send({
      from: FROM,
      to: client.email,
      subject: `Overdue: Invoice ${invoice.invoice_number} — ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} past due`,
      react: OverdueReminder({
        name: client.name,
        invoiceNumber: invoice.invoice_number,
        total: invoice.total,
        dueDate,
        daysOverdue,
        previewUrl,
      }),
    });
  } catch (raw) {
    console.error("[resend] overdue reminder threw:", raw);
    throw new Error(raw?.message || "Failed to send overdue reminder");
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send overdue reminder");
  return result;
}
