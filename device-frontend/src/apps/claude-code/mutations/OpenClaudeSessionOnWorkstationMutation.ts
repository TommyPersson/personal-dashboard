import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const OpenClaudeSessionOnWorkstationMutation = mutationOptions({
  mutationKey: ["claude-code", "openSessionOnWorkstation"],
  mutationFn: async (args: { sessionId: string }) => {
    await apiClient.post(`/api/apps/claude/sessions/${encodeURIComponent(args.sessionId)}/actions/open-on-workstation`, {})
  },
})
