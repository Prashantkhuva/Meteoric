import { useState, lazy, Suspense, useRef, useEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
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
  const overlayRef = useRef(null);
  const linksRef = useRef(null);
  const ctaRef = useRef(null);
  const isAnimating = useRef(false);

  const closeMenu = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimating.current = false;
        setIsMenuOpen(false);
        gsap.set(overlay, { display: "none" });
      },
    });

    tl.to(ctaRef.current, { y: 20, opacity: 0, duration: 0.2, ease: "power2.in" })
      .to(Array.from(linksRef.current?.children || []).reverse(), {
        y: 20, opacity: 0, stagger: 0.03, duration: 0.2, ease: "power2.in",
      }, "-=0.1")
      .to(overlay, {
        clipPath: "circle(0% at calc(100% - 28px) 28px)", duration: 0.4, ease: "power3.inOut",
      }, "-=0.1");
  };

  useEffect(() => {
    if (isMenuOpen) {
      lockScroll();
      const prev = document.activeElement;
      const overlay = overlayRef.current;
      if (!overlay) return;

      const onKey = (e) => { if (e.key === "Escape") closeMenu(); };
      overlay.addEventListener("keydown", onKey);
      const onOverlayClick = (e) => { if (e.target === overlay) closeMenu(); };
      overlay.addEventListener("click", onOverlayClick);

      const tl = gsap.timeline({
        onComplete: () => { isAnimating.current = false; },
      });
      isAnimating.current = true;

      tl.set(overlay, { display: "flex" })
        .fromTo(overlay,
          { clipPath: "circle(0% at calc(100% - 28px) 28px)" },
          { clipPath: "circle(150% at calc(100% - 28px) 28px)", duration: 0.5, ease: "power3.inOut" },
        )
        .fromTo(linksRef.current?.children || [],
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.35, ease: "power2.out" },
          "-=0.2",
        )
        .fromTo(ctaRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.15",
        );

      return () => {
        overlay.removeEventListener("keydown", onKey);
        overlay.removeEventListener("click", onOverlayClick);
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
                "linear-gradient(-7.69deg, rgba(10,10,10,0.95) 0%, rgba(18,18,18,0.95) 100%)",
              borderRadius: 100,
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
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
              onClick={() => isMenuOpen ? closeMenu() : setIsMenuOpen(true)}
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
      </header>

      {/* Mobile fullscreen overlay — outside header to avoid z-index stacking */}
      <div
        ref={overlayRef}
        tabIndex={-1}
        className="md:hidden fixed inset-0 z-[60] flex flex-col items-center justify-center"
        style={{
          display: "none",
          background: "linear-gradient(180deg, rgba(10,10,10,0.99) 0%, rgba(7,7,7,1) 100%)",
          backdropFilter: "blur(40px) saturate(1.2)",
        }}
      >
        {/* Close button */}
        <button
          onClick={closeMenu}
          className="absolute top-5 right-6 w-10 h-10 rounded-full border border-white/10 bg-white/[0.04] flex items-center justify-center text-white/50 hover:text-white hover:border-white/25 transition-all duration-200"
          aria-label="Close menu"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Nav links */}
        <div ref={linksRef} className="flex flex-col items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              onClick={closeMenu}
              className="group relative text-[28px] sm:text-[32px] font-display text-white/40 hover:text-white px-8 py-3.5 rounded-2xl hover:bg-white/[0.04] transition-all duration-200"
            >
              <span className="relative z-10">{item.label}</span>
              <span className="absolute left-8 right-8 bottom-3 h-px bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="w-12 h-px bg-white/[0.08] my-8" />

        {/* CTA */}
        <div ref={ctaRef}>
          <button
            onClick={() => { closeMenu(); setIsOpen(true); }}
            className="rounded-full px-10 py-3.5 text-sm font-semibold tracking-wide text-black hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200"
            style={{ background: "linear-gradient(180deg, #fff 0%, #cecece 100%)" }}
          >
            Let&apos;s Chat!
          </button>
        </div>
      </div>

      <Suspense fallback={null}>
        <RequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Suspense>
    </>
  );
}
