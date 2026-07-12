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

export default function InvoiceEmail({ name, invoiceNumber, total, currency, dueDate, previewUrl }) {
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

          <div style={{ marginBottom: "12px" }}>
            <Link href={wiseUrl} style={wiseButton}>
              <span style={{ display: "inline-block", verticalAlign: "middle", marginRight: "10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" fill="#0a0a0a" opacity="0.15"/>
                  <path d="M7.5 8.5L12 6l4.5 2.5L12 11 7.5 8.5z" fill="#0a0a0a"/>
                  <path d="M12 11v6.5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </span>
              <span style={{ verticalAlign: "middle" }}>Pay with Wise</span>
            </Link>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <Link href={paypalUrl} style={paypalButton}>
              <span style={{ display: "inline-block", verticalAlign: "middle", marginRight: "10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 21h2.5l1-6H8.5c-2 0-3.5-.5-4.5-2C3 11.5 3 9.5 4 8c1-1.5 3-2.5 5-2.5h4l1 6h-3c-1 0-2 .5-2.5 1.5L7 21z" fill="#ffffff"/>
                  <path d="M13 21h2.5l1-6H14c-2 0-3.5-.5-4.5-2-.5-1-.5-3 .5-4.5.5-.8 1.5-1.5 3-1.5h5l1 6h-3c-1 0-2 .5-2.5 1.5L13 21z" fill="#ffffff" opacity="0.6"/>
                </svg>
              </span>
              <span style={{ verticalAlign: "middle" }}>Pay with PayPal</span>
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
  padding: "14px 28px",
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
  padding: "14px 28px",
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
