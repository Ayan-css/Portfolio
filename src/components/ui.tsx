import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { techTagStyle } from '@/lib/tech'
import type { TechKey } from '@/lib/types'

/** A tech chip coloured by the real brand hue, so colour carries meaning. */
export function TechTag({ name, tech }: { name: string; tech: TechKey }) {
  return (
    <span
      className="chrome rounded border px-2 py-[3px] text-[11px] whitespace-nowrap"
      style={techTagStyle(tech)}
    >
      {name}
    </span>
  )
}

/** Section heading inside a window: a mono kicker above sans-serif prose. */
export function SectionHead({
  kicker,
  title,
  children,
}: {
  kicker: string
  title: string
  children?: ReactNode
}) {
  return (
    <header className="mb-5">
      <p className="chrome text-accent text-[10.5px] tracking-[0.16em] uppercase">{kicker}</p>
      <h3 className="mt-1.5 text-[19px] leading-tight font-semibold">{title}</h3>
      {children && <p className="text-os-dim mt-2 text-[14px] leading-relaxed">{children}</p>}
    </header>
  )
}

export function ExternalLink({
  href,
  children,
  primary,
}: {
  href: string
  children: ReactNode
  primary?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`chrome inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[11.5px] transition-colors duration-150 ${
        primary
          ? 'border-accent/50 bg-accent/10 text-accent hover:bg-accent/20'
          : 'border-os-line text-os-dim hover:border-os-line-strong hover:text-os-text'
      }`}
    >
      {children}
      <ArrowUpRight size={12} strokeWidth={2} />
    </a>
  )
}

/** Window body padding, applied identically everywhere so modules line up. */
export function Pane({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 sm:p-7 ${className}`}>{children}</div>
}
