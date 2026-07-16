import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function textReveal(el, options = {}) {
  if (!el) return null;
  const split = new SplitText(el, { type: "lines", linesClass: "split-line" });
  gsap.fromTo(
    split.lines,
    { y: options.y ?? 30, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      ease: options.ease ?? "power2.out",
      stagger: options.stagger ?? 0.1,
      scrollTrigger: {
        trigger: el,
        start: options.start ?? "top bottom",
        toggleActions: options.toggleActions ?? "play reset play reset",
      },
    },
  );
  return split;
}

export function blurTextReveal(el, options = {}) {
  if (!el) return null;
  const split = new SplitText(el, { type: "lines", linesClass: "split-line" });
  gsap.fromTo(
    split.lines,
    { filter: "blur(8px)", opacity: 0.1 },
    {
      filter: "blur(0px)",
      opacity: 1,
      stagger: { each: 1 / split.lines.length, ease: "none" },
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: options.start ?? "top 80%",
        end: options.end ?? "bottom 60%",
        scrub: options.scrub ?? 0.5,
        invalidateOnRefresh: true,
      },
    },
  );
  return split;
}
