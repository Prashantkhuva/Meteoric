import { Html, Body, Container, Text } from "react-email";
import EmailHead from "./EmailHead";
import EmailBanner from "./EmailBanner";
import { page, container, signoff, bodyText } from "./theme";

export default function CustomEmail({ html }) {
  return (
    <Html>
      <EmailHead />
      <Body className="body email-page" bgcolor="#f5f5f3" style={page}>
        <EmailBanner />
        <Container className="email-card" bgcolor="#ffffff" style={container}>
          <div style={bodyText} dangerouslySetInnerHTML={{ __html: html }} />
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
        </Container>
      </Body>
    </Html>
  );
}
