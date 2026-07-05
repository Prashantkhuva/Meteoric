import { memo } from "react";

const Logo = memo(function Logo({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center tracking-tight ${className}`}
      style={{
        fontSize: 28,
        fontWeight: 500,
        background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      aria-label="Meteoric"
    >
      <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "normal", display: "inline-block", transform: "skewX(-6deg)" }}>meteor</span>
      <span style={{ fontFamily: "var(--font-inter)" }}>ic</span>
    </span>
  );
});

export default Logo;
