import { Html, Preview, Body, Container, Text } from "react-email";
import EmailHead from "./EmailHead";
import EmailLogo from "./EmailLogo";
import { page, container, eyebrow, greeting, paragraph, signoff, footer, link } from "./theme";

export default function ReviewThankYou({ name }) {
  const baseUrl = "https://withmeteoric.com";
  return (
    <Html>
      <EmailHead />
      <Preview>Thank you for your review — it means a lot to us</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <EmailLogo />
          <Text style={eyebrow}>Thank you</Text>
          <Text style={greeting}>Hi{name ? ` ${name}` : " there"},</Text>
          <Text style={paragraph}>
            Thank you for taking the time to share your experience with
            Meteoric. Your feedback means a lot to us and helps us continue to
            improve.
          </Text>
          <Text style={paragraph}>
            We&apos;ll review your submission and it will appear on our site
            shortly. If you have any additional thoughts, feel free to reply to
            this email.
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
          <Text style={footer}>
            <a href={baseUrl} style={link}>
              withmeteoric.com
            </a>{" "}
            · Web development &amp; SaaS agency
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
