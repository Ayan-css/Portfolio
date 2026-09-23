import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronLeft, ChevronRight, FileText, Pause, Play, Printer, ShieldCheck } from 'lucide-react'
import { flagship } from '@/lib/data'
import type { WalkthroughScreen } from '@/lib/types'
import { useReducedMotion } from '@/hooks/useMediaQuery'

const STEPS = flagship.walkthrough
const AUTO_MS = 3200

/**
 * A simulation, not an embed. The real checkout is a live payment flow on a
 * pre-launch product — iframing it would be both a security problem and a lie
 * about what's running. Every pixel here is local.
 */
export function PhoneWalkthrough() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(!reduced)

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % STEPS.length), AUTO_MS)
    return () => clearTimeout(id)
  }, [playing, index])

  const step = STEPS[index]
  const go = (next: number) => {
    setPlaying(false)
    setIndex((next + STEPS.length) % STEPS.length)
  }

  return (
    <div>
      <div className="border-os-line bg-os-raised/40 mb-5 flex items-start gap-2.5 rounded-lg border p-3">
        <ShieldCheck size={14} strokeWidth={1.9} className="text-accent mt-0.5 shrink-0" />
        <p className="text-os-dim text-[13px] leading-relaxed">
          <span className="text-os-text font-medium">This is a simulation.</span> The real checkout
          takes live payments on a pre-launch product, so it isn't embedded here. The buttons below
          replay the sequence locally; the real thing is one click away under Overview.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <Phone screen={step.screen} index={index} />

        <div className="min-w-0 flex-1">
          <ol className="relative">
            <span aria-hidden className="bg-os-line absolute top-2 bottom-2 left-[5px] w-px" />
            {STEPS.map((entry, i) => {
              const isActive = i === index
              const isPast = i < index
              return (
                <li key={entry.id} className="relative pb-3 pl-6 last:pb-0">
                  <span
                    aria-hidden
                    className={`absolute top-[7px] left-0 h-[11px] w-[11px] rounded-full border transition-colors duration-200 ${
                      isActive
                        ? 'border-accent bg-accent'
                        : isPast
                          ? 'border-os-line-strong bg-os-line-strong'
                          : 'border-os-line bg-os-bg'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-current={isActive ? 'step' : undefined}
                    className="w-full text-left"
                  >
                    <span
                      className={`chrome text-[12px] transition-colors duration-200 ${
                        isActive ? 'text-accent' : isPast ? 'text-os-dim' : 'text-os-faint'
                      }`}
                    >
                      {entry.label}
                    </span>
                    {isActive && (
                      <motion.span
                        initial={reduced ? false : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="block overflow-hidden"
                      >
                        <span className="chrome text-os-faint mt-1 block text-[10.5px] break-words">
                          {entry.command}
                        </span>
                        <span className="text-os-dim mt-1.5 block text-[13px] leading-relaxed">
                          {entry.caption}
                        </span>
                      </motion.span>
                    )}
                  </button>
                </li>
              )
            })}
          </ol>

          <div className="mt-5 flex items-center gap-1.5">
            <Control label="Previous step" onClick={() => go(index - 1)}>
              <ChevronLeft size={14} strokeWidth={2.2} />
            </Control>
            <Control
              label={playing ? 'Pause walkthrough' : 'Play walkthrough'}
              onClick={() => setPlaying((p) => !p)}
            >
              {playing ? <Pause size={13} strokeWidth={2.2} /> : <Play size={13} strokeWidth={2.2} />}
            </Control>
            <Control label="Next step" onClick={() => go(index + 1)}>
              <ChevronRight size={14} strokeWidth={2.2} />
            </Control>
            <span className="chrome text-os-faint ml-2 text-[11px] tabular-nums">
              {index + 1} / {STEPS.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Control({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="border-os-line text-os-dim hover:border-os-line-strong hover:text-os-text grid h-8 w-8 place-items-center rounded-md border transition-colors duration-150"
    >
      {children}
    </button>
  )
}

function Phone({ screen, index }: { screen: WalkthroughScreen; index: number }) {
  const reduced = useReducedMotion()
  return (
    <div className="border-os-line-strong bg-os-void mx-auto h-[388px] w-[196px] shrink-0 rounded-[26px] border-[6px] p-2 shadow-2xl shadow-black/60">
      <div className="bg-os-bg relative h-full w-full overflow-hidden rounded-[17px]">
        <span
          aria-hidden
          className="bg-os-void absolute top-0 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-b-xl"
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full flex-col px-3.5 pt-7 pb-4"
          >
            <Screen screen={screen} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

const row = 'flex items-center justify-between text-[10px]'

function Screen({ screen }: { screen: WalkthroughScreen }) {
  switch (screen) {
    case 'qr':
      return (
        <>
          <p className="chrome text-os-faint text-[9px] tracking-widest uppercase">scan to print</p>
          <div className="my-auto grid place-items-center">
            <QrGlyph />
            <p className="chrome text-os-dim mt-3 text-center text-[10px]">
              point your camera
              <br />
              at the counter code
            </p>
          </div>
          <p className="chrome text-os-faint text-center text-[9px]">no app · no account</p>
        </>
      )

    case 'upload':
      return (
        <>
          <p className="chrome text-os-faint text-[9px] tracking-widest uppercase">upload</p>
          <div className="border-os-line mt-4 flex items-center gap-2 rounded-md border border-dashed p-3">
            <FileText size={16} strokeWidth={1.6} className="text-accent" />
            <div className="min-w-0">
              <p className="chrome truncate text-[10px]">assignment.pdf</p>
              <p className="chrome text-os-faint text-[9px]">12 pages · 2.4 MB</p>
            </div>
          </div>
          <div className="bg-os-line mt-4 h-1 overflow-hidden rounded-full">
            <motion.div
              className="bg-accent h-full"
              initial={{ width: '8%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
            />
          </div>
          <p className="chrome text-os-faint mt-2 text-[9px]">uploading direct to storage…</p>
        </>
      )

    case 'quote':
      return (
        <>
          <p className="chrome text-os-faint text-[9px] tracking-widest uppercase">quote</p>
          <div className="chrome text-os-dim mt-4 space-y-2">
            <div className={row}>
              <span>12 pages · B/W</span>
              <span>₹12.00</span>
            </div>
            <div className={row}>
              <span>single-sided</span>
              <span>₹0.40</span>
            </div>
            <div className="bg-os-line h-px" />
            <div className={`${row} text-os-text`}>
              <span>total</span>
              <span className="text-accent">₹12.40</span>
            </div>
            <p className="text-os-faint text-[9px]">stored as 1240 paise</p>
          </div>
          <p className="chrome border-os-line text-os-faint mt-auto rounded border border-dashed p-2 text-[9px] leading-snug">
            rate card frozen onto this job
          </p>
        </>
      )

    case 'pay':
      return (
        <>
          <p className="chrome text-os-faint text-[9px] tracking-widest uppercase">pay</p>
          <div className="my-auto text-center">
            <p className="chrome text-accent text-[22px]">₹12.40</p>
            <p className="chrome text-os-faint mt-1 text-[9px]">Razorpay · UPI</p>
          </div>
          <div className="chrome bg-accent grid h-8 place-items-center rounded-md text-[10px] text-black">
            pay now
          </div>
          <p className="chrome text-os-faint mt-2 text-center text-[8.5px] leading-snug">
            state advances on the verified webhook, never the browser
          </p>
        </>
      )

    case 'queued':
      return (
        <>
          <p className="chrome text-os-faint text-[9px] tracking-widest uppercase">queued</p>
          <div className="my-auto text-center">
            <span className="border-accent/50 bg-accent/10 mx-auto grid h-12 w-12 place-items-center rounded-full border">
              <Check size={20} strokeWidth={2.4} className="text-accent" />
            </span>
            <p className="chrome text-os-text mt-3 text-[11px]">paid · job #4821</p>
          </div>
          <div className="chrome text-os-faint space-y-1 text-[9px]">
            <div className={row}>
              <span>paymentState</span>
              <span className="text-tech-razorpay">CAPTURED</span>
            </div>
            <div className={row}>
              <span>printState</span>
              <span className="text-tech-csharp">PENDING</span>
            </div>
          </div>
        </>
      )

    case 'agent':
      return (
        <>
          <p className="chrome text-os-faint text-[9px] tracking-widest uppercase">shop pc</p>
          <div className="chrome text-os-dim mt-3 space-y-1 text-[8.5px] leading-relaxed">
            <p className="text-tech-csharp">agent: poll /jobs?shop=…</p>
            <p>claim job #4821</p>
            <p>download from signed url</p>
            <p>spool → default printer</p>
            <p className="text-accent">printState: PRINTED</p>
          </div>
          <div className="mt-auto flex items-center gap-2">
            <Printer size={16} strokeWidth={1.6} className="text-accent" />
            <p className="chrome text-os-faint text-[9px] leading-snug">
              the shop's existing printer — nothing new installed
            </p>
          </div>
        </>
      )
  }
}

/** Decorative QR-ish glyph. Not a real code — it would encode nothing true. */
function QrGlyph() {
  const cells = [
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [1, 0, 1, 0, 0, 1, 1, 0, 1],
    [1, 1, 1, 0, 1, 0, 1, 1, 1],
    [0, 0, 0, 1, 1, 1, 0, 0, 0],
    [1, 0, 1, 1, 0, 0, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0, 1, 1],
    [1, 1, 1, 0, 0, 1, 1, 1, 1],
    [1, 0, 1, 1, 1, 0, 1, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1],
  ]
  return (
    <svg width="84" height="84" viewBox="0 0 9 9" aria-hidden shapeRendering="crispEdges">
      {cells.flatMap((line, y) =>
        line.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#e8a33d" /> : null,
        ),
      )}
    </svg>
  )
}
