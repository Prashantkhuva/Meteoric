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

export default function ProposalEmail({ name, title, timeline, terms, previewUrl }) {
  return (
    <Html>
      <Head />
      <Preview>Proposal: {title}</Preview>
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
            We're excited to share our proposal for <strong style={strong}>{title}</strong>.
            We've put together a comprehensive plan tailored to your needs.
          </Text>

          <Text style={paragraph}>
            You can view the full proposal at the link below:
          </Text>

          <Link href={previewUrl} style={button}>
            View Your Proposal
          </Link>

          {timeline && (
            <>
              <Text style={sectionTitle}>Timeline</Text>
              <Text style={paragraph}>{timeline}</Text>
            </>
          )}

          {terms && (
            <>
              <Text style={sectionTitle}>Terms & Conditions</Text>
              <Text style={paragraph}>{terms}</Text>
            </>
          )}

          <Hr style={hr} />

          <Text style={paragraph}>
            We're looking forward to working with you. If you have any questions,
            feel free to reply to this email.
          </Text>

          <Text style={footer}>
            Best regards,
            <br />
            Meteoric Team
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

const strong = {
  color: "#ffffff",
};

const greeting = {
  fontSize: "16px",
  color: "#ffffff",
  fontWeight: 500,
  marginBottom: "12px",
};

const sectionTitle = {
  fontSize: "13px",
  color: "#EAEFFF",
  fontWeight: 600,
  marginTop: "24px",
  marginBottom: "8px",
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

const hr = {
  borderColor: "rgba(234, 239, 255, 0.08)",
  margin: "24px 0",
};

const footer = {
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.35)",
  lineHeight: "1.5",
};
