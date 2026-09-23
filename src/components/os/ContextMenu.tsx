import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useWindows } from '@/hooks/useWindowManager'
import { DOCK_ITEMS, WINDOWS } from '@/lib/windowMeta'

interface Point {
  x: number
  y: number
}

const MENU_W = 200
const MENU_H = 260

/** Right-click anywhere on the desktop. Suppressed on mobile, where there's no right button. */
export function ContextMenu({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { open, closeAll } = useWindows()
  const [at, setAt] = useState<Point | null>(null)

  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      // Let links, buttons and text inputs keep the browser's own menu.
      if (target.closest('a, button, input, textarea')) return
      event.preventDefault()
      setAt({
        x: Math.min(event.clientX, window.innerWidth - MENU_W - 8),
        y: Math.min(event.clientY, window.innerHeight - MENU_H - 8),
      })
    }
    const dismiss = () => setAt(null)

    window.addEventListener('contextmenu', onContextMenu)
    window.addEventListener('pointerdown', dismiss)
    window.addEventListener('blur', dismiss)
    return () => {
      window.removeEventListener('contextmenu', onContextMenu)
      window.removeEventListener('pointerdown', dismiss)
      window.removeEventListener('blur', dismiss)
    }
  }, [])

  if (!at) return null

  const item = 'chrome w-full px-3 py-1.5 text-left text-[12px] transition-colors duration-100'

  return (
    <motion.div
      role="menu"
      aria-label="Desktop actions"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.11, ease: [0.22, 1, 0.36, 1] }}
      style={{ left: at.x, top: at.y, width: MENU_W }}
      className="border-os-line-strong bg-os-surface fixed z-50 overflow-hidden rounded-lg border py-1.5 shadow-2xl shadow-black/70"
    >
      <p className="chrome text-os-faint px-3 pt-1 pb-1.5 text-[10px] tracking-widest uppercase">
        open
      </p>
      {DOCK_ITEMS.map((id) => (
        <button
          key={id}
          role="menuitem"
          className={`${item} text-os-text hover:bg-os-raised hover:text-accent`}
          onClick={() => {
            open(id)
            setAt(null)
          }}
        >
          {WINDOWS[id].title}
        </button>
      ))}

      <div aria-hidden className="bg-os-line my-1.5 h-px" />

      <button
        role="menuitem"
        className={`${item} text-os-dim hover:bg-os-raised hover:text-os-text`}
        onClick={() => {
          onOpenPalette()
          setAt(null)
        }}
      >
        Command palette ⌘K
      </button>
      <button
        role="menuitem"
        className={`${item} text-os-dim hover:bg-os-raised hover:text-os-text`}
        onClick={() => {
          closeAll()
          setAt(null)
        }}
      >
        Close all windows
      </button>
    </motion.div>
  )
}
