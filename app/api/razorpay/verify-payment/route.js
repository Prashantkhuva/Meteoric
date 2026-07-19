import { NextResponse } from "next/server";
import { verifyRazorpayPayment, isRazorpayConfigured } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";
import { sendPaymentConfirmation } from "@/lib/email/email";

export async function POST(request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, invoice_id } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const isValid = verifyRazorpayPayment({
    order_id: razorpay_order_id,
    payment_id: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!isValid) {
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }

  if (invoice_id) {
    try {
      const supabase = await createClient();
      if (supabase) {
        const paidAt = new Date().toISOString();
        const { error } = await supabase
          .from("invoices")
          .update({ status: "paid", paid_at: paidAt })
          .eq("id", invoice_id);

        if (error) {
          console.error("[razorpay] failed to mark invoice paid:", error.message);
        } else {
          const { data: invoice } = await supabase
            .from("invoices")
            .select("*, client:clients(name, email, phone), bank_account:bank_accounts(*)")
            .eq("id", invoice_id)
            .single();

          if (invoice?.client?.email) {
            try {
              await sendPaymentConfirmation({ ...invoice, paid_at: paidAt }, invoice.client);
            } catch (err) {
              console.error("[razorpay] payment confirmation email failed:", err.message);
            }
          }
        }
      }
    } catch (err) {
      console.error("[razorpay] post-payment error:", err.message);
    }
  }

  return NextResponse.json({ success: true });
}
