import { Html, Preview, Body, Container, Text } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import { page, container, eyebrow, greeting, paragraph, link, closing, signoff, footer } from "./theme";
interface LeadAutoReplyProps {
  name?: string | null;
  siteUrl?: string;
}


export default function LeadAutoReply({ name, siteUrl }: LeadAutoReplyProps) {
  const baseUrl = siteUrl || "https://withmeteoric.com";
  return (
    <Html>
      <EmailHead />
      <Preview>Thank you for reaching out — we'll be in touch</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Auto-reply" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Message received</Text>
          <Text style={greeting}>Hi{name ? ` ${name}` : " there"},</Text>
          <Text style={paragraph}>
            Thank you for reaching out. We've received your inquiry and we're
            excited to learn more about your project.
          </Text>
          <Text style={paragraph}>
            Our team typically responds within 24 hours. In the meantime, feel
            free to browse our work at{" "}
            <a href={baseUrl} style={link}>
              {baseUrl.replace("https://", "")}
            </a>
            .
          </Text>
          <Text style={closing}>
            Looking forward to hearing more about what you're building.
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
