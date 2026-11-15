import { CurrentTimeQuery } from "@src/apps/clock/queries/CurrentTimeQuery.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"


export type ClockAppState = {
  time: DateTime
}

export function useClockAppState(): ClockAppState {
  const query = useQuery({
    ...CurrentTimeQuery,
    refetchInterval: 5000,
  })

  const time = query.data ?? DateTime.now()

  return useDeepEqualMemo(() => ({
    time: time,
  }), [time])
}
