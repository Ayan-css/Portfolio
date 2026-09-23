import type { WindowId } from '@/lib/windowMeta'

/**
 * Maps a window id to its content. Sections stay dumb presentational
 * components — anything that needs to open another window calls useWindows().
 */
export const WINDOW_CONTENT: Record<WindowId, () => React.ReactElement> = {
  about: () => <Pending name="about.md" />,
  stack: () => <Pending name="stack" />,
  projects: () => <Pending name="~/projects" />,
  timeline: () => <Pending name="timeline.log" />,
  contact: () => <Pending name="contact" />,
  printok: () => <Pending name="PrintOK.app" />,
  porejects: () => <Pending name="Porejects/" />,
}

function Pending({ name }: { name: string }) {
  return (
    <div className="chrome text-os-faint grid h-full place-items-center p-8 text-[12px]">
      {name} — module not mounted yet
    </div>
  )
}
