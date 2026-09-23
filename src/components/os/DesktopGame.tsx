import { useCallback, useEffect, useRef, useState } from 'react'
import { useViewport } from '@/hooks/useViewport'

const CELL = 16
const DOCK_H = 84
const START_MS = 130 // ms per step at length 4
const FLOOR_MS = 68 // fastest it ever gets
const BEST_KEY = 'ayanos:snake-best'

/** Pellets cycle the indie palette, so no two in a row look alike. */
const PELLETS = ['#5fa04e', '#5b9dd9', '#8b7bc7', '#c56a4a', '#e8a33d', '#b4b4be']

type Point = { x: number; y: number }
type Status = 'idle' | 'playing' | 'paused' | 'over'

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

export function DesktopGame({ active }: { active: boolean }) {
  const viewport = useViewport()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Board is sized in whole cells so nothing ever lands on a half pixel.
  const cols = Math.max(12, Math.min(38, Math.floor((viewport.w - 160) / CELL)))
  const rows = Math.max(10, Math.min(22, Math.floor((viewport.h - DOCK_H - 240) / CELL)))

  const snake = useRef<Point[]>([])
  const dir = useRef<Point>({ x: 1, y: 0 })
  const queued = useRef<Point[]>([])
  const food = useRef<Point>({ x: 0, y: 0 })
  const pellet = useRef(0)

  const [status, setStatus] = useState<Status>('idle')
  const [score, setScore] = useState(0)
  const [best, setBest] = useState(0)
  const statusRef = useRef<Status>('idle')
  statusRef.current = status

  useEffect(() => setBest(readBest()), [])

  const placeFood = useCallback(() => {
    const taken = new Set(snake.current.map((p) => `${p.x},${p.y}`))
    const free: Point[] = []
    for (let x = 0; x < cols; x += 1) {
      for (let y = 0; y < rows; y += 1) {
        if (!taken.has(`${x},${y}`)) free.push({ x, y })
      }
    }
    if (free.length === 0) return
    food.current = free[Math.floor(Math.random() * free.length)]
    pellet.current = (pellet.current + 1) % PELLETS.length
  }, [cols, rows])

  const reset = useCallback(() => {
    const y = Math.floor(rows / 2)
    const x = Math.floor(cols / 4)
    snake.current = [
      { x: x + 2, y },
      { x: x + 1, y },
      { x, y },
      { x: x - 1, y },
    ]
    dir.current = { x: 1, y: 0 }
    queued.current = []
    setScore(0)
    placeFood()
  }, [cols, rows, placeFood])

  useEffect(() => {
    reset()
  }, [reset])

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
        // Queue turns instead of applying them, so a fast double-tap around a
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
    canvas.width = cols * CELL * dpr
    canvas.height = rows * CELL * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf = 0
    let last = performance.now()
    let acc = 0

    const step = () => {
      const turn = queued.current.shift()
      if (turn && (turn.x !== -dir.current.x || turn.y !== -dir.current.y)) dir.current = turn

      const head = snake.current[0]
      const next = { x: head.x + dir.current.x, y: head.y + dir.current.y }

      const offBoard = next.x < 0 || next.y < 0 || next.x >= cols || next.y >= rows
      const bitSelf = snake.current.some((p, i) => i < snake.current.length - 1 && p.x === next.x && p.y === next.y)
      if (offBoard || bitSelf) {
        setStatus('over')
        setScore((current) => {
          if (current > readBest()) {
            try {
              localStorage.setItem(BEST_KEY, String(current))
            } catch {
              /* private browsing — the run still counts on screen */
            }
            setBest(current)
          }
          return current
        })
        return
      }

      snake.current.unshift(next)
      if (next.x === food.current.x && next.y === food.current.y) {
        setScore((s) => s + 1)
        placeFood()
      } else {
        snake.current.pop()
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, cols * CELL, rows * CELL)

      // pellet: a filled cell with its centre punched out, so it reads as an item
      const color = PELLETS[pellet.current]
      const { x, y } = food.current
      ctx.fillStyle = color
      ctx.fillRect(x * CELL + 3, y * CELL + 3, CELL - 6, CELL - 6)
      ctx.fillStyle = '#0c0c0d'
      ctx.fillRect(x * CELL + 6, y * CELL + 6, CELL - 12, CELL - 12)

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
  }, [cols, rows, placeFood])

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-24">
      <div
        className="chrome text-os-faint mb-2 flex items-center justify-between text-[11px] tabular-nums"
        style={{ width: cols * CELL }}
      >
        <span>
          <span className="text-accent">$</span> snake
        </span>
        <span>
          score <span className="text-os-text">{score}</span>
          {best > 0 && <> · best {best}</>}
        </span>
      </div>

      <div
        className="border-os-line bg-os-void/40 relative rounded-md border"
        style={{ width: cols * CELL, height: rows * CELL }}
      >
        <canvas
          ref={canvasRef}
          aria-label={`Snake. Score ${score}.`}
          role="img"
          style={{ width: cols * CELL, height: rows * CELL, display: 'block' }}
        />

        {status !== 'playing' && (
          <div className="absolute inset-0 grid place-items-center bg-black/55 px-4 text-center">
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
      </div>

      <p className="chrome text-os-faint mt-3 text-[11px]">
        <kbd className="border-os-line rounded border px-1 py-0.5">space</kbd> pause ·{' '}
        <kbd className="border-os-line rounded border px-1 py-0.5">⌘K</kbd> command palette · or use
        the dock
      </p>
    </div>
  )
}
