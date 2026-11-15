import { PauseOutlined, PlayArrowOutlined } from "@mui/icons-material"
import { PauseOrPlayCommand } from "@src/apps/media-control/commands/PauseOrPlayCommand.ts"
import { SkipNextCommand } from "@src/apps/media-control/commands/SkipNextCommand.ts"
import { SkipPreviousCommand } from "@src/apps/media-control/commands/SkipPreviousCommand.ts"
import { MediaControlStatus, PlaybackState } from "@src/apps/media-control/models/MediaControlStatus.ts"
import { CommandButton } from "@src/common/components/CommandButton/CommandButton.tsx"
import React from "react"

/** Previous, pause/play and next, enabled as the player on the workstation allows. */
export const PlaybackControlButtons = (props: { status: MediaControlStatus | null }) => {
  const controls = props.status?.controls

  return (
    <>
      <CommandButton
        command={SkipPreviousCommand}
        iconOnly
        size={"large"}
        disabled={!controls?.isSkipPreviousEnabled}
      />
      <CommandButton
        command={PauseOrPlayCommand}
        iconOnly
        size={"large"}
        icon={props.status?.state === PlaybackState.Playing ? PauseOutlined : PlayArrowOutlined}
        disabled={!controls?.isPauseOrPlayEnabled}
      />
      <CommandButton
        command={SkipNextCommand}
        iconOnly
        size={"large"}
        disabled={!controls?.isSkipNextEnabled}
      />
    </>
  )
}
