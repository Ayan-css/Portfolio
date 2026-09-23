import { motion } from 'framer-motion'
import { useWindows } from '@/hooks/useWindowManager'
import { profile } from '@/lib/data'
import { ExternalLink, Pane } from '@/components/ui'

/** neofetch-style system info — the OS framing earns its keep here. */
const SYSINFO: [string, string][] = [
  ['user', 'ayan'],
  ['role', 'full-stack developer'],
  ['location', 'New Panvel, Maharashtra, IN'],
  ['education', 'BSc IT · AIKTC · sem 3'],
  ['shell', 'node + typescript'],
  ['flagship', 'PrintOK.app'],
  ['status', 'building, shipping, looking for the first shop'],
]

export function About() {
  const { open } = useWindows()

  return (
    <Pane>
      <div className="border-os-line bg-os-raised/40 mb-6 flex flex-col gap-5 rounded-lg border p-5 sm:flex-row sm:gap-7">
        <pre
          aria-hidden
          className="chrome text-accent shrink-0 text-[10px] leading-[1.35] select-none"
        >
{`   ╔══════════╗
   ║  ╭────╮  ║
   ║  │ >_ │  ║
   ║  ╰────╯  ║
   ╠══════════╣
   ║ AyanOS   ║
   ╚══════════╝`}
        </pre>

        <dl className="chrome min-w-0 flex-1 text-[11.5px] leading-[1.9]">
          <div className="text-os-text">
            <span className="text-accent">ayan</span>
            <span className="text-os-faint">@</span>
            <span className="text-accent">ayanos</span>
          </div>
          <div aria-hidden className="text-os-faint mb-1">
            ─────────────────────────────
          </div>
          {SYSINFO.map(([key, value]) => (
            <div key={key} className="flex gap-2">
              <dt className="text-os-faint w-[76px] shrink-0">{key}</dt>
              <dd className="text-os-dim min-w-0">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <h3 className="text-[19px] leading-tight font-semibold">{profile.name}</h3>

      {profile.bio.map((paragraph, i) => (
        <motion.p
          key={paragraph.slice(0, 24)}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 + i * 0.06, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="text-os-dim mt-3 text-[14.5px] leading-relaxed"
        >
          {paragraph}
        </motion.p>
      ))}

      <div className="border-os-line mt-6 border-t pt-4">
        <p className="chrome text-os-faint text-[10.5px] tracking-[0.16em] uppercase">right now</p>
        <p className="text-os-dim mt-1.5 text-[14px]">{profile.now}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => open('printok')}
          className="chrome border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 rounded-md border px-3 py-1.5 text-[11.5px] transition-colors duration-150"
        >
          open PrintOK.app
        </button>
        <ExternalLink href={profile.github}>github/{profile.githubHandle}</ExternalLink>
        {profile.linkedin && (
          <ExternalLink href={profile.linkedin}>linkedin/{profile.linkedinHandle}</ExternalLink>
        )}
        <button
          type="button"
          onClick={() => open('contact')}
          className="chrome border-os-line text-os-dim hover:border-os-line-strong hover:text-os-text rounded-md border px-3 py-1.5 text-[11.5px] transition-colors duration-150"
        >
          {profile.email}
        </button>
      </div>
    </Pane>
  )
}
