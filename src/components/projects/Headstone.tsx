/**
 * Pixel-art gravestone, the shape indie RPGs use: lit stone face, dark
 * right edge, carved cross, grass at the base. Drawn from a 16×16 character
 * map so the sprite stays editable as art rather than as path data.
 */

// Each row is centred in the 16-wide grid, so only the stone's own width is written.
const SPRITE = [
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

const PALETTE: Record<string, string> = {
  o: '#16161a', // outline
  l: '#b4b4be', // lit face
  m: '#82828e', // stone
  d: '#5a5a66', // shadowed edge
  e: '#3e3e48', // carved cross
  g: '#5fa04e', // grass — the same green the stack legend uses for Node
  G: '#417038',
}

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
      {SPRITE.flatMap((row, y) => {
        const offset = (16 - row.length) / 2
        return [...row].map((key, x) =>
          PALETTE[key] ? (
            <rect key={`${x}-${y}`} x={offset + x} y={y} width="1" height="1" fill={PALETTE[key]} />
          ) : null,
        )
      })}
    </svg>
  )
}
