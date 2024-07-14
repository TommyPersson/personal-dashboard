import { CurrentTimeEntity } from "@src/apps/clock/entities/CurrentTimeEntity.ts"
import { GoogleCalendarEventsEntity } from "@src/apps/google/entities/GoogleCalendarEventsEntity.ts"
import { GoogleCalendarEvent } from "@src/apps/google/models/GoogleCalendarEvent.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { OperationError } from "@src/infrastructure/framework/errors"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"

export type GoogleCalendarAppState = {
  events: GoogleCalendarEvent[]
  currentTime: Date,
  error: OperationError | null
  refresh: () => void
}

export function useGoogleCalendarState(): GoogleCalendarAppState {
  const entity = useEntity(GoogleCalendarEventsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const { value: currentTime } = useEntity(CurrentTimeEntity)

  return useDeepEqualMemo(() => ({
    events: entity.value ?? EmptyArray,
    currentTime: currentTime ?? new Date(),
    error: entity.error as OperationError,
    refresh: entity.fetchAsync,
  }), [entity.value, currentTime, entity.error, entity.fetchAsync])
}