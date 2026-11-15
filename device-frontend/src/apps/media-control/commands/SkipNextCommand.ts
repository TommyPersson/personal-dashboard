import { SkipNextOutlined } from "@mui/icons-material"
import { refreshStatusSoon } from "@src/apps/media-control/commands/refreshStatusSoon.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const SkipNextCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["mediaControl", "skipNext"],
    mutationFn: async () => {
      await apiClient.post(`/api/apps/media-control/actions/skip-next`, {})
    },
    onSettled: refreshStatusSoon,
  },
  label: "Next",
  icon: SkipNextOutlined,
  errorTitle: "Unable to skip to the next track",
})
