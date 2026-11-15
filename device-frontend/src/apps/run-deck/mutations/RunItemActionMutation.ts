import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const RunItemActionMutation = mutationOptions({
  mutationKey: ["runDeck", "runItemAction"],
  mutationFn: async (args: { itemId: string }) => {
    await apiClient.post(`/api/apps/run-deck/items/${args.itemId}/actions/run`, args)
  },
})
