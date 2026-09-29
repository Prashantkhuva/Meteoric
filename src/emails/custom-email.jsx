import { Html, Body, Container, Text } from "react-email";
import EmailHead from "./EmailHead";
import EmailLogo from "./EmailLogo";
import { page, container, signoff, bodyText } from "./theme";

export default function CustomEmail({ html }) {
  return (
    <Html>
      <EmailHead />
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <EmailLogo />
          <div style={bodyText} dangerouslySetInnerHTML={{ __html: html }} />
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
        </Container>
      </Body>
    </Html>
  );
}
