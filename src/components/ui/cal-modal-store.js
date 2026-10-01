let listener = null;
let pending = false;

export function openCalModal() {
  if (listener) listener();
  else pending = true;
}

export function registerCalModal(fn) {
  listener = fn;
  if (pending) {
    pending = false;
    fn();
  }
  return () => {
    if (listener === fn) listener = null;
  };
}
