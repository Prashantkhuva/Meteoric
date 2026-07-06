import { memo } from "react";
import Image from "next/image";

const Logo = memo(function Logo({ className = "" }) {
  return (
    <Image
      src="/meteoric.png"
      alt="Meteoric"
      width={157}
      height={40}
      priority
      className={`shrink-0 ${className}`}
    />
  );
});

export default Logo;
