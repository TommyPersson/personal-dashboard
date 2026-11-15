import { refreshStatusSoon } from "@src/apps/media-control/mutations/refreshStatusSoon.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const PauseOrPlayMutation = mutationOptions({
  mutationKey: ["mediaControl", "pauseOrPlay"],
  mutationFn: async () => {
    await apiClient.post(`/api/apps/media-control/actions/pause-or-play`, {})
  },
  onSettled: refreshStatusSoon,
})
