import { Img, Link, Text } from "react-email";

const SITE_URL = "https://withmeteoric.com";
const GRAVATAR_URL = "https://gravatar.com/coffeefortunately42043072f7?utm_source=email_signature";

export default function EmailSignature({ name = "Prashant Khuva", title = "Founder" }) {
  return (
    <div style={wrapper}>
      <Img
        src={GRAVATAR_URL}
        alt={name}
        width={40}
        height={40}
        style={avatar}
      />
      <div>
        <Text style={nameStyle}>
          <Link href={SITE_URL} style={nameLink}>
            <strong>Meteoric</strong>
          </Link>
        </Text>
        <Text style={roleStyle}>
          {name} · {title}
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
  gap: "12px",
  marginTop: "8px",
};

const avatar = {
  borderRadius: "50%",
  flexShrink: 0,
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

const roleStyle = {
  fontSize: "12px",
  color: "rgba(255, 255, 255, 0.45)",
  margin: "0 0 2px 0",
  lineHeight: "1.4",
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
