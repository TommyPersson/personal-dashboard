import { PauseOrPlayAction, SkipNextAction, SkipPreviousAction } from "@src/apps/media-control/actions"
import { MediaControlStatusEntity } from "@src/apps/media-control/entities/MediaControlStatusEntity.ts"
import { MediaControlStatus } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { delay } from "@src/infrastructure/utils"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

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

const refreshAfterActionDelayMs = 1_000

export function useMediaControlAppState(): MediaControlAppState {
  const entity = useEntity(MediaControlStatusEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const status = entity.value
  const previousStatusRef = useRef(status)

  const refreshEntity = entity.fetchAsync

  const { execute: executeSkipNext, ...skipNextAction } = useAction(SkipNextAction)
  const { execute: executeSkipPrevious, ...skipPreviousAction } = useAction(SkipPreviousAction)
  const { execute: executePauseOrPlay, ...pauseOrPlayAction } = useAction(PauseOrPlayAction)

  const handleSkipNext = useCallback(async () => {
    await executeSkipNext()
    await delay(refreshAfterActionDelayMs)
    refreshEntity()
  }, [executeSkipNext, refreshEntity])

  const handleSkipPrevious = useCallback(async () => {
    await executeSkipPrevious()
    await delay(refreshAfterActionDelayMs)
    refreshEntity()
  }, [executeSkipPrevious, refreshEntity])

  const handlePauseOrPlay = useCallback(async () => {
    await executePauseOrPlay()
    await delay(refreshAfterActionDelayMs)
    refreshEntity()
  }, [executePauseOrPlay, refreshEntity])

  const [isMinimized, setIsMinimized] = useState(false)

  const toggleMinimized = useCallback(() => {
    setIsMinimized(s => !s)
  }, [setIsMinimized])

  useInterval(refreshEntity, 1_000)

  useEffect(() => {
    if (!status) {
      setIsMinimized(true)
    } else if (status && previousStatusRef.current === null) {
      setIsMinimized(false)
    }
    previousStatusRef.current = status
  }, [status, setIsMinimized])

  return useMemo((): MediaControlAppState => ({
    status,
    controls: {
      canSkipNext: Boolean(status?.controls?.isSkipNextEnabled) && !skipNextAction.isInProgress,
      skipNext: handleSkipNext,
      canSkipPrevious: Boolean(status?.controls?.isSkipNextEnabled) && !skipPreviousAction.isInProgress,
      skipPrevious: handleSkipPrevious,
      canPauseOrPlay: Boolean(status?.controls?.isSkipNextEnabled) && !pauseOrPlayAction.isInProgress,
      pauseOrPlay: handlePauseOrPlay,
    },
    isMinimized,
    toggleMinimized,
  }), [entity, handleSkipNext, handleSkipPrevious, handlePauseOrPlay, isMinimized, toggleMinimized])
}
