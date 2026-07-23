import { memo } from "react";
import Image from "next/image";

const Logo = memo(function Logo({ className = "" }) {
  return (
    <Image
      src="/email-logo.svg"
      alt="Meteoric — software development agency"
      width={120}
      height={30}
      sizes="120px"
      priority
      className={`shrink-0 ${className}`}
    />
  );
});

export default Logo;
