import { SmartToyOutlined } from "@mui/icons-material"
import { ClaudeCodeAppState } from "@src/apps/claude-code/state/ClaudeCodeAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const ClaudeCodeAppBarIcon = React.memo((props: {
  state: ClaudeCodeAppState
}) => {
  const { state } = props

  const handleClick = useScrollIntoView("claudeCodeAppWidget")

  return (
    <AppBarIcon
      id={"claude-code"}
      order={960}
      icon={<SmartToyOutlined />}
      badgeProps={{
        badgeContent: state.waitingSessions.length,
        color: "warning",
      }}
      onClick={handleClick}
    />
  )
})
