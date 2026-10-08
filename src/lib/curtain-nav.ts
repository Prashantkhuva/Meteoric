let skipEnter = false;

export function markCurtainNav(): void {
  skipEnter = true;
}

export function consumeCurtainNav(): boolean {
  const value = skipEnter;
  skipEnter = false;
  return value;
}
