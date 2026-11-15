import { refreshStatusSoon } from "@src/apps/media-control/mutations/refreshStatusSoon.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const SkipNextMutation = mutationOptions({
  mutationKey: ["mediaControl", "skipNext"],
  mutationFn: async () => {
    await apiClient.post(`/api/apps/media-control/actions/skip-next`, {})
  },
  onSettled: refreshStatusSoon,
})
