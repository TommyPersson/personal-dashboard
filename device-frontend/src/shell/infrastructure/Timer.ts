import { useEffect } from "react"
import TimerWorker from "./TimerWorker?worker"

const timerWorker = new TimerWorker()

const listeners: Set<() => void> = new Set()

timerWorker.addEventListener("message", (e) => {
  listeners.forEach(it => it())
})

export function useSecondTimer(callback: () => void) {
  useEffect(() => {
    listeners.add(callback)

    return () => {
      listeners.delete(callback)
    }
  }, [callback])
}