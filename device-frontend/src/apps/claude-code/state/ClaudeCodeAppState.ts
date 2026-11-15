import { ClaudeSessionRemovedMessage, ClaudeSessionUpdatedMessage } from "@src/apps/claude-code/messages/ClaudeSessionMessages.ts"
import { ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { ClaudeSessionsQuery, ClaudeSessionsQueryKey } from "@src/apps/claude-code/queries/ClaudeSessionsQuery.ts"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

/** The app's actions are commands (`commands/`), bound directly by the widgets. */
export type ClaudeCodeAppState = {
  sessions: ClaudeSession[]
  sessionsRequiringInput: ClaudeSession[]
  error: Error | null
}

export function useClaudeCodeAppState(): ClaudeCodeAppState {
  const queryClient = useQueryClient()

  // Updates arrive over the websocket; the interval only catches up after the websocket has reconnected.
  const sessionsQuery = useQuery({
    ...ClaudeSessionsQuery,
    refetchInterval: 60_000,
  })

  const invalidateSessions = useCallback(() => {
    return queryClient.invalidateQueries({ queryKey: ClaudeSessionsQueryKey })
  }, [queryClient])

  useMessageListener(ClaudeSessionUpdatedMessage, invalidateSessions)
  useMessageListener(ClaudeSessionRemovedMessage, invalidateSessions)

  const sessions: ClaudeSession[] = sessionsQuery.data ?? EmptyArray
  const sessionsRequiringInput = sessions.filter(it => it.status === "WaitingForInput")

  return useDeepEqualMemo(() => ({
    sessions,
    sessionsRequiringInput,
    error: sessionsQuery.error,
  }), [sessions, sessionsRequiringInput, sessionsQuery.error])
}
