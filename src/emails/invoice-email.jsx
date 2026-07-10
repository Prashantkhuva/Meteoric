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

const SITE_URL = "https://withmeteoric.com";

export default function InvoiceEmail({ name, invoiceNumber, total, dueDate, previewUrl }) {
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

          <Link href={previewUrl} style={button}>
            View Invoice & Pay Online
          </Link>

          <Text style={paragraph}>
            Please remit payment by the due date. If you have any questions
            about this invoice, reply to this email or contact us directly.
          </Text>

          <Hr style={hr} />

          <Text style={paragraph}>
            Thank you for your business!
          </Text>

          <Text style={footer}>
            Meteoric Agency
            <br />
            contact@withmeteoric.com
          </Text>
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
  backgroundColor: "#EAEFFF",
  color: "#121212",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  margin: "16px 0",
};

const hr = {
  borderColor: "rgba(234, 239, 255, 0.08)",
  margin: "24px 0",
};

const footer = {
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.35)",
  lineHeight: "1.5",
};
