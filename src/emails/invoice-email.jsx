import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Hr,
  Link,
  Img,
} from "react-email";
import EmailSignature from "./email-signature";

const SITE_URL = "https://withmeteoric.com";
const WISE_BASE = "https://wise.com/pay/business/khuvaprashantdayanandbhai1";
const PAYPAL_ME = "https://paypal.me/Prashantkhuva";

export default function InvoiceEmail({ name, invoiceNumber, total, currency, dueDate, previewUrl, bankAccount }) {
  const curr = currency || "USD";
  const wiseUrl = `${WISE_BASE}?currency=${curr}&amount=${Number(total).toFixed(2)}`;
  const paypalUrl = `${PAYPAL_ME}/${Number(total).toFixed(2)}`;

  return (
    <Html>
      <Head />
      <Preview>Invoice {invoiceNumber} from Meteoric</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${SITE_URL}/meteoric.png`}
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
            <Text style={invoiceAmount}>${Number(total).toFixed(2)}</Text>

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
              {bankAccount.bank_name && <Text style={bankLine}><Text style={bankLabel}>Bank: </Text>{bankAccount.bank_name}</Text>}
              {bankAccount.account_holder && <Text style={bankLine}><Text style={bankLabel}>Name: </Text>{bankAccount.account_holder}</Text>}
              {bankAccount.account_number && <Text style={bankLine}><Text style={bankLabel}>Account No: </Text>{bankAccount.account_number}</Text>}
              {bankAccount.iban && <Text style={bankLine}><Text style={bankLabel}>IBAN: </Text>{bankAccount.iban}</Text>}
              {bankAccount.swift_bic && <Text style={bankLine}><Text style={bankLabel}>SWIFT/BIC: </Text>{bankAccount.swift_bic}</Text>}
              {bankAccount.routing_number && <Text style={bankLine}><Text style={bankLabel}>Routing: </Text>{bankAccount.routing_number}</Text>}
              {bankAccount.ifsc && <Text style={bankLine}><Text style={bankLabel}>IFSC: </Text>{bankAccount.ifsc}</Text>}
              {bankAccount.currency && <Text style={bankLine}><Text style={bankLabel}>Currency: </Text>{bankAccount.currency}</Text>}
              {bankAccount.country && <Text style={bankLine}><Text style={bankLabel}>Country: </Text>{bankAccount.country}</Text>}
            </div>
          )}

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

          <div style={{ marginBottom: "4px" }}>
            <Link href={previewUrl} style={button}>
              View Invoice
            </Link>
          </div>

          <Text style={paragraph}>
            Please remit payment by the due date. If you have any questions
            about this invoice, reply to this email or contact us directly.
          </Text>

          <Hr style={hr} />

          <Text style={paragraph}>
            Thank you for your business!
          </Text>

          <EmailSignature />
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
  color: "#b3b3b3",
  lineHeight: "1.8",
  margin: 0,
};

const bankLabel = {
  color: "#777777",
  fontWeight: 600,
};
