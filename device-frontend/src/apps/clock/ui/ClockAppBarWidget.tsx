import { Stack, Typography } from "@mui/material"
import { useClockAppState } from "@src/apps/clock/state/ClockAppState.ts"
import React, { useMemo } from "react"

import classes from "./ClockAppBarWidget.module.scss"

export const ClockAppBarWidget = () => {
  const state = useClockAppState()

  const timeText = useMemo(() => formatTime(state.time), [state.time.getMinutes()])
  const dayText = useMemo(() => formatDay(state.time), [state.time.getDay()])
  const dateText = useMemo(() => formatDate(state.time), [state.time.getDay()])
  const weekText = useMemo(() => formatWeek(state.time), [state.time.getDay()])

  return (
    <Stack className={classes.ClockAppBarWidget}>
      <Typography variant={"subtitle2"}>{timeText}</Typography>
      <Typography variant={"caption"}>{dayText}</Typography>
      <Typography variant={"caption"}>{dateText}</Typography>
      <Typography variant={"caption"}>w. {weekText}</Typography>
    </Stack>
  )
}

function formatDay(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "long" })
}

function formatDate(date: Date): string {
  const day = date.toLocaleDateString("sv-SE", { day: "2-digit" })
  const month = date.toLocaleDateString("sv-SE", { month: "2-digit" })
  return `${month}-${day}`
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })
}

function formatWeek(date: Date): string {
  // https://www.epochconverter.com/weeknumbers
  const target  = new Date(date.valueOf());
  const dayNr   = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() != 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  const weekNumber = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000)
  return weekNumber.toString();
}