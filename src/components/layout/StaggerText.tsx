"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export interface StaggerTextProps extends HTMLAttributes<HTMLSpanElement> {
  text?: string;
  children?: ReactNode;
  hoverColor?: string;
  hovered?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function StaggerText({
  text,
  children,
  hoverColor,
  hovered: externalHovered,
  className,
  style,
  ...rest
}: StaggerTextProps) {
  const [internalHovered, setInternalHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const hovered = externalHovered !== undefined ? externalHovered : internalHovered;
  const content = text || (typeof children === "string" ? children : "");
  const words = content.split(" ");

  // Word-level roll: the server HTML keeps the real text as plain readable
  // text nodes (one per word, real spaces between). The aria-hidden enter
  // layer is mounted client-side only, so it never appears in the built HTML.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <span
      ref={ref}
      className={hovered ? `${className ?? ""} st-hover`.trim() : className}
      style={
        {
          ...style,
          lineHeight: 1.25,
          ...(hoverColor ? { "--st-hover": hoverColor } : null),
        } as CSSProperties
      }
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      {...rest}
    >
      {content === "" ? (
        children
      ) : (
        words.map((word, wi) => (
          <Fragment key={wi}>
            {wi > 0 ? " " : null}
            <span
              className="st-word"
              style={{ "--sw": `${wi * 45}ms` } as CSSProperties}
            >
              <span className="st-word-inner">{word}</span>
              {mounted && (
                <span aria-hidden="true" className="st-word-enter">
                  {word}
                </span>
              )}
            </span>
          </Fragment>
        ))
      )}
    </span>
  );
}
