import { memo } from "react";

export interface LogoProps {
  className?: string;
  light?: boolean;
}

const Logo = memo(function Logo({ className = "", light = false }: LogoProps) {
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
