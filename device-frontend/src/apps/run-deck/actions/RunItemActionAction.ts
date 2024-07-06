import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const RunItemActionAction: ActionType<{ itemId: string }, void> = {
  key: "runDeck/runItemActionAction",
  action: async (args) => {
    await apiClient.post(`/api/apps/run-deck/items/${args.itemId}/actions/run`, args)
  },
}
