import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { useCallback, useState } from "react"


export type ClockAppState = {
  time: Date
}

export function useClockAppState(): ClockAppState {
  const [time, setTime] = useState(new Date())

  const refreshTime = useCallback(() => {
    setTime(new Date())
  }, [])

  useInterval(refreshTime, 5000)

  return {
    time
  }
}