import { DateTime } from "luxon"

export type CalendarEvent = {
  id: string
  calendarName: string
  summary: string
  startTime: DateTime<true>
  endTime: DateTime<true>
}