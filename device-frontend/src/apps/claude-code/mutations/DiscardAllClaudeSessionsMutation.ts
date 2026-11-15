import { ClaudeSessionsQueryKey } from "@src/apps/claude-code/queries/ClaudeSessionsQuery.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { mutationOptions } from "@tanstack/react-query"

export const DiscardAllClaudeSessionsMutation = mutationOptions({
  mutationKey: ["claude-code", "discardAllSessions"],
  mutationFn: async () => {
    await apiClient.post(`/api/apps/claude/sessions/actions/discard-all`, {})
  },
  onSettled: (_data, _error, _args, _onMutateResult, context) =>
    context.client.invalidateQueries({ queryKey: ClaudeSessionsQueryKey }),
})
