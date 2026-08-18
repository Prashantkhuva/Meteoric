"use client";

import { useState, useEffect, useRef } from "react";

export default function StaggerText({ text, children, hoverColor, hovered: externalHovered, className, style, ...rest }) {
  const [internalHovered, setInternalHovered] = useState(false);
  const ref = useRef(null);
  const hovered = externalHovered !== undefined ? externalHovered : internalHovered;
  const content = text || (typeof children === "string" ? children : "");
  const words = content.split(" ");

  useEffect(() => {
    ref.current?.classList.add("st-runtime");
  }, []);

  return (
    <span
      ref={ref}
      className={className}
      style={{ ...style, lineHeight: 1.25 }}
      onMouseEnter={() => setInternalHovered(true)}
      onMouseLeave={() => setInternalHovered(false)}
      {...rest}
    >
        {words.map((word, wi) => (
          <span key={wi} className="st-word">
            {word.split("").map((char, ci) => {
              const delay = `${(wi * word.length + ci) * 30}ms`;
              const charStyle = { transitionDelay: delay };
              const enterStyle = { transitionDelay: delay, color: hoverColor };

              return (
                <span key={ci} className="st-char-wrap" style={{ height: "1.25em" }}>
                  <span
                    className={`st-char ${hovered ? "exit" : ""}`}
                    style={charStyle}
                  >
                    {char}
                  </span>
                  <span
                    className={`st-char-enter ${hovered ? "enter" : ""}`}
                    style={enterStyle}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </span>
        ))}
      </span>
  );
}
