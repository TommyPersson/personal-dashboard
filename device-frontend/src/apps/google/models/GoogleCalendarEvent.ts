import { DateTime } from "luxon"

export type GoogleCalendarEvent = {
  id: string
  calendarName: string
  summary: string
  startTime: DateTime<true>
  endTime: DateTime<true>
}