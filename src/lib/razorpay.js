const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

export function isRazorpayConfigured() {
  return !!(KEY_ID && KEY_SECRET);
}

export async function createRazorpayOrder({ amount, currency, receipt }) {
  if (!isRazorpayConfigured()) return null;

  const auth = Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64");

  const res = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: Math.round(Number(amount) * 100), // paise
      currency: currency || "INR",
      receipt: receipt || undefined,
      payment_capture: 1,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error("[razorpay] order creation failed:", err);
    return null;
  }

  return res.json();
}

export function getRazorpayCheckoutUrl(orderId, amount) {
  return `https://checkout.razorpay.com/v1/checkout.js?order_id=${orderId}&amount=${amount}`;
}
