import { Html, Head, Preview, Body, Container, Text, Link } from "react-email";
import EmailLogo from "./EmailLogo";

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
      <Head />
      <Preview>You&apos;re invited to Meteoric Admin</Preview>
      <Body style={main}>
        <Container style={container}>
          <EmailLogo />

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

          {/* ── Credential box ─────────────────────────────────── */}
          <div style={credentialBox}>
            <Text style={credentialLabel}>EMAIL</Text>
            <Text style={credentialValue}>{email}</Text>
            <div style={credentialDivider} />
            <Text style={credentialLabel}>PASSWORD</Text>
            <div style={passwordRow}>
              <Text style={passwordText}>{password}</Text>
            </div>
          </div>

          {/* ── Login button ───────────────────────────────────── */}
          <Link href={loginUrl} style={button}>
            Login to Admin Panel
          </Link>

          {/* ── Security notice ────────────────────────────────── */}
          <div style={noticeBox}>
            <Text style={noticeText}>
              <strong style={strong}>Security note:</strong> For your safety,
              you&apos;ll be prompted to change this password immediately after
              your first login.
            </Text>
          </div>

          <Text style={closing}>
            Best regards,
            <br />
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
              Meteoric Team
            </span>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#000000",
  fontFamily: "Arial, Helvetica, sans-serif",
  padding: "40px 0",
};

const container = {
  maxWidth: "520px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#0a0a0a",
  border: "1px solid rgba(234, 239, 255, 0.1)",
};

const greeting = {
  fontSize: "16px",
  color: "#ffffff",
  fontWeight: 500,
  marginBottom: "12px",
};

const paragraph = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.6)",
  lineHeight: "1.6",
  marginBottom: "12px",
};

const strong = { color: "#ffffff" };

/* ── Credential box ──────────────────────────────────────────── */

const credentialBox = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(234, 239, 255, 0.1)",
  padding: "20px",
  margin: "20px 0",
};

const credentialLabel = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "1.2px",
  color: "rgba(255, 255, 255, 0.35)",
  marginBottom: "6px",
  fontFamily: "Arial, Helvetica, sans-serif",
};

const credentialValue = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.85)",
  fontFamily: "Arial, Helvetica, sans-serif",
  marginBottom: "0",
  marginTop: "0",
};

const credentialDivider = {
  height: "1px",
  backgroundColor: "rgba(234, 239, 255, 0.08)",
  margin: "14px 0",
};

const passwordRow = {
  backgroundColor: "#111111",
  border: "1px solid rgba(234, 239, 255, 0.08)",
  padding: "12px 16px",
  marginTop: "2px",
};

const passwordText = {
  fontSize: "18px",
  fontFamily: "SFMono-Regular, Menlo, Monaco, Consolas, 'Courier New', monospace",
  color: "#EAEFFF",
  letterSpacing: "2px",
  fontWeight: 600,
  margin: "0",
  lineHeight: "1.4",
  wordBreak: "break-all",
};

/* ── Button ──────────────────────────────────────────────────── */

const button = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#EAEFFF",
  color: "#121212",
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  margin: "20px 0",
};

/* ── Security notice ─────────────────────────────────────────── */

const noticeBox = {
  backgroundColor: "rgba(251, 191, 36, 0.06)",
  border: "1px solid rgba(251, 191, 36, 0.15)",
  padding: "14px 16px",
  marginTop: "8px",
  marginBottom: "24px",
};

const noticeText = {
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.5)",
  lineHeight: "1.6",
  margin: "0",
};

/* ── Closing ─────────────────────────────────────────────────── */

const closing = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.4)",
  lineHeight: "1.6",
  marginTop: "24px",
  marginBottom: "0",
};
