import { Stack, Typography } from "@mui/material"
import { useClockAppState } from "@src/apps/clock/state/ClockAppState.ts"
import { formatDate, formatDay, formatTime, formatWeek } from "@src/apps/clock/utils/clockUtils.ts"
import React, { useMemo } from "react"

import classes from "./ClockAppBarWidget.module.scss"

export const ClockAppBarWidget = React.memo(() => {
  const state = useClockAppState()

  const timeText = useMemo(() => formatTime(state.time), [state.time.minute])
  const dayText = useMemo(() => formatDay(state.time), [state.time.day])
  const dateText = useMemo(() => formatDate(state.time), [state.time.day])
  const weekText = useMemo(() => formatWeek(state.time), [state.time.day])

  return (
    <Stack className={classes.ClockAppBarWidget}>
      <Typography variant={"subtitle2"}>{timeText}</Typography>
      <Typography variant={"caption"}>{dayText}</Typography>
      <Typography variant={"caption"}>{dateText}</Typography>
      <Typography variant={"caption"}>w. {weekText}</Typography>
    </Stack>
  )
})
