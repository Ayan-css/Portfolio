import { useCallback, useEffect, useRef, useState } from 'react'
import { useViewport } from '@/hooks/useViewport'
import { useWindows } from '@/hooks/useWindowManager'
import type { WindowId } from '@/lib/windowMeta'

const CELL = 16
const DOCK_H = 84
const START_MS = 130 // ms per step at length 4
const FLOOR_MS = 68 // fastest it ever gets
const GAP = 3 // height of the doorway, in cells
const BEST_KEY = 'ayanos:snake-best'

/** Pellets cycle the indie palette, so no two in a row look alike. */
const PELLETS = ['#5fa04e', '#5b9dd9', '#8b7bc7', '#c56a4a', '#e8a33d', '#b4b4be']

type Point = { x: number; y: number }
type Status = 'idle' | 'playing' | 'paused' | 'over'
interface Target {
  id: WindowId
  x: number
  y: number
  w: number
  h: number
}

const TURNS: Record<string, Point> = {
  arrowleft: { x: -1, y: 0 }, a: { x: -1, y: 0 },
  arrowright: { x: 1, y: 0 }, d: { x: 1, y: 0 },
  arrowup: { x: 0, y: -1 }, w: { x: 0, y: -1 },
  arrowdown: { x: 0, y: 1 }, s: { x: 0, y: 1 },
}

const readBest = () => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

/**
 * Snake, with a doorway cut into the left wall. Eat inside the arena; steer out
 * through the gap and the desktop becomes the board — drive the head into an
 * icon and it opens that window. The game is a second way to navigate the
 * portfolio rather than a distraction parked next to it.
 */
interface GameProps {
  /** Whether the game currently owns the keyboard. */
  active: boolean
  /** False while a window covers the desktop — the game stays mounted, just hidden. */
  shown: boolean
}

export function DesktopGame({ active, shown }: GameProps) {
  const viewport = useViewport()
  const { open } = useWindows()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const areaW = viewport.w
  const areaH = viewport.h - DOCK_H

  // Whole-cell grid over the entire desktop, with the arena sitting inside it.
  const cols = Math.max(20, Math.floor(areaW / CELL))
  const rows = Math.max(14, Math.floor(areaH / CELL))
  const bw = Math.min(32, cols - 14)
  const bh = Math.min(18, rows - 6)
  const bx = Math.floor((cols - bw) / 2) + 3 // nudged right, clear of the icon column
  const by = Math.floor((rows - bh) / 2)
  const gy = by + Math.floor(bh / 2) - 1 // doorway, centred on the left wall

  const snake = useRef<Point[]>([])
  const dir = useRef<Point>({ x: 1, y: 0 })
  const queued = useRef<Point[]>([])
  const food = useRef<Point>({ x: 0, y: 0 })
  const pellet = useRef(0)
  const targets = useRef<Target[]>([])
  const lastHit = useRef<WindowId | null>(null)

  const [status, setStatus] = useState<Status>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const [outside, setOutside] = useState(false)
  const statusRef = useRef<Status>('idle')
  const outsideRef = useRef(false)
  statusRef.current = status

  useEffect(() => setBest(readBest()), [])

  const inArena = useCallback(
    (p: Point) => p.x >= bx && p.x < bx + bw && p.y >= by && p.y < by + bh,
    [bx, by, bw, bh],
  )

  const placeFood = useCallback(() => {
    const taken = new Set(snake.current.map((p) => `${p.x},${p.y}`))
    const free: Point[] = []
    for (let x = bx; x < bx + bw; x += 1) {
      for (let y = by; y < by + bh; y += 1) {
        if (!taken.has(`${x},${y}`)) free.push({ x, y })
      }
    }
    if (free.length === 0) return
    food.current = free[Math.floor(Math.random() * free.length)]
    pellet.current = (pellet.current + 1) % PELLETS.length
  }, [bx, by, bw, bh])

  const reset = useCallback(() => {
    const y = by + Math.floor(bh / 2)
    const x = bx + Math.floor(bw / 2)
    snake.current = [
      { x: x + 1, y },
      { x, y },
      { x: x - 1, y },
      { x: x - 2, y },
    ]
    dir.current = { x: 1, y: 0 }
    queued.current = []
    outsideRef.current = false
    lastHit.current = null
    setOutside(false)
    setScore(0)
    placeFood()
  }, [bx, by, bw, bh, placeFood])

  useEffect(() => {
    reset()
  }, [reset])

  // Targets are read from the DOM, so moving or renaming an icon needs no
  // change here — and an icon that isn't rendered simply isn't a target.
  const measure = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const base = canvas.getBoundingClientRect()
    if (base.width === 0) return // hidden behind a window; the rects would all be zero
    targets.current = [...document.querySelectorAll<HTMLElement>('[data-window-id]')].map((el) => {
      const r = el.getBoundingClientRect()
      return {
        id: el.dataset.windowId as WindowId,
        x: r.left - base.left,
        y: r.top - base.top,
        w: r.width,
        h: r.height,
      }
    })
  }, [])

  useEffect(() => {
    // The icons stagger in over ~0.3s, so measuring at mount would capture them
    // mid-slide and put every hitbox 10px off. Measure once they've landed, and
    // again the moment the snake leaves the arena, which is the only time it matters.
    measure()
    const settled = setTimeout(measure, 450)
    return () => clearTimeout(settled)
  }, [measure, shown, viewport.w, viewport.h])

  // ── input ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!active) return

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const el = document.activeElement as HTMLElement | null
      if (el?.tagName === 'INPUT' || el?.tagName === 'TEXTAREA' || el?.isContentEditable) return

      const key = event.key.toLowerCase()
      const turn = TURNS[key]

      if (turn) {
        event.preventDefault()
        // Queue turns rather than applying them, so a fast double-tap around a
        // corner can't fold the snake back into itself between two steps.
        const last = queued.current.at(-1) ?? dir.current
        if (turn.x !== -last.x || turn.y !== -last.y) queued.current.push(turn)
        if (statusRef.current === 'idle' || statusRef.current === 'paused') setStatus('playing')
        return
      }

      if (key === ' ' || key === 'enter') {
        event.preventDefault()
        if (statusRef.current === 'over') reset()
        setStatus((s) => (s === 'playing' ? 'paused' : 'playing'))
      } else if (key === 'p') {
        event.preventDefault()
        setStatus((s) => (s === 'playing' ? 'paused' : s === 'paused' ? 'playing' : s))
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, reset])

  useEffect(() => {
    if (!active && statusRef.current === 'playing') setStatus('paused')
  }, [active])

  // ── loop + render ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = areaW * dpr
    canvas.height = areaH * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Mounted but covered: keep every ref intact, just stop drawing.
    if (!shown) return

    let raf = 0
    let last = performance.now()
    let acc = 0

    const die = () => {
      setStatus('over')
      setScore((current) => {
        if (current > readBest()) {
          try {
            localStorage.setItem(BEST_KEY, String(current))
          } catch {
            /* private browsing loses the record, not the run */
          }
          setBest(current)
        }
        return current
      })
    }

    const step = () => {
      const turn = queued.current.shift()
      if (turn && (turn.x !== -dir.current.x || turn.y !== -dir.current.y)) dir.current = turn

      const head = snake.current[0]
      const next = { x: head.x + dir.current.x, y: head.y + dir.current.y }

      if (next.x < 0 || next.y < 0 || next.x >= cols || next.y >= rows) return die()

      // The arena wall is solid from both sides; only the doorway lets you through.
      const wasIn = inArena(head)
      const willBeIn = inArena(next)
      if (wasIn !== willBeIn) {
        const throughDoor =
          next.y === head.y &&
          next.y >= gy &&
          next.y < gy + GAP &&
          (head.x === bx || next.x === bx) &&
          dir.current.y === 0
        if (!throughDoor) return die()
        outsideRef.current = willBeIn === false
        if (outsideRef.current) measure()
        setOutside(outsideRef.current)
      }

      if (snake.current.some((p, i) => i < snake.current.length - 1 && p.x === next.x && p.y === next.y)) {
        return die()
      }

      snake.current.unshift(next)

      // Outside the arena the head is a cursor: drive it into an icon to open it.
      if (outsideRef.current) {
        const px = next.x * CELL + CELL / 2
        const py = next.y * CELL + CELL / 2
        const hit = targets.current.find(
          (t) => px >= t.x && px <= t.x + t.w && py >= t.y && py <= t.y + t.h,
        )
        // Resuming leaves the head parked on the icon it just opened, so only
        // fire again once it has actually left that icon's box.
        if (hit && lastHit.current !== hit.id) {
          lastHit.current = hit.id
          open(hit.id)
        } else if (!hit) {
          lastHit.current = null
        }
      }

      if (!outsideRef.current && next.x === food.current.x && next.y === food.current.y) {
        setScore((s) => s + 1)
        placeFood()
      } else {
        snake.current.pop()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, areaW, areaH)

      // arena frame, with the left wall drawn in two pieces around the doorway
      const l = bx * CELL
      const t = by * CELL
      const r = (bx + bw) * CELL
      const b = (by + bh) * CELL
      ctx.strokeStyle = '#2a2a2e'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(l, t)
      ctx.lineTo(r, t)
      ctx.lineTo(r, b)
      ctx.lineTo(l, b)
      ctx.lineTo(l, (gy + GAP) * CELL)
      ctx.moveTo(l, gy * CELL)
      ctx.lineTo(l, t)
      ctx.stroke()

      // doorway jambs, so the exit reads as a door rather than a gap in a line
      ctx.strokeStyle = '#e8a33d'
      ctx.beginPath()
      ctx.moveTo(l - 4, gy * CELL)
      ctx.lineTo(l + 4, gy * CELL)
      ctx.moveTo(l - 4, (gy + GAP) * CELL)
      ctx.lineTo(l + 4, (gy + GAP) * CELL)
      ctx.stroke()

      if (!outsideRef.current) {
        const color = PELLETS[pellet.current]
        const { x, y } = food.current
        ctx.fillStyle = color
        ctx.fillRect(x * CELL + 3, y * CELL + 3, CELL - 6, CELL - 6)
        ctx.fillStyle = '#0c0c0d'
        ctx.fillRect(x * CELL + 6, y * CELL + 6, CELL - 12, CELL - 12)
      } else {
        // out in the open: ring the icons the head can actually open
        ctx.strokeStyle = 'rgba(232, 163, 61, 0.55)'
        ctx.setLineDash([3, 3])
        for (const target of targets.current) {
          ctx.strokeRect(target.x - 3, target.y - 3, target.w + 6, target.h + 6)
        }
        ctx.setLineDash([])
      }

      snake.current.forEach((p, i) => {
        ctx.fillStyle = i === 0 ? '#e8a33d' : i % 2 ? '#a06d1f' : '#c4821f'
        ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2)
      })
    }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      const dt = now - last
      last = now

      if (statusRef.current === 'playing') {
        // Each segment shaves a little off the step, down to a floor.
        const pace = Math.max(FLOOR_MS, START_MS - (snake.current.length - 4) * 2.5)
        acc += dt
        while (acc >= pace) {
          acc -= pace
          if (statusRef.current === 'playing') step()
        }
      } else {
        acc = 0
      }

      draw()
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [areaW, areaH, cols, rows, bx, by, bw, bh, gy, shown, inArena, placeFood, open, measure])

  const boardLeft = bx * CELL
  const boardTop = by * CELL

  return (
    <div className={`pointer-events-none absolute inset-0 bottom-[84px] ${shown ? '' : 'hidden'}`}>
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={`Snake. Score ${score}.`}
        style={{ width: areaW, height: areaH, display: 'block' }}
      />

      <div
        className="chrome text-os-faint absolute flex items-center justify-between text-[11px] tabular-nums"
        style={{ left: boardLeft, top: boardTop - 22, width: bw * CELL }}
      >
        <span>
          <span className="text-accent">$</span> snake
        </span>
        <span>
          score <span className="text-os-text">{score}</span>
          {best > 0 && <> · best {best}</>}
        </span>
      </div>

      {status !== 'playing' && (
        <div
          className="absolute grid place-items-center bg-black/55 px-4 text-center"
          style={{ left: boardLeft, top: boardTop, width: bw * CELL, height: bh * CELL }}
        >
          {status === 'over' ? (
            <div className="chrome text-[12px] leading-[1.9]">
              <p className="text-red-400">segmentation fault (core dumped)</p>
              <p className="text-os-dim">
                length {snake.current.length} · score {score}
              </p>
              <p className="text-os-faint mt-2">
                <kbd className="border-os-line rounded border px-1 py-0.5">space</kbd> to run it
                again
              </p>
            </div>
          ) : (
            <div className="chrome text-[12px] leading-[1.9]">
              <p className="text-accent">{status === 'paused' ? 'paused' : '$ ./snake'}</p>
              <p className="text-os-faint">
                <kbd className="border-os-line rounded border px-1 py-0.5">↑</kbd>{' '}
                <kbd className="border-os-line rounded border px-1 py-0.5">←</kbd>{' '}
                <kbd className="border-os-line rounded border px-1 py-0.5">↓</kbd>{' '}
                <kbd className="border-os-line rounded border px-1 py-0.5">→</kbd> to move
              </p>
            </div>
          )}
        </div>
      )}

      <p
        className="chrome text-os-faint absolute text-center text-[11px]"
        style={{ left: boardLeft, top: (by + bh) * CELL + 12, width: bw * CELL }}
      >
        {outside ? (
          <span className="text-accent">
            drive the head into an icon to open it · the doorway leads back in
          </span>
        ) : (
          <>
            eat inside · steer through the{' '}
            <span className="text-accent">doorway</span> on the left to reach the icons
          </>
        )}
      </p>
    </div>
  )
}
