import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const SkipNextAction: ActionType<void, void> = {
  key: "mediaControl/skipNextAction",
  action: async (args) => {
    await apiClient.post(`/api/apps/media-control/actions/skip-next`, {})
  }
}

