import { useCallback, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { WindowManagerProvider } from '@/hooks/useWindowManager'
import { useShortcuts } from '@/hooks/useShortcuts'
import { useIsMobile } from '@/hooks/useMediaQuery'
import { BootSequence } from '@/components/os/BootSequence'
import { Desktop } from '@/components/os/Desktop'
import { CommandPalette } from '@/components/os/CommandPalette'
import { ContextMenu } from '@/components/os/ContextMenu'

const BOOTED_KEY = 'ayanos:booted'

export default function App() {
  // Boot once per browser session — re-watching it on every refresh gets old fast.
  const [booting, setBooting] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(BOOTED_KEY) === null,
  )

  const finishBoot = () => {
    sessionStorage.setItem(BOOTED_KEY, '1')
    setBooting(false)
  }

  return (
    <WindowManagerProvider>
      <AnimatePresence>{booting && <BootSequence onDone={finishBoot} />}</AnimatePresence>
      <Shell />
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
      <Desktop onOpenPalette={openPalette} />
      <AnimatePresence>
        {paletteOpen && <CommandPalette onClose={closePalette} />}
      </AnimatePresence>
      {!isMobile && <ContextMenu onOpenPalette={openPalette} />}
    </>
  )
}
