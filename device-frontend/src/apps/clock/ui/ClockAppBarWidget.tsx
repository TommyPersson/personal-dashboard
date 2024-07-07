import { Stack, Typography } from "@mui/material"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import React, { useCallback, useMemo, useState } from "react"

import classes from "./ClockAppBarWidget.module.scss"

export const ClockAppBarWidget = () => {

  const [time, setTime] = useState(new Date())

  const refreshTime = useCallback(() => {
    setTime(new Date())
  }, [])

  useInterval(refreshTime, 5000)

  const timeText = useMemo(() => formatTime(time), [time.getMinutes()])
  const dayText = useMemo(() => formatDay(time), [time.getDay()])
  const dateText = useMemo(() => formatDate(time), [time.getDay()])
  const weekText = useMemo(() => formatWeek(time), [time.getDay()])

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
  // TODO test this more thoroughly
  const firstDay = new Date(date.getFullYear(), 0, 4)
  return Math.floor((((date.valueOf() - firstDay.valueOf()) / 86400000) + firstDay.getDay() + 1) / 7).toString()
}