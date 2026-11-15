import { SkipPreviousOutlined } from "@mui/icons-material"
import { refreshStatusSoon } from "@src/apps/media-control/commands/refreshStatusSoon.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const SkipPreviousCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["mediaControl", "skipPrevious"],
    mutationFn: async () => {
      await apiClient.post(`/api/apps/media-control/actions/skip-previous`, {})
    },
    onSettled: refreshStatusSoon,
  },
  label: "Previous",
  icon: SkipPreviousOutlined,
  errorTitle: "Unable to skip to the previous track",
})
