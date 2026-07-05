import { memo } from "react";

const Logo = memo(function Logo({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center tracking-tight text-[30px] md:text-[28px] -skew-x-[6deg] ${className}`}
      style={{
        fontWeight: 500,
        background: "linear-gradient(135deg, #fff 0%, #a0a0a0 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
      aria-label="Meteoric"
    >
      <span>
        {" "}
        <span
          className="py-1"
          style={{ fontFamily: "var(--font-playfair)", fontStyle: "normal" }}
        >
          meteor
        </span>
        <span className="py-1" style={{ fontFamily: "var(--font-inter)" }}>
          ic
        </span>
      </span>
    </span>
  );
});

export default Logo;
