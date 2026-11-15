import { MediaControlStatus } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { MediaControlStatusQuery } from "@src/apps/media-control/queries/MediaControlStatusQuery.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"

export type MediaControlAppState = {
  status: MediaControlStatus | null
  isMinimized: boolean
  toggleMinimized: () => void
}

export function useMediaControlAppState(): MediaControlAppState {
  const query = useQuery({
    ...MediaControlStatusQuery,
    refetchInterval: 1_000,
  })

  const status = query.data ?? null
  const previousStatusRef = useRef(status)

  const [isMinimized, setIsMinimized] = useState(false)

  const toggleMinimized = useCallback(() => {
    setIsMinimized(s => !s)
  }, [setIsMinimized])

  useEffect(() => {
    if (!status) {
      setIsMinimized(true)
    } else if (status && previousStatusRef.current === null) {
      setIsMinimized(false)
    }
    previousStatusRef.current = status
  }, [status, setIsMinimized])

  return useDeepEqualMemo((): MediaControlAppState => ({
    status,
    isMinimized,
    toggleMinimized,
  }), [
    status,
    isMinimized,
    toggleMinimized,
  ])
}
