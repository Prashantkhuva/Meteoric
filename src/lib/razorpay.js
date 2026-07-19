import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export function isRazorpayConfigured() {
  return !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder({ amount, currency, receipt }) {
  if (!isRazorpayConfigured()) return null;

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: receipt || undefined,
    });
    return order;
  } catch (err) {
    console.error("[razorpay] order creation failed:", err);
    return null;
  }
}

export function verifyRazorpayPayment({ order_id, payment_id, signature }) {
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");
  return generated === signature;
}
