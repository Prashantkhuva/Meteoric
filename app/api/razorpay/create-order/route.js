import { NextResponse } from "next/server";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";

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

  const { amount, currency, receipt } = body;

  if (!amount || isNaN(Number(amount))) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const amountPaise = Math.round(Number(amount) * 100);
  if (amountPaise < 100) {
    return NextResponse.json({ error: "Minimum amount is ₹1 (100 paise)" }, { status: 400 });
  }

  const order = await createRazorpayOrder({ amount, currency, receipt });
  if (!order) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }

  return NextResponse.json({
    order_id: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
