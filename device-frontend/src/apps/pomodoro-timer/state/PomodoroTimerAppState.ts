import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useSecondTimer } from "@src/shell/infrastructure/Timer.ts"
import { Duration } from "luxon"
import { useCallback, useEffect, useState } from "react"


export type PomodoroTimerAppState = {
  isRunning: boolean
  remainingSeconds: number
  remainingTime: Duration
  percentRemaining: number
  startOrResume: () => void
  pause: () => void
  reset: () => void
}

export const PomodoroDurationSeconds = 60 * 25

export function usePomodoroTimerAppState(): PomodoroTimerAppState {
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

  return useDeepEqualMemo(() => ({
    isRunning: isRunning,
    remainingSeconds: remainingSeconds,
    remainingTime: Duration.fromObject({ seconds: remainingSeconds }),
    percentRemaining: (remainingSeconds / PomodoroDurationSeconds) * 100,
    startOrResume: startOrResume,
    pause: pause,
    reset: reset,
  }), [isRunning, remainingSeconds, startOrResume, pause, reset])
}