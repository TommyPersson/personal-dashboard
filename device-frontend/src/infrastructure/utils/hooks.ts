import { useCallback } from "react"

export function useScrollIntoView(elementId: string): () => void {
  return useCallback(() => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" })
  }, [elementId])
}