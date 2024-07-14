import {
  PauseOutlined,
  PlayArrowOutlined,
  SkipNextOutlined,
  SkipPreviousOutlined,
  SouthEastOutlined,
} from "@mui/icons-material"
import { Box, CardContent, Fade, IconButton, Stack, Typography } from "@mui/material"
import { PlaybackState } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { MediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { getThumbnailImageSrc } from "@src/apps/media-control/utils/mediaControlUtils.ts"
import { LockScreenWidgetPortal } from "@src/common/components/LockScreenWidgetPortal/LockScreenIconPortal.tsx"
import React from "react"

import classes from "./MediaControlLockScreenWidget.module.scss"

export const MediaControlLockScreenWidget = React.memo((props: { state: MediaControlAppState }) => {
  const { state } = props

  return (
    <LockScreenWidgetPortal id={"media-control-lock-screen-widget"} column={1} order={200}>
      <MediaInfoView state={state} />
    </LockScreenWidgetPortal>
  )
})


const MediaInfoView = (props: { state: MediaControlAppState }) => {
  const { state } = props

  const backgroundImage = getThumbnailImageSrc(state.status)

  const content = state.status ? (
    <Stack className={classes.ThumbnailTextContainer}>
      <Typography
        variant={"subtitle1"}
        className={classes.ThumbnailText}
        children={state.status?.mediaInfo?.title} />
      <Typography
        variant={"caption"}
        className={classes.ThumbnailText}
        children={state.status?.mediaInfo?.artist} />
    </Stack>
  ) : (
    <Typography>Nothing is being played</Typography>
  )

  return (
    <Fade in={!!state.status}>
      <Stack
        className={classes.ThumbnailContainer}
        style={{ backgroundImage: backgroundImage }}
      >
        <Stack direction={"row"} className={classes.ThumbnailContent}>
          {content}
          <PlaybackControlsView state={state} />
        </Stack>
      </Stack>
    </Fade>
  )
}


const PlaybackControlsView = (props: { state: MediaControlAppState }) => {
  const { status, controls, toggleMinimized } = props.state

  const pauseOrPlayIcon = status?.state === PlaybackState.Playing
    ? <PauseOutlined />
    : <PlayArrowOutlined />

  return (
    <Stack direction={"row"} className={classes.PlaybackControlsView}>
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
  )
}