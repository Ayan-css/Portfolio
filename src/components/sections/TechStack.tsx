import { motion } from 'framer-motion'
import {
  Cloud,
  Code2,
  Database,
  Layout,
  Server,
  Wrench,
  Filter,
  type LucideIcon,
} from 'lucide-react'
import { skillCategories } from '@/lib/data'
import { useSkillFilter } from '@/hooks/useSkillFilter'
import { useWindows } from '@/hooks/useWindowManager'
import { TechTag, SectionHead, Pane } from '@/components/ui'

/** Each category owns a hue, so the grid is scannable before you read a word. */
const ICONS: Record<string, { Icon: LucideIcon; color: string }> = {
  code: { Icon: Code2, color: '#e8a33d' },
  layout: { Icon: Layout, color: '#5b9dd9' },
  server: { Icon: Server, color: '#5fa04e' },
  database: { Icon: Database, color: '#4a90b8' },
  cloud: { Icon: Cloud, color: '#8b7bc7' },
  wrench: { Icon: Wrench, color: '#c56a4a' },
}

export function TechStack() {
  const { active, toggle } = useSkillFilter()
  const { open } = useWindows()

  const total = skillCategories.reduce((n, category) => n + category.items.length, 0)

  return (
    <Pane>
      <SectionHead kicker="stack" title={`${total} installed packages`}>
        Grouped the way they are on the resume. No proficiency bars — a number would only be a
        guess dressed up as evidence. Select a category to filter the Projects window by what
        actually used it.
      </SectionHead>

      <div className="grid gap-3 sm:grid-cols-2">
        {skillCategories.map((category, index) => {
          const { Icon, color } = ICONS[category.icon] ?? ICONS.code
          const isActive = active === category.id

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.035, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => {
                  toggle(category.id)
                  if (!isActive) open('projects')
                }}
                className={`h-full w-full rounded-lg border p-4 text-left transition-colors duration-150 ${
                  isActive ? '' : 'border-os-line bg-os-raised/40 hover:border-os-line-strong'
                }`}
                style={
                  isActive ? { borderColor: `${color}8a`, backgroundColor: `${color}12` } : undefined
                }
              >
                <div className="mb-3 flex items-center gap-2">
                  <Icon
                    size={14}
                    strokeWidth={1.9}
                    style={{ color, opacity: isActive ? 1 : 0.75 }}
                  />
                  <span
                    className="chrome text-[11.5px] tracking-wide"
                    style={isActive ? { color } : undefined}
                  >
                    {category.label}
                  </span>
                  <span className="chrome text-os-faint ml-auto text-[10.5px]">
                    {category.items.length}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {category.items.map((item) => (
                    <TechTag key={item.name} name={item.name} tech={item.tech} />
                  ))}
                </div>
              </button>
            </motion.div>
          )
        })}
      </div>

      {active && (
        <p className="chrome text-accent mt-5 flex items-center gap-2 text-[11.5px]">
          <Filter size={12} strokeWidth={2} />
          Projects filtered by {skillCategories.find((c) => c.id === active)?.label}. Click the
          category again to clear.
        </p>
      )}
    </Pane>
  )
}
