"use client";

import { forwardRef } from "react";
import Link from "next/link";
import StaggerText from "./StaggerText";

const StaggerLink = forwardRef(function StaggerLink(
  { href, children, className, style, onClick, hoverColor, onMouseEnter, onMouseLeave, ...rest },
  ref
) {
  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...rest}
      data-no-magnetic
      className="group relative inline-flex items-center min-h-6 rounded-full transition-all duration-200"
      style={{ textDecoration: "none" }}
    >
      <StaggerText
        className={className}
        style={style}
        hoverColor={hoverColor}
      >
        {children}
      </StaggerText>
    </Link>
  );
});

export default StaggerLink;
