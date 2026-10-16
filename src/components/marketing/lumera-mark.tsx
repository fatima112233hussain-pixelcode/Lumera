/**
 * The mark: a lens of light. Three strokes rotating around a filled core,
 * which is the "lumen" the name is built on and reads clearly at 20px.
 */
export function LumeraMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={className}
      aria-hidden
      role="presentation"
    >
      <defs>
        <linearGradient id="lumera-mark" x1="4" y1="4" x2="28" y2="28">
          <stop offset="0%" stopColor="currentColor" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <g className="text-primary" stroke="url(#lumera-mark)" strokeWidth="1.9">
        <ellipse cx="16" cy="16" rx="12.5" ry="5.6" />
        <ellipse
          cx="16"
          cy="16"
          rx="12.5"
          ry="5.6"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="12.5"
          ry="5.6"
          transform="rotate(120 16 16)"
        />
      </g>
      <circle cx="16" cy="16" r="3.4" className="fill-primary" />
    </svg>
  );
}
