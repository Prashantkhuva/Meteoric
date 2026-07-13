import { useState, lazy, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import Logo from "@/components/sections/Logo";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";
import StaggerLink from "./StaggerLink";
import StaggerText from "./StaggerText";

const RequestModal = lazy(() => import("./NavBar/RequestModal"));

const navItems = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isMenuOpen) {
      lockScroll();
      const prev = document.activeElement;
      const el = menuRef.current;
      if (el && typeof el.focus === "function") el.focus();
      return () => {
        unlockScroll();
        if (prev && typeof prev.focus === "function") prev.focus();
      };
    }
    unlockScroll();
  }, [isMenuOpen]);

  return (
    <>
      <style>{`
        .flip-btn {
          font-size: 14px;
          font-weight: 400;
          padding: 10px 28px;
          border: none;
          border-radius: 100px;
          background: linear-gradient(180deg, #fff 0%, #cecece 100%);
          outline: 0;
          line-height: 1;
          text-align: center;
          cursor: pointer;
        }
      `}</style>

      <header className="fixed md:static top-0 left-0 w-full z-50 py-4 md:pt-6 bg-transparent md:bg-transparent backdrop-blur-[20px] md:backdrop-blur-none">
        <div
          className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-[72px]"
        >
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center cursor-pointer">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav
            className="hidden md:flex items-center"
            style={{
              background:
                "linear-gradient(-7.69deg, rgb(0,0,0) 50%, rgb(41,41,41) 124%)",
              borderRadius: 100,
              boxShadow: "rgba(134,134,134,0.5) 0.5px 0.5px 0px 0px inset",
              gap: 56,
              padding: "16px 32px",
              height: 54,
            }}
          >
            {navItems.map((item) => (
              <StaggerLink
                key={item.to}
                href={item.to}
                onClick={() => setIsMenuOpen(false)}
                hoverColor="white"
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "rgb(128,128,128)",
                  letterSpacing: "normal",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                {item.label}
              </StaggerLink>
            ))}
          </nav>

          {/* Right side: CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(true)}
              className="hidden md:inline-flex items-center cursor-pointer flip-btn"
            >
              <StaggerText hoverColor="#1b1b1b" style={{ fontSize: 14, fontWeight: 400, color: "#1b1b1b" }}>
                {"Let's Chat!"}
              </StaggerText>
            </button>

            <button
              type="button"
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="md:hidden inline-flex h-6 w-6 flex-col items-center justify-center gap-[5px]"
              style={{ background: "rgba(255,255,255,0)", borderRadius: 8 }}
            >
              <span
                className="block h-[1.5px] w-4 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "rgb(255,255,255)",
                  transform: isMenuOpen ? "translateY(3.25px) rotate(45deg)" : "none",
                }}
              />
              <span
                className="block h-[1.5px] w-4 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "rgb(255,255,255)",
                  transform: isMenuOpen ? "translateY(-3.25px) rotate(-45deg)" : "none",
                }}
              />
            </button>
          </div>
        </div>

          {/* Mobile dropdown */}
        <div
          ref={menuRef}
          tabIndex={-1}
          className={`md:hidden mx-6 overflow-hidden rounded-xl border border-white/[0.06] bg-black/80 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-300 ${
            isMenuOpen
              ? "pointer-events-auto translate-y-0 opacity-100 max-h-[320px]"
              : "pointer-events-none -translate-y-3 opacity-0 max-h-0"
          }`}
        >
          <div className="flex flex-col p-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="group relative rounded-lg px-3 py-2 text-sm font-medium text-white/60 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { setIsMenuOpen(false); setIsOpen(true); }}
              className="mt-0.5 mx-1 rounded-lg px-3 py-2 text-sm font-medium text-black transition-all duration-200"
              style={{
                background: "linear-gradient(180deg, #fff 0%, #cecece 100%)",
              }}
            >
              Let&apos;s Chat!
            </button>
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <RequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Suspense>
    </>
  );
}
