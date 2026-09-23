import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ChevronRight, FileCode2 } from 'lucide-react'
import { porejects, porejectsNote, skillCategories } from '@/lib/data'
import { useSkillFilter } from '@/hooks/useSkillFilter'
import { Pane } from '@/components/ui'
import { ProjectPreviewCard } from './ProjectPreviewCard'

export function PorojectsFolder() {
  const [openId, setOpenId] = useState<string | null>(null)
  const { active } = useSkillFilter()

  const visible = active ? porejects.filter((p) => p.skills.includes(active)) : porejects
  const activeLabel = skillCategories.find((c) => c.id === active)?.label

  return (
    <Pane>
      <p className="text-os-dim mb-1 text-[14px] leading-relaxed">{porejectsNote}</p>
      <p className="chrome text-os-faint mb-5 text-[11px]">
        {visible.length} of {porejects.length} shown
        {active ? ` · filtered by ${activeLabel}` : ''}
      </p>

      <ul className="space-y-1">
        {visible.map((project) => {
          const isOpen = openId === project.id
          return (
            <li key={project.id}>
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
                <FileCode2
                  size={15}
                  strokeWidth={1.7}
                  className={isOpen ? 'text-accent shrink-0' : 'text-os-faint shrink-0'}
                />
                <span className={`chrome text-[12.5px] ${isOpen ? 'text-accent' : 'text-os-text'}`}>
                  {project.file}
                </span>
                <span className="text-os-faint ml-auto hidden truncate text-[12px] sm:block">
                  {project.name}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && <ProjectPreviewCard project={project} />}
              </AnimatePresence>
            </li>
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
