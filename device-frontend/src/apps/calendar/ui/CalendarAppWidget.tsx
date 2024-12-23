import { CalendarTodayOutlined, RefreshOutlined } from "@mui/icons-material"
import { Button, Card, CardContent, Paper, Stack, Typography } from "@mui/material"
import { CalendarEvent } from "@src/apps/calendar/models/CalendarEvent.ts"
import { CalendarAppState } from "@src/apps/calendar/state/CalendarAppState.ts"
import { AppWidget, AppWidgetHeader } from "@src/common/components/AppWidget/AppWidget.tsx"
import { getDecimalHours, getStartOfMinute } from "@src/infrastructure/utils/dates.ts"
import classNames from "classnames"
import { DateTime } from "luxon"
import React from "react"
import { useMeasure } from "react-use"

import classes from "./CalendarAppWidget.module.scss"

export const CalendarAppWidget = React.memo((props: { state: CalendarAppState }) => {
  const { state } = props

  const todayDate = state.currentTime.toISODate()
  const events = state.events.filter(it => it.startTime.toISODate() === todayDate || it.endTime.toISODate() === todayDate)

  return (
    <AppWidget className={classes.CalendarAppWidget}>
      <Stack spacing={2} flex={1}>
        <AppWidgetHeader
          icon={<CalendarTodayOutlined />}
          title={"Calendar"}
          rightContent={<Button startIcon={<RefreshOutlined />} children={"Refresh"} onClick={state.refresh} />}
        />
        {state.error && <strong>Not authenticated</strong>}
        <Paper style={{ flex: 1, display: "flex", position: "relative" }}>
          <CalendarView events={events} currentTime={state.currentTime} />
        </Paper>
      </Stack>
    </AppWidget>
  )
})

const CalendarView = (props: { events: CalendarEvent[], currentTime: DateTime }) => {
  const { events, currentTime } = props

  const [measureRef, measure] = useMeasure<HTMLDivElement>()

  const cellHeight = measure.height / 24

  const startOfDay = currentTime.startOf("day")

  return (
    <div className={classes.CalendarView} ref={measureRef}>
      <PassedTimeShade currentTime={currentTime} startOfDay={startOfDay} cellHeight={cellHeight} />
      <HourDividers cellHeight={cellHeight} />
      <CurrentTimeMarker currentTime={currentTime} startOfDay={startOfDay} cellHeight={cellHeight} />
      <EventCards events={events} currentTime={currentTime} startOfDay={startOfDay} cellHeight={cellHeight} />
    </div>
  )
}

const PassedTimeShade = (props: { currentTime: DateTime, startOfDay: DateTime, cellHeight: number }) => {
  const { currentTime, startOfDay, cellHeight } = props

  const now = getStartOfMinute(currentTime)
  const nowHour = getDecimalHours(now.valueOf() - startOfDay.valueOf())

  return (
    <div
      className={classes.PassedTimeShade}
      style={{ bottom: (24 - nowHour) * cellHeight }}
    />
  )
}

const CurrentTimeMarker = (props: { currentTime: DateTime, startOfDay: DateTime, cellHeight: number }) => {
  const { currentTime, startOfDay, cellHeight } = props

  const now = getStartOfMinute(currentTime)
  const nowHour = getDecimalHours(now.valueOf() - startOfDay.valueOf())

  return (
    <div
      className={classes.CurrentTimeMarker}
      style={{ top: nowHour * cellHeight - 1 }}
    />
  )
}

const AllHours = new Array(24).fill(0).map((_, i) => i)

const HourDividers = React.memo((props: { cellHeight: number }) => {
  const { cellHeight } = props
  return <div>{AllHours.map(i => <HourDivider key={i} hour={i} offsetY={i * cellHeight} />)}</div>
})

const HourDivider = (props: { hour: number, offsetY: number }) => {
  return (
    <div className={classes.HourCell} style={{ top: props.offsetY }}>
      <Typography
        variant={"caption"}
        children={`${props.hour.toString().padStart(2, "0")}:00`}
      />
    </div>
  )
}

const EventCards = (props: {
  events: CalendarEvent[],
  currentTime: DateTime,
  startOfDay: DateTime,
  cellHeight: number
}) => {
  const { events, currentTime, startOfDay, cellHeight } = props
  return events.map((it, i) => (
    <EventCard
      key={it.id}
      event={it}
      cellHeight={cellHeight}
      startOfDay={startOfDay}
      currentTime={currentTime}
    />),
  )
}

const EventCard = (props: {
  event: CalendarEvent,
  cellHeight: number,
  currentTime: DateTime,
  startOfDay: DateTime
}) => {
  const { event, cellHeight, currentTime, startOfDay } = props

  const startTime = getStartOfMinute(event.startTime)
  const endTime = getStartOfMinute(event.endTime)
  const startTimeHour = getDecimalHours(startTime.valueOf() - startOfDay.valueOf())
  const endTimeHour = getDecimalHours(endTime.valueOf() - startOfDay.valueOf())

  const durationHours = endTimeHour - startTimeHour

  const offsetY = startTimeHour * cellHeight + 1
  const height = Math.max(24, durationHours * cellHeight)

  const isInTheFuture = currentTime < startTime
  const isInProgress = currentTime >= startTime && currentTime <= endTime
  const isInThePast = currentTime > endTime

  const className = classNames(classes.EventCard, {
    [classes.IsInTheFuture]: isInTheFuture,
    [classes.IsInProgress]: isInProgress,
    [classes.IsInThePast]: isInThePast,
  })

  return (
    <Card
      className={className}
      style={{
        top: offsetY,
        minHeight: height,
      }}>
      <CardContent style={{ padding: 4 }}>
        <Typography variant={"body2"}>{event.summary}</Typography>
      </CardContent>
    </Card>
  )
}