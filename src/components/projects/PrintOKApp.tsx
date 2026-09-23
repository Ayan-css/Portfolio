import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { flagship } from '@/lib/data'
import { TechTag, ExternalLink } from '@/components/ui'
import { AppIcon } from './AppIcon'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { PhoneWalkthrough } from './PhoneWalkthrough'
import { useReducedMotion } from '@/hooks/useMediaQuery'

const TABS = ['Overview', 'Architecture', 'Walkthrough', 'Proof'] as const
type Tab = (typeof TABS)[number]

export function PrintOKApp() {
  const [tab, setTab] = useState<Tab>('Overview')
  const reduced = useReducedMotion()

  return (
    <div className="flex h-full flex-col">
      <header className="border-os-line bg-os-raised/30 flex flex-wrap items-center gap-4 border-b p-5 sm:p-6">
        <AppIcon size={54} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[19px] leading-none font-semibold">{flagship.name}</h3>
            <span className="chrome border-os-line text-os-faint rounded border px-1.5 py-[1px] text-[9.5px] tracking-widest uppercase">
              {flagship.status}
            </span>
          </div>
          <p className="text-os-dim mt-1.5 text-[14px]">{flagship.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {flagship.links.map((link) => (
            <ExternalLink key={link.href} href={link.href} primary={link.kind === 'live'}>
              {link.label}
            </ExternalLink>
          ))}
        </div>
      </header>

      <nav className="border-os-line flex shrink-0 gap-1 border-b px-4" aria-label="PrintOK sections">
        {TABS.map((name) => {
          const isActive = tab === name
          return (
            <button
              key={name}
              type="button"
              onClick={() => setTab(name)}
              aria-current={isActive ? 'page' : undefined}
              className={`chrome relative px-3 py-2.5 text-[12px] transition-colors duration-150 ${
                isActive ? 'text-accent' : 'text-os-faint hover:text-os-dim'
              }`}
            >
              {name}
              {isActive && (
                <motion.span
                  layoutId="printok-tab"
                  className="bg-accent absolute inset-x-2 -bottom-px h-[2px] rounded-full"
                  transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </button>
          )
        })}
      </nav>

      <div className="p-5 sm:p-6">
        {tab === 'Overview' && <Overview />}
        {tab === 'Architecture' && <ArchitectureDiagram />}
        {tab === 'Walkthrough' && <PhoneWalkthrough />}
        {tab === 'Proof' && <Proof />}
      </div>
    </div>
  )
}

function Overview() {
  return (
    <div className="max-w-2xl">
      <p className="text-os-text text-[15px] leading-relaxed">{flagship.summary}</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Block label="the problem">{flagship.problem}</Block>
        <Block label="the approach">{flagship.approach}</Block>
      </div>

      <div className="mt-6">
        <p className="chrome text-os-faint mb-2 text-[10.5px] tracking-[0.16em] uppercase">stack</p>
        <div className="flex flex-wrap gap-1.5">
          {flagship.stack.map((tech) => (
            <TechTag key={tech.name} name={tech.name} tech={tech.tech} />
          ))}
        </div>
      </div>

      <p className="border-os-line text-os-faint mt-6 border-t pt-4 text-[13px] leading-relaxed">
        <span className="chrome text-accent text-[11px] tracking-wider uppercase">status</span>{' '}
        {flagship.statusNote}
      </p>
    </div>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="chrome text-os-faint mb-1.5 text-[10.5px] tracking-[0.16em] uppercase">
        {label}
      </p>
      <p className="text-os-dim text-[14px] leading-relaxed">{children}</p>
    </div>
  )
}

function Proof() {
  const reduced = useReducedMotion()
  return (
    <div className="max-w-2xl">
      <p className="text-os-dim mb-5 text-[14px] leading-relaxed">
        What exists rather than what's claimed — every item below is something you can check in the
        repository.
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {flagship.proof.map((point, index) => (
          <motion.li
            key={point.label}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="border-os-line bg-os-raised/40 rounded-lg border p-4"
          >
            <p className="flex items-center gap-2">
              <CheckCircle2 size={14} strokeWidth={1.9} className="text-accent shrink-0" />
              <span className="chrome text-[12.5px]">{point.label}</span>
            </p>
            <p className="text-os-dim mt-2 text-[13.5px] leading-relaxed">{point.detail}</p>
          </motion.li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap gap-2">
        {flagship.links.map((link) => (
          <ExternalLink key={link.href} href={link.href} primary={link.kind === 'repo'}>
            {link.label}
          </ExternalLink>
        ))}
      </div>
    </div>
  )
}
