import { Html, Preview, Body, Container, Section, Text, Hr, Heading, Link } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
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
import type { CSSProperties } from "react";

interface ReviewNotificationProps {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  company?: string | null;
  project?: string | null;
  rating: number;
  content?: string | null;
  siteUrl?: string;
}


const star: CSSProperties = { color: `${colors.inkText} !important` };

const footerLink: CSSProperties = {
  fontSize: "12px",
  color: `${colors.faint} !important`,
  textAlign: "center",
  margin: "0",
};

const reviewQuote: CSSProperties = {
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontStyle: "italic",
  fontSize: "15px",
  color: `${colors.inkText} !important`,
  lineHeight: "1.6",
  margin: "0",
};

export default function ReviewNotification({
  name,
  email,
  role,
  company,
  project,
  rating,
  content,
  siteUrl,
}: ReviewNotificationProps) {
  const baseUrl = siteUrl || "https://withmeteoric.com";
  return (
    <Html>
      <EmailHead />
      <Preview>New review from {name as string}</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Review" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
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
