import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import { WINDOWS, type WindowId } from '@/lib/windowMeta'

export interface WinState {
  id: WindowId
  x: number
  y: number
  w: number
  h: number
  minimized: boolean
  maximized: boolean
  z: number
}

type Action =
  | { type: 'open'; id: WindowId }
  | { type: 'close'; id: WindowId }
  | { type: 'focus'; id: WindowId }
  | { type: 'minimize'; id: WindowId }
  | { type: 'toggleMax'; id: WindowId }
  | { type: 'move'; id: WindowId; x: number; y: number }
  | { type: 'closeAll' }

interface State {
  windows: WinState[]
  topZ: number
}

const DOCK_H = 84
const MARGIN = 24

/** Cascade each new window down-right so a fresh one is never hidden behind the last. */
function place(id: WindowId, openCount: number): Omit<WinState, 'z' | 'minimized' | 'maximized'> {
  const vw = typeof window === 'undefined' ? 1440 : window.innerWidth
  const vh = typeof window === 'undefined' ? 900 : window.innerHeight
  const meta = WINDOWS[id]

  const w = Math.min(meta.w, vw - MARGIN * 2)
  const h = Math.min(meta.h, vh - DOCK_H - MARGIN * 2)

  const offset = (openCount % 5) * 28
  const x = Math.max(MARGIN, Math.round((vw - w) / 2) + offset - 56)
  const y = Math.max(MARGIN, Math.round((vh - DOCK_H - h) / 2) + offset - 40)

  return { id, x, y, w, h }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open': {
      const z = state.topZ + 1
      const existing = state.windows.find((win) => win.id === action.id)
      // Re-opening a window restores it rather than spawning a duplicate.
      if (existing) {
        return {
          topZ: z,
          windows: state.windows.map((win) =>
            win.id === action.id ? { ...win, minimized: false, z } : win,
          ),
        }
      }
      const fresh: WinState = {
        ...place(action.id, state.windows.length),
        minimized: false,
        maximized: false,
        z,
      }
      return { topZ: z, windows: [...state.windows, fresh] }
    }

    case 'close':
      return { ...state, windows: state.windows.filter((win) => win.id !== action.id) }

    case 'closeAll':
      return { ...state, windows: [] }

    case 'focus': {
      const target = state.windows.find((win) => win.id === action.id)
      if (!target || target.z === state.topZ) return state
      const z = state.topZ + 1
      return {
        topZ: z,
        windows: state.windows.map((win) => (win.id === action.id ? { ...win, z } : win)),
      }
    }

    case 'minimize':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, minimized: true } : win,
        ),
      }

    case 'toggleMax':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, maximized: !win.maximized } : win,
        ),
      }

    case 'move':
      return {
        ...state,
        windows: state.windows.map((win) =>
          win.id === action.id ? { ...win, x: action.x, y: action.y } : win,
        ),
      }
  }
}

interface ManagerApi {
  windows: WinState[]
  topId: WindowId | null
  open: (id: WindowId) => void
  close: (id: WindowId) => void
  closeAll: () => void
  focus: (id: WindowId) => void
  minimize: (id: WindowId) => void
  toggleMax: (id: WindowId) => void
  move: (id: WindowId, x: number, y: number) => void
  isOpen: (id: WindowId) => boolean
}

const WindowManagerContext = createContext<ManagerApi | null>(null)

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { windows: [], topZ: 10 })

  const open = useCallback((id: WindowId) => dispatch({ type: 'open', id }), [])
  const close = useCallback((id: WindowId) => dispatch({ type: 'close', id }), [])
  const closeAll = useCallback(() => dispatch({ type: 'closeAll' }), [])
  const focus = useCallback((id: WindowId) => dispatch({ type: 'focus', id }), [])
  const minimize = useCallback((id: WindowId) => dispatch({ type: 'minimize', id }), [])
  const toggleMax = useCallback((id: WindowId) => dispatch({ type: 'toggleMax', id }), [])
  const move = useCallback(
    (id: WindowId, x: number, y: number) => dispatch({ type: 'move', id, x, y }),
    [],
  )

  const value = useMemo<ManagerApi>(() => {
    const visible = state.windows.filter((win) => !win.minimized)
    const top = visible.reduce<WinState | null>(
      (best, win) => (best === null || win.z > best.z ? win : best),
      null,
    )
    return {
      windows: state.windows,
      topId: top?.id ?? null,
      open,
      close,
      closeAll,
      focus,
      minimize,
      toggleMax,
      move,
      isOpen: (id) => state.windows.some((win) => win.id === id),
    }
  }, [state, open, close, closeAll, focus, minimize, toggleMax, move])

  return <WindowManagerContext value={value}>{children}</WindowManagerContext>
}

export function useWindows(): ManagerApi {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindows must be used inside <WindowManagerProvider>')
  return ctx
}
