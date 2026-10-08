import { Html, Preview, Body, Container, Text, Link } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import { page, container, eyebrow, greeting, paragraph, strong, primaryButton, closing, signoff, footer, link } from "./theme";
import type { CSSProperties } from "react";

interface ProposalEmailProps {
  title?: string | null;
  timeline?: string | null;
  terms?: string | null;
  previewUrl?: string;
  name?: string | null;
}


const sectionEyebrow: CSSProperties = { ...eyebrow, margin: "26px 0 10px 0" };

export default function ProposalEmail({
  title,
  timeline,
  terms,
  previewUrl,
  name,
}: ProposalEmailProps) {
  return (
    <Html>
      <EmailHead />
      <Preview>Proposal: {title as string}</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Proposal" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Proposal</Text>
          <Text style={greeting}>Hi {name || "there"},</Text>
          <Text style={paragraph}>
            We're excited to share our proposal for{" "}
            <strong style={strong}>{title}</strong>. We've put together a
            comprehensive plan tailored to your needs.
          </Text>
          <Text style={paragraph}>
            You can view the full proposal at the link below:
          </Text>
          <Text style={{ margin: "18px 0 8px" }}>
            <Link href={previewUrl} style={primaryButton}>
              View Your Proposal
            </Link>
          </Text>
          {timeline && (
            <>
              <Text style={sectionEyebrow}>Timeline</Text>
              <Text style={paragraph}>{timeline}</Text>
            </>
          )}
          {terms && (
            <>
              <Text style={sectionEyebrow}>Terms &amp; Conditions</Text>
              <Text style={paragraph}>{terms}</Text>
            </>
          )}
          <Text style={closing}>
            We're looking forward to working with you.
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
          <Text style={footer}>
            <Link href="https://withmeteoric.com" style={link}>
              withmeteoric.com
            </Link>{" "}
            · Web development &amp; SaaS agency
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
