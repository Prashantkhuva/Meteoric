import { Img } from "react-email";

const SITE_URL = "https://withmeteoric.com";

export default function EmailBanner() {
  return (
    <Img
      src={`${SITE_URL}/email-logo-banner.jpg`}
      alt="Meteoric"
      width="448"
      height="149"
      style={{
        margin: "0 auto",
        padding: 0,
        display: "block",
        width: "100%",
        maxWidth: "520px",
        height: "auto",
        border: 0,
        outline: 0,
        borderRadius: "16px 16px 0 0",
      }}
    />
  );
}
