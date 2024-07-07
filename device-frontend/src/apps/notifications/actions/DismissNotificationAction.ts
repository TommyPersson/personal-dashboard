import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const DismissNotificationAction: ActionType<{ notificationId: string }, void> = {
  key: "notifications/dismissNotificationAction",
  action: async (args) => {
    await apiClient.post(`/api/notifications/${args.notificationId}/actions/dismiss`, {})
  },
}