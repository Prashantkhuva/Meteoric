export default function GridLines({ className = "" }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`} aria-hidden="true">
      <div className="grid-line grid-line-v left" />
      <div className="grid-line grid-line-v right" />
    </div>
  );
}

export function GridLineHorizontal({ position = "top", animated = false }) {
  return (
    <div
      className={`grid-line grid-line-h ${position} ${animated ? "grid-line-animated" : ""}`}
      aria-hidden="true"
    />
  );
}

export function GridLineVertical({ position = "left", animated = false }) {
  return (
    <div
      className={`grid-line grid-line-v ${position} ${animated ? "grid-line-animated" : ""}`}
      aria-hidden="true"
    />
  );
}
