import { About } from '@/components/sections/About'
import { TechStack } from '@/components/sections/TechStack'
import { Timeline } from '@/components/sections/Timeline'
import { Projects } from '@/components/sections/Projects'
import { PrintOKApp } from '@/components/projects/PrintOKApp'
import { PorojectsFolder } from '@/components/projects/PorojectsFolder'
import type { WindowId } from '@/lib/windowMeta'

/**
 * Maps a window id to its content. Sections stay presentational — anything
 * that needs to open another window calls useWindows() for itself.
 */
export const WINDOW_CONTENT: Record<WindowId, () => React.ReactElement> = {
  about: About,
  stack: TechStack,
  projects: Projects,
  timeline: Timeline,
  printok: PrintOKApp,
  porejects: PorojectsFolder,
  contact: () => (
    <div className="chrome text-os-faint grid h-full place-items-center p-8 text-[12px]">
      contact — module not mounted yet
    </div>
  ),
}
