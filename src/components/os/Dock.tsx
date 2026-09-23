import { Clock, FolderOpen, Package, Terminal, User, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWindows } from '@/hooks/useWindowManager'
import { DOCK_ITEMS, WINDOWS, type WindowId } from '@/lib/windowMeta'
import { useIsMobile, useReducedMotion } from '@/hooks/useMediaQuery'
import { useClock } from '@/hooks/useClock'

const ICONS: Partial<Record<WindowId, LucideIcon>> = {
  about: User,
  stack: Package,
  projects: FolderOpen,
  timeline: Clock,
  contact: Terminal,
}

export function Dock({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { windows, open, focus, minimize, topId } = useWindows()
  const isMobile = useIsMobile()
  const time = useClock()
  const reduced = useReducedMotion()

  const activate = (id: WindowId) => {
    const win = windows.find((w) => w.id === id)
    // Clicking the focused window's dock icon tucks it away, like a real taskbar.
    if (win && !win.minimized && topId === id) minimize(id)
    else if (win && !win.minimized) focus(id)
    else open(id)
  }

  return (
    <nav
      aria-label="AyanOS taskbar"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center pb-3"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <motion.div
        initial={reduced ? false : { y: 26, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.34, ease: [0.22, 1, 0.36, 1] }}
        className="border-os-line bg-os-surface/95 pointer-events-auto flex items-center gap-1 rounded-xl border px-2 py-2 shadow-2xl shadow-black/60 backdrop-blur-sm"
      >
        {DOCK_ITEMS.map((id) => {
          const Icon = ICONS[id] ?? Package
          const win = windows.find((w) => w.id === id)
          const isTop = topId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => activate(id)}
              aria-label={`${WINDOWS[id].label}${win ? ' (open)' : ''}`}
              aria-pressed={Boolean(win)}
              className={`group relative flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-colors duration-150 sm:px-4 ${
                isTop ? 'bg-os-raised text-accent' : 'text-os-dim hover:bg-os-raised hover:text-os-text'
              }`}
            >
              <Icon size={isMobile ? 19 : 17} strokeWidth={1.8} />
              <span className="chrome text-[10.5px] tracking-tight">{WINDOWS[id].label}</span>
              <span
                aria-hidden
                className={`absolute -bottom-0.5 h-[3px] w-[3px] rounded-full transition-colors duration-150 ${
                  win ? (win.minimized ? 'bg-os-faint' : 'bg-accent') : 'bg-transparent'
                }`}
              />
            </button>
          )
        })}

        {!isMobile && (
          <>
            <span aria-hidden className="bg-os-line mx-1 h-8 w-px" />
            <button
              type="button"
              onClick={onOpenPalette}
              aria-label="Open command palette"
              className="chrome text-os-faint hover:bg-os-raised hover:text-os-text rounded-lg px-3 py-2 text-[11px] transition-colors duration-150"
            >
              <kbd className="border-os-line rounded border px-1.5 py-0.5">⌘K</kbd>
            </button>
            <motion.time
              className="chrome text-os-faint px-2 text-[11px] tabular-nums"
              aria-label="System clock"
            >
              {time}
            </motion.time>
          </>
        )}
      </motion.div>
    </nav>
  )
}
