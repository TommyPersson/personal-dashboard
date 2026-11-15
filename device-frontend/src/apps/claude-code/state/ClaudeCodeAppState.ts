import { ClaudeSessionRemovedMessage, ClaudeSessionUpdatedMessage } from "@src/apps/claude-code/messages/ClaudeSessionMessages.ts"
import { ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { DiscardAllClaudeSessionsMutation } from "@src/apps/claude-code/mutations/DiscardAllClaudeSessionsMutation.ts"
import { DiscardClaudeSessionMutation } from "@src/apps/claude-code/mutations/DiscardClaudeSessionMutation.ts"
import { OpenClaudeSessionOnWorkstationMutation } from "@src/apps/claude-code/mutations/OpenClaudeSessionOnWorkstationMutation.ts"
import { ClaudeSessionsQuery, ClaudeSessionsQueryKey } from "@src/apps/claude-code/queries/ClaudeSessionsQuery.ts"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"

export type ClaudeCodeAppState = {
  sessions: ClaudeSession[]
  sessionsRequiringInput: ClaudeSession[]
  error: Error | null
  discard: (session: ClaudeSession) => void
  discardAll: () => void
  openOnWorkstation: (session: ClaudeSession) => void
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

  const { mutate: discardSession } = useMutation(DiscardClaudeSessionMutation)
  const { mutate: discardAllSessions } = useMutation(DiscardAllClaudeSessionsMutation)
  const { mutate: openSessionOnWorkstation } = useMutation(OpenClaudeSessionOnWorkstationMutation)

  const discard = useCallback((session: ClaudeSession) => {
    discardSession({ sessionId: session.id })
  }, [discardSession])

  const discardAll = useCallback(() => {
    discardAllSessions()
  }, [discardAllSessions])

  const openOnWorkstation = useCallback((session: ClaudeSession) => {
    openSessionOnWorkstation({ sessionId: session.id })
  }, [openSessionOnWorkstation])

  const sessions: ClaudeSession[] = sessionsQuery.data ?? EmptyArray
  const sessionsRequiringInput = sessions.filter(it => it.status === "WaitingForInput")

  return useDeepEqualMemo(() => ({
    sessions,
    sessionsRequiringInput,
    error: sessionsQuery.error,
    discard,
    discardAll,
    openOnWorkstation,
  }), [sessions, sessionsRequiringInput, sessionsQuery.error, discard, discardAll, openOnWorkstation])
}
