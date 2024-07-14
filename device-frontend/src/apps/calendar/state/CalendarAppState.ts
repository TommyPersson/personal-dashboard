import { CalendarEventsEntity } from "@src/apps/calendar/entities/CalendarEventsEntity.ts"
import { CalendarEvent } from "@src/apps/calendar/models/CalendarEvent.ts"
import { CurrentTimeEntity } from "@src/apps/clock/entities/CurrentTimeEntity.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { OperationError } from "@src/infrastructure/framework/errors"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { DateTime } from "luxon"

export type CalendarAppState = {
  events: CalendarEvent[]
  currentTime: DateTime
  error: OperationError | null
  refresh: () => void
}

export function useCalendarState(): CalendarAppState {
  const currentTimeEntity = useEntity(CurrentTimeEntity)

  const currentTime = currentTimeEntity.value ?? DateTime.now()
  const minTime = currentTime.startOf("day")
  const maxTime = currentTime.plus({ days: 14 }).endOf("day")

  const entity = useEntity(CalendarEventsEntity(minTime, maxTime), {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(entity.fetchAsync, 5 * 60 * 1000) // TODO allow luxon Duration?

  return useDeepEqualMemo(() => ({
    events: entity.value ?? EmptyArray,
    currentTime: currentTime,
    error: entity.error as OperationError,
    refresh: entity.fetchAsync,
  }), [entity.value, currentTime.valueOf(), entity.error, entity.fetchAsync])
}