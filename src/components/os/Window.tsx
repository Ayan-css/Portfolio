import { useRef, type ReactNode, type RefObject } from 'react'
import { motion, useDragControls } from 'framer-motion'
import { Minus, Square, X, Copy } from 'lucide-react'
import { useIsMobile, useReducedMotion } from '@/hooks/useMediaQuery'
import { useViewport } from '@/hooks/useViewport'
import { useWindows, type WinState } from '@/hooks/useWindowManager'
import { WINDOWS } from '@/lib/windowMeta'

const DOCK_H = 84

interface WindowProps {
  win: WinState
  /** Desktop bounds, so a window can't be dragged out of reach. */
  bounds: RefObject<HTMLElement | null>
  children: ReactNode
}

export function Window({ win, bounds, children }: WindowProps) {
  const { close, focus, minimize, toggleMax, move, topId } = useWindows()
  const isMobile = useIsMobile()
  const reduced = useReducedMotion()
  const dragControls = useDragControls()
  const viewport = useViewport()
  const ref = useRef<HTMLDivElement>(null)

  const meta = WINDOWS[win.id]
  const focused = topId === win.id
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 40 }

  // On a phone the desktop metaphor stops helping: every window is a full sheet.
  if (isMobile) {
    return (
      <motion.section
        role="dialog"
        aria-label={meta.title}
        className="bg-os-surface border-os-line fixed inset-x-0 top-0 bottom-20 z-30 flex flex-col border-t"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
        initial={reduced ? false : { y: '100%' }}
        animate={{ y: 0 }}
        exit={reduced ? undefined : { y: '100%' }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38 }}
        onPointerDown={() => focus(win.id)}
      >
        <TitleBar
          title={meta.title}
          focused
          onClose={() => close(win.id)}
          onMinimize={() => minimize(win.id)}
          onToggleMax={() => toggleMax(win.id)}
          showMax={false}
          onStartDrag={undefined}
        />
        <div className="os-scroll flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </motion.section>
    )
  }

  // Both branches are plain numbers — Motion can't tween a number into a calc().
  const geometry = win.maximized
    ? { x: 12, y: 12, width: viewport.w - 24, height: viewport.h - DOCK_H - 24 }
    : { x: win.x, y: win.y, width: win.w, height: win.h }

  return (
    <motion.section
      ref={ref}
      role="dialog"
      aria-label={meta.title}
      drag={!win.maximized}
      dragListener={false}
      dragControls={dragControls}
      dragConstraints={bounds}
      dragElastic={0.04}
      dragMomentum={false}
      onDragEnd={() => {
        const rect = ref.current?.getBoundingClientRect()
        const parent = bounds.current?.getBoundingClientRect()
        if (rect && parent) move(win.id, rect.left - parent.left, rect.top - parent.top)
      }}
      onPointerDown={() => focus(win.id)}
      style={{ zIndex: win.z, position: 'absolute', left: 0, top: 0 }}
      initial={reduced ? { ...geometry, opacity: 1 } : { ...geometry, opacity: 0, scale: 0.96 }}
      animate={{ ...geometry, opacity: 1, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
      transition={spring}
      className={`bg-os-surface flex flex-col overflow-hidden rounded-lg border shadow-2xl shadow-black/60 ${
        focused ? 'border-os-line-strong' : 'border-os-line'
      }`}
    >
      <TitleBar
        title={meta.title}
        focused={focused}
        onClose={() => close(win.id)}
        onMinimize={() => minimize(win.id)}
        onToggleMax={() => toggleMax(win.id)}
        showMax
        maximized={win.maximized}
        onStartDrag={(event) => dragControls.start(event)}
      />
      <div className="os-scroll flex-1 overflow-y-auto">{children}</div>
    </motion.section>
  )
}

interface TitleBarProps {
  title: string
  focused: boolean
  maximized?: boolean
  showMax: boolean
  onClose: () => void
  onMinimize: () => void
  onToggleMax: () => void
  onStartDrag: ((event: React.PointerEvent) => void) | undefined
}

function TitleBar({
  title,
  focused,
  maximized,
  showMax,
  onClose,
  onMinimize,
  onToggleMax,
  onStartDrag,
}: TitleBarProps) {
  return (
    <header
      onPointerDown={onStartDrag}
      onDoubleClick={showMax ? onToggleMax : undefined}
      className={`border-os-line flex h-10 shrink-0 items-center gap-2 border-b px-3 select-none ${
        onStartDrag ? 'cursor-grab active:cursor-grabbing' : ''
      } ${focused ? 'bg-os-raised' : 'bg-os-surface'}`}
    >
      <span
        aria-hidden
        className={`h-2 w-2 shrink-0 rounded-full ${focused ? 'bg-accent' : 'bg-os-line-strong'}`}
      />
      <h2
        className={`chrome flex-1 truncate text-[12.5px] ${focused ? 'text-os-text' : 'text-os-faint'}`}
      >
        {title}
      </h2>

      <div className="flex items-center gap-0.5">
        <TitleButton label="Minimise window" onClick={onMinimize}>
          <Minus size={13} strokeWidth={2.4} />
        </TitleButton>
        {showMax && (
          <TitleButton label={maximized ? 'Restore window' : 'Maximise window'} onClick={onToggleMax}>
            {maximized ? <Copy size={11} strokeWidth={2.4} /> : <Square size={11} strokeWidth={2.4} />}
          </TitleButton>
        )}
        <TitleButton label="Close window" onClick={onClose} danger>
          <X size={13} strokeWidth={2.4} />
        </TitleButton>
      </div>
    </header>
  )
}

function TitleButton({
  label,
  onClick,
  danger,
  children,
}: {
  label: string
  onClick: () => void
  danger?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      onPointerDown={(event) => event.stopPropagation()}
      className={`text-os-faint grid h-7 w-7 place-items-center rounded transition-colors duration-150 ${
        danger ? 'hover:bg-red-500/15 hover:text-red-400' : 'hover:bg-os-line hover:text-os-text'
      }`}
    >
      {children}
    </button>
  )
}
