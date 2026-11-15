import { MediaControlStatus } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { PauseOrPlayMutation } from "@src/apps/media-control/mutations/PauseOrPlayMutation.ts"
import { SkipNextMutation } from "@src/apps/media-control/mutations/SkipNextMutation.ts"
import { SkipPreviousMutation } from "@src/apps/media-control/mutations/SkipPreviousMutation.ts"
import { MediaControlStatusQuery } from "@src/apps/media-control/queries/MediaControlStatusQuery.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useCallback, useEffect, useRef, useState } from "react"

export type MediaControlAppState = {
  status: MediaControlStatus | null
  controls: PlaybackControls
  isMinimized: boolean
  toggleMinimized: () => void
}

export type PlaybackControls = {
  canSkipNext: boolean
  skipNext: () => void
  canSkipPrevious: boolean
  skipPrevious: () => void
  canPauseOrPlay: boolean
  pauseOrPlay: () => void
}

export function useMediaControlAppState(): MediaControlAppState {
  const query = useQuery({
    ...MediaControlStatusQuery,
    refetchInterval: 1_000,
  })

  const status = query.data ?? null
  const previousStatusRef = useRef(status)

  const { mutate: skipNextMutate, isPending: isSkipNextPending } = useMutation(SkipNextMutation)
  const { mutate: skipPreviousMutate, isPending: isSkipPreviousPending } = useMutation(SkipPreviousMutation)
  const { mutate: pauseOrPlayMutate, isPending: isPauseOrPlayPending } = useMutation(PauseOrPlayMutation)

  const handleSkipNext = useCallback(() => skipNextMutate(), [skipNextMutate])
  const handleSkipPrevious = useCallback(() => skipPreviousMutate(), [skipPreviousMutate])
  const handlePauseOrPlay = useCallback(() => pauseOrPlayMutate(), [pauseOrPlayMutate])

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
    controls: {
      canSkipNext: Boolean(status?.controls?.isSkipNextEnabled) && !isSkipNextPending,
      skipNext: handleSkipNext,
      canSkipPrevious: Boolean(status?.controls?.isSkipNextEnabled) && !isSkipPreviousPending,
      skipPrevious: handleSkipPrevious,
      canPauseOrPlay: Boolean(status?.controls?.isSkipNextEnabled) && !isPauseOrPlayPending,
      pauseOrPlay: handlePauseOrPlay,
    },
    isMinimized,
    toggleMinimized,
  }), [
    status,
    isSkipNextPending,
    isSkipPreviousPending,
    isPauseOrPlayPending,
    handleSkipNext,
    handleSkipPrevious,
    handlePauseOrPlay,
    isMinimized,
    toggleMinimized,
  ])
}
