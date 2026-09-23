import { useSyncExternalStore } from 'react'

const subscribe = (onChange: () => void) => {
  window.addEventListener('resize', onChange)
  return () => window.removeEventListener('resize', onChange)
}

let cached = { w: 1440, h: 900 }

/** Viewport size as numbers. Motion can't interpolate a number into a calc() string. */
export function useViewport() {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (cached.w !== window.innerWidth || cached.h !== window.innerHeight) {
        cached = { w: window.innerWidth, h: window.innerHeight }
      }
      return cached
    },
    () => cached,
  )
}
