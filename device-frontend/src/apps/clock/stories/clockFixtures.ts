import { ClockAppState } from "@src/apps/clock/state/ClockAppState.ts"
import { DateTime } from "luxon"
import { http, HttpResponse } from "msw"

export const fixedTime = DateTime.fromISO("2026-11-13T09:41:00")

export function clockState(overrides: Partial<ClockAppState> = {}): ClockAppState {
  return {
    time: fixedTime,
    ...overrides,
  }
}

export const clockHandlers = [
  http.get("/api/apps/clock/current-time", () => HttpResponse.json({ currentTime: DateTime.now().toISO() })),
]
