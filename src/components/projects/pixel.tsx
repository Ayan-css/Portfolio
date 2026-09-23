/**
 * The pixel-art layer. One palette and one renderer, shared by every sprite,
 * so the gravestones, the desktop scene and the character can't drift apart.
 *
 * Sprites are authored as character maps rather than path data — change a row
 * of letters and the pixels move. Rows shorter than the grid are centred, which
 * is why every sprite's row widths share the grid's parity.
 */
export const PIXEL: Record<string, string> = {
  // stone
  o: '#16161a', // outline
  l: '#b4b4be', // lit face
  m: '#82828e', // body
  d: '#5a5a66', // shadowed edge
  e: '#3e3e48', // carving

  // ground
  g: '#5fa04e', // grass — the green the stack legend already uses for Node
  G: '#417038', // grass, shaded

  // flora
  f: '#e8a33d', // petal, the accent
  F: '#4d7a3f', // stem

  // character
  H: '#2e2a33', // hair
  S: '#d9a271', // skin
  E: '#14141a', // eye
  A: '#e8a33d', // hoodie — the accent, worn
  a: '#c4821f', // hoodie, shaded
  P: '#3a3f52', // trousers
  B: '#23232a', // boots
}

interface RowsProps {
  rows: string[]
  /** Grid width the rows are centred within. */
  width: number
  /** Row index the first string starts at. */
  top?: number
}

export function PixelRows({ rows, width, top = 0 }: RowsProps) {
  return (
    <>
      {rows.flatMap((row, y) => {
        const offset = (width - row.length) / 2
        return [...row].map((key, x) =>
          PIXEL[key] ? (
            <rect
              key={`${x}-${y}`}
              x={offset + x}
              y={top + y}
              width="1"
              height="1"
              fill={PIXEL[key]}
            />
          ) : null,
        )
      })}
    </>
  )
}

/** Builds one tapered row of a headstone: outline, lit edge, body, shadow, outline. */
export const stoneRow = (width: number, bevel = 1) =>
  'o' + 'l'.repeat(bevel) + 'm'.repeat(width - 2 - bevel * 2) + 'd'.repeat(bevel) + 'o'
