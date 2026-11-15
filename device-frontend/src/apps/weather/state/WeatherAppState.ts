import { WeatherData } from "@src/apps/weather/models/WeatherData.ts"
import { WeatherDataQuery } from "@src/apps/weather/queries/WeatherDataQuery.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery } from "@tanstack/react-query"
import { DateTime } from "luxon"
import { useCallback } from "react"

export type WeatherAppState = {
  data: WeatherData | null
  isLoading: boolean
  lastFetchedAt: DateTime | null
  refresh: () => void
}

export function useWeatherAppState(): WeatherAppState {
  const query = useQuery({
    ...WeatherDataQuery,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  })

  const { refetch } = query
  const refresh = useCallback(() => void refetch(), [refetch])

  const data = query.data ?? null
  const lastFetchedAt = query.dataUpdatedAt ? DateTime.fromMillis(query.dataUpdatedAt) : null

  return useDeepEqualMemo(() => ({
    data,
    // Also while refreshing, so the Refresh button shows that something happens.
    isLoading: query.isFetching,
    lastFetchedAt,
    refresh,
  }), [data, query.isFetching, query.dataUpdatedAt, refresh])
}
