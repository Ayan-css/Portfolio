import { useEffect, useState } from 'react'

const format = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

/** Taskbar clock. Ticks once a minute — a seconds-accurate clock would just burn renders. */
export function useClock(): string {
  const [time, setTime] = useState(format)

  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15_000)
    return () => clearInterval(id)
  }, [])

  return time
}
