import { SmartToyOutlined } from "@mui/icons-material"
import { ClaudeCodeAppState } from "@src/apps/claude-code/state/ClaudeCodeAppState.ts"
import { LockScreenIcon } from "@src/common/components/LockScreenIcon/LockScreenIcon.tsx"
import React from "react"

/** Shown while a session is waiting for a response on the workstation. */
export const ClaudeCodeLockScreenIcon = React.memo((props: {
  state: ClaudeCodeAppState
}) => {
  const { state } = props

  if (state.sessionsRequiringInput.length <= 0) {
    return null
  }

  return (
    <LockScreenIcon
      id={"claude-code"}
      order={960}
      icon={<SmartToyOutlined />}
      badgeProps={{
        badgeContent: state.sessionsRequiringInput.length,
        color: "warning",
      }}
    />
  )
})
