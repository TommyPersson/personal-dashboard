import { CurrentTimeEntity } from "@src/apps/clock/entities/CurrentTimeEntity.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"


export type ClockAppState = {
  time: Date
}

export function useClockAppState(): ClockAppState {
  const entity = useEntity(CurrentTimeEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(entity.fetchAsync, 5000)

  return {
    time: entity.value ?? new Date()
  }
}