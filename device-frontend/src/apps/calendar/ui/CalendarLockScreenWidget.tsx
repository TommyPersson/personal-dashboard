import { Card, CardContent, Stack, Typography } from "@mui/material"
import { CalendarEvent } from "@src/apps/calendar/models/CalendarEvent.ts"
import { CalendarAppState } from "@src/apps/calendar/state/CalendarAppState.ts"
import { LockScreenWidgetPortal } from "@src/common/components/LockScreenWidgetPortal/LockScreenIconPortal.tsx"
import classNames from "classnames"
import { DateTime } from "luxon"
import React from "react"

import classes from "./CalendarLockScreenWidget.module.scss"

export const CalendarLockScreenWidget = (props: { state: CalendarAppState }) => {
  const { state } = props

  return (
    <LockScreenWidgetPortal id={"calendar-lock-screen-widget"} column={2} order={100}>
      <UpcomingEventsView state={state} />
    </LockScreenWidgetPortal>
  )
}

const UpcomingEventsView = (props: { state: CalendarAppState }) => {
  const { state } = props

  const eventsByDate = Object.groupBy(state.events, it => it.startTime.toISODate())
  const eventsByDateArray = Object.entries(eventsByDate).sort(([a], [b]) => a.localeCompare(b))

  return (
    <Stack direction={"column"} className={classes.UpcomingEventsView}>
      <Typography variant={"h4"} children={"Upcoming events"} />
      <div className={classes.EventSections}>
        {eventsByDateArray.length === 0 ? <Typography variant={"body1"} marginTop={2}><em>None</em></Typography> : null}
        {eventsByDateArray.map(([date, events]) => (
          <EventSection key={date} date={date} events={events ?? []} currentTime={state.currentTime} />
        ))}
      </div>
    </Stack>
  )
}

const EventSection = (props: { date: string, events: CalendarEvent[], currentTime: DateTime }) => {
  const { events, currentTime } = props

  const date = DateTime.fromISO(props.date)
  const title = date.toFormat("EEEE, MM-dd")

  return (
    <Stack className={classes.EventSection}>
      <Typography variant={"caption"} children={title} />
      {events.map(it => <EventCard key={it.id} event={it} currentTime={currentTime} />)}
    </Stack>
  )
}

const EventCard = (props: { event: CalendarEvent, currentTime: DateTime }) => {
  const { event, currentTime } = props

  const startTimeText = event.startTime.toFormat("HH:mm")
  const endTimeText = event.endTime.toFormat("HH:mm")
  const timeText = `${startTimeText} — ${endTimeText}`

  const isInTheFuture = currentTime < event.startTime
  const isInProgress = currentTime >= event.startTime && currentTime <= event.endTime
  const isInThePast = currentTime > event.endTime

  const className = classNames(classes.EventCard, {
    [classes.IsInTheFuture]: isInTheFuture,
    [classes.IsInProgress]: isInProgress,
    [classes.IsInThePast]: isInThePast,
  })

  return (
    <Card className={className}>
      <CardContent>
        <Typography variant={"body1"} children={event.summary} className={classes.EventSummaryText} />
        <Typography variant={"body2"} children={timeText} className={classes.EventTimeText} />
      </CardContent>
    </Card>
  )
}