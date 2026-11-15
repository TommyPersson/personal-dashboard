import { PlayArrowOutlined } from "@mui/icons-material"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const RunItemActionCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["runDeck", "runItemAction"],
    mutationFn: async (args: { itemId: string }) => {
      await apiClient.post(`/api/apps/run-deck/items/${args.itemId}/actions/run`, args)
    },
  },
  label: "Run",
  icon: PlayArrowOutlined,
  errorTitle: "Unable to run the item",
})
