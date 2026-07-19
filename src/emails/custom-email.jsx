import { Html, Head, Body, Container, Hr, Img } from "react-email";
import EmailSignature from "./email-signature";

const SITE_URL = "https://withmeteoric.com";

export default function CustomEmail({ html }) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${SITE_URL}/meteoric.svg`}
            alt="Meteoric"
            width={120}
            height={30}
            style={logo}
          />

          <div
            style={bodyContent}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <Hr style={hr} />

          <EmailSignature />
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#000000",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  padding: "40px 0",
};

const container = {
  maxWidth: "520px",
  margin: "0 auto",
  padding: "32px",
  backgroundColor: "#0a0a0a",
  border: "1px solid rgba(234, 239, 255, 0.1)",
};

const logo = {
  marginBottom: "24px",
};

const bodyContent = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.6)",
  lineHeight: "1.6",
  marginBottom: "12px",
};

const hr = {
  borderColor: "rgba(234, 239, 255, 0.08)",
  margin: "24px 0",
};
