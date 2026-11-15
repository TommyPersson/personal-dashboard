import { ClaudeSessionSchema } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { queryOptions } from "@tanstack/react-query"
import { z } from "zod"

export const ClaudeSessionsQueryKey = ["claude-code", "sessions"] as const

const ClaudeSessionsResponseSchema = z.object({
  sessions: z.array(ClaudeSessionSchema),
})

export const ClaudeSessionsQuery = queryOptions({
  queryKey: ClaudeSessionsQueryKey,
  queryFn: async () => {
    const dto = await apiClient.get<unknown>("/api/apps/claude/sessions")
    return ClaudeSessionsResponseSchema.parse(dto).sessions
  },
})
