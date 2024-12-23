import { useCallback, useRef } from "react"

export function useDebounced(fn: () => void, delayMs: number, deps: any[]): () => void {
  const handleRef = useRef()

  return useCallback(() => {
    clearTimeout(handleRef.current)
    // @ts-expect-error typescript mistypes setTimeout as Node interface
    handleRef.current = setTimeout(fn, delayMs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delayMs])
}