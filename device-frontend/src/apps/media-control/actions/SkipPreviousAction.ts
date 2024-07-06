import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const SkipPreviousAction: ActionType<void, void> = {
  key: "mediaControl/skipPreviousAction",
  action: async (args) => {
    await apiClient.post(`/api/apps/media-control/actions/skip-previous`, {})
  },
}