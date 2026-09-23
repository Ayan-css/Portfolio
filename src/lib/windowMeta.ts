/**
 * Every window in AyanOS, declared once. Holds no components, so both the
 * window manager and the content registry can import it without a cycle.
 */
export const WINDOWS = {
  about: { label: 'About', title: 'about.md', w: 640, h: 540, dock: true },
  stack: { label: 'Stack', title: 'stack — installed packages', w: 780, h: 620, dock: true },
  projects: { label: 'Projects', title: '~/projects', w: 780, h: 540, dock: true },
  timeline: { label: 'Timeline', title: 'timeline.log', w: 700, h: 580, dock: true },
  contact: { label: 'Contact', title: 'ayan@ayanos: ~/contact', w: 700, h: 560, dock: true },
  printok: { label: 'PrintOK', title: 'PrintOK.app', w: 1060, h: 700, dock: false },
  porejects: { label: 'Porejects', title: '~/projects/Porejects', w: 740, h: 540, dock: false },
} as const

export type WindowId = keyof typeof WINDOWS

export const DOCK_ITEMS = (Object.keys(WINDOWS) as WindowId[]).filter((id) => WINDOWS[id].dock)
