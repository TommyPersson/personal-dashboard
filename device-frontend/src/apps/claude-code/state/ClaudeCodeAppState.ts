import { DiscardAllClaudeSessions } from "@src/apps/claude-code/actions/DiscardAllClaudeSessions.ts"
import { DiscardClaudeSession } from "@src/apps/claude-code/actions/DiscardClaudeSession.ts"
import { ClaudeSessionsEntity } from "@src/apps/claude-code/entities/ClaudeSessionsEntity.ts"
import { ClaudeSessionRemovedMessage, ClaudeSessionUpdatedMessage } from "@src/apps/claude-code/messages/ClaudeSessionMessages.ts"
import { ClaudeSession } from "@src/apps/claude-code/models/ClaudeSession.ts"
import { useEntity } from "@src/infrastructure/framework/entities"
import { useAction } from "@src/infrastructure/framework/entities/useAction.tsx"
import { useInterval } from "@src/infrastructure/hooks/useInterval.ts"
import { useMessageListener } from "@src/infrastructure/hooks/useMessageListener.tsx"
import { EmptyArray } from "@src/infrastructure/utils"
import { useDeepEqualMemo } from "@src/infrastructure/utils/hooks.ts"
import { useCallback } from "react"

export type ClaudeCodeAppState = {
  sessions: ClaudeSession[]
  /** Sessions that are blocked on the user. */
  waitingSessions: ClaudeSession[]
  error: Error | null
  discard: (session: ClaudeSession) => void
  discardAll: () => void
}

export function useClaudeCodeAppState(): ClaudeCodeAppState {
  const entity = useEntity(ClaudeSessionsEntity, {
    fetchOnMount: true,
    clearOnFetch: false,
  })

  const { fetchAsync } = entity
  const { execute: executeDiscard } = useAction(DiscardClaudeSession)

  const discard = useCallback(async (session: ClaudeSession) => {
    await executeDiscard({ sessionId: session.id })
    fetchAsync()
  }, [executeDiscard, fetchAsync])

  const { execute: executeDiscardAll } = useAction(DiscardAllClaudeSessions)

  const discardAll = useCallback(async () => {
    await executeDiscardAll()
    fetchAsync()
  }, [executeDiscardAll, fetchAsync])

  // Updates arrive over the websocket; the interval only catches up after the websocket has reconnected.
  useMessageListener(ClaudeSessionUpdatedMessage, fetchAsync)
  useMessageListener(ClaudeSessionRemovedMessage, fetchAsync)
  useInterval(fetchAsync, 60_000)

  const sessions: ClaudeSession[] = entity.value ?? EmptyArray
  const waitingSessions = sessions.filter(it => it.status === "WaitingForInput")

  return useDeepEqualMemo(() => ({
    sessions,
    waitingSessions,
    error: entity.error,
    discard,
    discardAll,
  }), [sessions, waitingSessions, entity.error, discard, discardAll])
}
