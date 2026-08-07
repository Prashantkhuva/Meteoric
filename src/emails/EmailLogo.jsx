import { Img } from "react-email";

const SITE_URL = "https://withmeteoric.com";

export default function EmailLogo() {
  return (
    <Img
      src={`${SITE_URL}/meteoric-email-logo.png`}
      alt="Meteoric"
      width="132"
      height="30"
      style={{
        margin: "0 0 24px 0",
        padding: 0,
        display: "block",
        border: 0,
        outline: 0,
      }}
    />
  );
}
