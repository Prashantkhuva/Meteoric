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
} from "@react-email/components";

export default function NewLeadNotification({ name, email, phone, services, details, budget }) {
  return (
    <Html>
      <Head />
      <Preview>New lead from {name || email}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Lead ✦</Heading>
          <Text style={muted}>
            A new lead has submitted the form on meteoric.agency
          </Text>
          <Hr style={hr} />

          <Section style={section}>
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
          <Text style={footer}>
            <Link href="https://hlxjljckxthmtssqrzwo.supabase.co" style={link}>
              View in Supabase
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

const h1 = {
  fontSize: "24px",
  fontWeight: 600,
  color: "#ffffff",
  letterSpacing: "-0.02em",
  marginBottom: "4px",
};

const muted = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.4)",
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

const footer = {
  fontSize: "12px",
  color: "rgba(255, 255, 255, 0.25)",
  textAlign: "center",
};
