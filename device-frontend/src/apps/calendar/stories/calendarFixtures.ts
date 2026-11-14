import { CalendarEvent } from "@src/apps/calendar/models/CalendarEvent.ts"
import { CalendarAppState } from "@src/apps/calendar/state/CalendarAppState.ts"
import { DateTime } from "luxon"
import { http, HttpResponse } from "msw"
import { fn } from "storybook/test"

const today = DateTime.now().startOf("day")

export const currentTime = today.set({ hour: 10, minute: 30 })

function event(id: string, summary: string, start: DateTime, durationMinutes: number): CalendarEvent {
  return {
    id,
    calendarName: "Work",
    summary,
    startTime: start as DateTime<true>,
    endTime: start.plus({ minutes: durationMinutes }) as DateTime<true>,
  }
}

export const calendarEvents: CalendarEvent[] = [
  event("1", "Morning stand-up", today.set({ hour: 9 }), 15),
  event("2", "Architecture review", today.set({ hour: 10 }), 60),
  event("3", "Lunch with the team", today.set({ hour: 12 }), 60),
  event("4", "1:1", today.set({ hour: 14, minute: 30 }), 30),
  event("5", "Release planning", today.set({ hour: 15, minute: 30 }), 90),
  event("6", "Dentist", today.plus({ days: 1 }).set({ hour: 8 }), 45),
  event("7", "Sprint demo", today.plus({ days: 2 }).set({ hour: 13 }), 60),
  event("8", "Retrospective", today.plus({ days: 2 }).set({ hour: 14, minute: 30 }), 60),
]

export function calendarState(overrides: Partial<CalendarAppState> = {}): CalendarAppState {
  return {
    events: calendarEvents,
    currentTime: currentTime,
    error: null,
    refresh: fn(),
    ...overrides,
  }
}

export const calendarHandlers = [
  http.get("/api/apps/calendar/events", () => HttpResponse.json({
    events: calendarEvents.map(it => ({
      ...it,
      startTime: it.startTime.toISO(),
      endTime: it.endTime.toISO(),
    })),
  })),
]
