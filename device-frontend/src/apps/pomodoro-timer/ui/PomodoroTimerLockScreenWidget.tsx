import { PauseOutlined, PlayArrowOutlined, Replay } from "@mui/icons-material"
import { Fade, IconButton, Stack, Typography } from "@mui/material"
import { PomodoroTimerAppState } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { LockScreenWidgetPortal } from "@src/common/components/LockScreenWidgetPortal/LockScreenIconPortal.tsx"
import React from "react"

import classes from "./PomodoroTimerLockScreenWidget.module.scss"

export const PomodoroTimerLockScreenWidget = React.memo((props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  return (
    <LockScreenWidgetPortal id={"pomodoro-timer-lock-screen-widget"} column={1} order={300}>
      <PomodoroTimerView state={state} />
    </LockScreenWidgetPortal>
  )
})


const PomodoroTimerView = (props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  const canPause = state.isRunning
  const canResume = !state.isRunning
  const canReset = true

  return (
    <Fade in={true}>
      <Stack direction={"row"} className={classes.Container}>
        <div className={classes.ProgressBackground} style={{ width: `${100 - state.percentRemaining}%` }} />
        <Stack direction={"row"} className={classes.LeftContent}>
          <Stack direction={"column"}>
            <Typography variant={"overline"} className={classes.Header}>Pomodoro</Typography>
            <Typography
              variant={"h2"}
              component={"h2"}
              fontWeight={"bold"}
            >
              {state.remainingTimeText}
            </Typography>
          </Stack>
        </Stack>
        <div style={{ flex: 1 }} />
        <Stack direction={"row"} className={classes.RightContent}>
          <IconButton
            size={"large"}
            children={<Replay />}
            disabled={!canReset}
            onClick={state.reset}
          />
          <IconButton

            size={"large"}
            children={<PauseOutlined />}
            disabled={!canPause}
            onClick={state.pause}
          />
          <IconButton
            size={"large"}
            children={<PlayArrowOutlined />}
            disabled={!canResume}
            onClick={state.startOrResume}
          />
        </Stack>
      </Stack>
    </Fade>
  )
}