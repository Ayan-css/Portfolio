import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { CornerDownLeft } from 'lucide-react'
import { useWindows } from '@/hooks/useWindowManager'
import { buildCommands, filterCommands, type Command } from '@/lib/commands'
import { useReducedMotion } from '@/hooks/useMediaQuery'

export function CommandPalette({ onClose }: { onClose: () => void }) {
  const { open, closeAll } = useWindows()
  const reduced = useReducedMotion()
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const [output, setOutput] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const commands = useMemo(() => buildCommands({ open, closeAll }), [open, closeAll])
  const results = useMemo(() => filterCommands(commands, query), [commands, query])

  // Keep the highlight in range as the result list shrinks under the query.
  const active = Math.min(cursor, Math.max(results.length - 1, 0))

  useEffect(() => setCursor(0), [query])

  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const runCommand = async (command: Command) => {
    const result = await command.run()
    if (typeof result === 'string') {
      setOutput(result)
      setQuery('')
      return
    }
    onClose()
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setCursor((c) => (results.length ? (c + 1) % results.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const command = results[active]
      if (command) void runCommand(command)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    }
  }

  let lastGroup = ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/55 px-4 pt-[14vh]"
      onPointerDown={onClose}
    >
      <motion.div
        role="dialog"
        aria-label="Command palette"
        onPointerDown={(event) => event.stopPropagation()}
        initial={reduced ? false : { opacity: 0, y: -8, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.16, ease: [0.22, 1, 0.36, 1] }}
        className="border-os-line-strong bg-os-surface w-full max-w-xl overflow-hidden rounded-xl border shadow-2xl shadow-black/70"
      >
        <div className="border-os-line flex items-center gap-2 border-b px-4">
          <span aria-hidden className="chrome text-accent text-[14px]">
            ❯
          </span>
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setOutput(null)
            }}
            onKeyDown={onKeyDown}
            placeholder="jump to a section, or try `sudo make coffee`"
            aria-label="Command"
            className="chrome placeholder:text-os-faint h-12 w-full bg-transparent text-[13px] outline-none"
          />
          <kbd className="border-os-line text-os-faint chrome hidden rounded border px-1.5 py-0.5 text-[10px] sm:block">
            esc
          </kbd>
        </div>

        {output && (
          <p className="chrome text-accent border-os-line border-b px-4 py-3 text-[12px]">
            {output}
          </p>
        )}

        <ul ref={listRef} className="os-scroll max-h-[46vh] overflow-y-auto py-1.5">
          {results.length === 0 && (
            <li className="chrome text-os-faint px-4 py-6 text-center text-[12px]">
              command not found: {query}
            </li>
          )}

          {results.map((command, index) => {
            const header = command.group !== lastGroup ? command.group : null
            lastGroup = command.group
            const isActive = index === active
            return (
              <li key={command.id}>
                {header && (
                  <p className="chrome text-os-faint px-4 pt-3 pb-1 text-[10px] tracking-widest uppercase">
                    {header}
                  </p>
                )}
                <button
                  type="button"
                  data-active={isActive}
                  onPointerEnter={() => setCursor(index)}
                  onClick={() => void runCommand(command)}
                  className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors duration-100 ${
                    isActive ? 'bg-os-raised' : ''
                  }`}
                >
                  <span
                    className={`chrome flex-1 truncate text-[12.5px] ${
                      isActive ? 'text-accent' : 'text-os-text'
                    }`}
                  >
                    {command.label}
                  </span>
                  {command.hint && (
                    <span className="text-os-faint chrome hidden truncate text-[11px] sm:block">
                      {command.hint}
                    </span>
                  )}
                  {isActive && <CornerDownLeft size={12} className="text-os-faint shrink-0" />}
                </button>
              </li>
            )
          })}
        </ul>
      </motion.div>
    </div>
  )
}
