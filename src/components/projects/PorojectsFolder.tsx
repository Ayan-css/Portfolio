import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, FileCode2 } from 'lucide-react'
import { porejects, porejectsNote, skillCategories } from '@/lib/data'
import { useSkillFilter } from '@/hooks/useSkillFilter'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { Pane } from '@/components/ui'
import { ProjectPreviewCard } from './ProjectPreviewCard'
import { Headstone } from './Headstone'

/**
 * Rows drop in. Anything left mid-progress drops from higher and lands harder —
 * a headstone falling into place — then kicks up a line of dust. The weight is
 * the point: an abandoned project should feel like it hit the ground.
 */
const DROP = {
  live: { from: -14, stiffness: 420, damping: 30 },
  grave: { from: -46, stiffness: 760, damping: 14 },
}

export function PorojectsFolder() {
  const [openId, setOpenId] = useState<string | null>(null)
  const { active } = useSkillFilter()
  const reduced = useReducedMotion()

  const visible = active ? porejects.filter((p) => p.skills.includes(active)) : porejects
  const activeLabel = skillCategories.find((c) => c.id === active)?.label
  const buried = visible.filter((p) => p.progress === 'mid-progress').length

  return (
    <Pane>
      <p className="text-os-dim mb-1 text-[14px] leading-relaxed">{porejectsNote}</p>
      <p className="chrome text-os-faint mb-5 text-[11px]">
        {visible.length} of {porejects.length} shown
        {active ? ` · filtered by ${activeLabel}` : ''}
        {buried > 0 ? ` · ${buried} left mid-progress` : ''}
      </p>

      <ul className="space-y-1">
        {visible.map((project, index) => {
          const isOpen = openId === project.id
          const isGrave = project.progress === 'mid-progress'
          const drop = isGrave ? DROP.grave : DROP.live
          const delay = index * 0.055

          return (
            <motion.li
              key={project.id}
              className="relative"
              initial={reduced ? false : { y: drop.from, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: drop.stiffness, damping: drop.damping, delay }
              }
            >
              {isGrave && !reduced && <Dust delay={delay} />}

              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenId(isOpen ? null : project.id)}
                className={`group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors duration-150 ${
                  isOpen ? 'bg-os-raised' : 'hover:bg-os-raised/60'
                }`}
              >
                <ChevronRight
                  size={13}
                  strokeWidth={2.2}
                  className={`text-os-faint shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-90' : ''
                  }`}
                />

                {isGrave ? (
                  // The sprite carries its own palette — no currentColor to inherit.
                  <Headstone />
                ) : (
                  <FileCode2
                    size={15}
                    strokeWidth={1.7}
                    className={isOpen ? 'text-accent shrink-0' : 'text-os-faint shrink-0'}
                  />
                )}

                <span
                  className={`chrome text-[12.5px] ${
                    isOpen ? 'text-accent' : isGrave ? 'text-os-dim' : 'text-os-text'
                  }`}
                >
                  {project.file}
                </span>

                {isGrave && (
                  <span className="chrome border-os-line text-os-faint shrink-0 rounded border px-1.5 py-[1px] text-[9.5px] tracking-wider">
                    mid-progress
                  </span>
                )}

                <span className="text-os-faint ml-auto hidden truncate text-[12px] sm:block">
                  {project.name}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && <ProjectPreviewCard project={project} />}
              </AnimatePresence>
            </motion.li>
          )
        })}
      </ul>

      {visible.length === 0 && (
        <p className="chrome text-os-faint py-8 text-center text-[12px]">
          no practice app used {activeLabel}
        </p>
      )}
    </Pane>
  )
}

/** The puff on impact: a line that spreads out from under the row and fades. */
function Dust({ delay }: { delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="bg-accent/40 pointer-events-none absolute inset-x-3 bottom-0 h-px origin-center"
      initial={{ scaleX: 0.15, opacity: 0 }}
      animate={{ scaleX: [0.15, 1, 1], opacity: [0, 0.9, 0] }}
      transition={{ delay: delay + 0.16, duration: 0.55, ease: 'easeOut', times: [0, 0.25, 1] }}
    />
  )
}
