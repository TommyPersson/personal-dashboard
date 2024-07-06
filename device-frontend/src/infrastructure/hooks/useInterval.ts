import { useEffect } from "react"

export function useInterval(fn: () => void, intervalMs: number) {
  useEffect(() => {
    const handle = setInterval(fn, intervalMs)
    return () => {
      clearInterval(handle)
    }
  }, [fn, intervalMs])
}