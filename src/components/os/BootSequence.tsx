import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useMediaQuery'

/** Each entry is one printed line; `accent` marks the shell prompts. */
const SCRIPT: { text: string; accent?: boolean }[] = [
  { text: 'AyanOS 1.0.0 — boot', accent: false },
  { text: '$ whoami', accent: true },
  { text: 'ansari mohd ayan nasiruddin · full-stack developer' },
  { text: '$ loading skills.json...' , accent: true },
  { text: 'ok — 6 categories, 0 proficiency bars' },
  { text: '$ mounting projects/...', accent: true },
  { text: 'ok — PrintOK.app + Porejects/ (6)' },
  { text: '$ startx', accent: true },
]

const CHAR_MS = 7
const LINE_PAUSE = 90

export function BootSequence({ onDone }: { onDone: () => void }) {
  const reduced = useReducedMotion()
  const [line, setLine] = useState(0)
  const [chars, setChars] = useState(0)
  const done = useRef(false)

  const finish = () => {
    if (done.current) return
    done.current = true
    onDone()
  }

  // Any key or click skips. Registered once, torn down on unmount.
  useEffect(() => {
    const skip = () => finish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (reduced) {
      finish()
      return
    }
    if (line >= SCRIPT.length) {
      const id = setTimeout(finish, 260)
      return () => clearTimeout(id)
    }

    const current = SCRIPT[line].text
    if (chars < current.length) {
      const id = setTimeout(() => setChars((c) => c + 1), CHAR_MS)
      return () => clearTimeout(id)
    }

    const id = setTimeout(() => {
      setLine((l) => l + 1)
      setChars(0)
    }, LINE_PAUSE)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [line, chars, reduced])

  return (
    <motion.div
      className="bg-os-void fixed inset-0 z-50 flex items-center justify-center p-6"
      exit={{ opacity: 0, transition: { duration: 0.28 } }}
    >
      <div className="chrome w-full max-w-lg text-[13px] leading-[1.9]">
        {SCRIPT.slice(0, line + 1).map((entry, i) => {
          const text = i === line ? entry.text.slice(0, chars) : entry.text
          return (
            <p key={entry.text} className={entry.accent ? 'text-accent' : 'text-os-dim'}>
              {text}
              {i === line && <span className="caret text-accent">▊</span>}
            </p>
          )
        })}
      </div>

      <button
        type="button"
        onClick={finish}
        className="chrome text-os-faint hover:text-os-text absolute right-6 bottom-6 text-[11px] transition-colors duration-150"
      >
        skip [any key]
      </button>
    </motion.div>
  )
}
