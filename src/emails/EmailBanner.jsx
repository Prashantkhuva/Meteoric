import { Img } from "react-email";

const SITE_URL = "https://withmeteoric.com";

const bandTable = {
  width: "100%",
  maxWidth: "520px",
  margin: "0 auto",
  borderCollapse: "collapse",
};

const bandCell = {
  backgroundColor: "#171717",
  padding: "22px 32px",
  borderRadius: "16px 16px 0 0",
};

const logo = {
  display: "block",
  border: 0,
  height: "26px",
  width: "auto",
};

const pill = {
  display: "inline-block",
  padding: "6px 14px",
  border: "1px solid #4a4a4a",
  borderRadius: "100px",
  color: "#fbfbf9",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  lineHeight: "1.3",
  whiteSpace: "nowrap",
};

export default function EmailBanner({ label }) {
  return (
    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={bandTable}>
      <tbody>
        <tr>
          <td bgcolor="#171717" style={bandCell}>
            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ width: "100%", borderCollapse: "collapse" }}>
              <tbody>
                <tr>
                  <td align="left" valign="middle" style={{ margin: 0, padding: 0 }}>
                    <Img
                      src={`${SITE_URL}/meteoric-email-logo.png`}
                      alt="Meteoric"
                      width="114"
                      height="26"
                      style={logo}
                    />
                  </td>
                  <td align="right" valign="middle" width="100%" style={{ margin: 0, padding: 0, width: "100%", textAlign: "right" }}>
                    {label ? <span style={pill}>{label}</span> : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
