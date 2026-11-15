import { CloseOutlined } from "@mui/icons-material"
import { ClaudeSessionsQueryKey } from "@src/apps/claude-code/queries/ClaudeSessionsQuery.ts"
import { apiClient } from "@src/infrastructure/framework/api/apiClient.ts"
import { defineCommand } from "@src/infrastructure/framework/commands/Command.ts"

export const DiscardClaudeSessionCommand = defineCommand({
  mutationOptions: {
    mutationKey: ["claude-code", "discardSession"],
    mutationFn: async (args: { sessionId: string }) => {
      await apiClient.post(`/api/apps/claude/sessions/${encodeURIComponent(args.sessionId)}/actions/discard`, {})
    },
    onSettled: (_data, _error, _args, _onMutateResult, context) =>
      context.client.invalidateQueries({ queryKey: ClaudeSessionsQueryKey }),
  },
  label: "Discard session",
  icon: CloseOutlined,
  errorTitle: "Unable to discard the session",
})
