import { SouthEastOutlined } from "@mui/icons-material"
import { Card, CardContent, IconButton, Slide, Stack, Typography } from "@mui/material"
import { MediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { PlaybackControlButtons } from "@src/apps/media-control/ui/PlaybackControlButtons.tsx"
import { getThumbnailImageSrc } from "@src/apps/media-control/utils/mediaControlUtils.ts"
import { AppAreaOverlayPortal } from "@src/common/components/AppAreaOverlayPortal/AppAreaOverlayPortal.tsx"
import React from "react"

import classes from "./MediaControlOverlay.module.scss"

export const MediaControlOverlay = React.memo((props: { state: MediaControlAppState }) => {
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
})

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
  const { status, toggleMinimized } = props.state

  return (
    <CardContent component={Stack} className={classes.PlaybackControlsView}>
      <Stack direction={"row"} spacing={2}>
        <PlaybackControlButtons status={status} />
      </Stack>
      <IconButton
        size={"large"}
        children={<SouthEastOutlined />}
        onClick={toggleMinimized}
      />
    </CardContent>
  )
}