import type { CSSProperties } from "react";

export const colors = {
  page: "#f5f5f3",
  card: "#ffffff",
  ink: "#1c1917",
  inkText: "#1c1917",
  body: "#5c5958",
  muted: "#82817f",
  faint: "#a8a6a3",
  hairline: "#edeeed",
  border: "#e8e8e6",
  inset: "#fafaf7",
  onInk: "#fbfbf9",
  amber: "#b45309",
};

const t = (c: string): string => `${c} !important`;

const sans =
  "Inter, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const serif = "Georgia, 'Times New Roman', serif";

export const page: CSSProperties = {
  backgroundColor: colors.page,
  backgroundImage: `linear-gradient(${colors.page}, ${colors.page})`,
  fontFamily: sans,
  padding: "48px 16px",
  margin: 0,
};

export const container: CSSProperties = {
  maxWidth: "520px",
  width: "100%",
  margin: "0 auto",
  padding: "40px 36px 32px",
  backgroundColor: colors.card,
  backgroundImage: `linear-gradient(${colors.card}, ${colors.card})`,
  border: `1px solid ${colors.border}`,
  borderRadius: "0 0 16px 16px",
  boxSizing: "border-box",
};

export const logo: CSSProperties = {
  margin: "0 0 32px 0",
  display: "block",
  border: 0,
};

export const eyebrow: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: t(colors.faint),
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  margin: "0 0 10px 0",
};

export const h1: CSSProperties = {
  fontSize: "24px",
  lineHeight: "1.2",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: t(colors.inkText),
  margin: "0 0 8px 0",
};

export const greeting: CSSProperties = {
  fontSize: "16px",
  fontWeight: 600,
  color: t(colors.inkText),
  margin: "0 0 12px 0",
};

export const paragraph: CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.65",
  color: t(colors.body),
  margin: "0 0 14px 0",
};

export const link: CSSProperties = {
  color: t(colors.inkText),
  textDecoration: "underline",
};

export const primaryButton: CSSProperties = {
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

export const secondaryButton: CSSProperties = {
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

export const inset: CSSProperties = {
  backgroundColor: colors.inset,
  backgroundImage: `linear-gradient(${colors.inset}, ${colors.inset})`,
  border: `1px solid ${colors.hairline}`,
  borderRadius: "12px",
  padding: "20px",
};

export const hr: CSSProperties = {
  border: 0,
  borderTop: `1px solid ${colors.hairline}`,
  margin: "24px 0",
};

export const label: CSSProperties = {
  fontSize: "11px",
  fontWeight: 700,
  color: t(colors.faint),
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  margin: "16px 0 3px 0",
};

export const value: CSSProperties = {
  fontSize: "15px",
  color: t(colors.inkText),
  margin: "0",
  lineHeight: "1.5",
};

export const bodyText: CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.65",
  color: t(colors.body),
  margin: "0 0 16px 0",
};

export const strong: CSSProperties = {
  fontWeight: 700,
  color: t(colors.inkText),
};

export const amount: CSSProperties = {
  fontSize: "30px",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: t(colors.inkText),
  margin: "0 0 4px 0",
};

export const divider: CSSProperties = {
  height: "1px",
  backgroundColor: colors.hairline,
  margin: "14px 0",
};

export const muted: CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: t(colors.muted),
  margin: "0 0 24px 0",
};

export const closing: CSSProperties = {
  fontSize: "15px",
  lineHeight: "1.65",
  color: t(colors.body),
  margin: "24px 0 0 0",
};

export const signoff: CSSProperties = {
  fontFamily: serif,
  fontStyle: "italic",
  fontSize: "14px",
  color: t(colors.muted),
  lineHeight: "1.6",
  margin: "6px 0 0 0",
};

export const footer: CSSProperties = {
  borderTop: `1px solid ${colors.hairline}`,
  margin: "28px 0 0 0",
  padding: "20px 0 0 0",
  fontSize: "11px",
  color: t(colors.faint),
  lineHeight: "1.6",
};
