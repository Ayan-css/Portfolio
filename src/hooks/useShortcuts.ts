import { useEffect } from 'react'
import { useWindows } from './useWindowManager'
import { DOCK_ITEMS } from '@/lib/windowMeta'

interface Options {
  paletteOpen: boolean
  togglePalette: () => void
  closePalette: () => void
}

/**
 * Global keyboard map. Registered once at the app root — every window inherits
 * it, and the palette owns its own arrow/enter handling while it's open.
 */
export function useShortcuts({ paletteOpen, togglePalette, closePalette }: Options) {
  const { close, topId, toggleMax, open } = useWindows()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey

      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        togglePalette()
        return
      }

      if (paletteOpen) {
        if (event.key === 'Escape') closePalette()
        return
      }

      // Never steal keys from the contact form.
      const target = event.target as HTMLElement | null
      const typing =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable === true

      if (event.key === 'Escape' && topId) {
        event.preventDefault()
        close(topId)
        return
      }

      if (typing) return

      if (mod && event.key.toLowerCase() === 'w' && topId) {
        event.preventDefault()
        close(topId)
        return
      }

      if (mod && event.key === 'Enter' && topId) {
        event.preventDefault()
        toggleMax(topId)
        return
      }

      // ⌘1–⌘5 jump straight to the five dock modules.
      if (mod && /^[1-9]$/.test(event.key)) {
        const id = DOCK_ITEMS[Number(event.key) - 1]
        if (id) {
          event.preventDefault()
          open(id)
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [paletteOpen, togglePalette, closePalette, close, topId, toggleMax, open])
}
