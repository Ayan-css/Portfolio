import { motion } from 'framer-motion'
import { Award, GraduationCap, Presentation, Users, type LucideIcon } from 'lucide-react'
import { timeline } from '@/lib/data'
import type { TimelineKind } from '@/lib/types'
import { SectionHead, Pane } from '@/components/ui'

/** Colour is the category here, so the rail can be read without the labels. */
const KIND: Record<TimelineKind, { Icon: LucideIcon; label: string; color: string }> = {
  education: { Icon: GraduationCap, label: 'education', color: '#5b9dd9' },
  leadership: { Icon: Users, label: 'leadership', color: '#e8a33d' },
  teaching: { Icon: Presentation, label: 'teaching', color: '#5fa04e' },
  certification: { Icon: Award, label: 'certification', color: '#8b7bc7' },
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
          const { Icon, label, color } = KIND[entry.kind]
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
                className="bg-os-bg absolute top-1.5 left-0 grid h-[15px] w-[15px] place-items-center rounded-full border"
                style={{ borderColor: entry.current ? color : `${color}59` }}
              >
                <span
                  className="h-[5px] w-[5px] rounded-full"
                  style={{ backgroundColor: color, opacity: entry.current ? 1 : 0.45 }}
                />
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <Icon size={13} strokeWidth={1.9} style={{ color }} />
                <span
                  className="chrome text-[10px] tracking-[0.14em] uppercase"
                  style={{ color, opacity: 0.85 }}
                >
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
