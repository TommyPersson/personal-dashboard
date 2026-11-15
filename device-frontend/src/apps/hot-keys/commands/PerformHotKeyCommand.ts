import { KeyboardOutlined } from "@mui/icons-material"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const PerformHotKeyCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["hotKeys", "performHotKey"],
    mutationFn: async (args: { hotKeyId: string }) => {
      await apiClient.post(`/api/apps/hot-keys/${args.hotKeyId}/actions/perform`, {})
    },
  },
  label: "Perform hot key",
  icon: KeyboardOutlined,
  errorTitle: "Unable to perform the hot key",
})
