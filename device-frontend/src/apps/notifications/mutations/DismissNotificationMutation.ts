import { NotificationsQueryKey } from "@src/apps/notifications/queries/NotificationsQuery.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const DismissNotificationMutation = mutationOptions({
  mutationKey: ["notifications", "dismiss"],
  mutationFn: async (args: { notificationId: string }) => {
    await apiClient.post(`/api/notifications/${args.notificationId}/actions/dismiss`, {})
  },
  onSettled: (_data, _error, _args, _onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: NotificationsQueryKey }),
})
