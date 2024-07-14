import { TimerOutlined } from "@mui/icons-material"
import { PomodoroDurationSeconds, PomodoroTimerAppState } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { AppBarIcon } from "@src/common/components/AppBarIcon/AppBarIcon.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React from "react"

export const PomodoroTimerAppBarIcon = React.memo((props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  const badgeContent = state.remainingSeconds !== PomodoroDurationSeconds ? state.remainingTimeText : null

  const handleClick = useScrollIntoView("pomodoroTimerAppWidget")

  return (
    <AppBarIcon
      id={"pomodoro-timer"}
      order={100}
      icon={<TimerOutlined />}
      badgeProps={{
        badgeContent: badgeContent,
        color: "info",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      }}
      onClick={handleClick}
    />
  )
})