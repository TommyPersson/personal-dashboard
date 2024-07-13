import { GoogleCalendarEvent } from "@src/apps/google/models/GoogleCalendarEvent.ts"
import { EntityType } from "@src/infrastructure/framework/entities"

export const GoogleCalendarEventsEntity : EntityType<GoogleCalendarEvent[]> = {
  key: "google/calendarEventsEntity",
  fetchUrl: "/api/apps/google/calendar/events",
  transform: payload => payload.events
}
