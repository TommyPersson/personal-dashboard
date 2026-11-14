import { useCallback, useRef } from "react"

export function useDebounced(fn: () => void, delayMs: number, deps: any[]): () => void {
  const handleRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  return useCallback(() => {
    clearTimeout(handleRef.current)
    handleRef.current = setTimeout(fn, delayMs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delayMs])
}