import { Html, Preview, Body, Container, Text, Link, Img } from "react-email";
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
  primaryButton,
  closing,
  signoff,
  footer,
  link,
  colors,
} from "./theme";

const SITE_URL = "https://withmeteoric.com";
const WISE_BASE = "https://wise.com/pay/business/khuvaprashantdayanandbhai1";
const PAYPAL_ME = "https://paypal.me/Prashantkhuva";
const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "\u20AC",
  GBP: "\u00A3",
  INR: "\u20B9",
  CAD: "CA$",
  AUD: "AU$",
  SGD: "S$",
  JPY: "\u00A5",
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

const invoiceBox = { ...inset, margin: "20px 0" };
const boxLabel = { ...label, margin: "0 0 4px 0" };
const boxValue = { ...value, margin: "0 0 12px 0" };

const bankSection = {
  ...inset,
  margin: "0 0 20px 0",
};
const bankTitle = {
  fontSize: "11px",
  fontWeight: 700,
  color: `${colors.inkText} !important`,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  margin: "0 0 12px 0",
};
const bankLine = {
  fontSize: "13px",
  color: `${colors.body} !important`,
  lineHeight: "1.9",
  margin: 0,
};
const bankLabel = { color: `${colors.inkText} !important`, fontWeight: 600 };

const wiseButton = {
  display: "inline-block",
  padding: "14px 24px",
  backgroundColor: "#9FE870",
  color: "#0a0a0a",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.02em",
  textDecoration: "none",
  borderRadius: "100px",
};
const paypalButton = {
  display: "inline-block",
  padding: "14px 24px",
  backgroundColor: "#0070BA",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.02em",
  textDecoration: "none",
  borderRadius: "100px",
};
const upiButton = {
  display: "inline-block",
  padding: "14px 24px",
  backgroundColor: colors.ink,
  textDecoration: "none",
  borderRadius: "100px",
};

export default function InvoiceEmail({
  name,
  invoiceNumber,
  total,
  currency,
  dueDate,
  previewUrl,
  bankAccount,
  showUPI,
}) {
  const curr = currency || "USD";
  const sym = getSymbol(curr);
  const wiseUrl = `${WISE_BASE}?currency=${curr}&amount=${formatAmount(total)}`;
  const paypalUrl = `${PAYPAL_ME}/${formatAmount(total)}${curr}`;
  return (
    <Html>
      <EmailHead />
      <Preview>Invoice {invoiceNumber} from Meteoric</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Invoice {invoiceNumber}</Text>
          <Text style={greeting}>Hi {name || "there"},</Text>
          <Text style={paragraph}>
            An invoice has been issued for your recent project with us.
          </Text>
          <div className="email-inset" bgcolor="#fafaf7" style={invoiceBox}>
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
                <Text style={{ ...boxValue, marginBottom: 0 }}>{dueDate}</Text>
              </>
            )}
          </div>
          {bankAccount && (
            <div className="email-inset" bgcolor="#fafaf7" style={bankSection}>
              <Text style={bankTitle}>Bank Transfer Details</Text>
              {bankAccount.bank_name && (
                <Text style={bankLine}>
                  <span style={bankLabel}>Bank: </span>
                  {bankAccount.bank_name}
                </Text>
              )}
              {bankAccount.account_holder && (
                <Text style={bankLine}>
                  <span style={bankLabel}>Name: </span>
                  {bankAccount.account_holder}
                </Text>
              )}
              {bankAccount.account_number && (
                <Text style={bankLine}>
                  <span style={bankLabel}>Account No: </span>
                  {bankAccount.account_number}
                </Text>
              )}
              {bankAccount.iban && (
                <Text style={bankLine}>
                  <span style={bankLabel}>IBAN: </span>
                  {bankAccount.iban}
                </Text>
              )}
              {bankAccount.swift_bic && (
                <Text style={bankLine}>
                  <span style={bankLabel}>SWIFT/BIC: </span>
                  {bankAccount.swift_bic}
                </Text>
              )}
              {bankAccount.routing_number && (
                <Text style={bankLine}>
                  <span style={bankLabel}>Routing: </span>
                  {bankAccount.routing_number}
                </Text>
              )}
              {bankAccount.ifsc && (
                <Text style={bankLine}>
                  <span style={bankLabel}>IFSC: </span>
                  {bankAccount.ifsc}
                </Text>
              )}
              {bankAccount.currency && (
                <Text style={bankLine}>
                  <span style={bankLabel}>Currency: </span>
                  {bankAccount.currency}
                </Text>
              )}
              {bankAccount.country && (
                <Text style={bankLine}>
                  <span style={bankLabel}>Country: </span>
                  {bankAccount.country}
                </Text>
              )}
            </div>
          )}
          {showUPI && (
            <div style={{ margin: "0 0 16px 0" }}>
              <Link href={previewUrl + "&rp=1"} style={upiButton}>
                <Img
                  src={`${SITE_URL}/new-upi-lg.svg`}
                  alt="UPI"
                  width={63}
                  height={20}
                />
              </Link>
            </div>
          )}
          {!showUPI && (
            <>
              <div style={{ margin: "0 0 12px 0" }}>
                <Link href={wiseUrl} style={wiseButton}>
                  <Img
                    src={`${SITE_URL}/wiselogo.svg`}
                    alt="Pay with Wise"
                    width={80}
                    height={18}
                  />
                </Link>
              </div>
              <div style={{ margin: "0 0 18px 0" }}>
                <Link href={paypalUrl} style={paypalButton}>
                  <Img
                    src={`${SITE_URL}/paypal.svg`}
                    alt="Pay with PayPal"
                    width={22}
                    height={22}
                  />
                </Link>
              </div>
            </>
          )}
          <div style={{ margin: "0 0 20px 0" }}>
            <Link href={previewUrl} style={primaryButton}>
              View Invoice
            </Link>
          </div>
          <Text style={paragraph}>
            Please remit payment by the due date. If you have any questions
            about this invoice, reply to this email or contact us directly.
          </Text>
          <Text style={closing}>Thank you for your business.</Text>
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
