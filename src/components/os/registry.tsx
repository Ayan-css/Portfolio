import { About } from '@/components/sections/About'
import { TechStack } from '@/components/sections/TechStack'
import { Timeline } from '@/components/sections/Timeline'
import { Projects } from '@/components/sections/Projects'
import { PrintOKApp } from '@/components/projects/PrintOKApp'
import { PorojectsFolder } from '@/components/projects/PorojectsFolder'
import { Contact } from '@/components/sections/Contact'
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
  contact: Contact,
}
