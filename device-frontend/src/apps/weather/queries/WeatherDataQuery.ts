import { WeatherDataSchema } from "@src/apps/weather/models/WeatherData.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"

export const WeatherDataQueryKey = ["weather", "data"] as const

export const WeatherDataQuery = queryOptions({
  queryKey: WeatherDataQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/weather/data")
    return WeatherDataSchema.parse(dto)
  },
})
