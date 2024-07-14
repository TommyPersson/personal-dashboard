import { Card, CardContent, Stack, Typography } from "@mui/material"
import { GoogleCalendarEvent } from "@src/apps/google/models/GoogleCalendarEvent.ts"
import { GoogleCalendarAppState } from "@src/apps/google/state/GoogleCalendarAppState.ts"
import { LockScreenWidgetPortal } from "@src/common/components/LockScreenWidgetPortal/LockScreenIconPortal.tsx"
import React from "react"

import classes from "./GoogleCalendarLockScreenWidget.module.scss"
import { DateTime } from "luxon"

export const GoogleCalendarLockScreenWidget = (props: { state: GoogleCalendarAppState }) => {
  const { state } = props

  return (
    <LockScreenWidgetPortal id={"google-calendar-lock-screen-widget"} column={2} order={100}>
      <UpcomingEventsView state={state} />
    </LockScreenWidgetPortal>
  )
}

const UpcomingEventsView = (props: { state: GoogleCalendarAppState }) => {
  const { state } = props

  const eventsByDate = Object.groupBy(state.events, it => it.startTime.toISODate())
  const eventsByDateArray = Object.entries(eventsByDate).sort(([a], [b]) => a.localeCompare(b))

  return (
    <Stack direction={"column"} className={classes.UpcomingEventsView}>
      <Typography variant={"h4"} children={"Upcoming events"} />
      <div className={classes.EventSections}>
        {eventsByDateArray.map(([date, events]) => (
          <EventSection key={date} date={date} events={events ?? []} />
        ))}
      </div>
    </Stack>
  )
}

const EventSection = (props: { date: string, events: GoogleCalendarEvent[] }) => {
  const { events } = props

  const date = DateTime.fromISO(props.date)
  const title = date.toFormat("EEEE, MM-dd")

  return (
    <Stack className={classes.EventSection}>
      <Typography variant={"caption"} children={title} />
      {events.map(it => <EventCard key={it.id} event={it} />)}
    </Stack>
  )
}

const EventCard = (props: { event: GoogleCalendarEvent }) => {
  const { event } = props

  const startTimeText = event.startTime.toFormat("HH:mm")
  const endTimeText = event.endTime.toFormat("HH:mm")
  const timeText = `${startTimeText} — ${endTimeText}`

  return (
    <Card className={classes.EventCard}>
      <CardContent>
        <Typography variant={"body1"} children={event.summary} className={classes.EventSummaryText} />
        <Typography variant={"body2"} children={timeText} className={classes.EventTimeText} />
      </CardContent>
    </Card>
  )
}