import { PlayArrowOutlined } from "@mui/icons-material"
import { refreshStatusSoon } from "@src/apps/media-control/commands/refreshStatusSoon.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const PauseOrPlayCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["mediaControl", "pauseOrPlay"],
    mutationFn: async () => {
      await apiClient.post(`/api/apps/media-control/actions/pause-or-play`, {})
    },
    onSettled: refreshStatusSoon,
  },
  label: "Pause or play",
  icon: PlayArrowOutlined,
  errorTitle: "Unable to pause or play",
})
