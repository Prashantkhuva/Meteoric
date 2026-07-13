import { Html, Head, Preview, Body, Container, Text, Hr, Img } from "react-email";
import EmailSignature from "./email-signature";

const SITE_URL = "https://withmeteoric.com";

const CURRENCY_SYMBOLS = { USD: "$", EUR: "\u20AC", GBP: "\u00A3", INR: "\u20B9", CAD: "CA$", AUD: "AU$", SGD: "S$", JPY: "\u00A5" };
function getSymbol(c) { return CURRENCY_SYMBOLS[c] || c || "$"; }

export default function PaymentConfirmation({
  name,
  invoiceNumber,
  total,
  currency = "USD",
  paidAt,
}) {
  const formattedDate = paidAt
    ? new Date(paidAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "today";

  const formattedTotal = `${getSymbol(currency)}${Number(total).toFixed(2)}`;

  return (
    <Html>
      <Head />
      <Preview>Payment Confirmed — Invoice {invoiceNumber}</Preview>
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
            We&apos;ve received your payment. Thank you!
          </Text>

          <div style={box}>
            <Text style={label}>Invoice Number</Text>
            <Text style={value}>{invoiceNumber}</Text>

            <div style={divider} />

            <Text style={label}>Amount Paid</Text>
            <Text style={amount}>{formattedTotal}</Text>

            <div style={divider} />

            <Text style={label}>Payment Date</Text>
            <Text style={value}>{formattedDate}</Text>
          </div>

          <Text style={paragraph}>
            Your invoice has been marked as <strong style={strongGreen}>paid</strong>.
            A paid-stamped receipt is attached to this email for your records.
          </Text>

          <Text style={paragraph}>
            It was a pleasure working with you. If you ever need web development,
            SaaS, or landing page services in the future, don&apos;t hesitate to reach out.
          </Text>

          <Hr style={hr} />

          <EmailSignature />
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#000000",
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
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

const strongGreen = { color: "#4ade80" };

const box = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(234, 239, 255, 0.1)",
  padding: "20px",
  margin: "20px 0",
};

const label = {
  fontSize: "11px",
  color: "rgba(255, 255, 255, 0.35)",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  margin: "0 0 4px 0",
};

const value = {
  fontSize: "15px",
  color: "#ffffff",
  fontWeight: 500,
  margin: "0 0 12px 0",
};

const amount = {
  fontSize: "28px",
  color: "#4ade80",
  fontWeight: 700,
  margin: "0 0 4px 0",
};

const divider = {
  height: "1px",
  backgroundColor: "rgba(234, 239, 255, 0.08)",
  margin: "12px 0",
};

const hr = {
  borderColor: "rgba(234, 239, 255, 0.08)",
  margin: "24px 0",
};
