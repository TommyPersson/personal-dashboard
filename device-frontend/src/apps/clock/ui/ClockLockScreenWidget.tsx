import { Stack, Typography } from "@mui/material"
import { ClockAppState } from "@src/apps/clock/state/ClockAppState.ts"
import { formatDate, formatDay, formatTime, formatWeek } from "@src/apps/clock/utils/clockUtils.ts"
import { LockScreenWidgetPortal } from "@src/common/components/LockScreenWidgetPortal/LockScreenIconPortal.tsx"
import { useMemo } from "react"

import classes from "./ClockLockScreenWidget.module.scss"

export const ClockLockScreenWidget = (props: { state: ClockAppState }) => {
  const { state } = props

  const timeText = useMemo(() => formatTime(state.time), [state.time.getMinutes()])
  const dayText = useMemo(() => formatDay(state.time), [state.time.getDay()])
  const dateText = useMemo(() => formatDate(state.time), [state.time.getDay()])
  const weekText = useMemo(() => formatWeek(state.time), [state.time.getDay()])

  return (
    <LockScreenWidgetPortal id={"clock-lock-screen-widget"} order={0}>
      <Stack direction={"row"} className={classes.ClockLockScreenWidget}>
        <Typography variant={"h1"} children={timeText} />
        <Stack>
          <Typography variant={"h4"} children={`${dayText}, ${dateText}`} />
          <Typography variant={"h6"} children={`Week ${weekText}`} />
        </Stack>
      </Stack>
    </LockScreenWidgetPortal>
  )
}