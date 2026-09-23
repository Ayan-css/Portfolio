import { About } from '@/components/sections/About'
import { TechStack } from '@/components/sections/TechStack'
import { Timeline } from '@/components/sections/Timeline'
import type { WindowId } from '@/lib/windowMeta'

/**
 * Maps a window id to its content. Sections stay presentational — anything
 * that needs to open another window calls useWindows() for itself.
 */
export const WINDOW_CONTENT: Record<WindowId, () => React.ReactElement> = {
  about: About,
  stack: TechStack,
  timeline: Timeline,
  projects: () => <Pending name="~/projects" />,
  printok: () => <Pending name="PrintOK.app" />,
  porejects: () => <Pending name="Porejects/" />,
  contact: () => <Pending name="contact" />,
}

function Pending({ name }: { name: string }) {
  return (
    <div className="chrome text-os-faint grid h-full place-items-center p-8 text-[12px]">
      {name} — module not mounted yet
    </div>
  )
}
