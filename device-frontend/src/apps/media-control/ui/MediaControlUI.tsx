import { useMediaControlAppState } from "@src/apps/media-control/state/MediaControlAppState.ts"
import { MediaControlAppBarIcon } from "@src/apps/media-control/ui/MediaControlAppBarIcon.tsx"
import { MediaControlOverlay } from "@src/apps/media-control/ui/MediaControlOverlay.tsx"
import React from "react"


export const MediaControlUI = () => {
  const state = useMediaControlAppState()

  return (
    <>
      <MediaControlOverlay state={state} />
      <MediaControlAppBarIcon state={state} />
    </>
  )
}
