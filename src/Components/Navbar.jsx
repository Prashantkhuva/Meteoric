import { useState, lazy, Suspense, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

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
          <div className="px-4 md:px-6 py-3 flex items-center justify-between rounded-full backdrop-blur-md bg-black/40 border border-[#EAEFFF]/10 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
            <Link
              href="/"
              className="flex shrink-0 items-center cursor-pointer"
            >
              <Logo />
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm text-neutral-300">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="relative group transition"
                >
                  {item.label}
                  <span className="absolute left-0 -bottom-1 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOpen(true)}
                className="relative overflow-hidden bg-[#EAEFFF] text-[#202020] px-4 md:px-6 py-2 md:py-3 text-sm md:text-base rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <span className="relative z-10">Let's Build!</span>
              </button>

              <button
                type="button"
                aria-label={
                  isMenuOpen ? "Close navigation menu" : "Open navigation menu"
                }
                aria-expanded={isMenuOpen}
                onClick={() => setIsMenuOpen((open) => !open)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors duration-300 hover:bg-white/10"
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div
            ref={menuRef}
            tabIndex={-1}
            className={`md:hidden absolute left-0 right-0 top-[calc(100%+0.5rem)] overflow-hidden rounded-[1.5rem] border border-[#EAEFFF]/10 bg-black/85 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.45)] transition-all duration-300 ${
              isMenuOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            <div className="flex flex-col p-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-white/75 transition-colors duration-300 hover:bg-white/10 hover:text-white"
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
