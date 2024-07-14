import { CurrentTimeEntity } from "@src/apps/clock/entities/CurrentTimeEntity.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { DateTime } from "luxon"


export type ClockAppState = {
  time: DateTime
}

export function useClockAppState(): ClockAppState {
  const entity = useEntity(CurrentTimeEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(entity.fetchAsync, 5000)

  const time = entity.value ?? DateTime.now()

  return useDeepEqualMemo(() => ({
    time: time,
  }), [time])
}