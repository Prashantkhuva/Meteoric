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

const reviewQuote = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: "italic",
  fontSize: "15px",
  color: colors.inkText,
  lineHeight: "1.6",
  margin: "0",
};

export default function ReviewNotification({ name, email, role, company, project, rating, content, siteUrl }) {
  const baseUrl = siteUrl || "https://withmeteoric.com";
  return (
    <Html>
      <Head />
      <Preview>New review from {name}</Preview>
      <Body style={page}>
        <Container style={container}>
          <EmailLogo />
          <Heading style={h1}>
            New Review <span style={star}>✦</span>
          </Heading>
          <Text style={muted}>{name} left a {rating}-star review</Text>
          <Hr style={hr} />
          <Section>
            <Text style={label}>Name</Text>
            <Text style={value}>{name}</Text>
            <Text style={label}>Email</Text>
            <Text style={value}>
              <Link href={`mailto:${email}`} style={link}>
                {email}
              </Link>
            </Text>
            {role && (
              <>
                <Text style={label}>Role</Text>
                <Text style={value}>{role}</Text>
              </>
            )}
            {company && (
              <>
                <Text style={label}>Company</Text>
                <Text style={value}>{company}</Text>
              </>
            )}
            {project && (
              <>
                <Text style={label}>Project</Text>
                <Text style={value}>{project}</Text>
              </>
            )}
            <Text style={label}>Rating</Text>
            <Text style={value}>
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
            </Text>
            <Text style={label}>Review</Text>
            <Text style={reviewQuote}>&ldquo;{content}&rdquo;</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footerLink}>
            <Link href={`${baseUrl}/admin`} style={link}>
              Approve or reject in Admin →
            </Link>
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
        </Container>
      </Body>
    </Html>
  );
}
