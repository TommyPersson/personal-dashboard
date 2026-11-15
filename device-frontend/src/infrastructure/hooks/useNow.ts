import { DateTime } from "luxon"
import { useEffect, useState } from "react"

/** The current time, updated every `intervalMs`. */
export function useNow(intervalMs: number = 1000): DateTime {
  const [now, setNow] = useState(() => DateTime.now())

  useEffect(() => {
    setNow(DateTime.now())
    const handle = setInterval(() => setNow(DateTime.now()), intervalMs)
    return () => clearInterval(handle)
  }, [intervalMs])

  return now
}
