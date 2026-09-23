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
      from_name: payload.name,
      reply_to: payload.email,
      message: payload.message,
      to_email: profile.email,
    },
    { publicKey: PUBLIC_KEY },
  )
}

/** Good enough to catch typos; the server is the only real validator anyway. */
export const looksLikeEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
