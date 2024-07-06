import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const PauseOrPlayAction: ActionType<void, void> = {
  key: "mediaControl/pauseOrPlayAction",
  action: async () => {
    await apiClient.post(`/api/apps/media-control/actions/pause-or-play`, {})
  },
}