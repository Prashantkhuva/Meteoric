import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Heading,
  Link,
  Img,
} from "react-email";

export default function HotLeadAlert({ lead, score, category, summary, siteUrl }) {
  const baseUrl = siteUrl || "https://withmeteoric.com";
  return (
    <Html>
      <Head />
      <Preview>🔥 Hot lead ({score}): {lead.name || lead.email}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src={`${baseUrl}/meteoric.png`} alt="Meteoric" width="126" height="32" style={logoImg} />
          <Heading style={h1}>🔥 Hot Lead &mdash; {score}/100</Heading>
          {category && <Text style={badge}>Category: {category}</Text>}
          {summary && <Text style={summaryText}>"{summary}"</Text>}
          <Hr style={hr} />

          <Section style={section}>
            <Text style={label}>Name</Text>
            <Text style={value}>{lead.name || "—"}</Text>

            <Text style={label}>Email</Text>
            <Text style={value}>
              <Link href={`mailto:${lead.email}`} style={link}>
                {lead.email}
              </Link>
            </Text>

            {lead.phone && (
              <>
                <Text style={label}>Phone</Text>
                <Text style={value}>
                  <Link href={`tel:${lead.phone}`} style={link}>
                    {lead.phone}
                  </Link>
                </Text>
              </>
            )}

            {lead.company && (
              <>
                <Text style={label}>Company</Text>
                <Text style={value}>{lead.company}</Text>
              </>
            )}

            {lead.services && (
              <>
                <Text style={label}>Services</Text>
                <Text style={value}>{lead.services}</Text>
              </>
            )}

            {lead.budget && (
              <>
                <Text style={label}>Budget</Text>
                <Text style={value}>{lead.budget}</Text>
              </>
            )}

            {lead.details && (
              <>
                <Text style={label}>Details</Text>
                <Text style={value}>{lead.details}</Text>
              </>
            )}
          </Section>

          <Hr style={hr} />
          <Text style={cta}>
            <Link href={`${baseUrl}/admin/leads`} style={ctaLink}>
              View in Admin &rarr;
            </Link>
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
  marginBottom: "20px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#ffffff",
  letterSpacing: "-0.02em",
  marginBottom: "4px",
};

const badge = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 600,
  color: "#fbbf24",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: "4px",
};

const summaryText = {
  fontSize: "15px",
  color: "#EAEFFF",
  fontStyle: "italic",
  marginBottom: "24px",
};

const hr = {
  borderColor: "rgba(234, 239, 255, 0.08)",
  margin: "24px 0",
};

const section = {
  margin: "0",
};

const label = {
  fontSize: "11px",
  fontWeight: 500,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "rgba(255, 255, 255, 0.3)",
  marginBottom: "2px",
  marginTop: "16px",
};

const value = {
  fontSize: "15px",
  color: "rgba(255, 255, 255, 0.8)",
  margin: "0",
  lineHeight: "1.4",
};

const link = {
  color: "#EAEFFF",
  textDecoration: "underline",
};

const cta = {
  textAlign: "center",
  margin: "0",
};

const ctaLink = {
  color: "#EAEFFF",
  fontSize: "14px",
  fontWeight: 500,
  textDecoration: "none",
  border: "1px solid rgba(234, 239, 255, 0.2)",
  padding: "10px 24px",
  borderRadius: "8px",
};
