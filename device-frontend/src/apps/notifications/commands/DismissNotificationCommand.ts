import { Close } from "@mui/icons-material"
import { NotificationsQueryKey } from "@src/apps/notifications/queries/NotificationsQuery.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const DismissNotificationCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["notifications", "dismiss"],
    mutationFn: async (args: { notificationId: string }) => {
      await dismissNotification(args.notificationId)
    },
    onSettled: (_data, _error, _args, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: NotificationsQueryKey }),
  },
  label: "Dismiss",
  icon: Close,
  errorTitle: "Unable to dismiss the notification",
})

/** There is no endpoint for dismissing them all, so each notification is dismissed on its own. */
export const ClearNotificationsCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["notifications", "clear"],
    mutationFn: async (args: { notificationIds: string[] }) => {
      await Promise.all(args.notificationIds.map(dismissNotification))
    },
    onSettled: (_data, _error, _args, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: NotificationsQueryKey }),
  },
  label: "Clear",
  icon: Close,
  errorTitle: "Unable to clear the notifications",
  canExecute: (args) => args.notificationIds.length > 0,
})

async function dismissNotification(notificationId: string) {
  await apiClient.post(`/api/notifications/${notificationId}/actions/dismiss`, {})
}
