import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/sections/Logo";

const RequestModal = lazy(() => import("./NavBar/RequestModal"));

const navItems = [
  { label: "Work", to: "/#work" },
  { label: "Services", to: "/#services" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.activeElement;
    const el = menuRef.current;
    if (el && typeof el.focus === "function") el.focus();
    return () => {
      if (prev && typeof prev.focus === "function") prev.focus();
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 flex justify-center">
          <div className="relative w-[95%] md:w-[80%] lg:w-[56rem] max-w-6xl mt-4">
            {/* Glow behind nav */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-b from-[#EAEFFF]/8 via-transparent to-transparent blur-3xl pointer-events-none" />

            <div className="relative px-5 md:px-7 h-15 flex items-center justify-between rounded-full bg-black/50 backdrop-blur-xl border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
              {/* Top edge highlight */}
              <div className="absolute inset-x-[20%] -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <Link
              href="/"
              className="flex shrink-0 items-center cursor-pointer"
            >
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="relative text-[13px] font-medium text-white/50 tracking-wide transition-colors duration-300 hover:text-white/90 before:absolute before:left-1/2 before:-translate-x-1/2 before:-bottom-[3px] before:w-0 before:h-[2px] before:rounded-full before:bg-white/70 before:transition-all before:duration-300 hover:before:w-[60%]"
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="relative overflow-hidden bg-white text-[#121212] px-3 md:px-4 py-[4px] text-[13px] font-semibold rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.97] group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                <span className="relative z-10">Let's Build</span>
              </button>

              <button
                type="button"
                aria-label={
                  isMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="md:hidden inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white"
              >
                {isMenuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile dropdown */}
          <div
            ref={menuRef}
            tabIndex={-1}
            className={`md:hidden absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-2xl border border-white/[0.06] bg-black/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 ${
              isMenuOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-3 opacity-0"
            }`}
          >
            <div className="flex flex-col p-2">
              {navItems.map((item, i) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="group relative rounded-xl px-4 py-3 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <Suspense fallback={null}><RequestModal isOpen={isOpen} setIsOpen={setIsOpen} /></Suspense>
    </>
  );
}
