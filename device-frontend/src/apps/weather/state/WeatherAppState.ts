import { WeatherDataEntity } from "@src/apps/weather/entities/WeatherDataEntity.ts"
import { WeatherData } from "@src/apps/weather/modes/WeatherData.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"

export type WeatherAppState = {
  data: WeatherData | null
  isLoading: boolean
  lastFetchedAt: Date | null
  refresh: () => void
}

export function useWeatherAppState(): WeatherAppState {
  const state = useEntity(WeatherDataEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  useInterval(state.fetchAsync, 5 * 60 * 1000) // 5 minutes

  return useDeepEqualMemo(() => ({
    data: state.value,
    isLoading: state.isLoading,
    lastFetchedAt: state.lastFetchedAt,
    refresh: state.fetchAsync,
  }), [state.value, state.isLoading, state.lastFetchedAt])
}