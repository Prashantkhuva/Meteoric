import { Html, Preview, Body, Container, Text, Link } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import { page, container, eyebrow, greeting, paragraph, primaryButton, closing, colors } from "./theme";
interface PasswordChangeRequiredProps {
  name?: string | null;
  loginUrl?: string;
}


export default function PasswordChangeRequired({
  name,
  loginUrl,
}: PasswordChangeRequiredProps) {
  return (
    <Html>
      <EmailHead />
      <Preview>Password Change Required - Meteoric Admin</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Security" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Security</Text>
          <Text style={greeting}>Hi {name || "there"},</Text>
          <Text style={paragraph}>
            Thank you for logging into Meteoric Admin. For security, this is
            your first login. Please set a new password below.
          </Text>
          <Text style={{ margin: "20px 0" }}>
            <Link href={loginUrl} style={primaryButton}>
              Set New Password
            </Link>
          </Text>
          <Text style={closing}>
            Best regards,
            <br />
            <span style={{ color: `${colors.muted} !important`, fontSize: "12px" }}>
              Meteoric Team
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
