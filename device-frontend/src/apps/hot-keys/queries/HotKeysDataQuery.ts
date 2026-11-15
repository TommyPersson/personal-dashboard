import { HotKeysDataSchema } from "@src/apps/hot-keys/models/HotKeysData.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"

export const HotKeysDataQueryKey = ["hotKeys", "data"] as const

export const HotKeysDataQuery = queryOptions({
  queryKey: HotKeysDataQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/hot-keys/data")
    return HotKeysDataSchema.parse(dto)
  },
})
