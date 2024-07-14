import { Stack, Typography } from "@mui/material"
import { ClockAppState } from "@src/apps/clock/state/ClockAppState.ts"
import { formatDate, formatDay, formatTime, formatWeek } from "@src/apps/clock/utils/clockUtils.ts"
import { LockScreenWidgetPortal } from "@src/common/components/LockScreenWidgetPortal/LockScreenIconPortal.tsx"
import React, { useMemo } from "react"

import classes from "./ClockLockScreenWidget.module.scss"

export const ClockLockScreenWidget = React.memo((props: { state: ClockAppState }) => {
  const { state } = props

  const timeText = useMemo(() => formatTime(state.time), [state.time.minute])
  const dayText = useMemo(() => formatDay(state.time), [state.time.day])
  const dateText = useMemo(() => formatDate(state.time), [state.time.day])
  const weekText = useMemo(() => formatWeek(state.time), [state.time.day])

  return (
    <LockScreenWidgetPortal id={"clock-lock-screen-widget"} column={1} order={0}>
      <Stack direction={"row"} className={classes.ClockLockScreenWidget}>
        <Typography variant={"h1"} children={timeText} />
        <Stack>
          <Typography variant={"h4"} children={`${dayText}, ${dateText}`} />
          <Typography variant={"h6"} children={`Week ${weekText}`} />
        </Stack>
      </Stack>
    </LockScreenWidgetPortal>
  )
})