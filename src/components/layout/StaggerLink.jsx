"use client";

import { forwardRef } from "react";
import Link from "next/link";
import StaggerText from "./StaggerText";

const StaggerLink = forwardRef(function StaggerLink(
  { href, children, className, style, onClick, hoverColor, onMouseEnter, onMouseLeave },
  ref
) {
  return (
    <Link
      ref={ref}
      href={href}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-no-magnetic
      className="group relative px-4 py-2 rounded-xl transition-all duration-200"
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
