import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const OpenClaudeSessionOnWorkstation: ActionType<{ sessionId: string }, void> = {
  key: "claude-code/openSessionOnWorkstation",
  action: async (args) => {
    await apiClient.post(`/api/apps/claude/sessions/${encodeURIComponent(args.sessionId)}/actions/open-on-workstation`, {})
  },
}
