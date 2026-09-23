import { profile } from './data'
import { WINDOWS, type WindowId } from './windowMeta'

export interface Command {
  id: string
  label: string
  hint: string
  group: 'Go to' | 'Open' | 'System'
  /** Extra search terms that aren't in the visible label. */
  keywords?: string
  /** Returning a string prints it in the palette instead of closing it. */
  run: () => string | void | Promise<string | void>
}

interface Deps {
  open: (id: WindowId) => void
  closeAll: () => void
}

/**
 * `cat resume.pdf` should never hand someone a 404 disguised as a download —
 * check the file is actually there first, then click a synthetic link.
 */
async function downloadResume(): Promise<string | void> {
  try {
    const res = await fetch(profile.resume, { method: 'HEAD' })
    if (!res.ok) throw new Error(String(res.status))
  } catch {
    return `cat: ${profile.resume}: no such file — mail ${profile.email} for a copy`
  }
  const a = document.createElement('a')
  a.href = profile.resume
  a.download = 'ansari-mohd-ayan-nasiruddin-resume.pdf'
  a.click()
}

export function buildCommands({ open, closeAll }: Deps): Command[] {
  const navigation: Command[] = (Object.keys(WINDOWS) as WindowId[]).map((id) => ({
    id: `open:${id}`,
    label: WINDOWS[id].label,
    hint: WINDOWS[id].title,
    group: WINDOWS[id].dock ? 'Go to' : 'Open',
    keywords: id,
    run: () => open(id),
  }))

  const links: Command[] = [
    {
      id: 'link:printok',
      label: 'open printok.vercel.app',
      hint: 'live deployment',
      group: 'Open',
      keywords: 'live demo site',
      run: () => {
        window.open('https://printok.vercel.app', '_blank', 'noopener')
      },
    },
    {
      id: 'link:github',
      label: `gh ${profile.githubHandle}`,
      hint: 'github profile',
      group: 'Open',
      keywords: 'github source repo code',
      run: () => {
        window.open(profile.github, '_blank', 'noopener')
      },
    },
    {
      id: 'link:mail',
      label: `mail ${profile.email}`,
      hint: 'compose',
      group: 'Open',
      keywords: 'email contact hire',
      run: () => {
        window.location.href = `mailto:${profile.email}`
      },
    },
  ]

  const system: Command[] = [
    {
      id: 'sys:resume',
      label: 'cat resume.pdf',
      hint: 'download',
      group: 'System',
      keywords: 'cv download resume',
      run: downloadResume,
    },
    {
      id: 'sys:closeall',
      label: 'killall windows',
      hint: 'close everything',
      group: 'System',
      keywords: 'close clear quit',
      run: () => closeAll(),
    },
    {
      id: 'sys:reboot',
      label: 'reboot',
      hint: 'replay the boot sequence',
      group: 'System',
      keywords: 'restart boot reload',
      run: () => {
        sessionStorage.removeItem('ayanos:booted')
        window.location.reload()
      },
    },
    {
      id: 'sys:coffee',
      label: 'sudo make coffee',
      hint: '',
      group: 'System',
      keywords: 'easter egg coffee',
      run: () => 'make: *** No rule to make target `coffee`. Error 418 — I am a teapot.',
    },
    {
      id: 'sys:uptime',
      label: 'uptime',
      hint: '',
      group: 'System',
      keywords: 'easter egg status',
      run: () =>
        'up since Apr 2025 · 1 flagship, 6 practice apps, 0 fake metrics · load average: caffeinated',
    },
  ]

  return [...navigation, ...links, ...system]
}

/** Substring match across label, hint and keywords. Fuzzy ranking would be a dependency for nothing. */
export function filterCommands(commands: Command[], query: string): Command[] {
  const q = query.trim().toLowerCase()
  if (!q) return commands
  return commands.filter((c) =>
    `${c.label} ${c.hint} ${c.keywords ?? ''}`.toLowerCase().includes(q),
  )
}
