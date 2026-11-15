import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const PerformHotKeyMutation = mutationOptions({
  mutationKey: ["hotKeys", "performHotKey"],
  mutationFn: async (args: { hotKeyId: string }) => {
    await apiClient.post(`/api/apps/hot-keys/${args.hotKeyId}/actions/perform`, {})
  },
})
