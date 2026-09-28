import { Html, Head, Preview, Body, Container, Text } from "react-email";
import EmailLogo from "./EmailLogo";
import { page, container, eyebrow, greeting, paragraph, inset, closing, signoff, footer, link, colors } from "./theme";

const box = { ...inset, margin: "20px 0" };

const step = {
  fontSize: "14px",
  color: colors.body,
  lineHeight: "1.6",
  margin: "0 0 14px 0",
  paddingLeft: "32px",
  textIndent: "-32px",
};

const stepNum = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "22px",
  height: "22px",
  backgroundColor: colors.ink,
  color: colors.onInk,
  textIndent: 0,
  fontSize: "12px",
  fontWeight: 700,
  borderRadius: "50%",
  marginRight: "10px",
};

export default function ClientWelcome({ name }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Meteoric — Let's Build Something Great</Preview>
      <Body style={page}>
        <Container style={container}>
          <EmailLogo />
          <Text style={eyebrow}>Welcome aboard</Text>
          <Text style={greeting}>Hi {name || "there"},</Text>
          <Text style={paragraph}>
            Welcome to Meteoric! We're thrilled to have you on board.
          </Text>
          <Text style={paragraph}>
            Over the next few days, we'll be reaching out to learn more about
            your project goals, timeline, and vision. Here's what to expect:
          </Text>
          <div style={box}>
            <Text style={step}>
              <span style={stepNum}>1</span> Onboarding call — we'll discuss
              your requirements in detail
            </Text>
            <Text style={step}>
              <span style={stepNum}>2</span> Project kickoff — we'll define
              scope, milestones, and timelines
            </Text>
            <Text style={step}>
              <span style={stepNum}>3</span> Design &amp; development — we'll
              keep you updated every step
            </Text>
          </div>
          <Text style={closing}>
            In the meantime, feel free to browse our portfolio or reach out if
            you have any questions.
          </Text>
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>
          <Text style={footer}>
            <a href="https://withmeteoric.com" style={link}>
              withmeteoric.com
            </a>{" "}
            · Web development &amp; SaaS agency
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
