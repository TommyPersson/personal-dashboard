import { RunDeckDataSchema } from "@src/apps/run-deck/models/RunDeckData.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"

export const RunDeckDataQueryKey = ["runDeck", "data"] as const

export const RunDeckDataQuery = queryOptions({
  queryKey: RunDeckDataQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/run-deck/data")
    return RunDeckDataSchema.parse(dto)
  },
})
