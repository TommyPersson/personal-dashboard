import { CalendarEvent } from "@src/apps/calendar/models/CalendarEvent.ts"
import { CalendarEventsQuery } from "@src/apps/calendar/queries/CalendarEventsQuery.ts"
import { CurrentTimeQuery } from "@src/apps/clock/queries/CurrentTimeQuery.ts"
import { OperationError } from "@src/infrastructure/framework/errors"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { useCallback } from "react"

export type CalendarAppState = {
  events: CalendarEvent[]
  currentTime: DateTime
  error: OperationError | null
  refresh: () => void
}

export function useCalendarState(): CalendarAppState {
  // Kept fresh by the clock app.
  const currentTimeQuery = useQuery(CurrentTimeQuery)

  const currentTime = currentTimeQuery.data ?? DateTime.now()
  const minTime = currentTime.startOf("day")
  const maxTime = currentTime.plus({ days: 14 }).endOf("day")

  const eventsQuery = useQuery({
    ...CalendarEventsQuery(minTime, maxTime),
    refetchInterval: 5_000,
  })

  const { refetch } = eventsQuery
  const refresh = useCallback(() => void refetch(), [refetch])

  return useDeepEqualMemo(() => ({
    events: eventsQuery.data ?? EmptyArray,
    currentTime: currentTime,
    error: eventsQuery.error as OperationError | null,
    refresh,
  }), [eventsQuery.data, currentTime.valueOf(), eventsQuery.error, refresh])
}
