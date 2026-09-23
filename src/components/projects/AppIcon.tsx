/**
 * PrintOK's app icon: a sheet coming out of a printer, drawn inline so it
 * scales crisply and costs no request. Amber accent, no gradients.
 */
export function AppIcon({ size = 64 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="shrink-0 rounded-[14px]"
    >
      <rect width="64" height="64" rx="14" fill="#141416" />
      <rect x="0.5" y="0.5" width="63" height="63" rx="13.5" fill="none" stroke="#2a2a2e" />
      {/* paper feeding out */}
      <rect x="20" y="12" width="24" height="15" rx="2" fill="none" stroke="#3a3a40" strokeWidth="2" />
      {/* printer body */}
      <rect x="14" y="27" width="36" height="16" rx="3" fill="#1c1c1f" stroke="#e8a33d" strokeWidth="2" />
      <circle cx="43" cy="35" r="2" fill="#e8a33d" />
      {/* printed sheet */}
      <rect x="21" y="41" width="22" height="13" rx="2" fill="#0c0c0d" stroke="#e8a33d" strokeWidth="2" />
      <path d="M25 46h14M25 50h9" stroke="#e8a33d" strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
    </svg>
  )
}
