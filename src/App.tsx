import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { WindowManagerProvider } from '@/hooks/useWindowManager'
import { SkillFilterProvider } from '@/hooks/useSkillFilter'
import { useShortcuts } from '@/hooks/useShortcuts'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { BootSequence } from '@/components/os/BootSequence'
import { Desktop } from '@/components/os/Desktop'
import { CommandPalette } from '@/components/os/CommandPalette'
import { ContextMenu } from '@/components/os/ContextMenu'

export default function App() {
  // Boots on every load. It's ~2s and any key or click skips it.
  const [booting, setBooting] = useState(true)

  const finishBoot = () => setBooting(false)

  return (
    <WindowManagerProvider>
      <AnimatePresence>{booting && <BootSequence onDone={finishBoot} />}</AnimatePresence>
      {/* Mounted only once boot is done, so the desktop gets a real entrance
          instead of being revealed already in place behind the overlay. */}
      {!booting && (
        <SkillFilterProvider>
          <Shell />
        </SkillFilterProvider>
      )}
    </WindowManagerProvider>
  )
}

/** Inside the provider, so shortcuts and the palette can drive the window manager. */
function Shell() {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const isMobile = useIsMobile()

  const togglePalette = useCallback(() => setPaletteOpen((v) => !v), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const openPalette = useCallback(() => setPaletteOpen(true), [])

  useShortcuts({ paletteOpen, togglePalette, closePalette })

  return (
    <>
      <Desktop onOpenPalette={openPalette} paletteOpen={paletteOpen} />
      <AnimatePresence>
        {paletteOpen && <CommandPalette onClose={closePalette} />}
      </AnimatePresence>
      {!isMobile && <ContextMenu onOpenPalette={openPalette} />}
    </>
  )
}
