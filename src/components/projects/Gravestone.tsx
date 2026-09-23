/**
 * A literal headstone for a project that was started and stopped, drawn in the
 * same language as the rest of the OS: near-black ground, chiselled monospace
 * engraving, one amber accent. Fills the same slot a screenshot would.
 */
export function Gravestone({ file }: { file: string }) {
  // Chiselled lettering: a dark shadow dropped just below the lit glyph.
  const engrave = (text: string, y: number, size: number, accent = false) => (
    <>
      <text x="84" y={y + 0.7} textAnchor="middle" className="chrome" fontSize={size} fill="#08080a">
        {text}
      </text>
      <text
        x="84"
        y={y}
        textAnchor="middle"
        className="chrome"
        fontSize={size}
        fill={accent ? '#e8a33d' : '#6b6b73'}
        opacity={accent ? 0.8 : 0.95}
      >
        {text}
      </text>
    </>
  )

  return (
    <svg
      viewBox="0 0 168 112"
      role="img"
      aria-label={`Headstone for ${file}, a project left mid-progress`}
      className="border-os-line bg-os-void h-[112px] w-full shrink-0 rounded-md border sm:w-[168px]"
    >
      {/* mound the stone is set into */}
      <path d="M34 98 q50 -13 100 0 v6 H34 Z" fill="#141416" />

      {/* the stone */}
      <path
        d="M40 98 V50 a44 44 0 0 1 88 0 V98 Z"
        fill="#1c1c1f"
        stroke="#3a3a40"
        strokeWidth="1.2"
      />
      {/* inner bevel, so it reads as carved rather than flat */}
      <path
        d="M46 98 V50 a38 38 0 0 1 76 0 V98"
        fill="none"
        stroke="#2a2a2e"
        strokeWidth="1"
      />

      {engrave('>_', 34, 9, true)}
      {engrave(file, 55, 7)}
      <path d="M62 62 H106" stroke="#2a2a2e" strokeWidth="1" />
      {engrave('left mid-progress', 74, 5.6)}

      {/* ground line, dashed like everything else in the chrome */}
      <path d="M6 104 H162" stroke="#2a2a2e" strokeWidth="1" strokeDasharray="3 5" />
    </svg>
  )
}
