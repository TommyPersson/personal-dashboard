import { GithubNotificationsQueryKey } from "@src/apps/github/queries/GithubNotificationsQuery.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const MarkAllGithubNotificationsAsReadMutation = mutationOptions({
  mutationKey: ["github", "markAllNotificationsAsRead"],
  mutationFn: async () => {
    await apiClient.post(`/api/apps/github/notifications/actions/mark-all-as-read`, {})
  },
  onSettled: (_data, _error, _args, _onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: GithubNotificationsQueryKey }),
})
