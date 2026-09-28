import { Html, Head, Preview, Body, Container, Section, Text, Hr, Heading, Link } from "react-email";
import EmailLogo from "./EmailLogo";
import {
  page,
  container,
  h1,
  muted,
  hr,
  label,
  value,
  link,
  signoff,
  colors,
} from "./theme";

const star = { color: colors.inkText };

const footerLink = {
  fontSize: "12px",
  color: colors.faint,
  textAlign: "center",
  margin: "0",
};

export default function NewLeadNotification({ name, email, phone, services, details, budget, siteUrl }) {
  const baseUrl = siteUrl || "https://withmeteoric.com";
  return (
    <Html>
      <Head />
      <Preview>New lead from {name || email}</Preview>
      <Body style={page}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>
            New Lead <span style={star}>✦</span>
          </Heading>
          <Text style={muted}>
            A new lead has submitted the form on{" "}
            {baseUrl.replace("https://", "")}
          </Text>
          <Hr style={hr} />
          <Section>
            <Text style={label}>Name</Text>
            <Text style={value}>{name || "—"}</Text>
            <Text style={label}>Email</Text>
            <Text style={value}>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>
            {phone && (
              <>
                <Text style={label}>Phone</Text>
                <Text style={value}>{phone}</Text>
              </>
            )}
            {services && (
              <>
                <Text style={label}>Services</Text>
                <Text style={value}>{services}</Text>
              </>
            )}
            {details && (
              <>
                <Text style={label}>Details</Text>
                <Text style={value}>{details}</Text>
              </>
            )}
            {budget && (
              <>
                <Text style={label}>Budget</Text>
                <Text style={value}>{budget}</Text>
              </>
            )}
          </Section>
          <Hr style={hr} />
          <Text style={footerLink}>
            <Link href={`${baseUrl}/admin/leads`} style={link}>
              View in Admin →
            </Link>
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
        </Container>
      </Body>
    </Html>
  );
}
