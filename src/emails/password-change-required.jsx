import { Html, Head, Preview, Body, Container, Text, Link } from "react-email";
import EmailLogo from "./EmailLogo";

export default function PasswordChangeRequired({ name, loginUrl }) {
  return (
    <Html>
      {" "}
      <Head />
      <Preview>Password Change Required - Meteoric Admin</Preview>{" "}
      <Body style={main}>
        {" "}
        <Container style={container}>
          {" "}
          <EmailLogo />
          <Text style={greeting}>Hi {name || "there"},</Text>{" "}
          <Text style={paragraph}>
            {" "}
            Thank you for logging into Meteoric Admin. For security, this is your
            first login. Please set a new password below.
          </Text>{" "}
          <p />
          <Link href={loginUrl} style={button}>
            {" "}
            Set New Password{" "}
          </Link>{" "}
          <p />
          <Text style={closing}>
            {" "}
            Best regards,<br />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
              Meteoric Team
            </span>
          </Text>{" "}
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