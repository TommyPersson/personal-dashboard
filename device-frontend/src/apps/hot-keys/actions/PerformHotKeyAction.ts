import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const PerformHotKeyAction: ActionType<{ hotKeyId: string }, void> = {
  key: "hotKeys/performHotKeyAction",
  action: async (args) => {
    await apiClient.post(`/api/apps/hot-keys/${args.hotKeyId}/actions/perform`, {})
  },
}
