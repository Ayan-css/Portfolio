import emailjs from '@emailjs/browser'
import { profile } from './data'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

/** All three are public identifiers by design — EmailJS has no secret to leak here. */
export const emailConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY)

export interface Message {
  name: string
  email: string
  message: string
}

/** A mailto: with the message already written, for when EmailJS isn't configured or fails. */
export function mailtoFallback({ name, email, message }: Message): string {
  const body = `${message}\n\n— ${name} (${email})`
  return `mailto:${profile.email}?subject=${encodeURIComponent(
    `Portfolio message from ${name || 'a visitor'}`,
  )}&body=${encodeURIComponent(body)}`
}

export async function sendMessage(payload: Message): Promise<void> {
  if (!emailConfigured) throw new Error('EmailJS is not configured')
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      // EmailJS's default template uses {{name}} and {{time}}; a custom subject
      // line usually uses {{from_name}}. Sending both names costs nothing and
      // means the template works whichever one it was written against.
      name: payload.name,
      from_name: payload.name,
      email: payload.email,
      reply_to: payload.email,
      message: payload.message,
      time: new Date().toLocaleString(),
    },
    { publicKey: PUBLIC_KEY },
  )
}

/** Good enough to catch typos; the server is the only real validator anyway. */
export const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
