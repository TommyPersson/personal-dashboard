import { CalendarEvent } from "@src/apps/calendar/models/CalendarEvent.ts"
import { EntityType } from "@src/infrastructure/framework/entities"
import { DateTime } from "luxon"

export const CalendarEventsEntity: (min: DateTime, max: DateTime) => EntityType<CalendarEvent[]> = (min: DateTime<true>, max: DateTime<true>) => ({
  key: "calendar/calendarEventsEntity",
  fetchUrl: `/api/apps/calendar/events?minTime=${encodeURIComponent(min.toISO())}&maxTime=${encodeURIComponent(max.toISO())}`,
  transform: transform,
})

function transform(payload: any): CalendarEvent[] {
  return payload.events.map((it: any) => ({
    ...it,
    startTime: DateTime.fromISO(it.startTime), // TODO use zod?
    endTime: DateTime.fromISO(it.endTime),
  }))
}
