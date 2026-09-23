import { PixelRows, stoneRow } from './pixel'

/**
 * The same headstone at scene scale: a pixel stone standing on a strip of
 * grass, with the engraving set in crisp monospace over it. Sprite art plus a
 * readable bitmap-style label is exactly how a game renders a named object,
 * and it keeps the filename legible at a size pixels couldn't spell.
 */
const GRID = 48
const STONE_TOP = 2

// Tapered shoulders, then a straight body, then the base course.
const STONE = [
  'o'.repeat(14),
  stoneRow(20, 2),
  stoneRow(26, 2),
  stoneRow(30, 2),
  stoneRow(32, 2),
  ...Array.from({ length: 16 }, () => stoneRow(34)),
  'o'.repeat(34),
]

// Grass runs the full width; the speckles stop it reading as a printed rule.
const GROUND = [
  Array.from({ length: GRID }, (_, i) => (i % 7 === 2 || i % 11 === 5 ? 'G' : 'g')).join(''),
  Array.from({ length: GRID }, (_, i) => (i % 5 === 1 ? 'g' : 'G')).join(''),
]

/** One flower, off to the side. The only warm thing in the scene besides the engraving. */
const FLOWER = ['.f.', 'fFf', '.F.', '.F.']

export function Gravestone({ file }: { file: string }) {
  // Chiselled text: the lit glyph with its shadow dropped a third of a pixel below.
  const engrave = (text: string, y: number, size: number, accent = false) => (
    <>
      <text
        x={GRID / 2}
        y={y + size * 0.14}
        textAnchor="middle"
        className="chrome"
        fontSize={size}
        fill="#2a2a32"
      >
        {text}
      </text>
      <text
        x={GRID / 2}
        y={y}
        textAnchor="middle"
        className="chrome"
        fontSize={size}
        fill={accent ? '#e8a33d' : '#d2d2da'}
        opacity={accent ? 0.9 : 0.72}
      >
        {text}
      </text>
    </>
  )

  return (
    <svg
      viewBox={`0 0 ${GRID} 32`}
      role="img"
      aria-label={`Headstone for ${file}, a project left mid-progress`}
      shapeRendering="crispEdges"
      className="border-os-line bg-os-void h-[112px] w-full shrink-0 rounded-md border sm:w-[168px]"
    >
      <PixelRows rows={STONE} width={GRID} top={STONE_TOP} />
      <PixelRows rows={GROUND} width={GRID} top={24} />

      {/* Tufts and a flower, pushed to the edges so they never crowd the stone. */}
      <g transform="translate(-16 0)">
        <PixelRows rows={FLOWER} width={GRID} top={20} />
      </g>
      <g transform="translate(17 0)">
        <PixelRows rows={['.g.', 'gGg']} width={GRID} top={22} />
      </g>

      {/* Engraving is not pixel art — it has to spell a filename. */}
      <g shapeRendering="auto">
        {engrave('>_', 10.5, 3.4, true)}
        {engrave(file, 16.4, 2.4)}
        <rect x={GRID / 2 - 9} y="18.4" width="18" height="0.4" fill="#5a5a66" />
        {engrave('left mid-progress', 21.6, 1.9)}
      </g>
    </svg>
  )
}
