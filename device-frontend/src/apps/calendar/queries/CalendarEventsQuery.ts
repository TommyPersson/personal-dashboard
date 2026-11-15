import { CalendarEventSchema } from "@src/apps/calendar/models/CalendarEvent.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { keepPreviousData, queryOptions } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { z } from "zod"

export const CalendarEventsQueryKey = ["calendar", "events"] as const

const CalendarEventsResponseSchema = z.object({
  events: z.array(CalendarEventSchema),
})

export const CalendarEventsQuery = (minTime: DateTime, maxTime: DateTime) => {
  const searchParams = { minTime: minTime.toISO(), maxTime: maxTime.toISO() }

  return queryOptions({
    queryKey: [...CalendarEventsQueryKey, searchParams],
    queryFn: async () => {
      const dto = await apiClient.get<unknown>("/api/apps/calendar/events", searchParams)
      return CalendarEventsResponseSchema.parse(dto).events
    },
    // Keeps the old events on screen while the next day's range loads.
    placeholderData: keepPreviousData,
  })
}
