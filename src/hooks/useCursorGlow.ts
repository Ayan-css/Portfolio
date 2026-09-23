import { useEffect, type RefObject } from 'react'
import { useIsMobile, useReducedMotion } from './useMediaQuery'

/**
 * A very faint amber pool of light that follows the pointer across the
 * wallpaper. Written straight to CSS custom properties inside one rAF, so it
 * never triggers a React render. Desktop only, and off under reduced motion.
 */
export function useCursorGlow(target: RefObject<HTMLElement | null>) {
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = target.current
    if (!el || isMobile || reduced) return

    let frame = 0
    const onMove = (event: PointerEvent) => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        el.style.setProperty('--glow-x', `${event.clientX}px`)
        el.style.setProperty('--glow-y', `${event.clientY}px`)
      })
    }

    el.addEventListener('pointermove', onMove)
    return () => {
      el.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [target, isMobile, reduced])

  return !isMobile && !reduced
}
