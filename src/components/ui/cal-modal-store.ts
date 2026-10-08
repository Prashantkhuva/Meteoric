let listener: (() => void) | null = null;
let pending = false;

export function openCalModal() {
  if (listener) listener();
  else pending = true;
}

export function registerCalModal(fn: () => void) {
  listener = fn;
  if (pending) {
    pending = false;
    fn();
  }
  return () => {
    if (listener === fn) listener = null;
  };
}
