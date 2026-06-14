import { memo } from "react";

const Logo = memo(function Logo({ className = "" }) {
  return (
    <span className={`block ${className}`} aria-label="Meteoric" role="img">
      <span className="relative block h-8 w-10 overflow-hidden sm:hidden">
        <img
          src="/meteoric-logo-1.png"
          alt=""
          width={40}
          height={32}
          className="absolute left-[-1.68rem] top-[-1.93rem] h-[6rem] w-auto max-w-none"
          aria-hidden="true"
          loading="lazy"
          decoding="async"
        />
      </span>

      <span className="relative hidden h-8 w-[10.5rem] overflow-hidden sm:block">
        <img
          src="/meteoric-logo.png"
          alt=""
          width={168}
          height={32}
          className="absolute left-[-3.625rem] top-[-4.8375rem] h-[12rem] w-auto max-w-none"
          aria-hidden="true"
          decoding="async"
        />
      </span>
    </span>
  );
});

export default Logo;
