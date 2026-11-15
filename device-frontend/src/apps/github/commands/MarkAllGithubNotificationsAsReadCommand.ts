import { MarkEmailReadOutlined } from "@mui/icons-material"
import { GithubNotificationsQueryKey } from "@src/apps/github/queries/GithubNotificationsQuery.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const MarkAllGithubNotificationsAsReadCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["github", "markAllNotificationsAsRead"],
    mutationFn: async () => {
      await apiClient.post(`/api/apps/github/notifications/actions/mark-all-as-read`, {})
    },
    onSettled: (_data, _error, _args, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: GithubNotificationsQueryKey }),
  },
  label: "Mark all as read",
  icon: MarkEmailReadOutlined,
  errorTitle: "Unable to mark the notifications as read",
})
