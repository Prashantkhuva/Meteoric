import { memo } from "react";
import Image from "next/image";

const Logo = memo(function Logo({ className = "" }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-label="Meteoric" role="img">
      <Image
        src="/meteoric-logo.png"
        alt=""
        width={168}
        height={32}
        className="hidden sm:block"
        aria-hidden="true"
      />
      <Image
        src="/meteoric-logo-1.png"
        alt=""
        width={24}
        height={18}
        className="sm:hidden"
        aria-hidden="true"
      />
    </span>
  );
});

export default Logo;
