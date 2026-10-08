import { Html, Preview, Body, Container, Text, Hr, Link } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import {
  page,
  container,
  eyebrow,
  greeting,
  paragraph,
  strong,
  label,
  value,
  amount,
  divider,
  inset,
  hr,
  primaryButton,
  closing,
  signoff,
  footer,
  link,
} from "./theme";
import type { CSSProperties } from "react";

interface OverdueReminderProps {
  name?: string | null;
  invoiceNumber?: string | number | null;
  total: number | string;
  currency?: string | null;
  dueDate?: string | null;
  daysOverdue: number;
  previewUrl?: string;
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
  AED: "AED",
};
function getSymbol(c: string | null): string {
  return CURRENCY_SYMBOLS[c ?? ""] || c || "$";
}
function formatAmount(n: number | string): string {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const box: CSSProperties = { ...inset, margin: "20px 0" };
const boxLabel: CSSProperties = { ...label, margin: "0 0 4px 0" };
const boxValue: CSSProperties = { ...value, margin: "0 0 12px 0" };
const strongRed: CSSProperties = { fontWeight: 700, color: "#b91c1c !important" };

export default function OverdueReminder({
  name,
  invoiceNumber,
  total,
  currency = "USD",
  dueDate,
  daysOverdue,
  previewUrl,
}: OverdueReminderProps) {
  const sym = getSymbol(currency);
  return (
    <Html>
      <EmailHead />
      <Preview>
        Overdue Invoice {invoiceNumber as string} — Please Remit Payment
      </Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Overdue" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Payment reminder</Text>
          <Text style={greeting}>Hi {name || "there"},</Text>
          <Text style={paragraph}>
            This is a reminder that invoice{" "}
            <strong style={strong}>{invoiceNumber}</strong> for{" "}
            <strong style={strong}>
              {sym}
              {formatAmount(total)}
            </strong>{" "}
            is now{" "}
            <strong style={strongRed}>
              {daysOverdue} day{daysOverdue !== 1 ? "s" : ""} overdue
            </strong>
            .
          </Text>
          <div className="email-inset" bgcolor="#fafaf7" style={box}>
            <Text style={boxLabel}>Invoice Number</Text>
            <Text style={boxValue}>{invoiceNumber}</Text>
            <div style={divider} />
            <Text style={boxLabel}>Total Amount</Text>
            <Text style={amount}>
              {sym}
              {formatAmount(total)}
            </Text>
            {dueDate && (
              <>
                <div style={divider} />
                <Text style={boxLabel}>Due Date</Text>
                <Text style={{ ...boxValue, marginBottom: 0 }}>
                  {dueDate}
                </Text>
              </>
            )}
          </div>
          <Text style={{ margin: "0 0 20px 0" }}>
            <Link href={previewUrl} style={primaryButton}>
              View Invoice &amp; Pay Now
            </Link>
          </Text>
          <Text style={paragraph}>
            Please remit payment at your earliest convenience to avoid any
            service interruption. If you have already paid, please disregard
            this notice.
          </Text>
          <Hr style={hr} />
          <Text style={closing}>
            Thank you for your prompt attention to this matter.
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
          <Text style={footer}>
            <Link href="https://withmeteoric.com" style={link}>
              withmeteoric.com
            </Link>{" "}
            · Web development &amp; SaaS agency
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
