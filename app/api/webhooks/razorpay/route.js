import { NextResponse } from "next/server";
import { verifyRazorpayWebhook, fetchRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";
import { createServiceClient } from "@/lib/supabase/service";
import { sendPaymentConfirmation } from "@/lib/email/email";
import { createNotification, NOTIFICATION_TYPES } from "@/lib/notifications";

function ack() {
  return NextResponse.json({ received: true });
}

async function markInvoicePaid(orderId, paymentId) {
  const supabase = createServiceClient();
  if (!supabase) {
    console.error("[razorpay:webhook] supabase not configured");
    return;
  }

  // Orders are created with receipt = invoice_number (see razorpay_service.dart).
  const order = await fetchRazorpayOrder(orderId);
  const invoiceNumber = order?.receipt;
  if (!invoiceNumber) {
    console.error(`[razorpay:webhook] no receipt on order ${orderId}`);
    return;
  }

  const { data: invoice } = await supabase
    .from("invoices")
    .select("id, invoice_number, status")
    .eq("invoice_number", invoiceNumber)
    .maybeSingle();
  if (!invoice) {
    console.error(`[razorpay:webhook] no invoice matching receipt "${invoiceNumber}"`);
    return;
  }

  const paidAt = new Date().toISOString();
  const { data: updated } = await supabase
    .from("invoices")
    .update({ status: "paid", paid_at: paidAt })
    .eq("id", invoice.id)
    .neq("status", "paid")
    .select("id")
    .maybeSingle();

  // Duplicate webhook delivery or already paid manually — nothing to do.
  if (!updated) return;

  const { data: full } = await supabase
    .from("invoices")
    .select("*, client:clients(name, email, phone), bank_account:bank_accounts(*)")
    .eq("id", invoice.id)
    .single();

  if (full?.client?.email) {
    try {
      await sendPaymentConfirmation({ ...full, paid_at: paidAt }, full.client);
    } catch (err) {
      console.error("[razorpay:webhook] confirmation email failed:", err.message);
    }
  }

  await createNotification({
    type: NOTIFICATION_TYPES.PAYMENT_RECEIVED,
    title: `Payment received · ${full?.invoice_number || invoice.invoice_number}`,
    body:
      full?.total != null
        ? `${full.currency || "USD"} ${Number(full.total).toFixed(2)}${full?.client?.name ? ` — ${full.client.name}` : ""}`
        : null,
    entityType: "invoice",
    entityId: invoice.id,
    dedupeKey: `invoice_paid:${invoice.id}`,
  });

  console.log(`[razorpay:webhook] invoice ${invoice.invoice_number} marked paid (payment ${paymentId})`);
}

export async function POST(request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }

  const raw = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyRazorpayWebhook(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event?.event !== "payment.captured") {
    return ack();
  }

  const payment = event?.payload?.payment?.entity;
  const orderId = payment?.order_id;
  if (!orderId) return ack();

  try {
    await markInvoicePaid(orderId, payment.id);
    return ack();
  } catch (err) {
    // 5xx makes Razorpay retry — transient failures get a second chance.
    console.error("[razorpay:webhook] processing failed:", err.message);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
