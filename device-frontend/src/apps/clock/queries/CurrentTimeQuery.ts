import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { zx } from "@src/infrastructure/framework/schemas/zx.ts"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

export const CurrentTimeQueryKey = ["clock", "currentTime"] as const

export const CurrentTimeResponseSchema = z.object({
  currentTime: zx.dateTime(),
})

export type CurrentTimeResponseDTO = z.input<typeof CurrentTimeResponseSchema>

/** The backend's clock, which the device follows rather than its own. */
export const CurrentTimeQuery = queryOptions({
  queryKey: CurrentTimeQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/clock/current-time")
    return CurrentTimeResponseSchema.parse(dto).currentTime
  },
})
