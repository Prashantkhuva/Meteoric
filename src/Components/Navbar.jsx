import React, { useState } from "react";
import { Link } from "react-router-dom";
import RequestModal from "./NavBar/RequestModal";

const navItems = [
  { label: "Work", to: "/#work" },
  { label: "Services", to: "/#services" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-center">
        <div className="w-[95%] md:w-[80%] lg:w-[56rem] max-w-6xl mt-4 px-4 md:px-6 py-3 flex items-center justify-between rounded-full backdrop-blur-md bg-black/40 border border-[#EAEFFF]/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
          <Link
            to="/"
            className="text-white font-semibold text-lg tracking-tight cursor-pointer"
          >
            Meteoric
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className="relative group transition"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="relative overflow-hidden bg-[#EAEFFF] text-[#202020] px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
          >
            <span className="relative z-10">Let's Build!</span>
          </button>
        </div>
      </nav>

      <RequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}
