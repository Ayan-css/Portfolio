import { PixelRows } from './pixel'

/**
 * Pixel gravestone, icon size: lit stone face, shadowed right edge, carved
 * cross, grass at the base. The sprite indie RPGs put on a dead party member.
 */
export const GRAVE_SPRITE = [
  '',
  'oooooo',
  'olmmmmdo',
  'olmmmmmmdo',
  'olmmmmmmmmdo',
  'olmmmmmmmmdo',
  'olmmmmeemmdo',
  'olmeeeeeemdo',
  'olmmmmeemmdo',
  'olmmmmeemmdo',
  'olmmmmmmmmdo',
  'olmmmmmmmmdo',
  'olmmmmmmmmdo',
  'oooooooooooo',
  'ggGggggggggGgg',
  'gGgggggggggggGgg',
]

export function Headstone({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden
      shapeRendering="crispEdges"
      className="shrink-0"
    >
      <PixelRows rows={GRAVE_SPRITE} width={16} />
    </svg>
  )
}
