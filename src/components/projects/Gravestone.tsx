import { PixelRows, stoneRow } from './pixel'

/**
 * A grave at scene scale. The stone is deliberately portrait — 18 units wide
 * by 22 tall — because a headstone wider than it is tall reads as squat no
 * matter how well it's drawn.
 *
 * That leaves no room to engrave a filename across it, so the name sits on a
 * nameplate beneath the scene instead, the way a game labels an object you're
 * looking at. The stone itself stays pure pixel art with a carved cross,
 * matching the icon in the row exactly.
 */
const GRID = 48

const plain = stoneRow(18)
const vertical = 'ol' + 'm'.repeat(6) + 'ee' + 'm'.repeat(6) + 'do'
const horizontal = 'ol' + 'mm' + 'e'.repeat(10) + 'mm' + 'do'

const STONE = [
  'o'.repeat(8),
  stoneRow(12, 2),
  stoneRow(16, 2),
  stoneRow(18, 2),
  plain,
  vertical,
  vertical,
  horizontal,
  vertical,
  vertical,
  ...Array.from({ length: 10 }, () => plain),
  'o'.repeat(18),
]

const GROUND = [
  Array.from({ length: GRID }, (_, i) => (i % 7 === 2 || i % 11 === 5 ? 'G' : 'g')).join(''),
  Array.from({ length: GRID }, (_, i) => (i % 5 === 1 ? 'g' : 'G')).join(''),
]

/** A second stone set back, drawn in the ground's own greys — depth, not detail. */
const DISTANT = ['oooo', 'ommmo', 'ommmo', 'ommmo', 'ommmo', 'ooooo']
const DISTANT_TINT = { o: '#101014', m: '#26262c' }

const FLOWER = ['.f.', 'fFf', '.F.', '.F.']

export function Gravestone({ file }: { file: string }) {
  return (
    <svg
      viewBox={`0 0 ${GRID} 34`}
      role="img"
      aria-label={`Headstone for ${file}, a project left mid-progress`}
      shapeRendering="crispEdges"
      className="border-os-line bg-os-void h-[112px] w-full shrink-0 rounded-md border sm:w-[168px]"
    >
      <g transform="translate(-15 0)">
        <PixelRows rows={DISTANT} width={GRID} top={17} overrides={DISTANT_TINT} />
      </g>

      <PixelRows rows={STONE} width={GRID} top={2} />
      <PixelRows rows={GROUND} width={GRID} top={24} />

      <g transform="translate(-17 0)">
        <PixelRows rows={FLOWER} width={GRID} top={20} />
      </g>
      <g transform="translate(16 0)">
        <PixelRows rows={['.g.', 'gGg']} width={GRID} top={22} />
      </g>

      {/* Nameplate. Crisp monospace, because it has to spell a filename. */}
      <g shapeRendering="auto">
        <text x="4" y="29.6" className="chrome" fontSize="2.8" fill="#e8a33d" opacity="0.9">
          &gt;
        </text>
        <text x="8" y="29.6" className="chrome" fontSize="2.8" fill="#d2d2da" opacity="0.82">
          {file}
        </text>
        <text x="4" y="32.6" className="chrome" fontSize="2" fill="#62626c">
          left mid-progress
        </text>
      </g>
    </svg>
  )
}
