import { NextResponse } from "next/server";
import { verifyRazorpayPayment, isRazorpayConfigured } from "@/lib/razorpay";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
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
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  if (invoice_id) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase
        .from("invoices")
        .update({ status: "paid", paid_at: new Date().toISOString() })
        .eq("id", invoice_id);
      if (error) console.error("[razorpay] failed to mark invoice paid:", error.message);
    }
  }

  return NextResponse.json({ success: true });
}
