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
export default function OverdueReminder({
  name,
  invoiceNumber,
  total,
  dueDate,
  daysOverdue,
  previewUrl,
  cb,
}) {
  return (
    <Html>
      {" "}
      <Head />{" "}
      <Preview>
        Overdue Invoice {invoiceNumber} — Please Remit Payment
      </Preview>{" "}
      <Body style={main}>
        {" "}
        <Container style={container}>
          {" "}
          // src={`${SITE_URL}/email-logo.svg?cb=${cb}`}
          <Img
            src='/public/email-logo.svg'
            width="132"
            height="30"
            alt="Meteoric"
            style={logo}
          />
          <Text style={greeting}>Hi {name || "there"},</Text>{" "}
          <Text style={paragraph}>
            {" "}
            This is a reminder that invoice{" "}
            <strong style={strong}>{invoiceNumber}</strong> for{" "}
            <strong style={strong}>${Number(total).toFixed(2)}</strong> is now{" "}
            <strong style={strongRed}>
              {daysOverdue} day{daysOverdue !== 1 ? "s" : ""} overdue
            </strong>
            .{" "}
          </Text>{" "}
          <div style={box}>
            {" "}
            <Text style={label}>Invoice Number</Text>{" "}
            <Text style={value}>{invoiceNumber}</Text> <div style={divider} />{" "}
            <Text style={label}>Total Amount</Text>{" "}
            <Text style={amount}>${Number(total).toFixed(2)}</Text>{" "}
            {dueDate && (
              <>
                {" "}
                <div style={divider} /> <Text style={label}>Due Date</Text>{" "}
                <Text style={value}>{dueDate}</Text>{" "}
              </>
            )}{" "}
          </div>{" "}
          <Link href={previewUrl} style={button}>
            {" "}
            View Invoice & Pay Now{" "}
          </Link>{" "}
          <Text style={paragraph}>
            {" "}
            Please remit payment at your earliest convenience to avoid any
            service interruption. If you have already paid, please disregard
            this notice.{" "}
          </Text>{" "}
          <Hr style={hr} />{" "}
          <Text style={closing}>
            {" "}
            Thank you for your prompt attention to this matter.{" "}
          </Text>{" "}
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>{" "}
        </Container>{" "}
      </Body>{" "}
    </Html>
  );
}
const main = {
  backgroundColor: "#000000",
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "40px 0",
};
const container = {
  maxWidth: "520px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#0a0a0a",
  border: "1px solid rgba(234, 239, 255, 0.1)",
};
const logo = { marginBottom: "24px" };
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
const strong = { color: "#ffffff" };
const strongRed = { color: "#f87171" };
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
  color: "#f87171",
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
const hr = { borderColor: "rgba(234, 239, 255, 0.08)", margin: "24px 0" };
