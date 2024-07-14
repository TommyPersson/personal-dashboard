import { CurrentTimeEntity } from "@src/apps/clock/entities/CurrentTimeEntity.ts"
import { GoogleCalendarEventsEntity } from "@src/apps/google/entities/GoogleCalendarEventsEntity.ts"
import { GoogleCalendarEvent } from "@src/apps/google/models/GoogleCalendarEvent.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { OperationError } from "@src/infrastructure/framework/errors"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { DateTime } from "luxon"

export type GoogleCalendarAppState = {
  events: GoogleCalendarEvent[]
  currentTime: DateTime
  error: OperationError | null
  refresh: () => void
}

export function useGoogleCalendarState(): GoogleCalendarAppState {
  const currentTimeEntity = useEntity(CurrentTimeEntity)

  const currentTime = currentTimeEntity.value ?? DateTime.now()
  const minTime = currentTime.startOf("day")
  const maxTime = currentTime.plus({ days: 14 }).endOf("day")

  const entity = useEntity(GoogleCalendarEventsEntity(minTime, maxTime), {
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