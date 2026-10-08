import { Html, Preview, Body, Container, Text } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import {
  page,
  container,
  eyebrow,
  greeting,
  paragraph,
  label,
  value,
  amount,
  divider,
  inset,
  signoff,
  footer,
  link,
} from "./theme";
import type { CSSProperties } from "react";

interface PaymentConfirmationProps {
  name?: string | null;
  invoiceNumber?: string | number | null;
  total: number | string;
  currency?: string;
  paidAt?: string | null;
}


const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  INR: "\u20B9",
  CAD: "CA$",
  AUD: "AU$",
  SGD: "S$",
  JPY: "\u00A5",
};
function getSymbol(c: string): string {
  return CURRENCY_SYMBOLS[c] || c || "$";
}

const box: CSSProperties = { ...inset, margin: "20px 0" };
const boxLabel: CSSProperties = { ...label, margin: "0 0 4px 0" };
const boxValue: CSSProperties = { ...value, margin: "0 0 12px 0" };
const strongPaid: CSSProperties = { fontWeight: 700, color: "#15803d !important" };

export default function PaymentConfirmation({
  name,
  invoiceNumber,
  total,
  currency = "USD",
  paidAt,
}: PaymentConfirmationProps) {
  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "today";
  const formattedTotal = `${getSymbol(currency)}${Number(total).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return (
    <Html>
      <EmailHead />
      <Preview>Payment Confirmed — Invoice {invoiceNumber as string}</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Payment" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Payment received</Text>
          <Text style={greeting}>Hi {name || "there"},</Text>
          <Text style={paragraph}>
            We&apos;ve received your payment. Thank you!
          </Text>
          <div className="email-inset" bgcolor="#fafaf7" style={box}>
            <Text style={boxLabel}>Invoice Number</Text>
            <Text style={boxValue}>{invoiceNumber}</Text>
            <div style={divider} />
            <Text style={boxLabel}>Amount Paid</Text>
            <Text style={amount}>{formattedTotal}</Text>
            <div style={divider} />
            <Text style={boxLabel}>Payment Date</Text>
            <Text style={{ ...boxValue, marginBottom: 0 }}>
              {formattedDate}
            </Text>
          </div>
          <Text style={paragraph}>
            Your invoice has been marked as{" "}
            <strong style={strongPaid}>paid</strong>. A paid-stamped receipt is
            attached to this email for your records.
          </Text>
          <Text style={paragraph}>
            It was a pleasure working with you. If you ever need web
            development, SaaS, or landing page services in the future,
            don&apos;t hesitate to reach out.
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
          <Text style={footer}>
            <a href="https://withmeteoric.com" style={link}>
              withmeteoric.com
            </a>{" "}
            · Web development &amp; SaaS agency
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
