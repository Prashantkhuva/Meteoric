"use client";

import Link from "next/link";
import { useState } from "react";

export default function StaggerLink({ href, children, className, style, onClick, hoverColor }) {
  const [hovered, setHovered] = useState(false);
  const text = typeof children === "string" ? children : "";
  const chars = text.split("");

  return (
    <>
      <style>{`
        .stag-char { display: block; will-change: transform, opacity; backface-visibility: hidden; line-height: 1.25; transform-origin: center center; }
        @keyframes stagExitUp {
          0%   { transform: translateY(0%) rotateX(0deg); opacity: 1; }
          100% { transform: translateY(-110%) rotateX(45deg); opacity: 0; }
        }
        @keyframes stagEnterUp {
          0%   { transform: translateY(110%) rotateX(-45deg); opacity: 0; }
          100% { transform: translateY(0%) rotateX(0deg); opacity: 1; }
        }
        @keyframes stagResetExit {
          0%   { transform: translateY(-110%) rotateX(45deg); opacity: 0; }
          100% { transform: translateY(0%) rotateX(0deg); opacity: 1; }
        }
        @keyframes stagResetEnter {
          0%   { transform: translateY(0%) rotateX(0deg); opacity: 1; }
          100% { transform: translateY(110%) rotateX(-45deg); opacity: 0; }
        }
      `}</style>
      <Link
        href={href}
        className={className}
        style={{ ...style, perspective: "400px", perspectiveOrigin: "50% 50%" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        {chars.map((char, i) => {
          const delay = `${i * 35}ms`;
          const dur = "320ms";
          const ease = "cubic-bezier(0.4, 0, 0.2, 1)";
          const wrap = { display: "inline-block", position: "relative", height: "1.25em", overflow: "hidden", verticalAlign: "top" };
          if (char === " ") Object.assign(wrap, { width: "0.35em", minWidth: "0.35em" });

          return (
            <span key={i} style={wrap}>
              <span
                className="stag-char"
                style={{
                  animation: hovered
                    ? `stagExitUp ${dur} ${delay} ${ease} forwards`
                    : `stagResetExit ${dur} ${delay} ${ease} forwards`,
                }}
              >
                {char === " " ? "\u00a0" : char}
              </span>
              <span
                className="stag-char"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  animation: hovered
                    ? `stagEnterUp ${dur} ${delay} ${ease} forwards`
                    : `stagResetEnter ${dur} ${delay} ${ease} forwards`,
                  transform: "translateY(110%)",
                  opacity: 0,
                  color: hoverColor,
                }}
              >
                {char === " " ? "\u00a0" : char}
              </span>
            </span>
          );
        })}
      </Link>
    </>
  );
}
