import { NotificationSchema } from "@src/apps/notifications/models/Notification.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

export const NotificationsQueryKey = ["notifications"] as const

const NotificationsResponseSchema = z.object({
  items: z.array(NotificationSchema),
})

export const NotificationsQuery = queryOptions({
  queryKey: NotificationsQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/notifications")
    return NotificationsResponseSchema.parse(dto).items
  },
})
