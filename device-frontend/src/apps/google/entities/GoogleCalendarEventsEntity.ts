import { GoogleCalendarEvent } from "@src/apps/google/models/GoogleCalendarEvent.ts"
import { EntityType } from "@src/infrastructure/framework/entities"
import { DateTime } from "luxon"

export const GoogleCalendarEventsEntity: (min: DateTime, max: DateTime) => EntityType<GoogleCalendarEvent[]> = (min: DateTime<true>, max: DateTime<true>) => ({
  key: "google/calendarEventsEntity",
  fetchUrl: `/api/apps/google/calendar/events?minTime=${encodeURIComponent(min.toISO())}&maxTime=${encodeURIComponent(max.toISO())}`,
  transform: transform,
})

function transform(payload: any): GoogleCalendarEvent[] {
  return payload.events.map((it: any) => ({
    ...it,
    startTime: DateTime.fromISO(it.startTime), // TODO use zod?
    endTime: DateTime.fromISO(it.endTime),
  }))
}
