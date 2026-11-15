import { ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"

export const ClaudeSessionsQueryKey = ["claude-code", "sessions"] as const

export const ClaudeSessionsQuery = queryOptions({
  queryKey: ClaudeSessionsQueryKey,
  queryFn: async () => {
    const payload = await apiClient.get<{ sessions: ClaudeSession[] }>("/api/apps/claude/sessions")
    return payload.sessions
  },
})
