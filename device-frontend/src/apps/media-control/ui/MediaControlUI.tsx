import {
  MusicNoteOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined,
  SouthEastOutlined,
} from "@mui/icons-material"
import { Badge, Card, CardContent, IconButton, Slide, Stack, Typography } from "@mui/material"
import { PauseOrPlayAction, SkipNextAction, SkipPreviousAction } from "@src/apps/media-control/actions"
import { MediaControlStatusEntity } from "@src/apps/media-control/entities/MediaControlStatusEntity.ts"
import { MediaControlStatus, PlaybackState } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { AppAreaOverlayPortal } from "@src/common/components/AppAreaOverlayPortal/AppAreaOverlayPortal.tsx"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { delay } from "@src/infrastructure/utils"
import React, { useCallback, useMemo, useState } from "react"

import classes from "./MediaControlUI.module.scss"


export const MediaControlUI = () => {
  const state = useMediaControlState({ refreshIntervalMs: 5000 })

  return (
    <>
      <MediaControlOverlay state={state} />
      <AppBarIconPortal appIconId={"media-control"}>
        <MediaControlAppBarButton state={state} />
      </AppBarIconPortal>
    </>
  )
}

export const MediaControlOverlay = (props: { state: MediaControlState }) => {
  const { state } = props

  if (!state.status) {
    return
  }

  return (
    <AppAreaOverlayPortal appOverlayId={"media-control"}>
      <Slide direction={"up"} in={!state.isMinimized}>
        <Card raised className={classes.MediaControlOverlay}>
          <MediaInfoView state={state} />
          <PlaybackControlsView state={state} />
        </Card>
      </Slide>
    </AppAreaOverlayPortal>
  )
}

const MediaInfoView = (props: { state: MediaControlState }) => {
  const { state } = props

  const backgroundImage = getThumbnailImageSrc(state.status)

  return (
    <CardContent
      className={classes.ThumbnailCardContainer}
      style={{ backgroundImage: backgroundImage }}
    >
      <Stack className={classes.ThumbnailContainer}>
        <Typography
          variant={"subtitle1"}
          className={classes.ThumbnailText}
          children={state.status?.mediaInfo?.title} />
        <Typography
          variant={"caption"}
          className={classes.ThumbnailText}
          children={state.status?.mediaInfo?.artist} />
      </Stack>
    </CardContent>
  )
}

const PlaybackControlsView = (props: { state: MediaControlState }) => {
  const { status, controls, toggleMinimized } = props.state

  const pauseOrPlayIcon = status?.state === PlaybackState.Playing
    ? <PauseOutlined />
    : <PlayArrowOutlined />

  return (
    <CardContent component={Stack} className={classes.PlaybackControlsView}>
      <Stack direction={"row"} spacing={2}>
        <IconButton
          size={"large"}
          children={<SkipPreviousOutlined />}
          disabled={!controls.canSkipPrevious}
          onClick={controls.skipPrevious}
        />
        <IconButton
          size={"large"}
          children={pauseOrPlayIcon}
          disabled={!controls.canPauseOrPlay}
          onClick={controls.pauseOrPlay}
        />
        <IconButton
          size={"large"}
          children={<SkipNextOutlined />}
          disabled={!controls.canSkipNext}
          onClick={controls.skipNext}
        />
      </Stack>
      <IconButton
        size={"large"}
        children={<SouthEastOutlined />}
        onClick={toggleMinimized}
      />
    </CardContent>
  )
}

function getThumbnailImageSrc(status: MediaControlStatus | null) {
  const title = status?.mediaInfo?.title ?? "unknown"
  const encodedTitle = encodeURIComponent(title)
  return `url("/api/apps/media-control/thumbnail?cache-buster=${encodedTitle}")`
}

const MediaControlAppBarButton = (props: { state: MediaControlState }) => {
  const { state } = props

  if (!state.isMinimized) {
    return null
  }

  return (
    <IconButton
      size={"large"}
      children={(
        <Badge color="secondary" variant={"dot"}>
          <MusicNoteOutlined />
        </Badge>
      )}
      onClick={state.toggleMinimized}
    />
  )
}

type MediaControlState = {
  status: MediaControlStatus | null
  controls: PlaybackControls
  isMinimized: boolean
  toggleMinimized: () => void
}

type PlaybackControls = {
  canSkipNext: boolean
  skipNext: () => void
  canSkipPrevious: boolean
  skipPrevious: () => void
  canPauseOrPlay: boolean
  pauseOrPlay: () => void
}

const refreshAfterActionDelayMs = 1000

function useMediaControlState(options: { refreshIntervalMs: number }): MediaControlState {
  const entity = useEntity(MediaControlStatusEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const status = entity.value
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

  useInterval(refreshEntity, options.refreshIntervalMs)

  return useMemo((): MediaControlState => ({
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
