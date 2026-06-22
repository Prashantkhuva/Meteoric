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

export default function LeadAutoReply({ name, siteUrl }) {
  const baseUrl = siteUrl || "https://withmeteoric.vercel.app";
  return (
    <Html>
      <Head />
      <Preview>Thank you for reaching out — we'll be in touch</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/meteoric-logo.png`}
            alt="Meteoric"
            width="168"
            height="32"
            style={logoImg}
          />

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

          <Hr style={hr} />

          <Text style={footer}>
            Prashant Khuva
            <br />
            Founder, Meteoric
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
  borderRadius: "16px",
};

const logoImg = {
  marginBottom: "24px",
  outline: "none",
  border: "none",
  textDecoration: "none",
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

const link = {
  color: "#EAEFFF",
  textDecoration: "underline",
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
