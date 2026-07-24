"use client";

import { useCallback } from "react";

export default function RazorpayCheckout({
  orderId,
  amount,
  currency,
  name,
  email,
  invoiceNumber,
}) {
  const handlePayment = useCallback(async () => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: orderId,
      amount,
      currency: currency || "INR",
      name: "Meteoric",
      description: `Invoice ${invoiceNumber || ""}`,
      prefill: { name, email },
      theme: { color: "#5F259F" },
      handler: async function (response) {
        try {
          const res = await fetch("/api/razorpay/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const data = await res.json();
          if (data.success) {
            window.location.reload();
          } else {
            alert("Payment verification failed. Please contact us.");
          }
        } catch {
          alert("Payment verification failed. Please contact us.");
        }
      },
      modal: {
        ondismiss: function () {
          // ponytail: user dismissed modal, no action needed
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert(response.error?.description || "Payment failed. Please try again.");
    });
    rzp.open();
  }, [orderId, amount, currency, name, email, invoiceNumber]);

  return (
    <button
      onClick={handlePayment}
      className="inline-flex items-center justify-center px-5 py-3 transition-all hover:opacity-90 active:scale-[0.97]"
      style={{
        backgroundColor: "#0a0a0a",
        border: "1px solid #1B1B1B",
        borderRadius: "6px",
      }}
    >
      <img
        src="/new-upi-lg.svg"
        alt="UPI"
        width="63"
        height="20"
        style={{ display: "block" }}
      />
    </button>
  );
}
