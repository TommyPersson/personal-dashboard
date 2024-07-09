import {
  MusicNoteOutlined,
  PauseOutlined,
  PlayArrowOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined,
  SouthEastOutlined,
} from "@mui/icons-material"
import { Badge, Card, CardContent, IconButton, Slide, Stack, Typography } from "@mui/material"
import { MediaControlStatus, PlaybackState } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { MediaControlAppState, useMediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { AppAreaOverlayPortal } from "@src/common/components/AppAreaOverlayPortal/AppAreaOverlayPortal.tsx"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import React from "react"

import classes from "./MediaControlUI.module.scss"


export const MediaControlUI = () => {
  const state = useMediaControlAppState()

  return (
    <>
      <MediaControlOverlay state={state} />
      <AppBarIconPortal appIconId={"media-control"} order={1000}>
        <MediaControlAppBarButton state={state} />
      </AppBarIconPortal>
    </>
  )
}

export const MediaControlOverlay = (props: { state: MediaControlAppState }) => {
  const { state } = props

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

const MediaInfoView = (props: { state: MediaControlAppState }) => {
  const { state } = props

  const backgroundImage = getThumbnailImageSrc(state.status)

  const content = state.status ? (
    <>
      <Typography
        variant={"subtitle1"}
        className={classes.ThumbnailText}
        children={state.status?.mediaInfo?.title} />
      <Typography
        variant={"caption"}
        className={classes.ThumbnailText}
        children={state.status?.mediaInfo?.artist} />
    </>
  ) : (
    <Typography>Nothing is being played</Typography>
  )

  return (
    <CardContent
      className={classes.ThumbnailCardContainer}
      style={{ backgroundImage: backgroundImage }}
    >
      <Stack className={classes.ThumbnailContainer}>
        {content}
      </Stack>
    </CardContent>
  )
}

const PlaybackControlsView = (props: { state: MediaControlAppState }) => {
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

const MediaControlAppBarButton = (props: { state: MediaControlAppState }) => {
  const { state } = props

  const variant = state.status ? "dot" : "standard"

  return (
    <IconButton
      size={"large"}
      children={(
        <Badge color="secondary" variant={variant}>
          <MusicNoteOutlined />
        </Badge>
      )}
      onClick={state.toggleMinimized}
    />
  )
}