import { TimerOutlined } from "@mui/icons-material"
import { Badge, IconButton } from "@mui/material"
import { PomodoroTimerAppState, PomodoroDurationSeconds } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const PomodoroTimerAppBarIcon = (props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  const badgeContent = state.remainingSeconds !== PomodoroDurationSeconds ? state.remainingTimeText : null

  const handleClick = useScrollIntoView("pomodoroTimerAppWidget")

  return (
    <AppBarIconPortal appIconId={"pomodoro-timer"} order={100}>
      <IconButton size={"large"} onClick={handleClick}>
        <Badge
          badgeContent={badgeContent}
          color={"info"}
          anchorOrigin={{ horizontal: "right", vertical: "top" }}
        >
          <TimerOutlined />
        </Badge>
      </IconButton>
    </AppBarIconPortal>
  )
}