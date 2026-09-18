import { useState, lazy, Suspense, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { gsap } from "@/lib/gsap-setup";
import Logo from "@/components/sections/Logo";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";
import { trackEvent } from "@/lib/analytics/gtag";
import ThemeToggle from "./ThemeToggle";

const RequestModal = lazy(() => import("./NavBar/RequestModal"));

const navItems = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Case Studies", to: "/case-studies" },
];

export default function Navbar({ isHome = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const overlayRef = useRef(null);
  const linksRef = useRef(null);
  const ctaRef = useRef(null);
  const isAnimating = useRef(false);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  const trackBookingClick = useCallback((buttonLocation) => {
    trackEvent("booking_click", { button_location: buttonLocation });
  }, []);

  // Toggle compact nav when first section leaves viewport
  useEffect(() => {
    // Home page: observe the hero section
    const hero = document.getElementById("home");
    if (hero) {
      const observer = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0 },
      );
      observer.observe(hero);
      return () => observer.disconnect();
    }

    // Non-home pages: use scroll threshold so full nav shows at top
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide scrolled pill when footer enters viewport
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setNearFooter(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

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

    tl.to(ctaRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
    })
      .to(
        Array.from(linksRef.current?.children || []).reverse(),
        {
          y: 20,
          opacity: 0,
          stagger: 0.03,
          duration: 0.2,
          ease: "power2.in",
        },
        "-=0.1",
      )
      .to(
        overlay,
        {
          clipPath: "circle(0% at calc(100% - 28px) 28px)",
          duration: 0.4,
          ease: "power3.inOut",
        },
        "-=0.1",
      );
  };

  useEffect(() => {
    if (isMenuOpen) {
      lockScroll();
      const prev = document.activeElement;
      const overlay = overlayRef.current;
      if (!overlay) return;

      const onKey = (e) => {
        if (e.key === "Escape") closeMenu();
        if (e.key === "Tab") {
          const focusable = overlay.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      overlay.addEventListener("keydown", onKey);
      const onOverlayClick = (e) => {
        if (e.target === overlay) closeMenu();
      };
      overlay.addEventListener("click", onOverlayClick);

      overlay.focus({ preventScroll: true });

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimating.current = false;
        },
      });
      isAnimating.current = true;

      tl.set(overlay, { display: "flex" })
        .fromTo(
          overlay,
          { clipPath: "circle(0% at calc(100% - 28px) 28px)" },
          {
            clipPath: "circle(150% at calc(100% - 28px) 28px)",
            duration: 0.5,
            ease: "power3.inOut",
          },
        )
        .fromTo(
          linksRef.current?.children || [],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.06,
            duration: 0.35,
            ease: "power2.out",
          },
          "-=0.2",
        )
        .fromTo(
          ctaRef.current,
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

  const linkColor = isHome ? "var(--hero-text)" : "var(--text-primary)";

  return (
    <>
      {/* ═══════ STATE 1: Mobile top nav — transparent on hero ═══════ */}
      <header
        className="shrink-0 lg:hidden"
        style={{
          position: "relative",
          zIndex: 20,
          opacity: scrolled ? 0 : 1,
          pointerEvents: scrolled ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between px-3 py-3.5 sm:px-8 sm:py-6 md:px-6 xl:px-8">
          <Link
            href="/"
            data-no-magnetic
            className="flex shrink-0 items-center gap-2.5"
          >
            <Logo light={!isHome || scrolled} />
          </Link>

          <div className="flex items-center gap-2">
            {/* Mobile hamburger */}
            <button
              type="button"
              data-no-magnetic
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              onClick={() => (isMenuOpen ? closeMenu() : setIsMenuOpen(true))}
              className="flex size-11 shrink-0 items-center justify-center rounded-full outline-none"
            >
              <span className="flex flex-col items-center justify-center gap-[5px]">
                <span
                  className="block h-[1.5px] w-5 rounded-full transition-all duration-300 origin-center"
                  style={{
                    backgroundColor: (!isHome || scrolled) ? "var(--text-primary)" : "var(--hero-text)",
                    transform: isMenuOpen ? "translateY(3.25px) rotate(45deg)" : "none",
                  }}
                />
                <span
                  className="block h-[1.5px] w-5 rounded-full transition-all duration-300 origin-center"
                  style={{
                    backgroundColor: (!isHome || scrolled) ? "var(--text-primary)" : "var(--hero-text)",
                    transform: isMenuOpen ? "translateY(-3.25px) rotate(-45deg)" : "none",
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ Mobile scrolled pill — atomik style ═══════ */}
      <div
        className="fixed top-4 left-0 right-0 z-[60] lg:hidden px-4"
        style={{
          opacity: scrolled && !nearFooter ? 1 : 0,
          pointerEvents: scrolled && !nearFooter ? "auto" : "none",
          transform: `translateY(${scrolled && !nearFooter ? "0" : "-12px"})`,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div
          className="flex w-full items-center justify-between gap-4 rounded-full pl-4 pr-1.5 py-1.5"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
          <Link
            href="/"
            data-no-magnetic
            className="flex shrink-0 items-center gap-2"
          >
            <Logo light />
          </Link>
          <button
            data-no-magnetic
            onClick={() => {
              trackBookingClick("/navbar-pill-mobile");
              openCal();
            }}
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[13px] font-medium transition-all duration-200 hover:opacity-85"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            Book a call
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </button>
        </div>
      </div>

      {/* Desktop top nav — transparent, overlays hero */}
      <header
        className="relative z-20 shrink-0 hidden lg:block"
        style={{
          opacity: scrolled ? 0 : 1,
          pointerEvents: scrolled ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <div className="mx-auto max-w-6xl flex items-center justify-between lg:h-28 lg:items-start lg:py-10 px-3 py-3.5 sm:px-8 sm:py-6 md:px-6 xl:px-8">
          <Link
            href="/"
            data-no-magnetic
            className="flex shrink-0 items-center gap-2.5"
          >
            <Logo light={!isHome} />
          </Link>

          {/* Desktop Nav — centered links */}
          <div className="absolute top-10 left-1/2 hidden h-[38px] -translate-x-1/2 items-center gap-8 text-[13px] font-medium lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                className="transition-opacity hover:opacity-70"
                style={{ color: linkColor }}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Theme + CTA + Mobile toggle */}
          <div className="flex items-center gap-2 lg:py-[3px]">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>

            <button
              data-no-magnetic
              onClick={() => {
                trackBookingClick("/navbar");
                openCal();
              }}
              className="hidden lg:inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-3.5 text-[13px] font-medium shadow-none group"
              style={
                isHome
                  ? { background: "var(--hero-text)", color: "var(--hero-bg)" }
                  : { background: "var(--text-primary)", color: "var(--bg-primary)" }
              }
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Book a call
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 12 12"
                className="size-2 -rotate-90 transition-transform duration-150 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-px motion-reduce:transition-none motion-reduce:transform-none"
              >
                <path
                  fill="currentColor"
                  d="M.996 4.248a.75.75 0 0 1 1.281-.53l3.72 3.72 3.72-3.72a.75.75 0 0 1 1.061 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L.996 4.779a.75.75 0 0 1 0-5.331Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* ═══════ STATE 2: Compact pill nav — fixed, centered, after scroll ═══════ */}
      <div
        className="fixed top-4 left-0 right-0 z-50 hidden lg:flex justify-center text-[13px] font-medium"
        style={{
          opacity: scrolled && !nearFooter ? 1 : 0,
          pointerEvents: scrolled && !nearFooter ? "auto" : "none",
          transform: `translateY(${scrolled && !nearFooter ? "0" : "-12px"})`,
          transition: "opacity 0.3s ease, transform 0.3s ease",
        }}
      >
        <div
          className="flex items-center justify-between gap-6 rounded-full px-5 py-1.5 text-[13px] font-medium max-w-[calc(100vw-2rem)]"
          style={{
            background: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          }}
        >
        <Link
          href="/"
          data-no-magnetic
          className="flex shrink-0 items-center pl-3"
        >
          <Logo light />
        </Link>

        <div className="flex items-center gap-5">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="transition-opacity hover:opacity-70 whitespace-nowrap"
              style={{ color: "var(--text-primary)" }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-1.5 pl-1">
          <ThemeToggle />
          <button
            data-no-magnetic
            onClick={() => {
              trackBookingClick("/navbar-pill");
              openCal();
            }}
            className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-full transition-all outline-none cursor-pointer h-8 gap-2 border-0 px-4 text-[13px] font-semibold shadow-none"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Book a call
          </button>
        </div>
        </div>
      </div>

      {/* ═══════ Mobile fullscreen overlay — atomik style ═══════ */}
      {createPortal(
        <div
          ref={overlayRef}
          tabIndex={-1}
          className="lg:hidden fixed inset-0 z-[60] flex flex-col items-center justify-center"
          style={{
            display: "none",
            background: "var(--bg-primary)",
          }}
        >
          {/* Close button */}
          <button
            data-no-magnetic
            onClick={closeMenu}
            className="absolute top-5 right-6 w-11 h-11 flex items-center justify-center rounded-full outline-none"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Nav links */}
          <div ref={linksRef} className="flex flex-col items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                onClick={closeMenu}
                data-no-magnetic
                className="text-[28px] sm:text-[32px] font-display px-6 py-3 transition-colors duration-200"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-10">
            <button
              data-no-magnetic
              onClick={() => {
                trackBookingClick("/navbar-mobile");
                closeMenu();
                openCal();
              }}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-200 hover:opacity-85 active:scale-[0.98]"
              style={{
                background: "var(--text-primary)",
                color: "var(--bg-primary)",
              }}
            >
              Book a call
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </button>
          </div>
        </div>,
        document.body,
      )}

      <Suspense fallback={null}>
        <RequestModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Suspense>
    </>
  );
}
