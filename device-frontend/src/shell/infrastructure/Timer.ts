import { useEffect } from "react"
import TimerWorker from "./TimerWorker?worker"

const timerWorker = new TimerWorker()

const listeners: Set<() => void> = new Set()

timerWorker.addEventListener("message", (e) => {
  if (e.data.type === "second-timer") {
    listeners.forEach(it => it())
  } else {
    window.postMessage(e.data)
  }
})

export function useSecondTimer(callback: () => void) {
  useEffect(() => {
    listeners.add(callback)

    return () => {
      listeners.delete(callback)
    }
  }, [callback])
}