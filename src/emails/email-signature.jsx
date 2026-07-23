import { Img, Link, Text } from "react-email";

const SITE_URL = "https://withmeteoric.com";

export default function EmailSignature() {
  return (
    <div style={wrapper}>
      <Img
        src={`${SITE_URL}/m.png?v=5`}
        alt="Meteoric"
        width={40}
        height={40}
        style={logo}
      />
      <div style={textBlock}>
        <Text style={nameStyle}>
          <Link href={SITE_URL} style={nameLink}>
            <strong>Meteoric</strong>
          </Link>
        </Text>
        <Text style={contactStyle}>
          <Link href="mailto:contact@withmeteoric.com" style={contactLink}>
            contact@withmeteoric.com
          </Link>
          {" · "}
          <Link href={SITE_URL} style={contactLink}>
            withmeteoric.com
          </Link>
        </Text>
      </div>
    </div>
  );
}

const wrapper = {
  display: "flex",
  alignItems: "center",
  marginTop: "12px",
  paddingTop: "16px",
};

const logo = {
  flexShrink: 0,
  borderRadius: "50%",
  marginRight: "16px",
};

const textBlock = {
  lineHeight: "1.3",
};

const nameStyle = {
  fontSize: "14px",
  color: "#ffffff",
  fontWeight: 600,
  margin: "0 0 2px 0",
  lineHeight: "1.3",
};

const nameLink = {
  color: "#ffffff",
  textDecoration: "none",
};

const contactStyle = {
  fontSize: "11px",
  color: "rgba(255, 255, 255, 0.3)",
  margin: "0",
  lineHeight: "1.4",
};

const contactLink = {
  color: "rgba(255, 255, 255, 0.35)",
  textDecoration: "underline",
};
