import { Pause, PlayArrow, Replay, TimerOutlined } from "@mui/icons-material"
import { Button, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material"
import { PomodoroTimerAppState } from "@src/apps/pomodoro-timer/state/PomodoroTimerAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import React from "react"

import classes from "./PomodoroTimerAppWidget.module.scss"

export const PomodoroTimerAppWidget = React.memo((props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  return (
    <AppWidget className={classes.PomodoroAppWidget} id={"pomodoroTimerAppWidget"}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Pomodoro Timer"}
          icon={<TimerOutlined />}
        />
        <Card>
          <CardContent>
            <Stack spacing={4}>
              <AnalogProgressTimer state={state} />
              <TextualProgressTimer state={state} />
              <ActionButtons state={state} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppWidget>
  )
})

const AnalogProgressTimer = (props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  return (
    <CircularProgress
      className={classes.TimerProgress}
      variant="determinate"
      size={"50%"}
      thickness={22}
      value={state.percentRemaining}
    />
  )
}

const TextualProgressTimer = (props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  return (
    <Typography
      variant={"h2"}
      component={"h2"}
      fontWeight={"bold"}
      textAlign={"center"}
    >
      {state.remainingTimeText}
      <Typography variant={"body1"}>remaining</Typography>
    </Typography>
  )
}

const ActionButtons = (props: { state: PomodoroTimerAppState }) => {
  const { state } = props

  return (
    <Stack
      direction={"column"}
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {!state.isRunning &&
        <Button
          color={"primary"}
          onClick={state.startOrResume}
          size="large"
          startIcon={<PlayArrow />}
          children={"Start"}
          variant={"contained"}
        />}
      {state.isRunning &&
        <Button
          color={"primary"}
          onClick={state.pause}
          size="large"
          startIcon={<Pause />}
          children={"Pause"}
          variant={"contained"}
        />}
      <Button
        children={"Reset"}
        onClick={state.reset}
        size="large"
        startIcon={<Replay />}
      />
    </Stack>
  )
}

