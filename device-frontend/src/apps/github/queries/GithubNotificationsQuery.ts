import { GithubNotificationSchema } from "@src/apps/github/models/GithubNotification.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

export const GithubNotificationsQueryKey = ["github", "notifications"] as const

const GithubNotificationsResponseSchema = z.object({
  notifications: z.array(GithubNotificationSchema),
})

export const GithubNotificationsQuery = queryOptions({
  queryKey: GithubNotificationsQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/github/notifications")
    return GithubNotificationsResponseSchema.parse(dto).notifications
  },
})
