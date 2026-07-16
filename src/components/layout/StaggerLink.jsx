"use client";

import Link from "next/link";
import StaggerText from "./StaggerText";

export default function StaggerLink({ href, children, className, style, onClick, hoverColor }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      data-no-magnetic
      className="group relative px-4 py-2 rounded-xl hover:bg-white/[0.04] transition-all duration-200"
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
}
