import { MusicNoteOutlined } from "@mui/icons-material"
import { MediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import React from "react"

export const MediaControlAppBarIcon = (props: { state: MediaControlAppState }) => {
  const { state } = props

  const variant = state.status ? "dot" : "standard"

  return (
    <AppBarIcon
      id={"media-control"}
      order={1000}
      icon={<MusicNoteOutlined />}
      badgeProps={{
        variant: variant,
        color: "secondary"
      }}
      onClick={state.toggleMinimized}
    />
  )
}