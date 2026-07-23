import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Link,
  Img,
} from "react-email";

const SITE_URL = "https://withmeteoric.com";
const WISE_BASE = "https://wise.com/pay/business/khuvaprashantdayanandbhai1";
const PAYPAL_ME = "https://paypal.me/Prashantkhuva";

const CURRENCY_SYMBOLS = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", INR: "\u20B9", CAD: "CA$", AUD: "AU$", SGD: "S$", JPY: "\u00A5" };
function getSymbol(c) { return CURRENCY_SYMBOLS[c] || c || "$"; }

export default function InvoiceEmail({ name, invoiceNumber, total, currency, dueDate, previewUrl, bankAccount, showUPI }) {
  const curr = currency || "USD";
  const sym = getSymbol(curr);
  const wiseUrl = `${WISE_BASE}?currency=${curr}&amount=${Number(total).toFixed(2)}`;
  const paypalUrl = `${PAYPAL_ME}/${Number(total).toFixed(2)}${curr}`;

  return (
    <Html>
      <Head />
      <Preview>Invoice {invoiceNumber} from Meteoric</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${SITE_URL}/logo.svg?v=5`}
            alt="Meteoric"
            width={120}
            height={30}
            style={logo}
          />

          <Text style={greeting}>Hi {name || "there"},</Text>

          <Text style={paragraph}>
            An invoice has been issued for your recent project with us.
          </Text>

          <div style={invoiceBox}>
            <Text style={invoiceLabel}>Invoice Number</Text>
            <Text style={invoiceValue}>{invoiceNumber}</Text>

            <div style={divider} />

            <Text style={invoiceLabel}>Total Amount</Text>
            <Text style={invoiceAmount}>{sym}{Number(total).toFixed(2)}</Text>

            {dueDate && (
              <>
                <div style={divider} />
                <Text style={invoiceLabel}>Due Date</Text>
                <Text style={invoiceValue}>{dueDate}</Text>
              </>
            )}
          </div>

          {bankAccount && (
            <div style={bankSection}>
              <Text style={bankTitle}>Bank Transfer Details</Text>
              {bankAccount.bank_name && <Text style={bankLine}><span style={bankLabel}>Bank: </span>{bankAccount.bank_name}</Text>}
              {bankAccount.account_holder && <Text style={bankLine}><span style={bankLabel}>Name: </span>{bankAccount.account_holder}</Text>}
              {bankAccount.account_number && <Text style={bankLine}><span style={bankLabel}>Account No: </span>{bankAccount.account_number}</Text>}
              {bankAccount.iban && <Text style={bankLine}><span style={bankLabel}>IBAN: </span>{bankAccount.iban}</Text>}
              {bankAccount.swift_bic && <Text style={bankLine}><span style={bankLabel}>SWIFT/BIC: </span>{bankAccount.swift_bic}</Text>}
              {bankAccount.routing_number && <Text style={bankLine}><span style={bankLabel}>Routing: </span>{bankAccount.routing_number}</Text>}
              {bankAccount.ifsc && <Text style={bankLine}><span style={bankLabel}>IFSC: </span>{bankAccount.ifsc}</Text>}
              {bankAccount.currency && <Text style={bankLine}><span style={bankLabel}>Currency: </span>{bankAccount.currency}</Text>}
              {bankAccount.country && <Text style={bankLine}><span style={bankLabel}>Country: </span>{bankAccount.country}</Text>}
            </div>
          )}

          {showUPI && (
            <div style={{ marginBottom: "12px" }}>
              <Link href={previewUrl + "&rp=1"} style={upiButton}>
                <Img src={`${SITE_URL}/upi.svg`} alt="UPI" width={56} height={20} />
              </Link>
            </div>
          )}

          {!showUPI && (
            <>
              <div style={{ marginBottom: "12px" }}>
                <Link href={wiseUrl} style={wiseButton}>
                  <Img src={`${SITE_URL}/wiselogo.svg`} alt="Pay with Wise" width={80} height={18} />
                </Link>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <Link href={paypalUrl} style={paypalButton}>
                  <Img src={`${SITE_URL}/paypal.svg`} alt="Pay with PayPal" width={22} height={22} />
                </Link>
              </div>
            </>
          )}

          <div style={{ marginBottom: "4px" }}>
            <Link href={previewUrl} style={button}>
              View Invoice
            </Link>
          </div>

          <Text style={paragraph}>
            Please remit payment by the due date. If you have any questions
            about this invoice, reply to this email or contact us directly.
          </Text>

          <Text style={closing}>Thank you for your business.</Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: "40px 0",
};

const container = {
  maxWidth: "520px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#0a0a0a",
  border: "1px solid rgba(234, 239, 255, 0.1)",
};

const logo = {
  marginBottom: "24px",
};

const greeting = {
  fontSize: "16px",
  color: "#ffffff",
  fontWeight: 500,
  marginBottom: "12px",
};

const paragraph = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.6)",
  lineHeight: "1.6",
  marginBottom: "12px",
};

const invoiceBox = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(234, 239, 255, 0.1)",
  padding: "20px",
  margin: "20px 0",
};

const invoiceLabel = {
  fontSize: "11px",
  color: "rgba(255, 255, 255, 0.35)",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 4px 0",
};

const invoiceValue = {
  fontSize: "15px",
  color: "#ffffff",
  fontWeight: 500,
  margin: "0 0 12px 0",
};

const invoiceAmount = {
  fontSize: "28px",
  color: "#EAEFFF",
  fontWeight: 700,
  margin: "0 0 4px 0",
};

const divider = {
  height: "1px",
  backgroundColor: "rgba(234, 239, 255, 0.08)",
  margin: "12px 0",
};

const button = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "rgba(255, 255, 255, 0.08)",
  color: "rgba(255, 255, 255, 0.6)",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  border: "1px solid rgba(234, 239, 255, 0.1)",
};

const wiseButton = {
  display: "inline-block",
  padding: "14px 24px",
  backgroundColor: "#9FE870",
  color: "#0a0a0a",
  fontSize: "14px",
  fontWeight: 700,
  letterSpacing: "0.02em",
  textDecoration: "none",
  borderRadius: "6px",
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
  borderRadius: "6px",
};

const closing = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.4)",
  lineHeight: "1.6",
  marginTop: "24px",
  marginBottom: "0",
};

const signoff = {
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.25)",
  lineHeight: "1.6",
  marginTop: "4px",
  marginBottom: "0",
};

const hr = {
  borderColor: "rgba(234, 239, 255, 0.08)",
  margin: "24px 0",
};

const bankSection = {
  backgroundColor: "#111111",
  border: "1px solid #222222",
  padding: "16px",
  marginBottom: "20px",
};

const upiButton = {
  display: "inline-block",
  padding: "14px 24px",
  backgroundColor: "#5F259F",
  textDecoration: "none",
  borderRadius: "6px",
};

const bankTitle = {
  fontSize: "10px",
  fontWeight: 700,
  color: "#EAEFFF",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "10px",
};

const bankLine = {
  fontSize: "12px",
  color: "#e0e0e0",
  lineHeight: "1.8",
  margin: 0,
};

const bankLabel = {
  color: "#aaaaaa",
  fontWeight: 600,
};
