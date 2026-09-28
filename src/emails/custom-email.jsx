import { Html, Head, Body, Container, Text } from "react-email";
import EmailLogo from "./EmailLogo";
import { page, container, signoff, bodyText } from "./theme";

export default function CustomEmail({ html }) {
  return (
    <Html>
      <Head />
      <Body style={page}>
        <Container style={container}>
          <EmailLogo />
          <div style={bodyText} dangerouslySetInnerHTML={{ __html: html }} />
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
        </Container>
      </Body>
    </Html>
  );
}
