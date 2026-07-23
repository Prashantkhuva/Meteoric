import { Html, Head, Preview, Body, Container, Text, Img } from "react-email";
const SITE_URL = "https://withmeteoric.com";
export default function ClientWelcome({ name }) {
  return (
    <Html>
      {" "}
      <Head />{" "}
      <Preview>Welcome to Meteoric — Let's Build Something Great</Preview>{" "}
      <Body style={main}>
        {" "}
        <Container style={container}>
          {" "}
          <Img
            src={`${SITE_URL}/email-logo.svg?v=1`}
            alt="Meteoric"
            width={120}
            height={30}
            style={logo}
          />{" "}
          <Text style={greeting}>Hi {name || "there"},</Text>{" "}
          <Text style={paragraph}>
            {" "}
            Welcome to Meteoric! We're thrilled to have you on board.{" "}
          </Text>{" "}
          <Text style={paragraph}>
            {" "}
            Over the next few days, we'll be reaching out to learn more about
            your project goals, timeline, and vision. Here's what to
            expect:{" "}
          </Text>{" "}
          <div style={box}>
            {" "}
            <Text style={step}>
              {" "}
              <span style={stepNum}>1</span> Onboarding call — we'll discuss
              your requirements in detail{" "}
            </Text>{" "}
            <Text style={step}>
              {" "}
              <span style={stepNum}>2</span> Project kickoff — we'll define
              scope, milestones, and timelines{" "}
            </Text>{" "}
            <Text style={step}>
              {" "}
              <span style={stepNum}>3</span> Design & development — we'll keep
              you updated every step{" "}
            </Text>{" "}
          </div>{" "}
          <Text style={closing}>
            {" "}
            In the meantime, feel free to browse our portfolio or reach out if
            you have any questions.{" "}
          </Text>{" "}
          <Text style={signoff}>Prashant — Founder, Meteoric</Text>{" "}
        </Container>{" "}
      </Body>{" "}
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
const logo = { marginBottom: "24px" };
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
const box = {
  backgroundColor: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(234, 239, 255, 0.1)",
  padding: "20px",
  margin: "20px 0",
};
const step = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.7)",
  lineHeight: "1.6",
  marginBottom: "12px",
};
const stepNum = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "22px",
  height: "22px",
  backgroundColor: "#EAEFFF",
  color: "#121212",
  fontSize: "12px",
  fontWeight: 700,
  marginRight: "10px",
};
const closing = {
  fontSize: "14px",
  color: "rgba(255, 255, 255, 0.4)",
  lineHeight: "1.6",
  marginTop: "24px",
  marginBottom: "0",
};
const signoff = {
  fontSize: "13px",
  color: "rgba(255, 255, 255, 0.25)",
  lineHeight: "1.6",
  marginTop: "4px",
  marginBottom: "0",
};
