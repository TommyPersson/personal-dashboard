import { dequal } from "dequal"
import { useCallback, useState } from "react"

export function useScrollIntoView(elementId: string): () => void {
  return useCallback(() => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" })
  }, [elementId])
}

export function useDeepEqualMemo<T>(fn: () => T, deps: any[]) {
  const [state, setState] = useState(fn())
  const [oldDeps, setOldDeps] = useState(deps)

  if (!dequal(oldDeps, deps)) {
    setOldDeps(deps)
    setState(fn())
  }

  return state
}
