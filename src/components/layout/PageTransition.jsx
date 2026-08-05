// CSS-only page fade — zero JS cost (replaces framer-motion AnimatePresence).
// The fade runs on navigation via the `page-enter` keyframe in src/index.css.
export default function PageTransition({ children }) {
  return <div className="page-enter">{children}</div>;
}
