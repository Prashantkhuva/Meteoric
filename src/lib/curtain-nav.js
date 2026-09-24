let skipEnter = false;

export function markCurtainNav() {
  skipEnter = true;
}

export function consumeCurtainNav() {
  const value = skipEnter;
  skipEnter = false;
  return value;
}
