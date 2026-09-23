import { FileText, FolderOpen, Package, Terminal, type LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useWindows } from '@/hooks/useWindowManager'
import { useReducedMotion } from '@/hooks/useMediaQuery'
import type { WindowId } from '@/lib/windowMeta'

const ICONS: { id: WindowId; label: string; Icon: LucideIcon; accent?: boolean }[] = [
  { id: 'projects', label: 'projects', Icon: FolderOpen, accent: true },
  { id: 'about', label: 'about.md', Icon: FileText },
  { id: 'stack', label: 'stack', Icon: Package },
  { id: 'contact', label: 'contact', Icon: Terminal },
]

/** Desktop shortcuts. Single click opens — this is a portfolio, not a file manager exam. */
export function DesktopIcons() {
  const { open } = useWindows()
  const reduced = useReducedMotion()

  return (
    <ul className="absolute top-6 left-6 z-0 flex w-20 flex-col gap-1">
      {ICONS.map(({ id, label, Icon, accent }, index) => (
        <motion.li
          key={id}
          initial={reduced ? false : { opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06, duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={() => open(id)}
            className="hover:bg-os-surface/70 focus-visible:bg-os-surface/70 group flex w-full flex-col items-center gap-1.5 rounded-lg px-1 py-2.5 transition-colors duration-150"
          >
            <Icon
              size={26}
              strokeWidth={1.4}
              className={accent ? 'text-accent' : 'text-os-dim group-hover:text-os-text'}
            />
            <span className="chrome text-os-dim group-hover:text-os-text text-[10.5px] leading-tight">
              {label}
            </span>
          </button>
        </motion.li>
      ))}
    </ul>
  )
}
