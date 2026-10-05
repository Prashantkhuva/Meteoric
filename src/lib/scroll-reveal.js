import { gsap } from "@/lib/gsap-setup";

/**
 * Directional masked-wipe reveal vars.
 *
 * `direction` = travel direction:
 * - up:    enters from below, rises      (clip opens bottom-up)
 * - down:  enters from above, drops      (clip opens top-down)
 * - left:  enters from the right, slides leftward
 * - right: enters from the left, slides rightward
 *
 * The clip-path wipe acts as the mask; clear it after the reveal finishes
 * (clearRevealClip) so hover transforms / glows on children are never clipped.
 */
const fromVars = {
  up: { clipPath: "inset(100% 0% 0% 0%)", y: 48, x: 0, opacity: 0 },
  down: { clipPath: "inset(0% 0% 100% 0%)", y: -48, x: 0, opacity: 0 },
  left: { clipPath: "inset(0% 0% 0% 100%)", x: 56, y: 0, opacity: 0 },
  right: { clipPath: "inset(0% 100% 0% 0%)", x: -56, y: 0, opacity: 0 },
};

export const revealTo = {
  clipPath: "inset(0% 0% 0% 0%)",
  x: 0,
  y: 0,
  opacity: 1,
};

export const revealFrom = (direction = "up") =>
  fromVars[direction] || fromVars.up;

export function clearRevealClip(target) {
  if (target) gsap.set(target, { clipPath: "none" });
}
