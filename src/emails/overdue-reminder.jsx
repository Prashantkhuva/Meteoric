import { Html, Head, Preview, Body, Container, Text, Hr, Link } from "react-email";
import EmailLogo from "./EmailLogo";
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

const CURRENCY_SYMBOLS = {
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
function getSymbol(c) {
  return CURRENCY_SYMBOLS[c] || c || "$";
}
function formatAmount(n) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const box = { ...inset, margin: "20px 0" };
const boxLabel = { ...label, margin: "0 0 4px 0" };
const boxValue = { ...value, margin: "0 0 12px 0" };
const strongRed = { fontWeight: 700, color: "#b91c1c" };

export default function OverdueReminder({
  name,
  invoiceNumber,
  total,
  currency = "USD",
  dueDate,
  daysOverdue,
  previewUrl,
}) {
  const sym = getSymbol(currency);
  return (
    <Html>
      <Head />
      <Preview>
        Overdue Invoice {invoiceNumber} — Please Remit Payment
      </Preview>
      <Body style={page}>
        <Container style={container}>
          <EmailLogo />
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
          <div style={box}>
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
