import { CurrentTimeEntity } from "@src/apps/clock/entities/CurrentTimeEntity.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useMemo } from "react"


export type ClockAppState = {
  time: Date
}

export function useClockAppState(): ClockAppState {
  const entity = useEntity(CurrentTimeEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(entity.fetchAsync, 5000)

  const time = entity.value ?? new Date()

  return useDeepEqualMemo(() => ({
    time: time,
  }), [time])
}