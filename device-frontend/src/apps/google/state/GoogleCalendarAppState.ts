import { GoogleCalendarEventsEntity } from "@src/apps/google/entities/GoogleCalendarEventsEntity.ts"
import { GoogleCalendarEvent } from "@src/apps/google/models/GoogleCalendarEvent.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { OperationError } from "@src/infrastructure/framework/errors"
import { EmptyArray } from "@src/infrastructure/utils"
import { useMemo } from "react"

export type GoogleCalendarAppState = {
  events: GoogleCalendarEvent[]
  error: OperationError | null
  refresh: () => void
}

export function useGoogleCalendarState(): GoogleCalendarAppState {
  const entity = useEntity(GoogleCalendarEventsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  return useMemo(() => ({
    events: entity.value ?? EmptyArray,
    error: entity.error as OperationError,
    refresh: entity.fetchAsync,
  }), [entity.value, entity.error, entity.fetchAsync])
}