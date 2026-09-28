export const colors = {
  page: "#f5f5f3",
  card: "#ffffff",
  ink: "#1c1917",
  inkText: "#1c1917",
  body: "rgba(28, 25, 23, 0.72)",
  muted: "rgba(28, 25, 23, 0.55)",
  faint: "rgba(28, 25, 23, 0.38)",
  hairline: "rgba(28, 25, 23, 0.08)",
  border: "rgba(28, 25, 23, 0.1)",
  inset: "#fafaf7",
  onInk: "#fbfbf9",
  amber: "#b45309",
};

const sans =
  "Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const serif = "Georgia, 'Times New Roman', serif";

export const page = {
  backgroundColor: colors.page,
  fontFamily: sans,
  padding: "48px 16px",
  margin: 0,
};

export const container = {
  maxWidth: "520px",
  width: "100%",
  margin: "0 auto",
  padding: "40px 36px 32px",
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
};

export const logo = {
  margin: "0 0 32px 0",
  display: "block",
  border: 0,
};

export const eyebrow = {
  fontSize: "11px",
  fontWeight: 700,
  color: colors.faint,
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  margin: "0 0 10px 0",
};

export const h1 = {
  fontSize: "24px",
  lineHeight: "1.2",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: colors.inkText,
  margin: "0 0 8px 0",
};

export const greeting = {
  fontSize: "16px",
  fontWeight: 600,
  color: colors.inkText,
  margin: "0 0 12px 0",
};

export const paragraph = {
  fontSize: "15px",
  lineHeight: "1.65",
  color: colors.body,
  margin: "0 0 14px 0",
};

export const link = {
  color: colors.inkText,
  textDecoration: "underline",
};

export const primaryButton = {
  display: "inline-block",
  padding: "13px 28px",
  backgroundColor: colors.ink,
  color: colors.onInk,
  fontSize: "14px",
  fontWeight: 600,
  letterSpacing: "0.01em",
  textDecoration: "none",
  borderRadius: "100px",
};

export const secondaryButton = {
  display: "inline-block",
  padding: "12px 27px",
  backgroundColor: colors.card,
  color: colors.inkText,
  fontSize: "14px",
  fontWeight: 600,
  textDecoration: "none",
  border: `1px solid ${colors.border}`,
  borderRadius: "100px",
};

export const inset = {
  backgroundColor: colors.inset,
  border: `1px solid ${colors.hairline}`,
  borderRadius: "12px",
  padding: "20px",
};

export const hr = {
  border: 0,
  borderTop: `1px solid ${colors.hairline}`,
  margin: "24px 0",
};

export const label = {
  fontSize: "11px",
  fontWeight: 700,
  color: colors.faint,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  margin: "16px 0 3px 0",
};

export const value = {
  fontSize: "15px",
  color: colors.inkText,
  margin: "0",
  lineHeight: "1.5",
};

export const bodyText = {
  fontSize: "15px",
  lineHeight: "1.65",
  color: colors.body,
  margin: "0 0 16px 0",
};

export const strong = {
  fontWeight: 700,
  color: colors.inkText,
};

export const amount = {
  fontSize: "30px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: colors.inkText,
  margin: "0 0 4px 0",
};

export const divider = {
  height: "1px",
  backgroundColor: colors.hairline,
  margin: "14px 0",
};

export const muted = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: colors.muted,
  margin: "0 0 24px 0",
};

export const closing = {
  fontSize: "15px",
  lineHeight: "1.65",
  color: colors.body,
  margin: "24px 0 0 0",
};

export const signoff = {
  fontFamily: serif,
  fontStyle: "italic",
  fontSize: "14px",
  color: colors.muted,
  lineHeight: "1.6",
  margin: "6px 0 0 0",
};

export const footer = {
  borderTop: `1px solid ${colors.hairline}`,
  margin: "28px 0 0 0",
  padding: "20px 0 0 0",
  fontSize: "11px",
  color: colors.faint,
  lineHeight: "1.6",
};
