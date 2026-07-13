"use client";

import { useState } from "react";

export default function StaggerText({ text, children, hoverColor, hovered: externalHovered, className, style, ...rest }) {
  const [internalHovered, setInternalHovered] = useState(false);
  const hovered = externalHovered !== undefined ? externalHovered : internalHovered;
  const content = text || (typeof children === "string" ? children : "");
  const words = content.split(" ");

  return (
    <>
      <style>{`
        .st-word { display: inline-flex; margin-right: 0.3em; }
        .st-word:last-child { margin-right: 0; }
        .st-char-wrap { display: inline-block; position: relative; overflow: hidden; vertical-align: top; }
        .st-char { display: inline-block; transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform; }
        .st-char.exit { transform: translateY(-110%); }
        .st-char-enter { display: inline-block; position: absolute; top: 0; left: 0; transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1); will-change: transform; transform: translateY(110%); }
        .st-char-enter.enter { transform: translateY(0%); }
      `}</style>
      <span
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
    </>
  );
}
