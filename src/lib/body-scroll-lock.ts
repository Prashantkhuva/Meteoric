let count = 0;

export function lockScroll(): void {
  count++;
  if (count === 1) {
    document.body.style.overflow = "hidden";
  }
}

export function unlockScroll(): void {
  count = Math.max(0, count - 1);
  if (count === 0) {
    document.body.style.overflow = "";
  }
}
