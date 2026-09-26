import Razorpay from "razorpay";
import crypto from "crypto";

let razorpay;

function getClient() {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

export function isRazorpayConfigured() {
  return !!(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder({ amount, currency, receipt }) {
  if (!isRazorpayConfigured()) {
    console.error("[razorpay] not configured — check NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET env vars");
    return { error: "Razorpay not configured" };
  }

  try {
    const order = await getClient().orders.create({
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: receipt || undefined,
    });
    return order;
  } catch (err) {
    const msg = err?.error?.description || err?.message || String(err);
    console.error("[razorpay] order creation failed:", msg);
    return { error: msg };
  }
}

export function verifyRazorpayPayment({ order_id, payment_id, signature }) {
  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(order_id + "|" + payment_id)
    .digest("hex");
  return generated === signature;
}

export function verifyRazorpayWebhook(rawBody, signature) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature || !rawBody) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signature, "utf8"));
  } catch {
    return false;
  }
}

export async function fetchRazorpayOrder(orderId) {
  if (!isRazorpayConfigured() || !orderId) return null;
  try {
    return await getClient().orders.fetch(orderId);
  } catch (err) {
    console.error("[razorpay] order fetch failed:", err?.message);
    return null;
  }
}
