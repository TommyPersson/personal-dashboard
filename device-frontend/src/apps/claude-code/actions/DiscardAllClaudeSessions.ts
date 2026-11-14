import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { ActionType } from "@src/infrastructure/framework/entities/useAction.tsx"

export const DiscardAllClaudeSessions: ActionType<void, void> = {
  key: "claude-code/discardAllSessions",
  action: async () => {
    await apiClient.post(`/api/apps/claude/sessions/actions/discard-all`, {})
  },
}
