import { motion } from 'framer-motion'
import { Folder, X } from 'lucide-react'
import { flagship, porejects, porejectsNote, skillCategories } from '@/lib/data'
import { useSkillFilter } from '@/hooks/useSkillFilter'
import { useWindows } from '@/hooks/useWindowManager'
import { TechTag, Pane } from '@/components/ui'
import { AppIcon } from '@/components/projects/AppIcon'

export function Projects() {
  const { open } = useWindows()
  const { active, clear } = useSkillFilter()

  const flagshipMatches = !active || flagship.skills.includes(active)
  const matchingPorejects = active ? porejects.filter((p) => p.skills.includes(active)) : porejects
  const activeLabel = skillCategories.find((c) => c.id === active)?.label

  return (
    <Pane>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <p className="chrome text-os-faint text-[11.5px]">
          ~/projects — 1 application, 1 folder
        </p>
        {active && (
          <button
            type="button"
            onClick={clear}
            className="chrome border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 ml-auto inline-flex items-center gap-1.5 rounded border px-2 py-1 text-[10.5px] transition-colors duration-150"
          >
            filtered: {activeLabel}
            <X size={11} strokeWidth={2.4} />
          </button>
        )}
      </div>

      {!flagshipMatches && matchingPorejects.length === 0 && (
        <p className="chrome text-os-faint py-10 text-center text-[12px]">
          no projects used {activeLabel} — clear the filter to see everything
        </p>
      )}

      {/* PrintOK gets a whole row and a large tile. The hierarchy is the point. */}
      {flagshipMatches && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => open('printok')}
          className="border-os-line bg-os-raised/40 hover:border-accent/50 hover:bg-accent/[0.05] group flex w-full flex-col gap-4 rounded-xl border p-5 text-left transition-colors duration-200 sm:flex-row sm:items-center sm:gap-6"
        >
          <AppIcon size={72} />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chrome group-hover:text-accent text-[14px] transition-colors duration-200">
                {flagship.file}
              </span>
              <span className="chrome border-accent/40 text-accent rounded border px-1.5 py-[1px] text-[9.5px] tracking-widest uppercase">
                flagship
              </span>
              <span className="chrome border-os-line text-os-faint rounded border px-1.5 py-[1px] text-[9.5px] tracking-widest uppercase">
                {flagship.status}
              </span>
            </div>

            <p className="text-os-text mt-2 text-[14.5px] font-medium">{flagship.tagline}</p>
            <p className="text-os-dim mt-1 line-clamp-2 text-[13.5px] leading-relaxed">
              {flagship.summary}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {flagship.stack.map((tech) => (
                <TechTag key={tech.name} name={tech.name} tech={tech.tech} />
              ))}
            </div>
          </div>
        </motion.button>
      )}

      {/* Everything else is one folder. Six practice apps do not get six flagship-sized cards. */}
      {matchingPorejects.length > 0 && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => open('porejects')}
          className="border-os-line hover:border-os-line-strong hover:bg-os-raised/40 mt-3 flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors duration-200"
        >
          <Folder size={34} strokeWidth={1.3} className="text-os-dim shrink-0" />
          <div className="min-w-0">
            <p className="chrome text-[13px]">
              Porejects/
              <span className="text-os-faint ml-2 text-[11px]">
                {matchingPorejects.length} item{matchingPorejects.length === 1 ? '' : 's'}
              </span>
            </p>
            <p className="text-os-dim mt-1 text-[13px] leading-relaxed">{porejectsNote}</p>
          </div>
        </motion.button>
      )}
    </Pane>
  )
}
