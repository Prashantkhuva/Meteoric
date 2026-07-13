"use client";

import Link from "next/link";
import StaggerText from "./StaggerText";

export default function StaggerLink({ href, children, className, style, onClick, hoverColor }) {
  return (
    <Link href={href} onClick={onClick} style={{ textDecoration: "none" }}>
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
