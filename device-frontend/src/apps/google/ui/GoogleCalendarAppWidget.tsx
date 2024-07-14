import { CalendarTodayOutlined, RefreshOutlined } from "@mui/icons-material"
import { Button, Card, CardContent, Divider, Paper, Stack, Typography } from "@mui/material"
import { GoogleCalendarEvent } from "@src/apps/google/models/GoogleCalendarEvent.ts"
import { GoogleCalendarAppState } from "@src/apps/google/state/GoogleCalendarAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import React from "react"
import { useMeasure } from "react-use"

import classes from "./GoogleCalendarAppWidget.module.scss"

export const GoogleCalendarAppWidget = React.memo((props: { state: GoogleCalendarAppState }) => {
  const { state } = props
  return (
    <AppWidget className={classes.GoogleCalendarAppWidget}>
      <Stack spacing={2} flex={1}>
        <AppWidgetHeader
          icon={<CalendarTodayOutlined />}
          title={"Google Calendar"}
          rightContent={<Button startIcon={<RefreshOutlined />} children={"Refresh"} onClick={state.refresh} />}
        />
        {state.error && <strong>Not authenticated</strong>}
        <Paper style={{ flex: 1, display: "flex", position: "relative" }}>
          <CalendarView events={state.events} currentTime={state.currentTime} />
        </Paper>
      </Stack>
    </AppWidget>
  )
})

const AllHours = new Array(24).fill(0).map((_, i) => i)

const CalendarView = (props: { events: GoogleCalendarEvent[], currentTime: Date }) => {
  const { events, currentTime } = props

  const [measureRef, measure] = useMeasure<HTMLDivElement>()

  const cellHeight = measure.height / 24

  const startOfDay = new Date()
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)
  startOfDay.setMilliseconds(0)

  const now = currentTime
  now.setSeconds(0)
  now.setMilliseconds(0)
  const nowHour = getDecimalHours(now.valueOf() - startOfDay.valueOf())
  console.log(nowHour, nowHour * cellHeight)

  return (
    <div ref={measureRef} style={{ flex: 1, display: "flex", position: "relative" }}>
      {AllHours.map(i => <HourDivider key={i} hour={i} offsetY={i * cellHeight} />)}
      {events.map((it, i) => <EventBox event={it} cellHeight={cellHeight} />)}
      <div style={{
        position: "absolute",
        top: nowHour * cellHeight - 1,
        left: 0,
        right: 0,
        height: 2,
        background: "red",
      }} />
    </div>
  )
}

const HourDivider = (props: { hour: number, offsetY: number }) => {
  return <>
    {props.hour != 0 && <Divider style={{ position: "absolute", top: props.offsetY, left: 0, right: 0, height: 1 }} />}
    <Typography
      variant={"caption"}
      style={{
        position: "absolute",
        top: props.offsetY,
        left: 2,
      }}
    >
      {`${props.hour.toString().padStart(2, "0")}:00`}
    </Typography>
  </>
}

const EventBox = (props: {
  event: GoogleCalendarEvent,
  cellHeight: number,
}) => {
  const { event, cellHeight } = props

  const startOfDay = new Date()
  startOfDay.setHours(0)
  startOfDay.setMinutes(0)
  startOfDay.setSeconds(0)
  startOfDay.setMilliseconds(0)
  const startTime = new Date(event.startTime)
  startTime.setSeconds(0)
  startTime.setMilliseconds(0)
  const endTime = new Date(event.endTime)
  endTime.setSeconds(0)
  endTime.setMilliseconds(0)
  const startTimeHour = getDecimalHours(startTime.valueOf() - startOfDay.valueOf())
  const endTimeHour = getDecimalHours(endTime.valueOf() - endTime.valueOf())

  const durationHours = endTimeHour - startTimeHour

  const offsetY = startTimeHour * cellHeight + 1
  const height = Math.max(24, durationHours * cellHeight)

  return (
    <Card style={{
      position: "absolute",
      top: offsetY,
      left: 50,
      right: 16,
      border: "1px solid white",
      minHeight: height,
    }}>
      <CardContent style={{ padding: 4 }}>
        <Typography variant={"body2"}>{event.summary}</Typography>
      </CardContent>
    </Card>
  )
}

function getDecimalHours(time: Date | number): number {
  return time.valueOf() / (60 * 60 * 1_000)
}