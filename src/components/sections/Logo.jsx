import { memo } from "react";

const Logo = memo(function Logo({ className = "", light = false }) {
  const src = light ? "/new-meteoric-lg-black.svg" : "/new-meteoric-lg.svg";
  return (
    <img
      src={src}
      alt="Meteoric — software development agency"
      className={`shrink-0 ${className}`}
      width={90}
      height={22}
    />
  );
});

export default Logo;
