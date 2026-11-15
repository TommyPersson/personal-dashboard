import { Fade, Stack, Typography } from "@mui/material"
import { MediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { PlaybackControlButtons } from "@src/apps/media-control/ui/PlaybackControlButtons.tsx"
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
    <Fade in={!!state.status} appear={true} unmountOnExit={true} mountOnEnter={true}>
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
  return (
    <Stack direction={"row"} className={classes.PlaybackControlsView}>
      <PlaybackControlButtons status={props.state.status} />
    </Stack>
  )
}