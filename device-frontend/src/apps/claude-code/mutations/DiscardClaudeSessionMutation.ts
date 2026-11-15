import { ClaudeSessionsQueryKey } from "@src/apps/claude-code/queries/ClaudeSessionsQuery.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const DiscardClaudeSessionMutation = mutationOptions({
  mutationKey: ["claude-code", "discardSession"],
  mutationFn: async (args: { sessionId: string }) => {
    await apiClient.post(`/api/apps/claude/sessions/${encodeURIComponent(args.sessionId)}/actions/discard`, {})
  },
  onSettled: (_data, _error, _args, _onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ClaudeSessionsQueryKey }),
})
