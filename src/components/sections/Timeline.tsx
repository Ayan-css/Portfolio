import { motion } from 'framer-motion'
import { Award, GraduationCap, Presentation, Users, type LucideIcon } from 'lucide-react'
import { timeline } from '@/lib/data'
import type { TimelineKind } from '@/lib/types'
import { SectionHead, Pane } from '@/components/ui'

const KIND: Record<TimelineKind, { Icon: LucideIcon; label: string }> = {
  education: { Icon: GraduationCap, label: 'education' },
  leadership: { Icon: Users, label: 'leadership' },
  teaching: { Icon: Presentation, label: 'teaching' },
  certification: { Icon: Award, label: 'certification' },
}

export function Timeline() {
  return (
    <Pane>
      <SectionHead kicker="timeline.log" title="Education & leadership">
        Straight from the resume — every line below is something that actually happened.
      </SectionHead>

      <ol className="relative">
        <span aria-hidden className="bg-os-line absolute top-2 bottom-2 left-[7px] w-px" />

        {timeline.map((entry, index) => {
          const { Icon, label } = KIND[entry.kind]
          return (
            <motion.li
              key={entry.id}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="relative pb-6 pl-8 last:pb-0"
            >
              <span
                aria-hidden
                className={`bg-os-bg absolute top-1.5 left-0 grid h-[15px] w-[15px] place-items-center rounded-full border ${
                  entry.current ? 'border-accent' : 'border-os-line-strong'
                }`}
              >
                <span
                  className={`h-[5px] w-[5px] rounded-full ${
                    entry.current ? 'bg-accent' : 'bg-os-line-strong'
                  }`}
                />
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <Icon size={13} strokeWidth={1.9} className="text-os-faint" />
                <span className="chrome text-os-faint text-[10px] tracking-[0.14em] uppercase">
                  {label}
                </span>
                {entry.period && (
                  <span className="chrome text-os-faint text-[10.5px]">· {entry.period}</span>
                )}
              </div>

              <h4 className="mt-1.5 text-[15px] leading-snug font-semibold">{entry.title}</h4>
              {entry.org && <p className="text-os-dim mt-0.5 text-[13.5px]">{entry.org}</p>}

              {(entry.status || entry.detail) && (
                <p className="chrome text-os-faint mt-2 text-[11.5px]">
                  {[entry.status, entry.detail].filter(Boolean).join('  ·  ')}
                </p>
              )}
            </motion.li>
          )
        })}
      </ol>
    </Pane>
  )
}
