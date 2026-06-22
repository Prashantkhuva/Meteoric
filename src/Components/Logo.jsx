import { memo } from "react";
import Image from "next/image";

const Logo = memo(function Logo({ className = "" }) {
  return (
    <span className={`block ${className}`} aria-label="Meteoric" role="img">
      <span className="block sm:hidden">
        <Image
          src="/meteoric-logo-1.png"
          alt=""
          width={40}
          height={32}
          aria-hidden="true"
        />
      </span>

      <span className="hidden sm:block">
        <Image
          src="/meteoric-logo.png"
          alt=""
          width={168}
          height={32}
          aria-hidden="true"
        />
      </span>
    </span>
  );
});

export default Logo;
