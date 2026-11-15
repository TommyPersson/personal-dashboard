import { OpenInNewOutlined } from "@mui/icons-material"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const OpenClaudeSessionOnWorkstationCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["claude-code", "openSessionOnWorkstation"],
    mutationFn: async (args: { sessionId: string }) => {
      await apiClient.post(`/api/apps/claude/sessions/${encodeURIComponent(args.sessionId)}/actions/open-on-workstation`, {})
    },
  },
  label: "Open session on the PC",
  icon: OpenInNewOutlined,
  errorTitle: "Unable to open the session on the PC",
})
