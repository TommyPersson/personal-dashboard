import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

export const IsDeviceUnlockedQueryKey = ["shell", "isDeviceUnlocked"] as const

const IsDeviceUnlockedResponseSchema = z.object({
  isDeviceUnlocked: z.boolean(),
})

export const IsDeviceUnlockedQuery = queryOptions({
  queryKey: IsDeviceUnlockedQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/auth/is-device-unlocked")
    return IsDeviceUnlockedResponseSchema.parse(dto).isDeviceUnlocked
  },
  // A failure means the server is unreachable, which the shell shows right away rather than after retries.
  retry: false,
})
