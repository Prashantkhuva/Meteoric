import {
  useState,
  lazy,
  Suspense,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { gsap } from "@/lib/gsap-setup";
import Logo from "@/components/sections/Logo";
import { lockScroll, unlockScroll } from "@/lib/body-scroll-lock";
import StaggerLink from "./StaggerLink";
import StaggerText from "./StaggerText";
import { trackEvent } from "@/lib/analytics/gtag";

const RequestModal = lazy(() => import("./NavBar/RequestModal"));

const navItems = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/blog" },
  { label: "Case Studies", to: "/case-studies" },
];

function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";
    return localStorage.getItem("meteors-theme") || "dark";
  });

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("meteors-theme", next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
  };

  return (
    <button
      data-no-magnetic
      onClick={toggle}
      className="theme-toggle"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const overlayRef = useRef(null);
  const linksRef = useRef(null);
  const ctaRef = useRef(null);
  const isAnimating = useRef(false);
  const navRef = useRef(null);
  const pillRef = useRef(null);
  const navItemRefs = useRef([]);
  const activeIndex = useRef(-1);

  const openCal = useCallback(async () => {
    const { getCalApi } = await import("@calcom/embed-react");
    const cal = await getCalApi({ namespace: "let-s-build" });
    cal("modal", { calLink: "prashantkhuva/let-s-build" });
  }, []);

  const trackBookingClick = useCallback((buttonLocation) => {
    trackEvent("booking_click", { button_location: buttonLocation });
  }, []);

  const movePill = useCallback((index) => {
    const nav = navRef.current;
    const pill = pillRef.current;
    const item = navItemRefs.current[index];
    if (!nav || !pill || !item) return;

    const navRect = nav.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    gsap.to(pill, {
      x: itemRect.left - navRect.left,
      width: itemRect.width,
      opacity: 1,
      duration: 0.35,
      ease: "power3.out",
    });
    activeIndex.current = index;
  }, []);

  const hidePill = useCallback(() => {
    const pill = pillRef.current;
    if (!pill) return;
    gsap.to(pill, { opacity: 0, duration: 0.25, ease: "power2.in" });
    activeIndex.current = -1;
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

  return (
    <>
      <header className="fixed md:static top-0 left-0 w-full max-w-full z-50 py-4 md:pt-6 bg-transparent overflow-hidden">
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-6 md:px-[72px]">
          {/* Logo */}
          <Link
            href="/"
            data-no-magnetic
            className="flex shrink-0 items-center cursor-pointer"
          >
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav
            ref={navRef}
            className="hidden md:flex items-center relative"
            style={{
              background: "var(--nav-bg)",
              borderRadius: 100,
              boxShadow:
                "inset 0 0 0 1px var(--border-color), 0 0 0 1px rgba(128,128,128,0.02)",
              gap: 4,
              padding: "6px",
              height: 42,
              backdropFilter: "blur(20px) saturate(1.2)",
            }}
          >
            <span
              ref={pillRef}
              className="absolute top-1/2 -translate-y-1/2 left-0 h-[calc(100%-12px)] rounded-full pointer-events-none"
              style={{
                background: "var(--accent-glow)",
                boxShadow: "0 0 12px var(--accent-glow)",
                opacity: 0,
                willChange: "transform, width",
              }}
            />
            {navItems.map((item, i) => (
              <StaggerLink
                key={item.to}
                href={item.to}
                ref={(el) => {
                  navItemRefs.current[i] = el;
                }}
                onClick={() => setIsMenuOpen(false)}
                hoverColor="var(--text-primary)"
                onMouseEnter={() => movePill(i)}
                onMouseLeave={hidePill}
                style={{
                  fontSize: 12,
                  fontWeight: 400,
                  color: "var(--text-muted)",
                  letterSpacing: "normal",
                  textDecoration: "none",
                  cursor: "pointer",
                  padding: "8px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {item.label}
              </StaggerLink>
            ))}
          </nav>

          {/* Right side: Theme toggle + CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              data-no-magnetic
              onClick={() => {
                trackBookingClick("/navbar");
                openCal();
              }}
              className="hidden md:inline-flex items-center cursor-pointer flip-btn"
            >
              <StaggerText
                hoverColor="var(--accent-text)"
                style={{ fontSize: 14, fontWeight: 400, color: "var(--accent-text)" }}
              >
                {"Book a Free Call"}
              </StaggerText>
            </button>

            <button
              type="button"
              data-no-magnetic
              aria-label={
                isMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={isMenuOpen}
              onClick={() => (isMenuOpen ? closeMenu() : setIsMenuOpen(true))}
              className="md:hidden inline-flex h-11 w-11 flex-col items-center justify-center gap-[5px]"
              style={{ background: "transparent", borderRadius: 8 }}
            >
              <span
                className="block h-[1.5px] w-4 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "var(--text-primary)",
                  transform: isMenuOpen
                    ? "translateY(3.25px) rotate(45deg)"
                    : "none",
                }}
              />
              <span
                className="block h-[1.5px] w-4 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: "var(--text-primary)",
                  transform: isMenuOpen
                    ? "translateY(-3.25px) rotate(-45deg)"
                    : "none",
                }}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay — portaled to body to escape GSAP transform containing block */}
      {createPortal(
      <div
        ref={overlayRef}
        tabIndex={-1}
        className="md:hidden fixed inset-0 z-[60] flex flex-col items-center justify-center"
        style={{
          display: "none",
          background: "var(--bg-primary)",
          backdropFilter: "blur(40px) saturate(1.2)",
        }}
      >
        {/* Close button */}
        <button
          data-no-magnetic
          onClick={closeMenu}
          className="absolute top-5 right-6 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-muted)",
            background: "var(--accent-glow)",
          }}
          aria-label="Close menu"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Nav links */}
        <div ref={linksRef} className="flex flex-col items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              onClick={closeMenu}
              data-no-magnetic
              className="group relative text-[28px] sm:text-[32px] font-display px-8 py-3.5 rounded-2xl transition-all duration-200"
              style={{ color: "var(--text-muted)" }}
            >
              <span className="relative z-10">{item.label}</span>
              <span
                className="absolute left-8 right-8 bottom-3 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                style={{ background: "var(--border-color)" }}
              />
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="w-12 h-px my-8" style={{ background: "var(--border-color)" }} />

        {/* CTA */}
        <div ref={ctaRef}>
          <button
            data-no-magnetic
            onClick={() => {
              trackBookingClick("/navbar-mobile");
              closeMenu();
              openCal();
            }}
            className="rounded-full px-10 py-3.5 text-sm font-semibold tracking-wide transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "var(--accent)",
              color: "var(--accent-text)",
            }}
          >
            Book a Free Call
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
