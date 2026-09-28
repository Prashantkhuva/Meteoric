import { Html, Head, Preview, Body, Container, Text, Link } from "react-email";
import EmailLogo from "./EmailLogo";
import { page, container, eyebrow, greeting, paragraph, primaryButton, closing, colors } from "./theme";

export default function PasswordChangeRequired({ name, loginUrl }) {
  return (
    <Html>
      <Head />
      <Preview>Password Change Required - Meteoric Admin</Preview>
      <Body style={page}>
        <Container style={container}>
          <EmailLogo />
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
            <span style={{ color: colors.muted, fontSize: "12px" }}>
              Meteoric Team
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
