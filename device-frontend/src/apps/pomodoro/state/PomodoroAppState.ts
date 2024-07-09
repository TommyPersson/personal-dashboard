import { useSecondTimer } from "@src/shell/infrastructure/Timer.ts"
import { useCallback, useEffect, useState } from "react"


export type PomodoroAppState = {
  isRunning: boolean
  remainingSeconds: number
  remainingTimeText: string
  percentRemaining: number
  startOrResume: () => void
  pause: () => void
  reset: () => void
}

export const PomodoroDurationSeconds = 60 * 25

export function usePomodoroAppState(): PomodoroAppState {
  const [isRunning, setIsRunning] = useState(false)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(PomodoroDurationSeconds)


  const pause = useCallback(() => {
    setIsRunning(false)
  }, [setIsRunning])

  const reset = useCallback(() => {
    setIsRunning(false)
    setRemainingSeconds(PomodoroDurationSeconds)
  }, [setIsRunning, setRemainingSeconds])

  const startOrResume = useCallback(() => {
    if (remainingSeconds === 0) {
      reset()
    }

    setIsRunning(true)
  }, [setIsRunning, reset, remainingSeconds])

  const countDownSecond = useCallback(() => {
    if (isRunning) {
      setRemainingSeconds(s => Math.max(0, s - 1))
    }
  }, [isRunning, setRemainingSeconds])

  useSecondTimer(countDownSecond)

  useEffect(() => {
    if (remainingSeconds <= 0) {
      setIsRunning(false)
    }
  }, [remainingSeconds, setIsRunning])

  return {
    isRunning: isRunning,
    remainingSeconds: remainingSeconds,
    remainingTimeText: formatTime(remainingSeconds),
    percentRemaining: (remainingSeconds / PomodoroDurationSeconds) * 100,
    startOrResume: startOrResume,
    pause: pause,
    reset: reset,
  }
}

function formatTime(seconds: number) {
  const minutesPart = Math.floor((seconds / 60)).toString(10).padStart(2, "0")
  const secondsPart = Math.floor((seconds % 60)).toString(10).padStart(2, "0")

  return `${minutesPart}:${secondsPart}`
}