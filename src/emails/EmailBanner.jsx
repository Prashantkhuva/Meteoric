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
        margin: "0 0 28px 0",
        padding: 0,
        display: "block",
        width: "100%",
        maxWidth: "448px",
        height: "auto",
        border: 0,
        outline: 0,
        borderRadius: "12px",
      }}
    />
  );
}
