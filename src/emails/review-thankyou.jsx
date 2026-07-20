import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Text,
  Hr,
  Img,
} from "react-email";
import EmailSignature from "./email-signature";

export default function ReviewThankYou({ name, siteUrl }) {
  const baseUrl = siteUrl || "https://withmeteoric.com";
  return (
    <Html>
      <Head />
      <Preview>Thank you for your review — it means a lot to us</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={`${baseUrl}/logo.svg`} alt="Meteoric" width="126" height="32" style={logoImg} />

          <Text style={greeting}>Hi{name ? ` ${name}` : " there"},</Text>

          <Text style={paragraph}>
            Thank you for taking the time to share your experience with
            Meteoric. Your feedback means a lot to us and helps us continue
            to improve.
          </Text>

          <Text style={paragraph}>
            We&apos;ll review your submission and it will appear on our site shortly.
            If you have any additional thoughts, feel free to reply to this email.
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
  borderRadius: "16px",
};

const logoImg = {
  marginBottom: "20px",
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

const hr = {
  borderColor: "rgba(234, 239, 255, 0.08)",
  margin: "24px 0",
};
