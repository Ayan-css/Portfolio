import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/lib/data'
import {
  emailConfigured,
  looksLikeEmail,
  mailtoFallback,
  sendMessage,
  type Message,
} from '@/lib/contact'
import { Pane } from '@/components/ui'

type Status =
  | { kind: 'idle' }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'error'; text: string; retryHref?: string }

const EMPTY: Message = { name: '', email: '', message: '' }

export function Contact() {
  const [form, setForm] = useState<Message>(EMPTY)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  const set = (key: keyof Message) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    if (!form.name.trim() || !form.message.trim()) {
      setStatus({ kind: 'error', text: 'name and message are required' })
      return
    }
    if (!looksLikeEmail(form.email)) {
      setStatus({ kind: 'error', text: `invalid address: ${form.email || '(empty)'}` })
      return
    }

    // No mail service wired up? Hand over a pre-filled mailto rather than pretending to send.
    if (!emailConfigured) {
      window.location.href = mailtoFallback(form)
      setStatus({ kind: 'sent' })
      return
    }

    setStatus({ kind: 'sending' })
    try {
      await sendMessage(form)
      setStatus({ kind: 'sent' })
      setForm(EMPTY)
    } catch {
      setStatus({
        kind: 'error',
        text: 'delivery failed — the mail service did not accept the message',
        retryHref: mailtoFallback(form),
      })
    }
  }

  if (status.kind === 'sent') {
    return (
      <Pane>
        <div className="chrome text-[12.5px] leading-[2]">
          <p className="text-accent">$ send_message --to={profile.handle}</p>
          <motion.p
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-tech-node"
          >
            ✓ delivered. {emailConfigured ? 'Ayan will get back to you.' : 'Your mail client should be open.'}
          </motion.p>
          <button
            type="button"
            onClick={() => setStatus({ kind: 'idle' })}
            className="text-os-faint hover:text-os-text mt-4 transition-colors duration-150"
          >
            $ send another
          </button>
        </div>
      </Pane>
    )
  }

  const sending = status.kind === 'sending'

  return (
    <Pane>
      <form onSubmit={onSubmit} className="chrome text-[12.5px]">
        <p className="text-accent mb-4">$ send_message --to={profile.handle}</p>

        <Field label="name" value={form.name} onChange={set('name')} disabled={sending} />
        <Field
          label="email"
          type="email"
          value={form.email}
          onChange={set('email')}
          disabled={sending}
        />
        <Field
          label="message"
          value={form.message}
          onChange={set('message')}
          disabled={sending}
          multiline
        />

        <p role="status" aria-live="polite" className="sr-only">
          {sending ? 'sending message' : status.kind === 'error' ? `error: ${status.text}` : ''}
        </p>

        {status.kind === 'error' && (
          <p className="mt-3 text-[11.5px] text-red-400">
            error: {status.text}
            {status.retryHref && (
              <>
                {' — '}
                <a href={status.retryHref} className="underline underline-offset-2">
                  open in your mail client instead
                </a>
              </>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="border-accent/50 bg-accent/10 text-accent hover:bg-accent/20 mt-5 rounded-md border px-4 py-2 text-[11.5px] transition-colors duration-150 disabled:opacity-50"
        >
          {sending ? 'sending…' : '↵ send'}
        </button>

        {!emailConfigured && (
          <p className="text-os-faint mt-3 text-[10.5px] leading-relaxed">
            note: no mail service configured, so this opens your own mail client with the message
            pre-written. Set the three VITE_EMAILJS_* values in .env to send in-page.
          </p>
        )}
      </form>

      <div className="border-os-line mt-7 border-t pt-5">
        <p className="chrome text-os-faint mb-3 text-[10.5px] tracking-[0.16em] uppercase">
          elsewhere
        </p>
        <ul className="chrome space-y-1.5 text-[12px]">
          <CurlLine href={profile.github} label={profile.github.replace('https://', '')} />
          {profile.linkedin && (
            <CurlLine href={profile.linkedin} label={profile.linkedin.replace('https://', '')} />
          )}
          <CurlLine href={`mailto:${profile.email}`} label={profile.email} verb="mail" />
        </ul>
      </div>
    </Pane>
  )
}

function CurlLine({ href, label, verb = 'curl' }: { href: string; label: string; verb?: string }) {
  return (
    <li>
      <a
        href={href}
        target={href.startsWith('mailto:') ? undefined : '_blank'}
        rel="noopener noreferrer"
        className="text-os-dim hover:text-accent group inline-flex gap-2 transition-colors duration-150"
      >
        <span className="text-os-faint">$</span>
        <span className="text-os-faint">{verb}</span>
        <span className="group-hover:underline group-hover:underline-offset-2">{label}</span>
      </a>
    </li>
  )
}

function Field({
  label,
  value,
  onChange,
  disabled,
  multiline,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
  multiline?: boolean
  type?: string
}) {
  const shared =
    'w-full bg-transparent text-os-text placeholder:text-os-faint/70 outline-none disabled:opacity-50'

  return (
    <label className="border-os-line focus-within:border-accent/50 mb-2 flex gap-2 rounded-md border px-3 py-2 transition-colors duration-150">
      <span className="text-os-faint w-[62px] shrink-0 select-none">{label}</span>
      <span aria-hidden className="text-accent select-none">
        ›
      </span>
      {multiline ? (
        <textarea
          rows={5}
          required
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder="what are you building?"
          className={`${shared} resize-none`}
        />
      ) : (
        <input
          type={type}
          required
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={label === 'email' ? 'you@example.com' : 'your name'}
          className={shared}
        />
      )}
    </label>
  )
}
