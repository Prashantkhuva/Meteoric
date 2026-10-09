import { resend } from "@/lib/email/resend";
import NewLeadEmail from "@/emails/new-lead-notification";
import HotLeadAlert from "@/emails/hot-lead-alert";
import LeadAutoReply from "@/emails/lead-autoreply";
import ProposalEmail from "@/emails/proposal-email";
import InvoiceEmail from "@/emails/invoice-email";
import OverdueReminder from "@/emails/overdue-reminder";
import FollowUpReminder from "@/emails/follow-up-reminder";
import ClientWelcome from "@/emails/client-welcome";
import PaymentConfirmation from "@/emails/payment-confirmation";
import ReviewThankYou from "@/emails/review-thankyou";
import InvitationEmail from "@/emails/invitation-email";
import CustomEmail from "@/emails/custom-email";
import { generateProposalPdf, generateInvoicePdf } from "@/lib/pdf/generate";
import type { CreateEmailOptions, CreateEmailResponse } from "resend";
import type { Client, Invoice, Lead, Proposal } from "@/lib/types";

import { isRazorpayConfigured } from "@/lib/razorpay";

const FROM =
  process.env.FROM_EMAIL || "Meteoric <onboarding@resend.dev>";
const ADMIN = process.env.ADMIN_EMAIL;
const ADMIN_FROM = `Meteoric <${process.env.ADMIN_CONTACT_EMAIL || "admin@mail.withmeteoric.com"}>`;
const BILLING_FROM = `Meteoric <${process.env.BILLING_EMAIL || "billing@mail.withmeteoric.com"}>`;
const DOMAIN = (FROM || "").match(/@([^>]+)/)?.[1];

const SENDER_MAP: Record<string, string> = {
  contact: "contact@mail.withmeteoric.com",
  admin: process.env.ADMIN_CONTACT_EMAIL || "admin@mail.withmeteoric.com",
  billing: process.env.BILLING_EMAIL || "billing@mail.withmeteoric.com",
  support: process.env.SUPPORT_EMAIL || "support@mail.withmeteoric.com",
};

function sanitizeFilename(name?: string | null) {
  if (!name) return "attachment";
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_{2,}/g, "_").slice(0, 100);
}

function isTestMode() {
  return DOMAIN === "resend.dev";
}

function testModeWarning(recipient?: string | null) {
  console.warn(
    `[resend] Test mode: can only send to ${ADMIN}, not ${recipient}. ` +
      `Verify a domain at https://resend.com/domains and update FROM_EMAIL.`
  );
}

export async function sendNewLeadNotification(lead: Lead) {
  const result = await resend.emails.send({
    from: ADMIN_FROM,
    to: [ADMIN!],
    subject: `New lead from ${lead.name || lead.email}`,
    react: NewLeadEmail({ ...lead }),
  });
  if (result?.error) console.error("[resend] admin notification failed:", result.error);
  return result;
}

export async function sendHotLeadAlert(
  lead: Lead,
  score: number | string | null,
  category?: string | null,
  summary?: string | null
) {
  if (!ADMIN) return;
  const result = await resend.emails.send({
    from: ADMIN_FROM,
    to: [ADMIN],
    subject: `🔥 Hot lead (${score}): ${lead.name || lead.email}`,
    react: HotLeadAlert({
      lead,
      score: score as number | string,
      category,
      summary,
    }),
  });
  if (result?.error) console.error("[resend] hot lead alert failed:", result.error);
  return result;
}

export async function sendLeadAutoReply(lead: Lead) {
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

export async function sendProposalEmail(proposal: Proposal, lead: Lead | null, previewUrl?: string) {
  if (!lead?.email) throw new Error("Lead has no email address");

  if (isTestMode() && lead.email !== ADMIN) {
    testModeWarning(lead.email);
    throw new Error("Cannot send — verify a custom domain in Resend first (test mode only delivers to admin)");
  }

  const pdfBuffer = await generateProposalPdf(proposal, lead);

  let result: CreateEmailResponse;
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
    throw new Error((raw as { message?: string })?.message || "Failed to send proposal email", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send proposal email");
  return result;
}

export async function sendClientWelcome(client: Client) {
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

export async function sendInvoiceEmail(invoice: Invoice, client: Client | null, previewUrl?: string) {
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

  const pdfBuffer = await generateInvoicePdf(invoice, client, invoice.currency || "USD", previewUrl);

  const showUPI =
    invoice.currency === "INR" && invoice.bank_account?.upi_id && isRazorpayConfigured();

  let result: CreateEmailResponse;
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
        showUPI: showUPI as boolean,
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
    throw new Error((raw as { message?: string })?.message || "Failed to send invoice email", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send invoice email");
  return result;
}

export async function sendOverdueReminder(invoice: Invoice, client: Client | null, previewUrl?: string) {
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

  let result: CreateEmailResponse;
  try {
    result = await resend.emails.send({
      from: BILLING_FROM,
      to: client.email,
      subject: `Overdue: Invoice ${invoice.invoice_number} — ${daysOverdue} day${daysOverdue !== 1 ? "s" : ""} past due`,
      react: OverdueReminder({
        name: client.name,
        invoiceNumber: invoice.invoice_number,
        total: invoice.total,
        currency: invoice.currency,
        dueDate,
        daysOverdue,
        previewUrl,
      }),
    });
  } catch (raw) {
    console.error("[resend] overdue reminder threw:", raw);
    throw new Error((raw as { message?: string })?.message || "Failed to send overdue reminder", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send overdue reminder");
  return result;
}

export async function sendFollowUpReminder(
  lead: { name?: string | null; company?: string | null },
  when: string,
  minutes: number,
  note?: string | null
) {
  if (!ADMIN) return;
  try {
    const result = await resend.emails.send({
      from: ADMIN_FROM,
      to: [ADMIN],
      subject: `Follow-up in ${minutes} min: ${lead.name || "lead"}`,
      react: FollowUpReminder({
        leadName: lead.name,
        company: lead.company,
        when,
        minutes,
        note,
      }),
    });
    if (result?.error) console.error("[resend] follow-up reminder failed:", result.error);
    return result;
  } catch (raw) {
    console.error("[resend] follow-up reminder threw:", raw);
    return null;
  }
}

export async function sendCustomEmail({
  from,
  to,
  subject,
  html,
  attachments,
}: {
  from: string;
  to: Array<string | undefined>;
  subject: string;
  html: string;
  attachments?: Array<{ filename?: string | null; content?: string | Buffer | null }> | null;
}) {
  const fromAddress = SENDER_MAP[from] || SENDER_MAP.contact;

  if (isTestMode()) {
    const nonAdmin = to.find((e) => e !== ADMIN);
    if (nonAdmin) {
      testModeWarning(nonAdmin);
      throw new Error("Cannot send — verify a custom domain in Resend first (test mode only delivers to admin)");
    }
  }

  const safeAttachments = (attachments || [])
    .filter((a): a is { filename: string; content: string | Buffer } =>
      Boolean(a && a.filename && a.content)
    )
    .map((a) => ({
      filename: sanitizeFilename(a.filename),
      content: a.content,
    }));

  let result: CreateEmailResponse;
  try {
    const payload: CreateEmailOptions & { reply_to?: string } = {
      from: `Meteoric <${fromAddress}>`,
      to: to as string[],
      subject,
      react: CustomEmail({ html }),
      reply_to: fromAddress,
      attachments: safeAttachments.length > 0 ? safeAttachments : undefined,
    };
    result = await resend.emails.send(payload);
  } catch (raw) {
    console.error("[resend] custom email threw:", raw);
    throw new Error((raw as { message?: string })?.message || "Failed to send custom email", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send custom email");
  return result;
}

export async function sendInvitationEmail({
  name,
  email,
  role,
  password,
  loginUrl,
}: {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  password?: string | null;
  loginUrl?: string;
}) {
  if (!email) throw new Error("No email address provided");

  if (isTestMode() && email !== ADMIN) {
    testModeWarning(email);
    throw new Error("Cannot send — verify a domain in Resend first (test mode only delivers to admin)");
  }

  let result: CreateEmailResponse;
  try {
    result = await resend.emails.send({
      from: `Meteoric <${SENDER_MAP.admin}>`,
      to: email,
      subject: "You're invited to Meteoric Admin",
      react: InvitationEmail({ name, role, email, password, loginUrl }),
    });
  } catch (raw) {
    console.error("[resend] invitation email threw:", raw);
    throw new Error((raw as { message?: string })?.message || "Failed to send invitation email", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send invitation email");
  return result;
}

export async function sendPaymentConfirmation(invoice: Invoice, client: Client | null) {
  if (!client?.email) throw new Error("Client has no email address");

  if (isTestMode() && client.email !== ADMIN) {
    testModeWarning(client.email);
    throw new Error("Cannot send — verify a custom domain in Resend first (test mode only delivers to admin)");
  }

  const pdfBuffer = await generateInvoicePdf(invoice, client, invoice.currency || "USD");

  let result: CreateEmailResponse;
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
    throw new Error((raw as { message?: string })?.message || "Failed to send payment confirmation", { cause: raw });
  }
  if (result?.error) throw new Error(result.error.message || "Failed to send payment confirmation");
  return result;
}

export async function sendReviewThankYou(email?: string | null, name?: string | null) {
  if (!email) return;

  if (isTestMode() && email !== ADMIN) {
    testModeWarning(email);
    return { success: false, message: "Cannot send in test mode" };
  }

  const result = await resend.emails.send({
    from: FROM,
    to: [email],
    subject: "Thank you for your review — Meteoric",
    react: ReviewThankYou({ name }),
  });
  if (result?.error) console.error("[resend] review thank-you failed:", result.error);
  return result;
}
