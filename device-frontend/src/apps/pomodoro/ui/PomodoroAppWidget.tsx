import { Pause, PlayArrow, Replay, TimerOutlined } from "@mui/icons-material"
import { Badge, Button, Card, CardContent, CircularProgress, IconButton, Stack, Typography } from "@mui/material"
import {
  PomodoroAppState,
  PomodoroDurationSeconds,
  usePomodoroAppState,
} from "@src/apps/pomodoro/state/PomodoroAppState.ts"
import { AppBarIconPortal } from "@src/common/components/AppBarIconPortal/AppBarIconPortal.tsx"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { useScrollIntoView } from "@src/infrastructure/utils/hooks.ts"
import React, { useCallback } from "react"
import classes from "./PomodoroAppWidget.module.scss"

export const PomodoroAppUI = () => {
  const state = usePomodoroAppState()

  return (
    <>
      <PomodoroAppWidget state={state} />
      <PomodoroTimerAppBarIcon state={state} />
    </>
  )
}

export const PomodoroAppWidget = (props: { state: PomodoroAppState }) => {
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
}

const AnalogProgressTimer = (props: { state: PomodoroAppState }) => {
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

const TextualProgressTimer = (props: { state: PomodoroAppState }) => {
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

const ActionButtons = (props: { state: PomodoroAppState }) => {
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

const PomodoroTimerAppBarIcon = (props: { state: PomodoroAppState }) => {
  const { state } = props

  const badgeContent = state.remainingSeconds !== PomodoroDurationSeconds ? state.remainingTimeText : null

  const handleClick = useScrollIntoView("pomodoroTimerAppWidget")

  return (
    <AppBarIconPortal appIconId={"pomodoro-timer"} order={800}>
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