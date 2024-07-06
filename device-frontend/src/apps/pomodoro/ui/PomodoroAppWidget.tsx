import { Close, NotificationsOutlined, Pause, PlayArrow, Replay, TimerOutlined } from "@mui/icons-material"
import { Box, Button, Card, CardContent, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import { PomodoroTimerHook, usePomodoroTimer } from "@src/apps/pomodoro/hooks/usePomodoroTimer.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import React from "react"
import classes from "./PomodoroAppWidget.module.scss"


export const PomodoroAppWidget = () => {
  const timer = usePomodoroTimer()

  return (
    <AppWidget className={classes.PomodoroAppWidget}>
      <Stack spacing={2}>
        <AppWidgetHeader
          title={"Pomodoro Timer"}
          icon={<TimerOutlined />}
        />
        <Card>
          <CardContent>
            <Stack spacing={4}>
              {/*<Typography variant={"h5"} component={"h1"} textAlign={"center"}>Pomodoro Timer</Typography>*/}
              <AnalogProgressTimer timer={timer} />
              <TextualProgressTimer timer={timer} />
              <ActionButtons timer={timer} />
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </AppWidget>
  )
}

const AnalogProgressTimer = (props: { timer: PomodoroTimerHook }) => {
  const { timer } = props

  return (
    <CircularProgress
      className={classes.TimerProgress}
      variant="determinate"
      size={"50%"}
      thickness={22}
      value={timer.percentRemaining}
    />
  )
}

const TextualProgressTimer = (props: { timer: PomodoroTimerHook }) => {
  const { timer } = props

  return (
    <Typography
      variant={"h2"}
      component={"h2"}
      fontWeight={"bold"}
      textAlign={"center"}
    >
      {timer.remainingTimeText}
      <Typography variant={"body1"}>remaining</Typography>
    </Typography>
  )
}

const ActionButtons = (props: { timer: PomodoroTimerHook }) => {
  const { timer } = props

  return (
    <Stack
      direction={"column"}
      spacing={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {!timer.isRunning &&
        <Button
          color={"primary"}
          onClick={timer.startOrResume}
          size="large"
          startIcon={<PlayArrow />}
          children={"Start"}
          variant={"contained"}
        />}
      {timer.isRunning &&
        <Button
          color={"primary"}
          onClick={timer.pause}
          size="large"
          startIcon={<Pause />}
          children={"Pause"}
          variant={"contained"}
        />}
      <Button
        children={"Reset"}
        onClick={timer.reset}
        size="large"
        startIcon={<Replay />}
      />
    </Stack>
  )
}