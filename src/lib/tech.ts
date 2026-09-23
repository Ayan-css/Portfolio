import type { TechKey } from './types'

/**
 * The colour legend. These are the real brand hues of PrintOK's own stack, so a
 * tag's colour carries information instead of decorating. Kept as literal hex
 * because Tailwind can't build class names from runtime values.
 */
const TECH_COLOR: Record<TechKey, string> = {
  js: '#f2c14e',
  ts: '#3178c6',
  node: '#5fa04e',
  pg: '#4a90b8',
  prisma: '#5a67d8',
  csharp: '#9b4f96',
  docker: '#2496ed',
  razorpay: '#3395ff',
  react: '#61dafb',
  python: '#f2c14e',
  neutral: '#7d7d87',
}

export const techColor = (tech: TechKey): string => TECH_COLOR[tech] ?? TECH_COLOR.neutral

/** Inline styles for a tech tag: tinted border and text over a faint wash of the same hue. */
export function techTagStyle(tech: TechKey) {
  const c = techColor(tech)
  return {
    color: c,
    borderColor: `${c}59`,
    backgroundColor: `${c}14`,
  }
}
