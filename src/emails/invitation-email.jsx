import { Html, Preview, Body, Container, Text, Link } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import {
  page,
  container,
  eyebrow,
  greeting,
  paragraph,
  strong,
  label,
  value,
  divider,
  inset,
  primaryButton,
  closing,
  colors,
} from "./theme";

const credentialBox = { ...inset, margin: "20px 0" };
const credentialLabel = { ...label, margin: "0 0 6px 0" };
const credentialValue = { ...value, marginBottom: "0" };

const passwordBox = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "6px 0 0 0",
};

const passwordText = {
  fontSize: "17px",
  fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  color: `${colors.inkText} !important`,
  letterSpacing: "2px",
  fontWeight: 600,
  margin: "0",
  lineHeight: "1.4",
  wordBreak: "break-all",
};

const noticeBox = {
  backgroundColor: "#faf6f6",
  backgroundImage: "linear-gradient(#faf6f6, #faf6f6)",
  border: "1px solid #f0ddce",
  borderRadius: "10px",
  padding: "14px 16px",
  margin: "4px 0 24px 0",
};

const noticeText = {
  fontSize: "13px",
  color: `${colors.body} !important`,
  lineHeight: "1.6",
  margin: "0",
};

export default function InvitationEmail({ name, role, email, password, loginUrl }) {
  const roleName =
    role === "superadmin"
      ? "Super Admin"
      : role === "admin"
        ? "Admin"
        : role === "speaker"
          ? "Speaker"
          : role;

  return (
    <Html>
      <EmailHead />
      <Preview>You&apos;re invited to Meteoric Admin</Preview>
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner label="Invitation" />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <Text style={eyebrow}>Team invitation</Text>
          <Text style={greeting}>Hi {name || "there"},</Text>
          <Text style={paragraph}>
            You&apos;ve been invited to the{" "}
            <strong style={strong}>Meteoric Admin</strong> panel as a{" "}
            <strong style={strong}>{roleName}</strong>.
          </Text>
          <Text style={paragraph}>
            Here are your login credentials. You&apos;ll be asked to set a new
            password on your first login.
          </Text>

          <div className="email-inset" bgcolor="#fafaf7" style={credentialBox}>
            <Text style={credentialLabel}>Email</Text>
            <Text style={credentialValue}>{email}</Text>
            <div style={{ ...divider, margin: "14px 0" }} />
            <Text style={{ ...credentialLabel, marginBottom: "8px" }}>
              Password
            </Text>
            <div className="email-card" bgcolor="#ffffff" style={passwordBox}>
              <Text style={passwordText}>{password}</Text>
            </div>
          </div>

          <Text style={{ margin: "0 0 20px 0" }}>
            <Link href={loginUrl} style={primaryButton}>
              Login to Admin Panel
            </Link>
          </Text>

          <div className="email-banner" style={noticeBox}>
            <Text style={noticeText}>
              <strong style={strong}>Security note:</strong> For your safety,
              you&apos;ll be prompted to change this password immediately after
              your first login.
            </Text>
          </div>

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
