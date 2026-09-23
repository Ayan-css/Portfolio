import { useSyncExternalStore } from 'react'

/** Native matchMedia, subscribed the React 18+ way. No resize listeners, no lib. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Below this width the desktop metaphor stops being usable and windows become sheets. */
export const useIsMobile = () => useMediaQuery('(max-width: 860px)')

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
