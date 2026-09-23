import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { SkillCategoryId } from '@/lib/types'

interface FilterApi {
  active: SkillCategoryId | null
  /** Selecting the active category clears it, so the chip is a toggle. */
  toggle: (id: SkillCategoryId) => void
  clear: () => void
}

const SkillFilterContext = createContext<FilterApi | null>(null)

/**
 * Clicking a Tech Stack category filters the Projects module. Two unrelated
 * windows need to agree on one value — that's all this holds.
 */
export function SkillFilterProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<SkillCategoryId | null>(null)

  const toggle = useCallback(
    (id: SkillCategoryId) => setActive((current) => (current === id ? null : id)),
    [],
  )
  const clear = useCallback(() => setActive(null), [])

  const value = useMemo(() => ({ active, toggle, clear }), [active, toggle, clear])
  return <SkillFilterContext value={value}>{children}</SkillFilterContext>
}

export function useSkillFilter(): FilterApi {
  const ctx = useContext(SkillFilterContext)
  if (!ctx) throw new Error('useSkillFilter must be used inside <SkillFilterProvider>')
  return ctx
}
