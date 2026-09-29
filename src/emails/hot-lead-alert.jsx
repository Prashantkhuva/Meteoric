import { Html, Preview, Body, Container, Section, Text, Hr, Heading, Link } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import {
  page,
  container,
  h1,
  hr,
  label,
  value,
  link,
  signoff,
  secondaryButton,
  colors,
} from "./theme";

const badge = {
  display: "inline-block",
  fontSize: "11px",
  fontWeight: 700,
  color: `${colors.amber} !important`,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  margin: "0 0 6px 0",
};

const summaryText = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: "italic",
  fontSize: "16px",
  color: `${colors.inkText} !important`,
  lineHeight: "1.6",
  margin: "0 0 24px 0",
};

const cta = { textAlign: "center", margin: "4px 0 0 0" };

export default function HotLeadAlert({ lead, score, category, summary, siteUrl }) {
  const baseUrl = siteUrl || "https://withmeteoric.com";
  return (
    <Html>
      <EmailHead />
      <Preview>
        🔥 Hot lead ({score}): {lead.name || lead.email}
      </Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <EmailBanner />
          <Text style={badge}>Hot lead · {score}/100</Text>
          <Heading style={h1}>{lead.name || lead.email}</Heading>
          {category && <Text style={{ ...value, margin: "0 0 8px 0" }}>Category: {category}</Text>}
          {summary && <Text style={summaryText}>&ldquo;{summary}&rdquo;</Text>}
          <Hr style={hr} />
          <Section>
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
            <Link href={`${baseUrl}/admin/leads`} style={secondaryButton}>
              View in Admin
            </Link>
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
        </Container>
      </Body>
    </Html>
  );
}
