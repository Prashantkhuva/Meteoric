import { resend } from "@/lib/email/resend";
import NewLeadEmail from "@/emails/new-lead-notification";
import HotLeadAlert from "@/emails/hot-lead-alert";
import LeadAutoReply from "@/emails/lead-autoreply";
import ProposalEmail from "@/emails/proposal-email";
import InvoiceEmail from "@/emails/invoice-email";
import OverdueReminder from "@/emails/overdue-reminder";
import ClientWelcome from "@/emails/client-welcome";
import PaymentConfirmation from "@/emails/payment-confirmation";
import ReviewThankYou from "@/emails/review-thankyou";
import CustomEmail from "@/emails/custom-email";
import { generateProposalPdf, generateInvoicePdf } from "@/lib/pdf/generate";
import { getSiteUrl } from "@/config/site-url";

import { createRazorpayOrder, getRazorpayCheckoutUrl, isRazorpayConfigured } from "@/lib/razorpay";

const FROM =
  process.env.FROM_EMAIL || "Meteoric <onboarding@resend.dev>";
const ADMIN = process.env.ADMIN_EMAIL;
const ADMIN_FROM = `Meteoric <${process.env.ADMIN_CONTACT_EMAIL || "admin@withmeteoric.com"}>`;
const BILLING_FROM = `Meteoric <${process.env.BILLING_EMAIL || "billing@withmeteoric.com"}>`;
const DOMAIN = (FROM || "").match(/@([^>]+)/)?.[1];

const SENDER_MAP = {
  contact: "contact@withmeteoric.com",
  admin: process.env.ADMIN_CONTACT_EMAIL || "admin@withmeteoric.com",
  billing: process.env.BILLING_EMAIL || "billing@withmeteoric.com",
  support: process.env.SUPPORT_EMAIL || "support@withmeteoric.com",
};

function sanitizeFilename(name) {
  if (!name) return "attachment";
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_").slice(0, 100);
}

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
    from: ADMIN_FROM,
    to: [ADMIN],
    subject: `New lead from ${lead.name || lead.email}`,
    react: NewLeadEmail(lead),
  });
  if (result?.error) console.error("[resend] admin notification failed:", result.error);
  return result;
}

export async function sendHotLeadAlert(lead, score, category, summary) {
  if (!ADMIN) return;
  const result = await resend.emails.send({
    from: ADMIN_FROM,
    to: [ADMIN],
    subject: `🔥 Hot lead (${score}): ${lead.name || lead.email}`,
    react: HotLeadAlert({ lead, score, category, summary }),
  });
  if (result?.error) console.error("[resend] hot lead alert failed:", result.error);
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
      from: ADMIN_FROM,
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
          filename: sanitizeFilename(`Proposal-${proposal.title}.pdf`),
          content: pdfBuffer,
        },
      ],
    });
  } catch (raw) {
    console.error("[resend] proposal email threw:", raw);
    throw new Error(raw?.message || "Failed to send proposal email", { cause: raw });
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

  const pdfBuffer = await generateInvoicePdf(invoice, client, invoice.currency || "USD");

  let razorpayUrl = null;
  if (invoice.currency === "INR" && invoice.bank_account?.upi_id && isRazorpayConfigured()) {
    const order = await createRazorpayOrder({
      amount: invoice.total,
      currency: "INR",
      receipt: invoice.invoice_number,
    });
    if (order?.id) {
      razorpayUrl = getRazorpayCheckoutUrl(order.id, invoice.total);
    }
  }

  let result;
  try {
    result = await resend.emails.send({
      from: BILLING_FROM,
      to: client.email,
      subject: `Invoice ${invoice.invoice_number} from Meteoric`,
      react: InvoiceEmail({
        name: client.name,
        invoiceNumber: invoice.invoice_number,
        total: invoice.total,
        currency: invoice.currency || "USD",
        dueDate,
        previewUrl,
        bankAccount: invoice.bank_account || null,
        razorpayUrl,
      }),
      attachments: [
        {
          filename: sanitizeFilename(`Invoice-${invoice.invoice_number}.pdf`),
          content: pdfBuffer,
        },
      ],
    });
  } catch (raw) {
    console.error("[resend] invoice email threw:", raw);
    throw new Error(raw?.message || "Failed to send invoice email", { cause: raw });
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
      from: BILLING_FROM,
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
    throw new Error(raw?.message || "Failed to send overdue reminder", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send overdue reminder");
  return result;
}

export async function sendCustomEmail({ from, to, subject, html, attachments }) {
  const fromAddress = SENDER_MAP[from] || SENDER_MAP.contact;

  if (isTestMode()) {
    const nonAdmin = to.find((e) => e !== ADMIN);
    if (nonAdmin) {
      testModeWarning(nonAdmin);
      throw new Error("Cannot send — verify a custom domain in Resend first (test mode only delivers to admin)");
    }
  }

  const safeAttachments = (attachments || []).filter(
    (a) => a && a.filename && a.content
  ).map((a) => ({
    filename: sanitizeFilename(a.filename),
    content: a.content,
  }));

  let result;
  try {
    result = await resend.emails.send({
      from: `Meteoric <${fromAddress}>`,
      to,
      subject,
      react: CustomEmail({ html }),
      reply_to: fromAddress,
      attachments: safeAttachments.length > 0 ? safeAttachments : undefined,
    });
  } catch (raw) {
    console.error("[resend] custom email threw:", raw);
    throw new Error(raw?.message || "Failed to send custom email", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send custom email");
  return result;
}

export async function sendPaymentConfirmation(invoice, client) {
  if (!client?.email) throw new Error("Client has no email address");

  if (isTestMode() && client.email !== ADMIN) {
    testModeWarning(client.email);
    throw new Error("Cannot send — verify a custom domain in Resend first (test mode only delivers to admin)");
  }

  const pdfBuffer = await generateInvoicePdf(invoice, client, invoice.currency || "USD");

  let result;
  try {
    result = await resend.emails.send({
      from: BILLING_FROM,
      to: client.email,
      subject: `Payment Confirmed — Invoice ${invoice.invoice_number}`,
      react: PaymentConfirmation({
        name: client.name,
        invoiceNumber: invoice.invoice_number,
        total: invoice.total,
        currency: invoice.currency || "USD",
        paidAt: invoice.paid_at,
      }),
      attachments: [
        {
          filename: sanitizeFilename(`Invoice-${invoice.invoice_number}-PAID.pdf`),
          content: pdfBuffer,
        },
      ],
    });
  } catch (raw) {
    console.error("[resend] payment confirmation threw:", raw);
    throw new Error(raw?.message || "Failed to send payment confirmation", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send payment confirmation");
  return result;
}

export async function sendReviewThankYou(email, name) {
  if (!email) return;

  if (isTestMode() && email !== ADMIN) {
    testModeWarning(email);
    return { success: false, message: "Cannot send in test mode" };
  }

  const result = await resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Thank you for your review — Meteoric",
    react: ReviewThankYou({ name, siteUrl: getSiteUrl() }),
  });
  if (result?.error) console.error("[resend] review thank-you failed:", result.error);
  return result;
}
