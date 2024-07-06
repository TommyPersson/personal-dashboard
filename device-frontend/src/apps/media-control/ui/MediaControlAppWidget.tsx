import {
  MusicNoteOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined,
} from "@mui/icons-material"
import { Box, Card, CardContent, IconButton, Stack, Typography } from "@mui/material"
import { PauseOrPlayAction, SkipNextAction, SkipPreviousAction } from "@src/apps/media-control/actions"
import { MediaControlStatusEntity } from "@src/apps/media-control/entities/MediaControlStatusEntity.ts"
import { MediaControlStatus, PlaybackState } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { delay } from "@src/infrastructure/utils"
import React, { useCallback, useMemo } from "react"

import classes from "./MediaControlAppWidget.module.scss"


export const MediaControlAppWidget = () => {
  const state = useMediaControlState({ refreshIntervalMs: 5000 })

  const cardContent = state.status
    ? <MediaInfoView state={state} />
    : <EmptyView />

  return (
    <AppWidget className={classes.MediaControlAppWidget}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Media Control"}
          icon={<MusicNoteOutlined />}
        />
        <Card>
          {cardContent}
          <PlaybackControlsView state={state} />
        </Card>
      </Stack>
    </AppWidget>
  )
}

const EmptyView = () => (
  <CardContent>
    <Typography variant={"subtitle1"} textAlign={"center"}>Nothing is being played</Typography>
  </CardContent>
)

const MediaInfoView = (props: { state: MediaControlState }) => {
  const { state } = props

  const backgroundImage = getThumbnailImageSrc(state.status)

  return (
    <CardContent
      className={classes.OverlayCardContainer}
      style={{ backgroundImage: backgroundImage }}
    >
      <Stack className={classes.OverlayContainer}>
        <Typography
          variant={"subtitle1"}
          className={classes.OverlayText}
          children={state.status?.mediaInfo?.title} />
        <Typography
          variant={"caption"}
          className={classes.OverlayText}
          children={state.status?.mediaInfo?.artist} />
      </Stack>
    </CardContent>
  )
}

const PlaybackControlsView = (props: { state: MediaControlState }) => {
  const { status, controls } = props.state

  const pauseOrPlayIcon = status?.state === PlaybackState.Playing
    ? <PauseOutlined />
    : <PlayArrowOutlined />

  return <CardContent component={Stack} style={{ padding: 0 }}>
    <Stack direction={"row"} alignSelf={"center"} spacing={2}>
      <IconButton
        size={"large"}
        children={<SkipPreviousOutlined />}
        disabled={!controls.canSkipPrevious}
        onClick={controls.skipPrevious}
        style={{ transform: "scale(1.2)" }}
      />
      <IconButton
        size={"large"}
        children={pauseOrPlayIcon}
        disabled={!controls.canPauseOrPlay}
        onClick={controls.pauseOrPlay}
        style={{ transform: "scale(1.2)" }}
      />
      <IconButton
        size={"large"}
        children={<SkipNextOutlined />}
        disabled={!controls.canSkipNext}
        onClick={controls.skipNext}
        style={{ transform: "scale(1.2)" }}
      />
    </Stack>
  </CardContent>
}

function getThumbnailImageSrc(status: MediaControlStatus | null) {
  const title = status?.mediaInfo?.title ?? "unknown"
  const encodedTitle = encodeURIComponent(title)
  return `url("/api/apps/media-control/thumbnail?cache-buster=${encodedTitle}")`
}

type MediaControlState = {
  status: MediaControlStatus | null
  controls: PlaybackControls
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

  useInterval(refreshEntity, options.refreshIntervalMs)

  const backgroundImage = getThumbnailImageSrc(entity.value)

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
  }), [entity, handleSkipNext, handleSkipPrevious, handlePauseOrPlay])
}