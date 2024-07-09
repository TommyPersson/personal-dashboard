import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const MarkAllNotificationsAsRead: ActionType<void, void> = {
  key: "github/markAllNotificationsAsRead",
  action: async () => {
    await apiClient.post(`/api/apps/github/notifications/actions/mark-all-as-read`, {})
  },
}
