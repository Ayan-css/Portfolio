import { motion } from 'framer-motion'
import { Github } from 'lucide-react'
import type { Poreject } from '@/lib/types'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import { Gravestone } from './Gravestone'

/** Inline preview for one practice app. Deliberately small — these aren't PrintOK. */
export function ProjectPreviewCard({ project }: { project: Poreject }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={reduced ? undefined : { opacity: 0, height: 0 }}
      transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div className="border-os-line bg-os-raised/40 mt-2 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
        <Thumbnail project={project} />

        <div className="min-w-0 flex-1">
          <p className="text-os-text text-[14px] leading-relaxed">{project.learned}</p>
          <p className="text-os-dim mt-1.5 text-[13.5px] leading-relaxed">{project.note}</p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {project.stack.map((name) => (
              <span
                key={name}
                className="chrome border-os-line text-os-faint rounded border px-2 py-[3px] text-[10.5px]"
              >
                {name}
              </span>
            ))}
          </div>

          {/* No repo URL yet? Say so, rather than linking somewhere that 404s. */}
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="chrome text-os-dim hover:text-accent mt-3 inline-flex items-center gap-1.5 text-[11.5px] transition-colors duration-150"
            >
              <Github size={12} strokeWidth={1.9} />
              view source
            </a>
          ) : (
            <p className="chrome text-os-faint mt-3 text-[11px]">source link coming</p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function Thumbnail({ project }: { project: Poreject }) {
  // A project that was stopped gets a headstone, not a product shot.
  if (project.progress === 'mid-progress') return <Gravestone file={project.file} />

  if (project.screenshot) {
    return (
      <img
        src={project.screenshot}
        alt={`${project.name} screenshot`}
        loading="lazy"
        width={168}
        height={112}
        className="border-os-line h-[112px] w-full shrink-0 rounded-md border object-cover sm:w-[168px]"
      />
    )
  }

  // Generated placeholder: an on-brand app window, never a stock illustration.
  return (
    <div
      aria-hidden
      className="border-os-line bg-os-void flex h-[112px] w-full shrink-0 flex-col overflow-hidden rounded-md border sm:w-[168px]"
    >
      <div className="border-os-line flex h-5 items-center gap-1 border-b px-2">
        <span className="bg-os-line-strong h-1.5 w-1.5 rounded-full" />
        <span className="bg-os-line-strong h-1.5 w-1.5 rounded-full" />
        <span className="chrome text-os-faint ml-1 truncate text-[7.5px]">{project.file}</span>
      </div>
      <div className="flex flex-1 gap-1.5 p-2">
        <div className="bg-os-surface w-1/4 rounded-sm" />
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="bg-accent/25 h-2.5 rounded-sm" />
          <div className="bg-os-surface h-2 w-4/5 rounded-sm" />
          <div className="bg-os-surface h-2 w-3/5 rounded-sm" />
          <div className="bg-os-surface mt-auto h-3 w-1/2 rounded-sm" />
        </div>
      </div>
    </div>
  )
}
