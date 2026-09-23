/** A small headstone for a project that was started and stopped. */
export function Headstone({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden className="shrink-0">
      <path
        d="M4 14V6a4 4 0 0 1 8 0v8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path d="M2.5 14h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M8 7.5v3M6.7 8.8h2.6" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  )
}
