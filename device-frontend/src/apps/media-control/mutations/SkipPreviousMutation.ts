import { refreshStatusSoon } from "@src/apps/media-control/mutations/refreshStatusSoon.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const SkipPreviousMutation = mutationOptions({
  mutationKey: ["mediaControl", "skipPrevious"],
  mutationFn: async () => {
    await apiClient.post(`/api/apps/media-control/actions/skip-previous`, {})
  },
  onSettled: refreshStatusSoon,
})
