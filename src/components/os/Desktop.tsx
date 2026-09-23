import { useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { useWindows } from '@/hooks/useWindowManager'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { useCursorGlow } from '@/hooks/useCursorGlow'
import { Window } from './Window'
import { Dock } from './Dock'
import { DesktopIcons } from './DesktopIcons'
import { WINDOW_CONTENT } from './registry'
import { DesktopGame } from './DesktopGame'

interface DesktopProps {
  onOpenPalette: () => void
  /** The game gives up the keyboard while the palette has it. */
  paletteOpen: boolean
}

export function Desktop({ onOpenPalette, paletteOpen }: DesktopProps) {
  const { windows, topId } = useWindows()
  const surface = useRef<HTMLDivElement>(null)
  const shell = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const glowing = useCursorGlow(shell)

  // On mobile only the focused window is on screen — stacked sheets would trap scroll.
  const visible = windows.filter(
    (win) => !win.minimized && (!isMobile || win.id === topId),
  )

  return (
    <div
      ref={shell}
      className={`os-wallpaper relative h-full w-full overflow-hidden ${glowing ? "os-glow" : ""}`}
    >
      <div ref={surface} className="absolute inset-0 bottom-[84px]">
        {!isMobile && <DesktopIcons />}

        <AnimatePresence>
          {visible.map((win) => {
            const Content = WINDOW_CONTENT[win.id]
            return (
              <Window key={win.id} win={win} bounds={surface}>
                <Content />
              </Window>
            )
          })}
        </AnimatePresence>
      </div>

      {isMobile && visible.length === 0 && <MobileHome />}
      {!isMobile && visible.length === 0 && <DesktopGame active={!paletteOpen} />}

      <Dock onOpenPalette={onOpenPalette} />
    </div>
  )
}

function MobileHome() {
  return (
    <div className="flex h-full flex-col justify-center px-7 pb-28">
      <p className="chrome text-accent text-[11px] tracking-widest uppercase">AyanOS 1.0.0</p>
      <h1 className="mt-3 text-[26px] leading-tight font-semibold">
        Ansari Mohd Ayan Nasiruddin
      </h1>
      <p className="text-os-dim mt-2 text-[15px]">
        Full-stack developer. Built PrintOK — print-on-demand with no new hardware.
      </p>
      <p className="chrome text-os-faint mt-6 text-[11.5px]">tap a module below to open it</p>
    </div>
  )
}
