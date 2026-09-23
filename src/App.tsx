import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { WindowManagerProvider } from '@/hooks/useWindowManager'
import { BootSequence } from '@/components/os/BootSequence'
import { Desktop } from '@/components/os/Desktop'

const BOOTED_KEY = 'ayanos:booted'

export default function App() {
  // Boot once per browser session — re-watching it on every refresh gets old fast.
  const [booting, setBooting] = useState(
    () => typeof window !== 'undefined' && sessionStorage.getItem(BOOTED_KEY) === null,
  )
  const [paletteOpen, setPaletteOpen] = useState(false)

  const finishBoot = () => {
    sessionStorage.setItem(BOOTED_KEY, '1')
    setBooting(false)
  }

  return (
    <WindowManagerProvider>
      <AnimatePresence>{booting && <BootSequence onDone={finishBoot} />}</AnimatePresence>
      <Desktop onOpenPalette={() => setPaletteOpen(true)} />
      {paletteOpen && null /* command palette lands in phase 3 */}
    </WindowManagerProvider>
  )
}
