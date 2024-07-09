import { MusicNoteOutlined } from "@mui/icons-material"
import { Badge, IconButton } from "@mui/material"
import { MediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import React from "react"

export const MediaControlAppBarIcon = (props: { state: MediaControlAppState }) => {
  const { state } = props

  const variant = state.status ? "dot" : "standard"

  return (
    <AppBarIconPortal appIconId={"media-control"} order={1000}>
      <IconButton size={"large"} onClick={state.toggleMinimized}>
        <Badge color="secondary" variant={variant}>
          <MusicNoteOutlined />
        </Badge>
      </IconButton>
    </AppBarIconPortal>
  )
}