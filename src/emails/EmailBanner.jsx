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
        margin: "-40px -36px 32px -36px",
        padding: 0,
        display: "block",
        width: "calc(100% + 72px)",
        maxWidth: "none",
        height: "auto",
        border: 0,
        outline: 0,
        borderRadius: "16px 16px 0 0",
      }}
    />
  );
}
